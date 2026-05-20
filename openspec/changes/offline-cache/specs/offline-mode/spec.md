## ADDED Requirements

### Requirement: Offline mode toggle in Settings
`app/settings.tsx` SHALL display an "Offline" toggle. Its state SHALL be persisted in AsyncStorage under `offline_mode` (boolean). The hook `useOfflineMode` SHALL expose `{ isOffline: boolean, setOffline: (v: boolean) => void }` following the same pattern as `useCalibration`.

#### Scenario: Default state is online
- **WHEN** the app is opened for the first time (no stored value)
- **THEN** `isOffline` is `false`

#### Scenario: Toggle persists across restarts
- **WHEN** the user enables offline mode and restarts the app
- **THEN** `isOffline` is `true` on next launch

#### Scenario: Toggling updates state immediately
- **WHEN** the user flips the offline toggle in Settings
- **THEN** `isOffline` changes immediately and AsyncStorage is updated

### Requirement: Home screen filters categories when offline mode is active
When `isOffline` is `true`, `app/index.tsx` SHALL only display categories for which `hasCachedWords` returns `true`. Categories without cached words SHALL be hidden entirely. If no category has cached words, a message indicating that no offline content is available SHALL be shown.

#### Scenario: Offline mode shows only cached categories
- **WHEN** offline mode is active and three out of ten categories have cached words
- **THEN** only those three categories appear in the home grid

#### Scenario: Offline mode with no cached categories shows empty state message
- **WHEN** offline mode is active and no category has any cached words
- **THEN** an empty-state message is shown instead of the category grid

#### Scenario: Online mode shows all categories regardless of cache
- **WHEN** offline mode is inactive
- **THEN** all categories returned by the API (or category cache) are displayed

### Requirement: Words source is the cache when offline mode is active
When `isOffline` is `true`, `useWords` SHALL return cached words directly without attempting an API call. If the cache is empty for the requested category, it SHALL return an error (this state should not occur if the home screen correctly filters, but must be handled defensively).

#### Scenario: Offline mode serves words from cache without API call
- **WHEN** offline mode is active and `useWords` is called for a category with cached words
- **THEN** cached words are returned immediately and no network request is made

#### Scenario: Offline mode with empty cache returns error
- **WHEN** offline mode is active and the cache for the category is empty
- **THEN** `useWords` returns `data: null` and a non-null `error`

### Requirement: CategoryCard shows an offline availability indicator
When offline mode is active, each CategoryCard in the home grid SHALL display a visual indicator (e.g., a small badge or icon) confirming the category is available offline. Because offline filtering already hides unavailable categories, this indicator is always shown on visible cards when `isOffline` is `true`.

#### Scenario: Offline indicator visible on each card in offline mode
- **WHEN** offline mode is active and a category card is rendered
- **THEN** a visual offline-available indicator is displayed on the card

#### Scenario: No indicator when online mode is active
- **WHEN** offline mode is inactive
- **THEN** CategoryCard renders without any offline indicator
