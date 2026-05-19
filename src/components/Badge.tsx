import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { radii, spacing, typography } from '../utils/theme';

type BadgeColor = 'primary' | 'success' | 'accent' | 'neutral';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  label: string;
  color?: BadgeColor;
  size?: BadgeSize;
}

export function Badge({ label, color = 'primary', size = 'md' }: BadgeProps) {
  const { theme } = useTheme();

  const colorMap: Record<BadgeColor, string> = {
    primary: theme.colors.primary,
    success: theme.colors.success,
    accent: theme.colors.accent,
    neutral: theme.colors.onSurfaceSecondary,
  };

  const resolvedColor = colorMap[color];
  const isSm = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: resolvedColor + '22',
          paddingHorizontal: isSm ? spacing[2] : spacing[3],
          paddingVertical: isSm ? 2 : spacing[1],
        },
      ]}
    >
      <Text
        style={[
          styles.label,
          {
            color: resolvedColor,
            fontSize: isSm ? typography.fontSize.xs : typography.fontSize.sm,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: radii.full,
    alignSelf: 'flex-start',
  },
  label: {
    fontWeight: typography.fontWeight.semibold,
  },
});
