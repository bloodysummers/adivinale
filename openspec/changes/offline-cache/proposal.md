## Why

La app realiza un request al API en cada carga de categorías y en cada inicio de ronda, sin aprovechar datos ya descargados. Esto aumenta el consumo de datos, alarga el tiempo de arranque y hace la app inutilizable sin conexión, incluso cuando el usuario ya jugó esas categorías antes.

## What Changes

- **Cache de categorías con TTL**: Al obtener la lista de categorías se guarda en AsyncStorage con una marca de tiempo. Mientras el TTL no expire (default 7 días), se sirve desde cache sin hacer request. Al expirar o si no hay cache, se va al API y se refresca el cache.
- **Cache acumulativo de palabras por categoría**: Cada vez que el API devuelve palabras para una categoría, los nuevos ítems se fusionan con los ya guardados en AsyncStorage (deduplicación por `id`). El cache nunca se borra automáticamente, solo crece.
- **Fallback de palabras**: Si el request de palabras falla (error de red o timeout de 8 s), se sirven las palabras desde cache. Si tampoco hay cache, se muestra error.
- **Modo offline**: Nueva opción en la pantalla de Settings. Cuando está activado:
  - Solo se muestran en home las categorías que tengan al menos una palabra guardada en cache.
  - Al iniciar ronda se usan exclusivamente las palabras del cache (no se hace request al API).
- **Indicador de disponibilidad offline en CategoryCard**: Las categorías sin palabras cacheadas muestran un indicador visual cuando el modo offline está activo.

## Capabilities

### New Capabilities

- `categories-cache`: Lectura y escritura en AsyncStorage con TTL configurable; se expone a través del hook `useCategories`.
- `words-cache`: Cache acumulativo por `categoryId` en AsyncStorage; merge de nuevas palabras en cada fetch exitoso; lectura directa cuando se necesita fallback u offline.
- `offline-mode`: Toggle en Settings que persiste en AsyncStorage; filtra la lista de categorías en home; selecciona la fuente de palabras en ready screen.

### Modified Capabilities

<!-- settings-screen (add-menu): agrega toggle de Offline mode -->

## Impact

- **Hooks**: `src/hooks/useCategories.ts` (lee cache antes del request), `src/hooks/useWords.ts` (merge + fallback), nuevo `src/hooks/useOfflineMode.ts`.
- **Nuevo util**: `src/utils/cache.ts` — helpers para leer/escribir entradas con TTL en AsyncStorage.
- **Pantallas**: `app/settings.tsx` (nuevo toggle), `app/index.tsx` (filtra por disponibilidad offline), `app/game/ready.tsx` (fuente de palabras: API vs cache).
- **Componentes**: `CategoryCard.tsx` (indicador opcional de disponibilidad offline).
- **Dependencias nuevas**: ninguna (`@react-native-async-storage/async-storage` ya instalado).
- **No toca**: flujo del acelerómetro, sistema de puntuación, ThemeProvider.
