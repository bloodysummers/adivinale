import { useEffect, useState } from 'react';
import { getCategories } from '../api/client';
import { useOfflineMode } from './useOfflineMode';
import { readCache, writeCache, CATEGORIES_TTL_MS } from '../utils/cache';
import type { Category } from '../types';

const CACHE_KEY = 'cache:categories';

export function useCategories() {
  const [data, setData] = useState<Category[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isOffline } = useOfflineMode();

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    async function load() {
      const cached = await readCache<Category[]>(CACHE_KEY);

      // Offline mode: always serve from cache, skip TTL check
      if (isOffline) {
        if (cached) {
          if (!cancelled) { setData(cached.data); setIsLoading(false); }
        } else {
          if (!cancelled) { setError(new Error('Sin conexión y sin cache')); setIsLoading(false); }
        }
        return;
      }

      // Online mode: serve from cache if within TTL
      if (cached && Date.now() - cached.cachedAt < CATEGORIES_TTL_MS) {
        if (!cancelled) { setData(cached.data); setIsLoading(false); }
        return;
      }

      // Fetch fresh data
      try {
        const cats = await getCategories();
        await writeCache(CACHE_KEY, cats);
        if (!cancelled) { setData(cats); setIsLoading(false); }
      } catch (err) {
        // Fall back to stale cache if available
        if (cached) {
          if (!cancelled) { setData(cached.data); setIsLoading(false); }
        } else {
          if (!cancelled) { setError(err as Error); setIsLoading(false); }
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, [isOffline]);

  return { data, error, isLoading };
}
