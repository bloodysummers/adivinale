import { useEffect, useState } from 'react';
import { getWords } from '../api/client';
import type { Word } from '../types';

export function useWords(categoryId: string) {
  const [data, setData] = useState<Word[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!categoryId) return;
    let cancelled = false;
    setIsLoading(true);
    setData(null);
    setError(null);
    getWords(categoryId)
      .then((words) => {
        if (!cancelled) {
          setData(words);
          setIsLoading(false);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err);
          setIsLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [categoryId]);

  return { data, error, isLoading };
}
