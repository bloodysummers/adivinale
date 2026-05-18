import { useEffect, useRef, useState } from 'react';

interface UseGameTimerOptions {
  duration?: number;
  onExpire: () => void;
  running: boolean;
}

export function useGameTimer({ duration = 60, onExpire, running }: UseGameTimerOptions) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (!running) return;

    const id = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          onExpireRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [running]);

  return { timeLeft };
}
