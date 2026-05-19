import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme, useWindowDimensions } from 'react-native';
import { lightColors, darkColors, scaleTypography, spacing, radii, gradients, getShadow, type Theme } from '../utils/theme';

const BASE_WIDTH = 390;
const MAX_SCALE = 1.35;

interface ThemeContextValue {
  theme: Theme;
  colorScheme: 'light' | 'dark';
  scale: number;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const scheme = useColorScheme();
  const { width } = useWindowDimensions();

  const colorScheme: 'light' | 'dark' = scheme === 'dark' ? 'dark' : 'light';
  const scale = Math.min(width / BASE_WIDTH, MAX_SCALE);

  const theme = useMemo<Theme>(() => ({
    colors: colorScheme === 'dark' ? darkColors : lightColors,
    typography: scaleTypography(scale),
    spacing,
    radii,
    gradients,
    getShadow,
  }), [colorScheme, scale]);

  const value = useMemo(() => ({ theme, colorScheme, scale }), [theme, colorScheme, scale]);

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
