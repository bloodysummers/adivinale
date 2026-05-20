## ADDED Requirements

### Requirement: Hamburger button visible on home screen
The home screen (`app/index.tsx`) SHALL display a hamburger menu button in the top-left corner of the screen at all times.

#### Scenario: Button is rendered on home screen load
- **WHEN** the user opens the app and the home screen is displayed
- **THEN** a hamburger icon button is visible in the top-left area of the screen

#### Scenario: Button opens the drawer
- **WHEN** the user taps the hamburger button
- **THEN** the drawer slides in from the left side of the screen

### Requirement: Left drawer with overlay
The drawer (`src/components/Drawer.tsx`) SHALL slide in from the left with a semi-transparent overlay covering the rest of the screen. The drawer SHALL close when the user taps the overlay or presses the system back button (Android).

#### Scenario: Drawer opens with animation
- **WHEN** the drawer is triggered to open
- **THEN** the drawer animates in from the left edge and an overlay appears behind it

#### Scenario: Tap overlay to close
- **WHEN** the drawer is open and the user taps the overlay area
- **THEN** the drawer slides out to the left and the overlay disappears

#### Scenario: Android back button closes drawer
- **WHEN** the drawer is open and the user presses the Android hardware back button
- **THEN** the drawer closes and the back event is consumed (does not navigate back)

### Requirement: Game mode switches (Clásico / Equipos)
The drawer SHALL contain a section with two mutually exclusive mode options — "Clásico" and "Equipos" — displayed as toggle switches or radio buttons. Selecting one SHALL deselect the other. The selected mode SHALL be stored in Zustand game store.

#### Scenario: Only one mode can be active at a time
- **WHEN** the user selects "Equipos"
- **THEN** "Equipos" becomes active and "Clásico" becomes inactive

#### Scenario: Default mode is Clásico
- **WHEN** the drawer is opened for the first time in a session
- **THEN** "Clásico" is the active mode

### Requirement: Navigation to Settings screen
The drawer SHALL contain a "Configuración" row that navigates to `app/settings.tsx` and closes the drawer.

#### Scenario: Tapping Configuración navigates to settings
- **WHEN** the user taps the "Configuración" row in the drawer
- **THEN** the app navigates to the Settings screen and the drawer closes

### Requirement: Navigation to Submit Answer screen
The drawer SHALL contain a "Sugerir respuesta" row that navigates to `app/submit-answer.tsx` and closes the drawer.

#### Scenario: Tapping Sugerir respuesta navigates to submit form
- **WHEN** the user taps the "Sugerir respuesta" row in the drawer
- **THEN** the app navigates to the Submit Answer screen and the drawer closes
