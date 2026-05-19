import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGameStore } from '../../src/store/gameStore';
import { useWords } from '../../src/hooks/useWords';
import { useLandscape } from '../../src/hooks/useLandscape';
import { playCounter } from '../../src/utils/audio';
import { Text } from '../../src/components/Text';
import { gradients, spacing } from '../../src/utils/theme';

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
    if (!categoryId) return;
    if (step === 0) playCounter();
    if (STEPS[step] === '¡Ya!') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 160);
      setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 320);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    timerRef.current = setTimeout(tick, 1000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [step, categoryId]);

  useEffect(() => {
    if (countdownDone && words && words.length > 0) {
      startRound(category!, words);
      router.replace('/game/play');
    }
  }, [countdownDone, words]);

  function tick() {
    const next = step + 1;
    if (next < STEPS.length) setStep(next);
    else setCountdownDone(true);
  }

  if (!category) {
    return (
      <LinearGradient colors={gradients.primary as [string, string]} style={styles.fill}>
        <SafeAreaView style={styles.fill}>
          <View style={styles.center}>
            <Text variant="body" color="#fff">Categoría no encontrada</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient colors={gradients.primary as [string, string]} style={styles.fill}>
        <SafeAreaView style={styles.fill}>
          <View style={styles.center}>
            <Text variant="body" color="#fff">Error al cargar palabras. Intenta de nuevo.</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={gradients.primary as [string, string]} style={styles.fill}>
      <SafeAreaView style={styles.fill}>
        <View style={styles.center}>
          <View style={styles.categoryBadge}>
            <Text style={styles.emoji}>{category.emoji}</Text>
            <Text variant="label" color="rgba(255,255,255,0.85)">{category.name}</Text>
          </View>

          <Text variant="countdown" color="#fff">{STEPS[step]}</Text>

          <Text variant="bodySmall" color="rgba(255,255,255,0.7)" align="center">
            {countdownDone && isLoading ? 'Cargando palabras…' : 'Pon el teléfono en tu frente'}
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing[4],
  },
  categoryBadge: {
    alignItems: 'center',
    gap: spacing[2],
  },
  emoji: {
    fontSize: 56,
    lineHeight: 68,
  },
});
