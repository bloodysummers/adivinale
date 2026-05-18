import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { categories } from '../../src/data/categories';
import { wordsByCategory } from '../../src/data/words';
import { useGameStore } from '../../src/store/gameStore';
import { useLandscape } from '../../src/hooks/useLandscape';
import { colors, spacing, typography } from '../../src/utils/theme';

const STEPS = ['3', '2', '1', '¡Ya!'];

export default function ReadyScreen() {
  useLandscape();
  const router = useRouter();
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const startRound = useGameStore((s) => s.startRound);
  const [step, setStep] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const category = categories.find((c) => c.id === categoryId);

  useEffect(() => {
    if (!category) return;

    timerRef.current = setTimeout(tick, 1000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [step, category]);

  function tick() {
    const next = step + 1;
    if (next < STEPS.length) {
      setStep(next);
    } else {
      const words = wordsByCategory[categoryId ?? ''] ?? [];
      startRound(category!, words);
      router.replace('/game/play');
    }
  }

  if (!category) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Categoría no encontrada</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.categoryEmoji}>{category.emoji}</Text>
      <Text style={styles.categoryName}>{category.name}</Text>
      <Text style={styles.countdown}>{STEPS[step]}</Text>
      <Text style={styles.hint}>Pon el teléfono en tu frente</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  categoryEmoji: {
    fontSize: 56,
  },
  categoryName: {
    ...typography.heading,
    color: colors.textSecondary,
  },
  countdown: {
    fontSize: 96,
    fontWeight: '900',
    color: colors.text,
    marginVertical: spacing.md,
  },
  hint: {
    ...typography.body,
    color: colors.textSecondary,
  },
  error: {
    ...typography.body,
    color: colors.skip,
  },
});
