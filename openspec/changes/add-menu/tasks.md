## 1. Dependencies & Setup

- [x] 1.1 Install `@react-native-async-storage/async-storage` and run `npx expo install` to ensure compatibility with Expo SDK 54
- [x] 1.2 Add `gameMode` field (`'clasico' | 'equipos'`) to Zustand store in `src/store/gameStore.ts` with default `'clasico'`

## 2. Calibration Persistence

- [x] 2.1 Create `src/hooks/useCalibration.ts` — reads `calibration_threshold` from AsyncStorage on mount, exposes `{ threshold, setThreshold }` with `CALIBRATION_DEFAULT = 0.7`
- [x] 2.2 Update `src/hooks/useAccelerometer.ts` to accept threshold as a parameter instead of a hardcoded literal
- [x] 2.3 Update `app/game/play.tsx` to call `useCalibration()` and pass `threshold` to `useAccelerometer`

## 3. Theme Persistence

- [x] 3.1 Update `src/theme/ThemeProvider.tsx` to read `theme_preference` from AsyncStorage on boot; expose `setTheme(scheme)` in context
- [x] 3.2 Update `app/_layout.tsx` splash-screen gate to also wait for the theme preference AsyncStorage read to resolve before calling `SplashScreen.hideAsync()`

## 4. Drawer Component

- [x] 4.1 Create `src/components/Drawer.tsx` — animated slide-in from left with overlay; accepts `isOpen`, `onClose`, and `children` props; handles Android `BackHandler` when open
- [x] 4.2 Add Clásico/Equipos mode switches section inside `Drawer.tsx` connected to Zustand `gameMode`
- [x] 4.3 Add "Configuración" navigation row inside `Drawer.tsx` (navigates to `app/settings.tsx`, closes drawer)
- [x] 4.4 Add "Sugerir respuesta" navigation row inside `Drawer.tsx` (navigates to `app/submit-answer.tsx`, closes drawer)

## 5. Home Screen Integration

- [x] 5.1 Update `app/index.tsx` — add hamburger button in top-left, add `isDrawerOpen` state, render `<Drawer>` component

## 6. Settings Screen

- [x] 6.1 Create `app/settings.tsx` — screen with back navigation header styled with the design system
- [x] 6.2 Add calibration slider/stepper to settings screen — reads from `useCalibration()`, calls `setThreshold` on change
- [x] 6.3 Add theme selector (Claro / Oscuro) to settings screen — reads `colorScheme` from `useTheme()`, calls `setTheme` on selection

## 7. Submit Answer Screen

- [x] 7.1 Create `app/submit-answer.tsx` — screen with back navigation, category dropdown (fetches from existing categories API), text input, and submit button
- [x] 7.2 Implement submit logic in `app/submit-answer.tsx` — POST to `/api/suggest-word`, handle loading/success/duplicate/error states

## 8. Vercel Function

- [x] 8.1 Create `api/suggest-word.ts` Vercel Function — accepts `{ categoryId, text }`, performs case-insensitive duplicate check against `words` and `word_suggestions` tables in Neon, inserts into `word_suggestions` if no duplicate, returns `{ status: 'created' | 'duplicate' }`
- [x] 8.2 Create `word_suggestions` table in Neon if it does not exist (`id`, `category_id`, `text`, `created_at`)
