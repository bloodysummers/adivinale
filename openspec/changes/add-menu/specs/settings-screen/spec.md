## ADDED Requirements

### Requirement: Settings screen is accessible via drawer
The settings screen (`app/settings.tsx`) SHALL be a full screen reachable from the drawer's "Configuración" row. It SHALL have a back button or header that returns to the home screen.

#### Scenario: Settings screen renders after navigation
- **WHEN** the user navigates to the Settings screen from the drawer
- **THEN** the Settings screen is displayed with calibration and theme controls

#### Scenario: Back navigation returns to home
- **WHEN** the user presses back from the Settings screen
- **THEN** the app returns to the home screen

### Requirement: Accelerometer calibration control
The settings screen SHALL display a calibration control (slider or stepper) that lets the user set the tilt threshold used by the accelerometer. The default value SHALL be `0.7`. The current value SHALL be read from AsyncStorage on mount; changes SHALL be written to AsyncStorage immediately.

#### Scenario: Default calibration value shown on first open
- **WHEN** the user opens Settings for the first time (no stored value)
- **THEN** the calibration control is set to `0.7`

#### Scenario: Stored calibration value is loaded
- **WHEN** the user opens Settings and a calibration value has been previously saved
- **THEN** the calibration control reflects the stored value

#### Scenario: Changing calibration persists the value
- **WHEN** the user moves the calibration control to a new value
- **THEN** the new value is written to AsyncStorage under the key `calibration_threshold`

### Requirement: Theme mode selector
The settings screen SHALL display a theme selector allowing the user to choose between "Claro" (light) and "Oscuro" (dark). The selected value SHALL be persisted to AsyncStorage. The active theme SHALL update immediately throughout the app upon selection.

#### Scenario: Current theme mode is highlighted
- **WHEN** the Settings screen loads
- **THEN** the selector shows the currently active theme mode as selected

#### Scenario: Selecting a theme updates the app immediately
- **WHEN** the user selects "Oscuro"
- **THEN** the app switches to dark theme immediately without requiring a restart

#### Scenario: Theme preference persists across app restarts
- **WHEN** the user selects "Claro" and restarts the app
- **THEN** the app launches in light theme regardless of the device system theme
