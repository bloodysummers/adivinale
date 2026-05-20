## ADDED Requirements

### Requirement: ThemeProvider reads stored theme preference on boot
`ThemeProvider` SHALL read the `theme_preference` key from AsyncStorage during initialization. If a value (`'light'` or `'dark'`) is found it SHALL be used as the active color scheme, overriding `useColorScheme()`. If no stored value exists, `useColorScheme()` SHALL be used as the default.

#### Scenario: Stored preference overrides system scheme
- **WHEN** AsyncStorage contains `theme_preference = 'dark'` and the device is in light mode
- **THEN** the app renders with the dark theme

#### Scenario: No stored preference falls back to system scheme
- **WHEN** AsyncStorage has no `theme_preference` entry
- **THEN** the app renders with the theme matching the device system scheme

### Requirement: ThemeProvider exposes a setTheme function
`ThemeProvider` SHALL expose a `setTheme(scheme: 'light' | 'dark')` function via context. Calling it SHALL update the active theme immediately and write the new value to AsyncStorage under `theme_preference`.

#### Scenario: setTheme updates theme and persists
- **WHEN** `setTheme('dark')` is called
- **THEN** the context `colorScheme` changes to `'dark'` immediately and `theme_preference = 'dark'` is written to AsyncStorage

### Requirement: Splash screen remains visible until theme preference is loaded
The app SHALL keep the splash screen visible until both fonts and the AsyncStorage theme preference have been resolved, preventing a visible theme flash on startup.

#### Scenario: Splash hides only after theme is loaded
- **WHEN** the app starts and AsyncStorage read is pending
- **THEN** the splash screen remains visible until the read completes (or fails), then hides
