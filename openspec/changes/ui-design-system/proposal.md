## Why

La app no tiene un sistema de diseño definido: no hay paleta de colores, tipografía, ni componentes base consistentes. Para que Adivínale se sienta como un juego (no una app de formularios), necesitamos un design system con theme adaptativo (light/dark), elementos con volumen (sombras, gradientes, bordes), y tokens reutilizables antes de seguir construyendo pantallas.

## What Changes

- Definir paleta de colores con tokens semánticos para light mode y dark mode
- Definir escala tipográfica (familias, tamaños, pesos)
- Definir sistema de elevaciones/sombras para efecto "3D/game"
- Implementar `ThemeProvider` y hook `useTheme` para acceso universal al tema
- Crear componentes base: `GameButton`, `Card`, `Text`, `Badge`, `ScreenContainer`
- Reemplazar estilos hardcodeados en pantallas existentes por tokens del tema
- Configurar `src/utils/theme.ts` como fuente única de verdad

## Capabilities

### New Capabilities

- `design-tokens`: Paleta de colores, tipografía, spacing, radii, elevaciones y gradientes para light/dark mode
- `theme-provider`: Context/hook para acceder al tema activo y detectar el modo del sistema (light/dark)
- `base-components`: Componentes reutilizables — `GameButton`, `Card`, `Text`, `Badge`, `ScreenContainer` — construidos sobre los tokens del tema

### Modified Capabilities

<!-- No hay specs existentes aún; no hay capabilidades previas que modificar -->

## Impact

- **Pantallas afectadas:** `app/(tabs)/index.tsx`, `app/game/ready.tsx`, `app/game/play.tsx`, `app/game/results.tsx`
- **Archivos nuevos:** `src/utils/theme.ts`, `src/theme/ThemeProvider.tsx`, `src/components/GameButton.tsx`, `src/components/Card.tsx`, `src/components/Text.tsx`, `src/components/Badge.tsx`, `src/components/ScreenContainer.tsx`
- **Dependencias nuevas:** ninguna (solo APIs nativas de React Native + `expo-system-ui` ya disponible en Expo SDK 54)
- **No toca** el flujo del acelerómetro ni la lógica de juego
