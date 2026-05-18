import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGameStore } from '../../src/store/gameStore';
import { useWords } from '../../src/hooks/useWords';
import { useLandscape } from '../../src/hooks/useLandscape';
import { colors, spacing, typography } from '../../src/utils/theme';

const STEPS = ['3', '2', '1', '¡Ya!'];

export default function ReadyScreen() {
  useLandscape();
  const router = useRouter();
  const { categoryId, categoryName, categoryEmoji } =
    useLocalSearchParams<{ categoryId: string; categoryName: string; categoryEmoji: string }>();
  const startRound = useGameStore((s) => s.startRound);
  const [step, setStep] = useState(0);
  const [countdownDone, setCountdownDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: words, error, isLoading } = useWords(categoryId ?? '');

  const category = categoryId
    ? { id: categoryId, name: categoryName ?? '', emoji: categoryEmoji ?? '', language: 'es+en' as const }
    : null;

  useEffect(() => {
    if (!category) return;
    timerRef.current = setTimeout(tick, 1000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [step, category]);

  useEffect(() => {
    if (countdownDone && words && words.length > 0) {
      startRound(category!, words);
      router.replace('/game/play');
    }
  }, [countdownDone, words]);

  function tick() {
    const next = step + 1;
    if (next < STEPS.length) {
      setStep(next);
    } else {
      setCountdownDone(true);
    }
  }

  if (!category) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Categoría no encontrada</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Error al cargar palabras. Intenta de nuevo.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.categoryEmoji}>{category.emoji}</Text>
      <Text style={styles.categoryName}>{category.name}</Text>
      <Text style={styles.countdown}>{STEPS[step]}</Text>
      {countdownDone && isLoading ? (
        <Text style={styles.hint}>Cargando palabras…</Text>
      ) : (
        <Text style={styles.hint}>Pon el teléfono en tu frente</Text>
      )}
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
