import React, { useRef } from 'react';
import { Animated, Platform, Pressable, StyleSheet, StyleProp, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { Category } from '../types';
import { Text } from './Text';
import { useTheme } from '../theme/ThemeProvider';
import { radii, spacing } from '../utils/theme';

const CARD_GRADIENTS: [string, string][] = [
  ['#5B4FE8', '#8B70F8'],
  ['#4ECDC4', '#2EB890'],
  ['#FF6B6B', '#FF8C42'],
  ['#F59E0B', '#EF4444'],
  ['#6366F1', '#8B5CF6'],
  ['#10B981', '#059669'],
  ['#EC4899', '#8B5CF6'],
  ['#3B82F6', '#6366F1'],
];

// Darker shade per gradient for the bottom "button edge"
const CARD_EDGES: string[] = [
  '#3730A3', '#0D9488', '#DC2626', '#B45309',
  '#4338CA', '#047857', '#BE185D', '#1D4ED8',
];

function pickIndex(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) & 0xffffffff;
  return Math.abs(hash) % CARD_GRADIENTS.length;
}

interface CategoryCardProps {
  category: Category;
  onPress: (category: Category) => void;
  offlineAvailable?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function CategoryCard({ category, onPress, offlineAvailable = false, style }: CategoryCardProps) {
  const { theme } = useTheme();
  const { fontSize, lineHeight } = theme.typography;
  // minHeight = 2 lines of the button variant (fontSize.lg × lineHeight.normal × 2)
  const nameMinHeight = fontSize.lg * lineHeight.normal * 2;

  const idx = pickIndex(category.id);
  const gradient = CARD_GRADIENTS[idx];
  const edgeColor = CARD_EDGES[idx];

  const scale = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  function handlePressIn() {
    Animated.parallel([
      Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 60 }),
      Animated.timing(translateY, { toValue: 5, duration: 60, useNativeDriver: true }),
    ]).start();
  }

  function handlePressOut() {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 60 }),
      Animated.timing(translateY, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  }

  const iosShadow = Platform.OS === 'ios'
    ? { shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.28, shadowRadius: 8 }
    : {};

  return (
    <Animated.View
      style={[
        styles.outer,
        iosShadow,
        { transform: [{ scale }, { translateY }] },
        style,
      ]}
    >
      {/* Bottom edge — gives the "button thickness" illusion */}
      <View style={[styles.edge, { backgroundColor: edgeColor }]} />

      <Pressable
        onPress={() => onPress(category)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.pressable}
      >
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          {/* Top sheen for light refraction */}
          <View style={styles.sheen} />

          {offlineAvailable && (
            <View style={styles.offlineBadge}>
              <Text style={styles.offlineIcon}>📥</Text>
            </View>
          )}

          <View style={styles.emojiWrapper}>
            <Text style={styles.emoji}>{category.emoji}</Text>
          </View>
          <View style={[styles.nameContainer, { minHeight: nameMinHeight }]}>
            <Text variant="button" color="#fff" align="center" style={styles.name}>
              {category.name}
            </Text>
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  outer: {
    borderRadius: radii.xl,
    elevation: 8,
  },
  edge: {
    // Sits behind the card — its bottom 5px show as the "thick edge"
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
    // Card floats 5px above edge → shows the bottom "thickness"
    marginBottom: 5,
  },
  card: {
    borderRadius: radii.xl,
    paddingTop: spacing[4],
    paddingBottom: spacing[3],
    paddingHorizontal: spacing[3],
    alignItems: 'center',
    gap: spacing[2],
    minHeight: 108,
    justifyContent: 'center',
  },
  sheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '45%',
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    backgroundColor: 'rgba(255,255,255,0.13)',
  },
  emojiWrapper: {
    width: 52,
    height: 52,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 2,
  },
  emoji: {
    fontSize: 26,
    lineHeight: 34,
  },
  nameContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  offlineBadge: {
    position: 'absolute',
    top: spacing[2],
    right: spacing[2],
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: radii.full,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  offlineIcon: {
    fontSize: 12,
    lineHeight: 16,
  },
});
