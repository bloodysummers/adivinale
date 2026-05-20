## Context

`useCategories` y `useWords` siempre van al API sin cache. `useWords` se invoca en `app/game/ready.tsx` justo antes de iniciar la ronda; si la red falla en ese momento el juego queda bloqueado. No existe mecanismo de modo offline.

AsyncStorage ya está instalado (`@react-native-async-storage/async-storage`) gracias al cambio `add-menu`.

## Goals / Non-Goals

**Goals:**
- Categories: cache con TTL → menos requests, carga más rápida.
- Words: cache acumulativo por categoría → fallback cuando la red falla; base de datos local que crece con el uso.
- Offline mode: setting persistido; filtra categorías disponibles; elige fuente de palabras (cache vs API).
- La app funciona en tres modos: online puro, online con fallback a cache, offline puro.

**Non-Goals:**
- Invalidación/borrado manual del cache de palabras desde la UI (la gestión del cache es invisible al usuario excepto el indicador de disponibilidad).
- Sincronización de cambios del servidor (no hay push/webhooks).
- Cache de imágenes o assets.
- Cifrado del cache.

## Decisions

### Cache storage format: JSON en AsyncStorage con clave por recurso
Cada entrada usa una clave fija (`cache:categories`, `cache:words:<categoryId>`). El valor es JSON que incluye el payload y, para categories, un campo `cachedAt` (timestamp Unix ms).

**Alternativa**: una sola clave con un mapa de todos los recursos → más difícil de leer/escribir de forma atómica por categoría.

### Categories TTL: 7 días, configurable como constante
7 días es más que suficiente para un juego casual sin cambios frecuentes en las categorías. La constante `CATEGORIES_TTL_MS` vive en `src/utils/cache.ts`.

**Alternativa**: TTL configurable por el usuario → complejidad innecesaria para este caso.

### Words cache: merge por `id`, sin expiración
Las palabras del API se fusionan con las ya almacenadas (conjunto por `id`). Nunca se borran: el cache solo crece. Esta estrategia maximiza la disponibilidad offline progresiva: cuantas más rondas se jueguen, más palabras estarán disponibles sin conexión.

**Alternativa**: Reemplazar el cache en cada fetch → siempre estaría actualizado, pero destruye la disponibilidad offline acumulada.

### Fallback order para words: API → cache → error
En modo online el flujo es: (1) intenta API con timeout de 8 s; (2) si falla, sirve desde cache si hay palabras; (3) si tampoco hay cache, devuelve error. `useWords` encapsula esta lógica.

### Offline mode: fuente única de verdad en AsyncStorage vía `useOfflineMode`
El hook `useOfflineMode` expone `{ isOffline, setOffline }` con el mismo patrón que `useCalibration`. `useCategories` y `useWords` lo consumen para elegir su estrategia.

**Alternativa**: Zustand store para `isOffline` → no persiste entre reinicios.

### Disponibilidad offline de una categoría: ≥1 palabra en cache
Una categoría se considera "disponible offline" si `cache:words:<id>` existe y tiene al menos un ítem. `useCategories` en modo offline filtra la lista usando esta verificación.

## Risks / Trade-offs

- **Cache stale de categories**: si el TTL de 7 días expira en mitad de una sesión de juego, el siguiente cold start lanzará un request. → Aceptable; el juego solo usa la lista de categorías en el home screen.
- **Words cache ilimitado**: en teoría crece indefinitely en AsyncStorage. → En la práctica cada categoría tiene decenas/centenas de palabras cortas (~50 bytes/word). 10 categorías × 200 palabras × 50 bytes ≈ 100 KB, dentro de márgenes normales de AsyncStorage.
- **Timeout de 8 s puede sentirse lento**: si la red existe pero está muy lenta, el usuario espera 8 s en la ready screen antes del fallback. → Se muestra un spinner con mensaje "Cargando palabras…" durante ese tiempo. Si se decide reducir el timeout, la constante `WORDS_FETCH_TIMEOUT_MS` está en un lugar central.
- **Race condition en merge**: dos rondas simultáneas de la misma categoría podrían leer el mismo cache y sobrescribirse. → Muy improbable en mobile single-user; no se introduce mutex para no añadir complejidad.

## Open Questions

- ¿Debería haber un botón en Settings para limpiar el cache de palabras? (Out of scope por ahora, pero fácil de agregar más tarde con `AsyncStorage.removeItem`.)
- ¿El TTL de categorías debe reiniciarse en cada fetch exitoso o solo en el primero? (Decisión actual: se sobreescribe en cada fetch exitoso.)
