import React from 'react';
import {
  Text as RNText,
  StyleProp,
  StyleSheet,
  TextStyle,
} from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { typography } from '../utils/theme';

type Variant = 'heading1' | 'heading2' | 'heading3' | 'body' | 'bodySmall' | 'label' | 'caption';

interface TextProps {
  children: React.ReactNode;
  variant?: Variant;
  color?: string;
  align?: 'left' | 'center' | 'right';
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  adjustsFontSizeToFit?: boolean;
}

export function Text({ children, variant = 'body', color, align, style, numberOfLines, adjustsFontSizeToFit }: TextProps) {
  const { theme } = useTheme();

  const isCaption = variant === 'caption';
  const resolvedColor = color ?? (isCaption ? theme.colors.onSurfaceSecondary : theme.colors.onBackground);

  return (
    <RNText
      style={[
        variantStyles[variant],
        { color: resolvedColor },
        align != null && { textAlign: align },
        style,
      ]}
      numberOfLines={numberOfLines}
      adjustsFontSizeToFit={adjustsFontSizeToFit}
    >
      {children}
    </RNText>
  );
}

const variantStyles = StyleSheet.create({
  heading1: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.extrabold,
    lineHeight: typography.fontSize['4xl'] * typography.lineHeight.tight,
  },
  heading2: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.fontSize['3xl'] * typography.lineHeight.tight,
  },
  heading3: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.fontSize['2xl'] * typography.lineHeight.tight,
  },
  body: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.fontSize.md * typography.lineHeight.normal,
  },
  bodySmall: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.fontSize.sm * typography.lineHeight.normal,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.fontSize.sm * typography.lineHeight.normal,
  },
  caption: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.fontSize.xs * typography.lineHeight.normal,
  },
});
