import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme, useWindowDimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, darkColors, scaleTypography, spacing, radii, gradients, getShadow, type Theme } from '../utils/theme';

const BASE_WIDTH = 390;
const MAX_SCALE = 1.35;
const STORAGE_KEY = 'theme_preference';

interface ThemeContextValue {
  theme: Theme;
  colorScheme: 'light' | 'dark';
  scale: number;
  themeLoaded: boolean;
  setTheme: (scheme: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const { width } = useWindowDimensions();

  const [storedScheme, setStoredScheme] = useState<'light' | 'dark' | null>(null);
  const [themeLoaded, setThemeLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (val === 'light' || val === 'dark') setStoredScheme(val);
      setThemeLoaded(true);
    }).catch(() => setThemeLoaded(true));
  }, []);

  const colorScheme: 'light' | 'dark' = storedScheme ?? (systemScheme === 'dark' ? 'dark' : 'light');
  const scale = Math.min(width / BASE_WIDTH, MAX_SCALE);

  const setTheme = useCallback((scheme: 'light' | 'dark') => {
    setStoredScheme(scheme);
    AsyncStorage.setItem(STORAGE_KEY, scheme);
  }, []);

  const theme = useMemo<Theme>(() => ({
    colors: colorScheme === 'dark' ? darkColors : lightColors,
    typography: scaleTypography(scale),
    spacing,
    radii,
    gradients,
    getShadow,
  }), [colorScheme, scale]);

  const value = useMemo(
    () => ({ theme, colorScheme, scale, themeLoaded, setTheme }),
    [theme, colorScheme, scale, themeLoaded, setTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}
