import { useEffect, useRef } from 'react';
import { Accelerometer } from 'expo-sensors';
import {
  CORRECT_THRESHOLD,
  SKIP_THRESHOLD,
  HOLD_DURATION_MS,
  DEBOUNCE_MS,
} from '../utils/accelerometer';

export type TiltDirection = 'up' | 'down';

interface UseAccelerometerOptions {
  onTilt: (direction: TiltDirection) => void;
  enabled?: boolean;
}

export function useAccelerometer({ onTilt, enabled = true }: UseAccelerometerOptions) {
  const holdStartRef = useRef<number | null>(null);
  const holdDirectionRef = useRef<TiltDirection | null>(null);
  const lastTiltAtRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled) return;

    Accelerometer.setUpdateInterval(50);

    const subscription = Accelerometer.addListener(({ z }) => {
      const now = Date.now();

      let currentDirection: TiltDirection | null = null;
      if (z > CORRECT_THRESHOLD) currentDirection = 'up';
      else if (z < SKIP_THRESHOLD) currentDirection = 'down';

      if (currentDirection === null) {
        holdStartRef.current = null;
        holdDirectionRef.current = null;
        return;
      }

      if (holdDirectionRef.current !== currentDirection) {
        holdStartRef.current = now;
        holdDirectionRef.current = currentDirection;
        return;
      }

      const holdStart = holdStartRef.current ?? now;
      const heldFor = now - holdStart;

      if (heldFor >= HOLD_DURATION_MS) {
        const sinceLastTilt = now - lastTiltAtRef.current;
        if (sinceLastTilt >= DEBOUNCE_MS) {
          lastTiltAtRef.current = now;
          holdStartRef.current = null;
          holdDirectionRef.current = null;
          onTilt(currentDirection);
        }
      }
    });

    return () => subscription.remove();
  }, [enabled, onTilt]);
}
