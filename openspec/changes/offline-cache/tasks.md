## 1. Cache Utility

- [x] 1.1 Create `src/utils/cache.ts` — export `CATEGORIES_TTL_MS = 7 * 24 * 60 * 60 * 1000`, `WORDS_FETCH_TIMEOUT_MS = 8000`; export helpers `readCache<T>(key): Promise<{ data: T; cachedAt: number } | null>` and `writeCache<T>(key, data): Promise<void>` that serialize/deserialize with AsyncStorage
- [x] 1.2 Export `hasCachedWords(categoryId: string): Promise<boolean>` from `src/utils/cache.ts` — returns true if `cache:words:<categoryId>` exists and has at least one entry

## 2. Offline Mode Hook

- [x] 2.1 Create `src/hooks/useOfflineMode.ts` — reads `offline_mode` from AsyncStorage on mount, exposes `{ isOffline, setOffline }` with immediate state update + AsyncStorage write on change

## 3. Categories Cache

- [x] 3.1 Update `src/hooks/useCategories.ts` — on mount: if offline mode is active, return cache unconditionally (skip TTL check); in online mode: read `cache:categories`, if age < `CATEGORIES_TTL_MS` serve from cache, otherwise fetch, write cache on success, fall back to stale cache on fetch failure

## 4. Words Cache + Fallback

- [x] 4.1 Update `src/hooks/useWords.ts` — wrap fetch in `Promise.race` with a `WORDS_FETCH_TIMEOUT_MS` timeout; on success merge returned words into `cache:words:<categoryId>` (deduplicate by `id`); on failure fall back to cached words if available, error if not
- [x] 4.2 Update `src/hooks/useWords.ts` — when `isOffline` is `true` (read from `useOfflineMode`), skip the API call entirely and return cached words directly

## 5. Offline Mode Setting

- [x] 5.1 Add `useOfflineMode` toggle to `app/settings.tsx` — new card section "Modo de juego" with a Switch row for "Offline" that reads/writes via `useOfflineMode`

## 6. Home Screen Filtering

- [x] 6.1 Update `app/index.tsx` — when `isOffline` is `true`, filter the categories list to those for which `hasCachedWords` returns `true`; show empty-state message if no cached categories are available
- [x] 6.2 Update `app/index.tsx` — pass an `offlineAvailable` boolean prop to `CategoryCard` when offline mode is active (always `true` for visible cards in offline mode)

## 7. CategoryCard Offline Indicator

- [x] 7.1 Update `src/components/CategoryCard.tsx` — accept optional `offlineAvailable?: boolean` prop; when `true`, render a small "offline" badge (e.g., a wifi-off emoji or icon overlay) in the top-right corner of the card
