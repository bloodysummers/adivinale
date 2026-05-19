import { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useGameStore } from '../../src/store/gameStore';
import { useLandscape } from '../../src/hooks/useLandscape';
import { playGameOver } from '../../src/utils/audio';
import { Text } from '../../src/components/Text';
import { GameButton } from '../../src/components/GameButton';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { useTheme } from '../../src/theme/ThemeProvider';
import { spacing, radii } from '../../src/utils/theme';

export default function ResultsScreen() {
  useLandscape();
  const router = useRouter();
  const { theme } = useTheme();
  const { score, currentIndex, category, playedWords, resetRound } = useGameStore((s) => s);

  useEffect(() => {
    playGameOver();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 300);
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 520);
  }, []);

  function handlePlayAgain() {
    resetRound();
    router.replace(
      `/game/ready?categoryId=${category?.id ?? ''}&categoryName=${encodeURIComponent(category?.name ?? '')}&categoryEmoji=${encodeURIComponent(category?.emoji ?? '')}`
    );
  }

  function handleHome() {
    resetRound();
    router.replace('/');
  }

  return (
    <ScreenContainer style={styles.container}>
      <View style={styles.header}>
        {category && (
          <Text variant="label" color={theme.colors.onSurfaceSecondary} align="center">
            {category.emoji} {category.name}
          </Text>
        )}
        <View style={styles.scoreRow}>
          <Text variant="heading1" color={theme.colors.success}>{score}</Text>
          <Text variant="heading2" color={theme.colors.onSurfaceSecondary}> / {currentIndex}</Text>
          <Text variant="heading3" color={theme.colors.onSurfaceSecondary}> aciertos</Text>
        </View>
      </View>

      <ScrollView
        style={styles.wordList}
        contentContainerStyle={styles.wordListContent}
        showsVerticalScrollIndicator={false}
      >
        {playedWords.map((pw, i) => {
          const isCorrect = pw.status === 'correct';
          return (
            <View
              key={pw.word.id ?? i}
              style={[styles.wordRow, { borderBottomColor: theme.colors.border }]}
            >
              <Text
                style={[
                  styles.icon,
                  { color: isCorrect ? theme.colors.success : theme.colors.error },
                ]}
              >
                {isCorrect ? '✓' : '✗'}
              </Text>
              <Text variant="body" color={theme.colors.onSurface} style={styles.wordText}>
                {pw.word.text}
              </Text>
              {pw.word.subtext ? (
                <Text variant="caption">{pw.word.subtext}</Text>
              ) : null}
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.buttons}>
        <View style={styles.btnWrapper}>
          <GameButton label="Jugar de nuevo" onPress={handlePlayAgain} variant="primary" fullWidth />
        </View>
        <View style={styles.btnWrapper}>
          <GameButton label="Ir al inicio" onPress={handleHome} variant="accent" fullWidth />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing[4],
  },
  header: {
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[3],
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  wordList: {
    flex: 1,
  },
  wordListContent: {
    paddingBottom: spacing[3],
  },
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingVertical: spacing[2],
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  icon: {
    fontWeight: '700',
    width: 20,
    textAlign: 'center',
  },
  wordText: {
    flex: 1,
  },
  buttons: {
    flexDirection: 'row',
    gap: spacing[3],
    paddingTop: spacing[3],
    paddingBottom: spacing[2],
  },
  btnWrapper: {
    flex: 1,
  },
});
