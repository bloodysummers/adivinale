import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { radii, spacing } from '../utils/theme';

type Elevation = 0 | 1 | 2 | 3;
type PaddingKey = keyof typeof spacing;

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  elevation?: Elevation;
  padding?: PaddingKey;
}

export function Card({ children, style, elevation = 2, padding = 4 }: CardProps) {
  const { theme } = useTheme();
  const shadow = theme.getShadow(elevation);

  return (
    <View
      style={[
        styles.card,
        shadow,
        { backgroundColor: theme.colors.surface, padding: spacing[padding] },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.lg,
  },
});
