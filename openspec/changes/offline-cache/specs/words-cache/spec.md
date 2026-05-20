## ADDED Requirements

### Requirement: Words are merged into a per-category cache on every successful fetch
After a successful API call for a category's words, `useWords` SHALL merge the returned words into the existing AsyncStorage entry for key `cache:words:<categoryId>`. Deduplication SHALL be performed by `id`: words already present in the cache SHALL NOT be duplicated.

#### Scenario: New words are added to an empty cache
- **WHEN** a fetch returns words for a category that has no cache entry
- **THEN** all returned words are written to `cache:words:<categoryId>`

#### Scenario: New words are merged into an existing cache
- **WHEN** a fetch returns words for a category that already has a cache entry
- **THEN** only words with IDs not already in the cache are appended; existing entries are unchanged

#### Scenario: No new words leaves the cache unchanged
- **WHEN** a fetch returns words that are all already present in the cache (by `id`)
- **THEN** the cache entry is not modified

### Requirement: Words fetch falls back to cache on network failure or timeout
`useWords` SHALL enforce a fetch timeout of `WORDS_FETCH_TIMEOUT_MS` (default 8000 ms). If the fetch fails (network error or timeout) and the cache for that category is non-empty, the hook SHALL return the cached words. If the cache is also empty, the hook SHALL return an error.

#### Scenario: Network error triggers cache fallback
- **WHEN** the API call for words throws a network error and cached words exist for the category
- **THEN** `useWords` returns the cached words with `error: null`

#### Scenario: Timeout triggers cache fallback
- **WHEN** the API call does not respond within 8 s and cached words exist for the category
- **THEN** `useWords` returns the cached words with `error: null`

#### Scenario: Failure with empty cache returns error
- **WHEN** the API call fails and no cached words exist for the category
- **THEN** `useWords` returns `data: null` and a non-null `error`

### Requirement: Words cache reports coverage per category
`useWordsCache` helper (or exported utility) SHALL expose a function `hasCachedWords(categoryId: string): Promise<boolean>` that returns `true` if `cache:words:<categoryId>` exists and has at least one word.

#### Scenario: Category with cached words returns true
- **WHEN** `hasCachedWords` is called for a category that has at least one word in cache
- **THEN** the function resolves to `true`

#### Scenario: Category without cached words returns false
- **WHEN** `hasCachedWords` is called for a category with no cache entry
- **THEN** the function resolves to `false`
