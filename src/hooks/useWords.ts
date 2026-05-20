import { useEffect, useState } from 'react';
import { getWords } from '../api/client';
import { useOfflineMode } from './useOfflineMode';
import { readCache, writeCache, WORDS_FETCH_TIMEOUT_MS } from '../utils/cache';
import type { Word } from '../types';

function cacheKey(categoryId: string) {
  return `cache:words:${categoryId}`;
}

function mergeWords(existing: Word[], incoming: Word[]): Word[] {
  const seen = new Set(existing.map((w) => w.id));
  const novel = incoming.filter((w) => !seen.has(w.id));
  return novel.length > 0 ? [...existing, ...novel] : existing;
}

function fetchWithTimeout(categoryId: string): Promise<Word[]> {
  return Promise.race([
    getWords(categoryId),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), WORDS_FETCH_TIMEOUT_MS)
    ),
  ]);
}

export function useWords(categoryId: string) {
  const [data, setData] = useState<Word[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isOffline } = useOfflineMode();

  useEffect(() => {
    if (!categoryId) return;
    let cancelled = false;
    setIsLoading(true);
    setData(null);
    setError(null);

    async function load() {
      const cached = await readCache<Word[]>(cacheKey(categoryId));

      // Offline mode: serve from cache only, no API call
      if (isOffline) {
        if (cached && cached.data.length > 0) {
          if (!cancelled) { setData(cached.data); setIsLoading(false); }
        } else {
          if (!cancelled) { setError(new Error('Sin palabras en cache para esta categoría')); setIsLoading(false); }
        }
        return;
      }

      // Online mode: fetch with timeout
      try {
        const words = await fetchWithTimeout(categoryId);
        const merged = mergeWords(cached?.data ?? [], words);
        await writeCache(cacheKey(categoryId), merged);
        if (!cancelled) { setData(words); setIsLoading(false); }
      } catch {
        // Fallback to cache on network/timeout failure
        if (cached && cached.data.length > 0) {
          if (!cancelled) { setData(cached.data); setIsLoading(false); }
        } else {
          if (!cancelled) { setError(new Error('No se pudieron cargar las palabras')); setIsLoading(false); }
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, [categoryId, isOffline]);

  return { data, error, isLoading };
}
