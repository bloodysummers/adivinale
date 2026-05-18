## Why

La app no tiene ninguna pantalla funcional aún. Se necesita un MVP jugable end-to-end que valide la mecánica central —adivinar palabras inclinando el teléfono— sin depender de un backend externo.

## What Changes

- Pantalla Home con dos categorías hardcodeadas (Películas y Series, 20 palabras cada una).
- Pantalla `game/ready.tsx`: cuenta regresiva 3-2-1 antes de iniciar la ronda.
- Pantalla `game/play.tsx`: muestra palabras al azar sin repetir, detecta inclinación con el acelerómetro, cuenta 60 segundos y navega a resultados.
- Pantalla `game/results.tsx`: muestra aciertos / total de palabras presentadas y permite reiniciar o cambiar categoría.
- Hook `useAccelerometer` con lógica de umbral, hold-duration y debounce.
- Hook `useGameTimer` para countdown de 60 s.
- Store Zustand (`gameStore`) con estado de la ronda activa.
- Datos locales en `src/data/words.ts` (reemplaza la llamada a API para el MVP).

## Capabilities

### New Capabilities

- `category-selection`: Pantalla Home que lista categorías disponibles y navega al flujo de juego con la categoría elegida.
- `gameplay-round`: Flujo completo de una ronda — cuenta regresiva, presentación de palabras barajadas sin repetición, detección de inclinación, timer de 60 s y pantalla de resultados.
- `local-word-data`: Datos de palabras hardcodeados localmente (sin API) para Películas y Series, 20 palabras cada una.
- `unit-tests`: Suite de pruebas unitarias para utilidades, store y hooks del MVP.

### Modified Capabilities

_(ninguna — no hay specs existentes)_

## Impact

- **Pantallas nuevas:** `app/index.tsx`, `app/game/ready.tsx`, `app/game/play.tsx`, `app/game/results.tsx`, `app/_layout.tsx`, `app/game/_layout.tsx`
- **Hooks nuevos:** `src/hooks/useAccelerometer.ts`, `src/hooks/useGameTimer.ts`
- **Store:** `src/store/gameStore.ts`
- **Datos locales:** `src/data/words.ts`
- **Utilidades:** `src/utils/theme.ts`, `src/utils/shuffle.ts`
- **Tipos:** `src/types/index.ts`
- **Nueva dependencia:** `expo-sensors` (para el acelerómetro) — ya está en el stack, verificar que esté instalada.
- **Dependencias de test:** `jest`, `jest-expo`, `@testing-library/react-native`, `@types/jest`
- **Archivos de test:** `src/utils/__tests__/`, `src/data/__tests__/`, `src/store/__tests__/`, `src/hooks/__tests__/`
- **Toca el flujo del acelerómetro:** sí.
