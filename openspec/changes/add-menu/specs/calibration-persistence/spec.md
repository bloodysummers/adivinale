## ADDED Requirements

### Requirement: useCalibration hook exposes threshold value
A new hook `src/hooks/useCalibration.ts` SHALL export `useCalibration()` which returns `{ threshold: number, setThreshold: (value: number) => void }`. On mount it SHALL read `calibration_threshold` from AsyncStorage; if no value is stored it SHALL return `CALIBRATION_DEFAULT = 0.7`.

#### Scenario: Default threshold returned when no stored value
- **WHEN** `useCalibration()` is called and AsyncStorage has no `calibration_threshold`
- **THEN** `threshold` is `0.7`

#### Scenario: Stored threshold is returned after hydration
- **WHEN** `useCalibration()` is called and AsyncStorage contains `calibration_threshold = 0.5`
- **THEN** `threshold` resolves to `0.5` after the async read completes

### Requirement: setThreshold persists the value
Calling `setThreshold(value)` SHALL immediately update the in-memory threshold and write the new value to AsyncStorage under `calibration_threshold`.

#### Scenario: setThreshold updates and persists
- **WHEN** `setThreshold(0.9)` is called
- **THEN** `threshold` becomes `0.9` synchronously and `calibration_threshold = 0.9` is written to AsyncStorage

### Requirement: play.tsx uses threshold from useCalibration
The game play screen (`app/game/play.tsx`) SHALL obtain the tilt threshold from `useCalibration()` instead of a hardcoded literal. The `useAccelerometer` hook SHALL accept the threshold as a parameter.

#### Scenario: Calibrated threshold used during gameplay
- **WHEN** the user has set a custom calibration and starts a game round
- **THEN** the accelerometer uses the stored threshold value to detect correct/pass tilts
