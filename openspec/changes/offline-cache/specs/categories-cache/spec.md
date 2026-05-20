## ADDED Requirements

### Requirement: Categories are cached in AsyncStorage with a TTL
`useCategories` SHALL write the API response to AsyncStorage under the key `cache:categories` together with a `cachedAt` timestamp. On subsequent calls, if the cached entry is present and its age is less than `CATEGORIES_TTL_MS` (default 7 days), the hook SHALL return the cached data without making a network request.

#### Scenario: Fresh cache is served without a network request
- **WHEN** `useCategories` is called and a valid cache entry exists with age < 7 days
- **THEN** the hook returns the cached categories immediately and no API call is made

#### Scenario: Expired cache triggers a fresh fetch
- **WHEN** `useCategories` is called in online mode and the cached entry is older than 7 days
- **THEN** the hook makes an API call, returns fresh categories, and overwrites the cache entry with updated data and timestamp

#### Scenario: No cache entry triggers a fresh fetch
- **WHEN** `useCategories` is called and no cache entry exists
- **THEN** the hook makes an API call and, on success, writes the result to AsyncStorage with `cachedAt = Date.now()`

#### Scenario: TTL expiration check is skipped in offline mode
- **WHEN** `useCategories` is called and offline mode is active, regardless of how old the cache entry is
- **THEN** the hook returns the cached categories without checking the TTL and without making an API call

#### Scenario: Switching back to online mode with an expired cache triggers a fresh fetch
- **WHEN** offline mode is deactivated and `useCategories` is called with a cache entry older than 7 days
- **THEN** the hook makes an API call and refreshes the cache

#### Scenario: API failure with stale cache serves stale data
- **WHEN** `useCategories` is called in online mode, the TTL has expired, the API call fails, and a stale cache entry exists
- **THEN** the hook returns the stale cached categories as a fallback rather than an error

#### Scenario: API failure with no cache returns an error
- **WHEN** `useCategories` is called, the API call fails, and no cache entry exists
- **THEN** the hook returns `error` and `data: null`
