import AsyncStorage from '@react-native-async-storage/async-storage';

export const CATEGORIES_TTL_MS = 7 * 24 * 60 * 60 * 1000;
export const WORDS_FETCH_TIMEOUT_MS = 8_000;

interface CacheEntry<T> {
  data: T;
  cachedAt: number;
}

export async function readCache<T>(key: string): Promise<CacheEntry<T> | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw == null) return null;
    return JSON.parse(raw) as CacheEntry<T>;
  } catch {
    return null;
  }
}

export async function writeCache<T>(key: string, data: T): Promise<void> {
  try {
    const entry: CacheEntry<T> = { data, cachedAt: Date.now() };
    await AsyncStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // ignore write failures — cache is best-effort
  }
}

export async function hasCachedWords(categoryId: string): Promise<boolean> {
  const entry = await readCache<{ id: string }[]>(`cache:words:${categoryId}`);
  return entry != null && entry.data.length > 0;
}
