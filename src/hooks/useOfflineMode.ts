import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'offline_mode';

interface OfflineModeContextValue {
  isOffline: boolean;
  setOffline: (value: boolean) => void;
}

const OfflineModeContext = createContext<OfflineModeContextValue>({
  isOffline: false,
  setOffline: () => {},
});

export function OfflineModeProvider({ children }: { children: React.ReactNode }) {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (val === 'true') setIsOffline(true);
    });
  }, []);

  const setOffline = useCallback((value: boolean) => {
    setIsOffline(value);
    AsyncStorage.setItem(STORAGE_KEY, String(value));
  }, []);

  return React.createElement(
    OfflineModeContext.Provider,
    { value: { isOffline, setOffline } },
    children
  );
}

export function useOfflineMode(): OfflineModeContextValue {
  return useContext(OfflineModeContext);
}
