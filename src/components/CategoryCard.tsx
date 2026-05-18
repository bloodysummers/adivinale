import { Pressable, StyleSheet, Text } from 'react-native';
import type { Category } from '../types';
import { colors, spacing, typography } from '../utils/theme';

interface CategoryCardProps {
  category: Category;
  onPress: (category: Category) => void;
}

export function CategoryCard({ category, onPress }: CategoryCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={() => onPress(category)}
    >
      <Text style={styles.emoji}>{category.emoji}</Text>
      <Text style={styles.name}>{category.name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    alignItems: 'center',
    marginVertical: spacing.sm,
    width: '100%',
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.97 }],
  },
  emoji: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  name: {
    ...typography.heading,
    color: colors.text,
  },
});
