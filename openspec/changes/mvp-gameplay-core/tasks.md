## 1. Fundación: tipos, theme y utilidades

- [x] 1.1 Crear `src/types/index.ts` con interfaces `Category`, `Word`, `RoundResult`, `WordStatus`, `RoundWord`
- [x] 1.2 Crear `src/utils/theme.ts` con colores, tipografía y spacing del MVP
- [x] 1.3 Crear `src/utils/shuffle.ts` con implementación Fisher-Yates tipada
- [x] 1.4 Crear `src/utils/accelerometer.ts` con constantes `CORRECT_THRESHOLD`, `SKIP_THRESHOLD`, `HOLD_DURATION_MS`, `DEBOUNCE_MS`

## 2. Datos locales

- [x] 2.1 Crear `src/data/categories.ts` con array de 2 categorías (`peliculas`, `series`) tipadas como `Category[]`
- [x] 2.2 Crear `src/data/words.ts` con 20 palabras para la categoría `peliculas` tipadas como `Word[]`
- [x] 2.3 Agregar 20 palabras para la categoría `series` en `src/data/words.ts`

## 3. Estado global (Zustand)

- [x] 3.1 Crear `src/store/gameStore.ts` con campos `category`, `words`, `currentIndex`, `score`, `status` (`idle | countdown | playing | finished`)
- [x] 3.2 Agregar acciones al store: `startRound(category, words)`, `markCorrect()`, `markSkipped()`, `endRound()`, `resetRound()`
- [x] 3.3 Verificar que `startRound` baraja las palabras con Fisher-Yates antes de guardarlas

## 4. Hooks

- [x] 4.1 Crear `src/hooks/useAccelerometer.ts` con suscripción a `expo-sensors`, lógica de umbral, hold-duration y debounce — [ACELERÓMETRO]
- [x] 4.2 Crear `src/hooks/useGameTimer.ts` con countdown de 60 s usando `setInterval`, expone `timeLeft` y callback `onExpire`

## 5. Layouts y navegación

- [x] 5.1 Crear/actualizar `app/_layout.tsx` como Stack navigator raíz
- [x] 5.2 Crear `app/game/_layout.tsx` con `gestureEnabled: false` en la pantalla `play` para bloquear swipe-back
- [x] 5.3 Instalar/verificar `expo-screen-orientation` y agregar `ScreenOrientation.lockAsync(LANDSCAPE)` al montar `ready`, `play` y `results`; restaurar a `ALL` al desmontar

## 6. Pantalla Home — selección de categoría

- [x] 6.1 Crear `app/index.tsx` que lea categorías de `src/data/categories.ts` y las liste
- [x] 6.2 Crear componente `src/components/CategoryCard.tsx` que muestre emoji y nombre
- [x] 6.3 Al tocar una tarjeta, despachar `gameStore` con la categoría y navegar a `game/ready?categoryId=<id>`

## 7. Pantalla Ready — cuenta regresiva

- [x] 7.1 Crear `app/game/ready.tsx` que lea `categoryId` del query param
- [x] 7.2 Implementar cuenta regresiva 3 → 2 → 1 → "¡Ya!" con `setInterval` o `setTimeout`
- [x] 7.3 Al terminar la cuenta, cargar las palabras de la categoría en el store y navegar a `game/play` con `router.replace`

## 8. Pantalla Play — ronda activa

- [x] 8.1 Crear `app/game/play.tsx` que consuma `gameStore` para mostrar la palabra actual (`words[currentIndex]`)
- [x] 8.2 Integrar `useGameTimer` y mostrar el tiempo restante en pantalla
- [x] 8.3 Integrar `useAccelerometer` y conectar callbacks a `markCorrect()` / `markSkipped()` del store — [ACELERÓMETRO]
- [x] 8.4 Agregar botones manuales "✓ Correcto" y "✗ Pasa" visibles solo en modo desarrollo (sin acelerómetro disponible)
- [x] 8.5 Navegar a `game/results` cuando `timeLeft === 0` o `currentIndex >= words.length`
- [x] 8.6 Crear componente `src/components/WordDisplay.tsx` para mostrar la palabra actual con estilos grandes y legibles
- [x] 8.7 Crear componente `src/components/Timer.tsx` para mostrar el tiempo restante

## 9. Pantalla Results — resultados

- [x] 9.1 Crear `app/game/results.tsx` que lea `score` y `currentIndex` del store y muestre "X / Y"
- [x] 9.2 Botón "Jugar de nuevo": llama `resetRound()` y navega a `game/ready` con la misma categoría
- [x] 9.3 Botón "Cambiar categoría": llama `resetRound()` y navega a Home con `router.replace`
- [x] 9.4 Crear componente `src/components/ScoreBoard.tsx` para mostrar el score final

## 11. Pruebas unitarias

### 11.1 Setup

- [x] 11.1 Instalar `jest`, `jest-expo`, `@testing-library/react-native`, `@types/jest` como devDependencies
- [x] 11.2 Configurar `jest.config.js` con preset `jest-expo` y `transformIgnorePatterns` para módulos nativos
- [x] 11.3 Agregar script `"test": "jest"` al `package.json`

### 11.2 Tests de utilidades (`src/utils`)

- [x] 11.4 Crear `src/utils/__tests__/shuffle.test.ts` — casos: no muta original, mismos elementos, distribución no constante
- [x] 11.5 Crear `src/utils/__tests__/accelerometer.test.ts` — verificar valores de las 4 constantes exportadas

### 11.3 Tests de datos (`src/data`)

- [x] 11.6 Crear `src/data/__tests__/categories.test.ts` — 2 categorías, campos `id`/`name`/`emoji`/`language` presentes
- [x] 11.7 Crear `src/data/__tests__/words.test.ts` — 20 palabras por categoría, `categoryId` correcto, ids únicos en toda la colección

### 11.4 Tests del store (`src/store`)

- [x] 11.8 Crear `src/store/__tests__/gameStore.test.ts`
  - `startRound`: guarda categoría, baraja palabras, `currentIndex=0`, `score=0`, `status='playing'`
  - `markCorrect`: incrementa score, avanza índice, cambia a `finished` en el último elemento
  - `markSkipped`: no toca score, avanza índice, cambia a `finished` en el último elemento
  - `endRound`: cambia `status` a `finished`
  - `resetRound`: limpia `words`, `currentIndex`, `score`, vuelve a `idle`

### 11.5 Tests del hook useGameTimer (`src/hooks`)

- [x] 11.9 Crear `src/hooks/__tests__/useGameTimer.test.ts` con fake timers
  - Inicia con `timeLeft = duration`
  - Decrementa 1 por segundo mientras `running = true`
  - Llama `onExpire` exactamente una vez al llegar a 0
  - No decrementa cuando `running = false`

### 11.6 Tests del hook useAccelerometer (`src/hooks`)

- [x] 11.10 Crear `src/hooks/__tests__/useAccelerometer.test.ts` mockeando `expo-sensors`
  - Dispara `onTilt('up')` cuando z > 0.7 sostenido ≥ 150 ms
  - Dispara `onTilt('down')` cuando z < -0.7 sostenido ≥ 150 ms
  - No dispara si el umbral se sostiene menos de 150 ms
  - Debounce: no dispara si han pasado menos de 600 ms desde el último evento
  - No dispara cuando `enabled = false`

### 11.7 Verificación

- [x] 11.11 Correr `npm test` y verificar que todos los tests pasan con 0 errores

## 10. Verificación final

- [x] 10.1 Correr `npx tsc --noEmit` y resolver todos los errores de tipos
- [x] 10.2 Probar flujo completo en simulador: Home → Ready → Play → Results → Jugar de nuevo
- [x] 10.3 Probar detección de inclinación en dispositivo físico (iOS o Android) — [ACELERÓMETRO]
- [x] 10.4 Verificar que no se repiten palabras en una ronda completa
- [x] 10.5 Verificar que el timer termina la ronda correctamente a los 60 s
