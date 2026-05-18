import { useCallback, useEffect } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useGameStore } from '../../src/store/gameStore';
import { useAccelerometer } from '../../src/hooks/useAccelerometer';
import { useGameTimer } from '../../src/hooks/useGameTimer';
import { useLandscape } from '../../src/hooks/useLandscape';
import { WordDisplay } from '../../src/components/WordDisplay';
import { Timer } from '../../src/components/Timer';
import { colors, spacing, typography } from '../../src/utils/theme';
import type { TiltDirection } from '../../src/hooks/useAccelerometer';

const IS_DEV = __DEV__;

export default function PlayScreen() {
  useLandscape();
  const router = useRouter();
  const { words, currentIndex, score, status, markCorrect, markSkipped, endRound } =
    useGameStore((s) => s);

  const handleExpire = useCallback(() => {
    endRound();
  }, [endRound]);

  const { timeLeft } = useGameTimer({
    duration: 60,
    onExpire: handleExpire,
    running: status === 'playing',
  });

  const handleTilt = useCallback(
    (direction: TiltDirection) => {
      if (direction === 'up') markCorrect();
      else markSkipped();
    },
    [markCorrect, markSkipped]
  );

  useAccelerometer({ onTilt: handleTilt, enabled: status === 'playing' });

  useEffect(() => {
    if (status === 'finished' || timeLeft === 0) {
      router.replace('/game/results');
    }
  }, [status, timeLeft, router]);

  const currentWord = words[currentIndex];

  if (!currentWord) {
    return (
      <View style={styles.container}>
        <Text style={styles.fallback}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Timer timeLeft={timeLeft} />
        <Text style={styles.scoreText}>✓ {score}</Text>
      </View>

      <WordDisplay word={currentWord.text} />

      {IS_DEV && (
        <View style={styles.devButtons}>
          <Pressable
            style={[styles.devBtn, styles.correctBtn]}
            onPress={markCorrect}
          >
            <Text style={styles.devBtnText}>✓ Correcto</Text>
          </Pressable>
          <Pressable
            style={[styles.devBtn, styles.skipBtn]}
            onPress={markSkipped}
          >
            <Text style={styles.devBtnText}>✗ Pasa</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  scoreText: {
    ...typography.timer,
    color: colors.correct,
  },
  fallback: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
  devButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  devBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  correctBtn: {
    backgroundColor: colors.correct,
  },
  skipBtn: {
    backgroundColor: colors.skip,
  },
  devBtnText: {
    ...typography.body,
    color: colors.text,
    fontWeight: '700',
  },
});
