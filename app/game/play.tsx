import { useCallback, useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGameStore } from '../../src/store/gameStore';
import { useAccelerometer } from '../../src/hooks/useAccelerometer';
import { useCalibration } from '../../src/hooks/useCalibration';
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
const FLASH_IN_MS = 60;
const FLASH_OUT_MS = 380;
const FLASH_OPACITY = 0.45;

export default function PlayScreen() {
  useLandscape();
  const router = useRouter();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { words, currentIndex, score, status, markCorrect, markSkipped, endRound } = useGameStore((s) => s);

  const { threshold } = useCalibration();

  const flashAnim = useRef(new Animated.Value(0)).current;
  const flashColorRef = useRef<'success' | 'skip'>('success');
  const flashAnimRef = useRef<Animated.CompositeAnimation | null>(null);

  const triggerFlash = useCallback((type: 'success' | 'skip') => {
    flashColorRef.current = type;
    flashAnimRef.current?.stop();
    flashAnim.setValue(0);
    flashAnimRef.current = Animated.sequence([
      Animated.timing(flashAnim, { toValue: FLASH_OPACITY, duration: FLASH_IN_MS, useNativeDriver: true }),
      Animated.timing(flashAnim, { toValue: 0, duration: FLASH_OUT_MS, useNativeDriver: true }),
    ]);
    flashAnimRef.current.start();
  }, [flashAnim]);

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
        triggerFlash('success');
        markCorrect();
      } else {
        playSkip();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        setTimeout(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning), 120);
        triggerFlash('skip');
        markSkipped();
      }
    },
    [markCorrect, markSkipped, triggerFlash]
  );

  useAccelerometer({ onTilt: handleTilt, enabled: status === 'playing', threshold });

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

  const flashColor = flashColorRef.current === 'success' ? theme.colors.success : theme.colors.error;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Colour-pulse overlay — sits above background, below all content */}
      <Animated.View
        style={[StyleSheet.absoluteFill, { backgroundColor: flashColor, opacity: flashAnim }]}
        pointerEvents="none"
      />

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
            <GameButton label="✓ Correcto" onPress={() => { triggerFlash('success'); markCorrect(); }} variant="success" fullWidth />
          </View>
          <View style={styles.devBtnWrapper}>
            <GameButton label="✗ Pasa" onPress={() => { triggerFlash('skip'); markSkipped(); }} variant="accent" fullWidth />
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
