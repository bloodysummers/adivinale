import { Platform } from 'react-native';

// ─── Colors ──────────────────────────────────────────────────────────────────

export const lightColors = {
  primary: '#5B4FE8',
  primaryDark: '#3D32C4',
  primaryLight: '#8B82F0',
  accent: '#FF6B6B',
  success: '#4ECDC4',
  error: '#EF4444',
  background: '#F4F3FF',
  surface: '#FFFFFF',
  surfaceVariant: '#EAE8FF',
  onPrimary: '#FFFFFF',
  onBackground: '#1A1730',
  onSurface: '#1A1730',
  onSurfaceSecondary: '#6B6490',
  border: '#D4D0F5',
  overlay: 'rgba(26, 23, 48, 0.5)',
};

export const darkColors = {
  primary: '#7B70F0',
  primaryDark: '#5B4FE8',
  primaryLight: '#A89BF5',
  accent: '#FF8585',
  success: '#5EDBD2',
  error: '#F87171',
  background: '#1A1730',
  surface: '#252140',
  surfaceVariant: '#2E2A50',
  onPrimary: '#FFFFFF',
  onBackground: '#F0EEFF',
  onSurface: '#F0EEFF',
  onSurfaceSecondary: '#9B95C4',
  border: '#3D3860',
  overlay: 'rgba(0, 0, 0, 0.6)',
};

export type Colors = typeof lightColors;

// ─── Typography ──────────────────────────────────────────────────────────────

export const typography = {
  fontFamily: {
    heading: undefined as string | undefined,
    body: undefined as string | undefined,
  },
  fontSize: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 38,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// ─── Spacing ─────────────────────────────────────────────────────────────────

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

// ─── Radii ───────────────────────────────────────────────────────────────────

export const radii = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

// ─── Gradients ───────────────────────────────────────────────────────────────

export const gradients = {
  primary: ['#5B4FE8', '#8B70F8'] as string[],
  success: ['#4ECDC4', '#2EB890'] as string[],
  accent: ['#FF8C42', '#FF6B6B'] as string[],
  background: {
    light: ['#F4F3FF', '#EAE8FF'] as string[],
    dark: ['#1A1730', '#252140'] as string[],
  },
};

// ─── Shadows ─────────────────────────────────────────────────────────────────

type ShadowLevel = 0 | 1 | 2 | 3 | 4;

const shadowConfig: Record<ShadowLevel, { elevation: number; opacity: number; radius: number; offsetY: number }> = {
  0: { elevation: 0, opacity: 0, radius: 0, offsetY: 0 },
  1: { elevation: 2, opacity: 0.08, radius: 4, offsetY: 2 },
  2: { elevation: 4, opacity: 0.12, radius: 8, offsetY: 4 },
  3: { elevation: 8, opacity: 0.18, radius: 16, offsetY: 8 },
  4: { elevation: 16, opacity: 0.25, radius: 24, offsetY: 12 },
};

export function getShadow(level: ShadowLevel) {
  const cfg = shadowConfig[level];
  if (Platform.OS === 'android') {
    return { elevation: cfg.elevation };
  }
  return {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: cfg.offsetY },
    shadowOpacity: cfg.opacity,
    shadowRadius: cfg.radius,
  };
}

// ─── Composite themes ────────────────────────────────────────────────────────

export const lightTheme = {
  colors: lightColors,
  typography,
  spacing,
  radii,
  gradients,
  getShadow,
};

export const darkTheme = {
  colors: darkColors,
  typography,
  spacing,
  radii,
  gradients,
  getShadow,
};

export type Theme = typeof lightTheme;
