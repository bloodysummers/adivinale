import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useGameStore } from '../../src/store/gameStore';
import { useLandscape } from '../../src/hooks/useLandscape';
import { playGameOver } from '../../src/utils/audio';
import { colors, spacing, typography } from '../../src/utils/theme';

export default function ResultsScreen() {
  useLandscape();
  const router = useRouter();
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
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          {category && (
            <Text style={styles.categoryName}>
              {category.emoji} {category.name}
            </Text>
          )}
        </View>
        <View style={styles.scoreInline}>
          <Text style={styles.scoreCorrect}>{score}</Text>
          <Text style={styles.scoreTotal}> / {currentIndex}</Text>
          <Text style={styles.scoreLabel}> aciertos</Text>
        </View>
      </View>

      <ScrollView
        style={styles.wordList}
        contentContainerStyle={styles.wordListContent}
        showsVerticalScrollIndicator={false}
      >
        {playedWords.map((pw, i) => (
          <View key={pw.word.id ?? i} style={styles.wordRow}>
            <Text style={pw.status === 'correct' ? styles.iconCorrect : styles.iconSkipped}>
              {pw.status === 'correct' ? '✓' : '✗'}
            </Text>
            <Text style={styles.wordText}>{pw.word.text}</Text>
            {pw.word.subtext ? (
              <Text style={styles.wordSubtext}>{pw.word.subtext}</Text>
            ) : null}
          </View>
        ))}
      </ScrollView>

      <View style={styles.buttons}>
        <Pressable style={[styles.btn, styles.btnPrimary]} onPress={handlePlayAgain}>
          <Text style={styles.btnText}>Jugar de nuevo</Text>
        </Pressable>
        <Pressable style={[styles.btn, styles.btnSecondary]} onPress={handleHome}>
          <Text style={[styles.btnText, styles.btnTextSecondary]}>Ir al inicio</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  categoryName: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  scoreInline: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.xs,
  },
  scoreCorrect: {
    ...typography.score,
    color: colors.correct,
  },
  scoreTotal: {
    ...typography.score,
    color: colors.textSecondary,
  },
  scoreLabel: {
    ...typography.heading,
    color: colors.textSecondary,
  },
  wordList: {
    flex: 1,
  },
  wordListContent: {
    paddingBottom: spacing.sm,
  },
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.textSecondary + '33',
  },
  iconCorrect: {
    ...typography.body,
    color: colors.correct,
    fontWeight: '700',
    width: 20,
    textAlign: 'center',
  },
  iconSkipped: {
    ...typography.body,
    color: colors.skip,
    fontWeight: '700',
    width: 20,
    textAlign: 'center',
  },
  wordText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  wordSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  buttons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  btn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: 14,
    alignItems: 'center',
  },
  btnPrimary: {
    backgroundColor: colors.primary,
  },
  btnSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  btnText: {
    ...typography.body,
    color: colors.text,
    fontWeight: '700',
  },
  btnTextSecondary: {
    color: colors.primary,
  },
});
