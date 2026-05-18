import type { Category, Word } from '../types';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) {
    const body = await res.text().catch(() => res.statusText);
    throw new Error(body);
  }
  return res.json() as Promise<T>;
}

export async function getCategories(): Promise<Category[]> {
  const data = await apiFetch<{ categories: Category[] }>('/api/categories');
  return data.categories;
}

export async function getWords(categoryId: string): Promise<Word[]> {
  const data = await apiFetch<{ words: Word[] }>(`/api/categories/${categoryId}/words`);
  return data.words;
}
