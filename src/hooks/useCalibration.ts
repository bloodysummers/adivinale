import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CORRECT_THRESHOLD } from '../utils/accelerometer';

const STORAGE_KEY = 'calibration_threshold';

export const CALIBRATION_DEFAULT = CORRECT_THRESHOLD;
export const CALIBRATION_MIN = 0.2;
export const CALIBRATION_MAX = 0.9;

interface CalibrationState {
  threshold: number;
  setThreshold: (value: number) => void;
}

export function useCalibration(): CalibrationState {
  const [threshold, setThresholdState] = useState(CALIBRATION_DEFAULT);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored != null) {
        const parsed = parseFloat(stored);
        if (!isNaN(parsed)) setThresholdState(parsed);
      }
    });
  }, []);

  const setThreshold = useCallback((value: number) => {
    setThresholdState(value);
    AsyncStorage.setItem(STORAGE_KEY, String(value));
  }, []);

  return { threshold, setThreshold };
}
