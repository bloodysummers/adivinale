## Context

App nueva sin ninguna pantalla funcional. El MVP debe ser jugable en un dispositivo físico sin depender de un backend externo. El stack ya está definido (Expo SDK 54, Expo Router v4, expo-sensors, Zustand, TypeScript). No existe código de producción aún, solo scaffolding inicial.

## Goals / Non-Goals

**Goals:**
- Flujo de juego completo end-to-end: Home → Ready → Play → Results.
- Detección de inclinación con acelerómetro (arriba = correcto, abajo = pasa).
- Timer de 60 segundos con presentación de palabras sin repetición.
- Datos locales para las dos categorías iniciales (Películas, Series — 20 palabras c/u).
- UI funcional y legible (no necesariamente diseño final).

**Non-Goals:**
- Llamadas a API REST ni conexión a base de datos.
- Múltiples turnos / modo multijugador.
- Historial persistente de partidas.
- Animaciones elaboradas o diseño visual final.
- Soporte de más de 2 categorías.
- Autenticación o cuentas de usuario.

## Decisions

### 1. Datos locales en `src/data/words.ts`

**Decisión:** Un archivo TypeScript con arrays tipados de `Word[]` por categoría, exportados por slug.

**Alternativa descartada:** JSON file — requiere `require()` sin tipado o `import` con `resolveJsonModule`, más fricción innecesaria para un MVP.

**Rationale:** Tipado nativo, tree-shakeable, cero overhead de parsing. Fácil de reemplazar por llamadas a API más adelante sin cambiar los contratos de los hooks.

---

### 2. Estado de ronda en Zustand (`gameStore`)

**Decisión:** Un store central con slices para la ronda activa: `{ category, words, currentIndex, score, skipped, status }`.

**Alternativa descartada:** State local en `play.tsx` — el estado necesita sobrevivir navegación hacia `results.tsx` y la pantalla de resultados necesita leer el score sin re-renderizar.

**Rationale:** Zustand ya es la elección del proyecto. Un solo store evita prop-drilling entre `play.tsx` y `results.tsx`.

---

### 3. Lógica del acelerómetro en hook `useAccelerometer`

**Decisión:** Encapsular suscripción, umbral (z > 0.7 correcto / z < -0.7 pasa), hold duration (150 ms) y debounce (600 ms) en un hook reutilizable que expone un callback `onTilt(direction: 'up' | 'down')`.

**Rationale:** Aísla la lógica del sensor de la pantalla de juego. La pantalla solo registra `onTilt` y llama a `markCorrect()` o `markSkipped()` del store. Facilita testing unitario del hook.

**Detalle de implementación:** El hook mantiene una referencia a `lastTiltAt` (timestamp) y `holdStart` (timestamp). Una inclinación se dispara solo si el eje Z supera el umbral continuamente por ≥150 ms y han pasado ≥600 ms desde el último disparo.

---

### 4. Palabras barajadas al inicio de la ronda

**Decisión:** Barajar la lista completa de la categoría con Fisher-Yates en `src/utils/shuffle.ts` al momento de iniciar la ronda (en la acción `startRound` del store), guardar el array barajado en el store y avanzar por índice.

**Alternativa descartada:** Barajar cada vez que se avanza — riesgo de repetición si el shuffle no es perfecto.

**Rationale:** Una sola pasada garantiza no-repetición. El índice `currentIndex` es simple de incrementar y de usar para calcular `totalWords`.

---

### 5. Navegación con Expo Router

**Decisión:** Usar `router.push` / `router.replace` con parámetros mínimos. El `categoryId` se pasa como query param de `Home` a `ready.tsx`; el resto del estado vive en el store.

**Rationale:** Evita serializar objetos grandes en params. `router.replace` en resultados evita que "atrás" regrese al juego activo.

---

### 6. Orientación de pantalla

**Decisión:** Forzar landscape en las pantallas del flujo de juego (`ready`, `play`, `results`). El jugador sostiene el teléfono horizontalmente en la frente, con la pantalla mirando hacia afuera.

**Rationale:** La mecánica real del juego requiere landscape: el teléfono se sostiene de lado sobre la frente para que los demás jugadores lean la palabra. En landscape, el eje relevante del acelerómetro para detectar la inclinación adelante/atrás sigue siendo el eje Z. Se usa `expo-screen-orientation` con `ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)` al montar las pantallas del juego, y se restaura a `ALL` al desmontar (al salir a Home).

## Risks / Trade-offs

- **Acelerómetro en simulador iOS/Android** → No funciona. Las pruebas de sensor deben hacerse en dispositivo físico. Mitigación: agregar un modo de desarrollo con botones manuales "Correcto" / "Pasa" cuando el acelerómetro no esté disponible.
- **Calibración de umbrales** → Los valores z < -0.7 / z > 0.7 son estimados; pueden requerir ajuste tras pruebas físicas. Mitigación: extraer como constantes en `src/utils/accelerometer.ts` para cambiarlas sin tocar el hook.
- **Datos locales hardcodeados** → No escalable más allá del MVP. Mitigación: la interfaz `Word[]` es idéntica al contrato de la API, por lo que el reemplazo es un swap de importación en el hook `useRound`.
- **Sin navegación de regreso desde Play** → Salir accidentalmente perdería la partida. Mitigación: deshabilitar el gesto de swipe-back en `play.tsx` con `gestureEnabled: false` en el layout.
