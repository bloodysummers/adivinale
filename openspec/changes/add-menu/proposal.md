## Why

La app no tiene ningún mecanismo de navegación secundaria ni configuración accesible al usuario. Se necesita un punto de entrada para ajustes de sesión (modo de juego), configuración del dispositivo (calibración del acelerómetro) y participación de comunidad (sugerir respuestas), todo sin interrumpir el flujo principal de selección de categoría → juego.

## What Changes

- Nuevo botón de menú (hamburger) en la esquina superior izquierda de la pantalla principal.
- Nuevo drawer lateral izquierdo con tres secciones:
  - **Modo de juego**: switches mutuamente exclusivos Clásico / Equipos.
  - **Configuración**: enlace a pantalla de settings.
  - **Sugerir respuesta**: enlace a pantalla de formulario.
- Nueva pantalla `app/settings.tsx` con:
  - Control de calibración (slider o stepper) que persiste en AsyncStorage y alimenta la lógica del acelerómetro en `play.tsx`.
  - Selector de tema (Light / Dark) que sobrescribe `useColorScheme()` y persiste en AsyncStorage.
- Nueva pantalla `app/submit-answer.tsx` con formulario: dropdown de categorías + campo de texto + botón de envío que llama a una Vercel Function.
- El `ThemeProvider` debe leer la preferencia de tema guardada en AsyncStorage además del esquema del sistema, con prioridad al valor guardado por el usuario.

## Capabilities

### New Capabilities

- `menu-drawer`: Drawer lateral con botón de apertura en home, opciones de modo de juego, navegación a settings y submit-answer.
- `settings-screen`: Pantalla de configuración con calibración de acelerómetro (persiste en AsyncStorage) y selector de tema (persiste en AsyncStorage).
- `submit-answer-screen`: Pantalla con formulario para sugerir palabras a una categoría; llama a Vercel Function que verifica duplicados e inserta en la DB.
- `theme-persistence`: Lógica en `ThemeProvider` para leer/escribir preferencia de tema en AsyncStorage, con prioridad sobre `useColorScheme()`.
- `calibration-persistence`: Hook `useCalibration` que expone el umbral de inclinación desde AsyncStorage; usado en `useAccelerometer`.

### Modified Capabilities

<!-- ninguna spec existente cambia requisitos -->

## Impact

- **Pantallas**: `app/index.tsx` (botón de menú), nueva `app/settings.tsx`, nueva `app/submit-answer.tsx`.
- **Componentes**: nuevo `src/components/Drawer.tsx`.
- **Hooks**: nuevo `src/hooks/useCalibration.ts`, modificación de `src/hooks/useAccelerometer.ts`.
- **Estado/persistencia**: `ThemeProvider` con AsyncStorage, nuevo hook de calibración con AsyncStorage.
- **API**: nueva Vercel Function `api/suggest-word.ts` (o endpoint equivalente).
- **Dependencias nuevas**: `@react-native-async-storage/async-storage`.
- **No toca** el flujo del acelerómetro en tiempo de juego, solo el umbral que usa.
