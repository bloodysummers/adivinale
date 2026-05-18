import { useEffect, useState } from 'react';
import { getCategories } from '../api/client';
import type { Category } from '../types';

export function useCategories() {
  const [data, setData] = useState<Category[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    getCategories()
      .then((cats) => {
        if (!cancelled) {
          setData(cats);
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
  }, []);

  return { data, error, isLoading };
}
