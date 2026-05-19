## 1. Design Tokens

- [x] 1.1 Crear `src/utils/theme.ts` con `lightColors` y `darkColors` (todos los tokens semánticos: primary, primaryDark, primaryLight, accent, success, error, background, surface, surfaceVariant, onPrimary, onBackground, onSurface, onSurfaceSecondary, border, overlay)
- [x] 1.2 Agregar `typography` a `src/utils/theme.ts` (fontFamily, fontSize x8 valores, fontWeight x5 valores, lineHeight x3 valores)
- [x] 1.3 Agregar `spacing`, `radii` y `gradients` a `src/utils/theme.ts`
- [x] 1.4 Implementar función `getShadow(level: 0|1|2|3|4)` en `src/utils/theme.ts` con estilos por plataforma (iOS shadowColor/Offset/Opacity/Radius + Android elevation)
- [x] 1.5 Exportar objetos `lightTheme` y `darkTheme` compuestos (colors + typography + spacing + radii + gradients + getShadow) desde `src/utils/theme.ts`
- [x] 1.6 Exportar tipo `Theme` desde `src/utils/theme.ts` para tipado estático

## 2. ThemeProvider

- [x] 2.1 Crear `src/theme/ThemeProvider.tsx` con `ThemeContext`, `ThemeProvider` component y hook `useTheme()`
- [x] 2.2 `ThemeProvider` detecta `useColorScheme()` y provee el theme correcto; re-renderiza al cambiar el modo del sistema
- [x] 2.3 `useTheme()` lanza error descriptivo si se usa fuera del Provider
- [x] 2.4 Envolver la app con `ThemeProvider` en `app/_layout.tsx`

## 3. Componente GameButton

- [x] 3.1 Crear `src/components/GameButton.tsx` con `Pressable` + `LinearGradient`, soporte para `variant` (primary/secondary/success/accent), `size` (sm/md/lg) y `fullWidth`
- [x] 3.2 Implementar efecto de hundimiento al presionar: `Animated.spring` o `transform: scale(0.96)` + reducción de sombra
- [x] 3.3 Implementar estado `disabled` con opacidad 0.5 y bloqueo de `onPress`

## 4. Componente Card

- [x] 4.1 Crear `src/components/Card.tsx` con fondo `surface`, `getShadow(elevation)`, bordes `radii.lg`, y prop `padding` configurable

## 5. Componente Text

- [x] 5.1 Crear `src/components/Text.tsx` con todas las variantes tipográficas (heading1..3, body, bodySmall, label, caption), consumiendo tokens de `typography` y `colors` del tema activo

## 6. Componentes Badge y ScreenContainer

- [x] 6.1 Crear `src/components/Badge.tsx` con fondo semitransparente del color elegido y texto del mismo color, en tamaños sm/md
- [x] 6.2 Crear `src/components/ScreenContainer.tsx` con `SafeAreaView`, padding horizontal `spacing[5]`, fondo `background`, soporte para `scrollable` y `withGradient` (usa `expo-linear-gradient`)

## 7. Exports y verificación

- [x] 7.1 Crear barrel `src/components/index.ts` exportando `GameButton`, `Card`, `Text`, `Badge`, `ScreenContainer`
- [x] 7.2 Crear barrel `src/theme/index.ts` exportando `ThemeProvider`, `useTheme`
- [x] 7.3 Verificar que `npm run web` levanta sin errores de TypeScript en los nuevos archivos
- [x] 7.4 Verificar visualmente en simulador iOS que light/dark mode cambia los colores del theme en tiempo real

## 8. Migración de componentes legacy

- [x] 8.1 Migrar `src/components/CategoryCard.tsx`: gradiente por categoría, emoji, `Text` del design system, feedback de toque
- [x] 8.2 Migrar `src/components/ScoreBoard.tsx`: `useTheme()` para colores, `Text` para variantes tipográficas
- [x] 8.3 Migrar `src/components/Timer.tsx`: `useTheme()` para color del timer, token `typography.fontSize['3xl']`
- [x] 8.4 Migrar `src/components/WordDisplay.tsx`: `useTheme()`, `Text variant="heading1"`, tokens de spacing numéricos

## 9. Migración de pantallas

- [x] 9.1 Migrar `app/index.tsx` (Home): `ScreenContainer`, `Text` heading1/body, `ActivityIndicator` con color del tema
- [x] 9.2 Migrar `app/game/ready.tsx`: fondo `LinearGradient` con `gradients.primary`, tipografía del tema
- [x] 9.3 Migrar `app/game/play.tsx`: colores del tema, `GameButton` para dev buttons, tokens de spacing
- [x] 9.4 Migrar `app/game/results.tsx`: `GameButton` para acciones, `Text` para score y lista, colores semánticos

## 10. Pruebas unitarias — Componentes del design system

- [x] 10.1 Configurar `jest.config.js` para transformar `expo-linear-gradient` y agregar setup file con mocks
- [x] 10.2 Crear `src/__tests__/components/GameButton.test.tsx` (render, press handler, disabled)
- [x] 10.3 Crear `src/__tests__/components/Card.test.tsx` (render, children, elevation)
- [x] 10.4 Crear `src/__tests__/components/Text.test.tsx` (variantes de estilo, color por defecto)
- [x] 10.5 Crear `src/__tests__/components/Badge.test.tsx` (label, colores, tamaños)
- [x] 10.6 Crear `src/__tests__/components/ScreenContainer.test.tsx` (render, scrollable, withGradient)

## 11. Pruebas unitarias — Store

- [x] 11.1 Crear `src/__tests__/store/gameStore.test.ts` (startRound, markCorrect, markSkipped, endRound, resetRound, estado final)

## 12. Limpieza

- [x] 12.1 Eliminar exports legacy (`colors`, `legacySpacing`, presets `word/timer/heading/score`) de `src/utils/theme.ts` y verificar `tsc --noEmit`
