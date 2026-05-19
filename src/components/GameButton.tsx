import React, { useRef } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeProvider';
import { radii, spacing, typography, gradients } from '../utils/theme';

type Variant = 'primary' | 'secondary' | 'success' | 'accent';
type Size = 'sm' | 'md' | 'lg';

interface GameButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: Size;
}

const sizeStyles: Record<Size, { paddingVertical: number; paddingHorizontal: number; fontSize: number }> = {
  sm: { paddingVertical: spacing[2], paddingHorizontal: spacing[4], fontSize: typography.fontSize.sm },
  md: { paddingVertical: spacing[3], paddingHorizontal: spacing[6], fontSize: typography.fontSize.lg },
  lg: { paddingVertical: spacing[4], paddingHorizontal: spacing[8], fontSize: typography.fontSize.xl },
};

const variantGradients: Record<Variant, string[]> = {
  primary: gradients.primary,
  secondary: ['#8B70F8', '#6C63FF'],
  success: gradients.success,
  accent: gradients.accent,
};

// Darker bottom-edge color per variant (simulates button thickness)
const variantEdges: Record<Variant, string> = {
  primary: '#3730A3',
  secondary: '#4338CA',
  success: '#0D9488',
  accent: '#DC2626',
};

const EDGE_HEIGHT = 5;

export function GameButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  fullWidth = false,
  size = 'md',
}: GameButtonProps) {
  const { theme } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  function handlePressIn() {
    Animated.parallel([
      Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 60 }),
      Animated.timing(translateY, { toValue: EDGE_HEIGHT, duration: 60, useNativeDriver: true }),
    ]).start();
  }

  function handlePressOut() {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 60 }),
      Animated.timing(translateY, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  }

  const { paddingVertical, paddingHorizontal, fontSize } = sizeStyles[size];
  const colors = variantGradients[variant];
  const edgeColor = variantEdges[variant];

  const iosShadow = Platform.OS === 'ios'
    ? { shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.25, shadowRadius: 8 }
    : {};

  return (
    <Animated.View
      style={[
        styles.outer,
        fullWidth && styles.fullWidth,
        iosShadow,
        { transform: [{ scale }, { translateY }] },
        disabled && styles.disabled,
      ]}
    >
      {/* Bottom edge — visible below the card, gives physical depth */}
      <View style={[styles.edge, { backgroundColor: edgeColor }]} />

      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[styles.pressable, fullWidth && styles.fullWidth]}
      >
        <LinearGradient
          colors={colors as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.gradient, { paddingVertical, paddingHorizontal }]}
        >
          {/* Top sheen */}
          <View style={styles.sheen} />
          <Text style={[styles.label, { fontSize, color: theme.colors.onPrimary }]}>
            {label}
          </Text>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  outer: {
    borderRadius: radii.xl,
    alignSelf: 'flex-start',
    elevation: 8,
  },
  fullWidth: {
    alignSelf: 'stretch',
    width: '100%',
  },
  edge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    borderRadius: radii.xl,
  },
  pressable: {
    borderRadius: radii.xl,
    overflow: 'hidden',
    // Floats above the edge so EDGE_HEIGHT px of edge color shows at the bottom
    marginBottom: EDGE_HEIGHT,
  },
  gradient: {
    borderRadius: radii.xl,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  sheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  label: {
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 0.3,
  },
  disabled: {
    opacity: 0.5,
  },
});
