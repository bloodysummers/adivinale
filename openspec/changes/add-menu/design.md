## Context

The app currently has a single home screen (`app/index.tsx`) that shows category cards with no secondary navigation, settings, or configuration surface. The accelerometer threshold is hardcoded. There is no way for the user to change the visual theme or suggest new words. The `ThemeProvider` reads `useColorScheme()` and cannot be overridden.

## Goals / Non-Goals

**Goals:**
- Add a hamburger button on the home screen that opens a left drawer.
- Drawer provides: Clásico/Equipos mode switch, link to Settings, link to Suggest Answer.
- Settings screen: accelerometer calibration (persisted in AsyncStorage), theme selector Light/Dark (persisted in AsyncStorage).
- Submit-answer screen: category dropdown + text field + submit → Vercel Function for deduplication and insert.
- ThemeProvider reads user theme preference from AsyncStorage with priority over system `useColorScheme()`.
- `useCalibration` hook exposes the threshold value consumed by `useAccelerometer`.

**Non-Goals:**
- Online/multiplayer modes are not in scope for this change.
- No user authentication or accounts.
- The Clásico/Equipos switch is UI-only for this change; game logic differentiation between modes is a separate task.
- No analytics or crash reporting additions.

## Decisions

### Drawer implementation: custom component over react-navigation drawer
The app uses Expo Router (file-based). Adding `@react-navigation/drawer` would require restructuring the navigator tree and adding a native dependency. Instead, a custom `Drawer.tsx` component uses an `Animated.Value` with a slide-in/out transform and an overlay, keeping the change self-contained. The drawer is controlled via a boolean state lifted into `index.tsx`.

**Alternative considered**: `react-native-reanimated` + Gesture Handler drawer — rejected because it adds two native dependencies and increases bundle size for a simple one-level menu.

### AsyncStorage for settings persistence
`@react-native-async-storage/async-storage` is the standard React Native choice for lightweight key-value persistence. No network round-trip, works offline, survives app restarts.

**Alternative considered**: MMKV (via `react-native-mmkv`) — faster but requires native module install and is overkill for two small settings values.

### ThemeProvider boot: optimistic default + async hydration
`AsyncStorage` reads are async. On first render the ThemeProvider returns the system scheme; once the AsyncStorage read resolves it applies the stored preference. This avoids blocking the splash screen on an I/O read.

**Risk**: One-frame flicker if stored theme differs from system scheme.
**Mitigation**: The flicker happens before the splash screen hides. `SplashScreen.preventAutoHideAsync()` is already in place; we keep the splash up until fonts AND the theme preference are resolved.

### Calibration: default value from existing constant
`useAccelerometer` currently uses a hardcoded threshold (~0.7). `useCalibration` wraps this with an AsyncStorage-backed value and exports `CALIBRATION_DEFAULT = 0.7`. The play screen switches from the literal to `useCalibration()`.

### Vercel Function for suggest-word
The submit-answer screen POSTs to `/api/suggest-word` (a Vercel serverless function). The function:
1. Queries Neon for an exact match (`lower(text) = lower(input)`) in the given category.
2. If no duplicate, inserts the suggestion into a `word_suggestions` table (separate from production words — moderation before promotion).
3. Returns `{ status: 'created' | 'duplicate' }`.

**Alternative considered**: Direct Neon write from the client — rejected because it would expose DB credentials in the app bundle.

## Risks / Trade-offs

- **AsyncStorage hydration race**: Theme/calibration values arrive after first render. → Mitigated by keeping splash visible until both fonts and theme preference are loaded (extend the existing `fontsLoaded || fontError` gate to also wait for `themeLoaded`).
- **Custom drawer accessibility**: Native drawer has built-in a11y (focus trap, back gesture). Custom implementation requires manual `accessibilityViewIsModal` and back-button handling on Android. → Add `BackHandler` listener when drawer is open.
- **Clásico/Equipos switch is UI-only**: Selecting "Equipos" sets a flag in Zustand but game logic doesn't yet differentiate. → Document as known limitation; game-mode logic is a separate roadmap item.
- **Vercel Function cold start latency**: Suggest-word submissions may have ~200–500 ms cold-start delay. → Acceptable for a low-frequency action; show an activity indicator while the request is in flight.

## Open Questions

- Should the `word_suggestions` table be in the existing Neon project or a separate database? (Assume same project for now.)
- Should Clásico/Equipos selection persist between sessions or reset each time? (Assume reset — session-scoped only.)
