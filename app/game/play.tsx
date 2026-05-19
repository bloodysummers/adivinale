import { useCallback, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGameStore } from '../../src/store/gameStore';
import { useAccelerometer } from '../../src/hooks/useAccelerometer';
import { useGameTimer } from '../../src/hooks/useGameTimer';
import { useLandscape } from '../../src/hooks/useLandscape';
import { playSkip, playSuccess } from '../../src/utils/audio';
import { WordDisplay } from '../../src/components/WordDisplay';
import { Timer } from '../../src/components/Timer';
import { Text } from '../../src/components/Text';
import { GameButton } from '../../src/components/GameButton';
import { useTheme } from '../../src/theme/ThemeProvider';
import { spacing } from '../../src/utils/theme';
import type { TiltDirection } from '../../src/hooks/useAccelerometer';

const IS_DEV = __DEV__;

export default function PlayScreen() {
  useLandscape();
  const router = useRouter();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { words, currentIndex, score, status, markCorrect, markSkipped, endRound } = useGameStore((s) => s);

  const handleExpire = useCallback(() => endRound(), [endRound]);

  const { timeLeft } = useGameTimer({
    duration: 60,
    onExpire: handleExpire,
    running: status === 'playing',
  });

  const handleTilt = useCallback(
    (direction: TiltDirection) => {
      if (direction === 'up') {
        playSuccess();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setTimeout(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success), 120);
        markCorrect();
      } else {
        playSkip();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        setTimeout(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning), 120);
        markSkipped();
      }
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
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text variant="body" color={theme.colors.onSurfaceSecondary} align="center">
          Cargando...
        </Text>
      </View>
    );
  }

  // In landscape, insets apply to left/right (notch sides) — use them for horizontal padding
  const hPad = Math.max(spacing[6], insets.left + spacing[4]);
  const topPad = Math.max(spacing[4], insets.top + spacing[2]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.topBar, { paddingHorizontal: hPad, paddingTop: topPad }]}>
        <Timer timeLeft={timeLeft} />
        <Text variant="heading2" color={theme.colors.success}>✓ {score}</Text>
      </View>

      {/* WordDisplay takes all remaining vertical space */}
      <View style={styles.wordArea}>
        <WordDisplay word={currentWord.text} subtext={currentWord.subtext} />
      </View>

      {IS_DEV && (
        <View style={[styles.devButtons, { paddingHorizontal: hPad, paddingBottom: Math.max(spacing[4], insets.bottom) }]}>
          {/* Each button lives in a flex:1 wrapper — never use fullWidth inside a row */}
          <View style={styles.devBtnWrapper}>
            <GameButton label="✓ Correcto" onPress={markCorrect} variant="success" fullWidth />
          </View>
          <View style={styles.devBtnWrapper}>
            <GameButton label="✗ Pasa" onPress={markSkipped} variant="accent" fullWidth />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wordArea: {
    flex: 1,
  },
  devButtons: {
    flexDirection: 'row',
    gap: spacing[4],
  },
  devBtnWrapper: {
    // Each wrapper takes half the row — GameButton with fullWidth fills it
    flex: 1,
  },
});
