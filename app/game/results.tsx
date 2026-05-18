import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useGameStore } from '../../src/store/gameStore';
import { ScoreBoard } from '../../src/components/ScoreBoard';
import { useLandscape } from '../../src/hooks/useLandscape';
import { colors, spacing, typography } from '../../src/utils/theme';

export default function ResultsScreen() {
  useLandscape();
  const router = useRouter();
  const { score, currentIndex, category, resetRound } = useGameStore((s) => s);

  function handlePlayAgain() {
    resetRound();
    router.replace(`/game/ready?categoryId=${category?.id ?? ''}`);
  }

  function handleChangeCategory() {
    resetRound();
    router.replace('/');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resultado</Text>
      {category && (
        <Text style={styles.categoryName}>
          {category.emoji} {category.name}
        </Text>
      )}

      <View style={styles.scoreContainer}>
        <ScoreBoard score={score} total={currentIndex} />
      </View>

      <View style={styles.buttons}>
        <Pressable style={[styles.btn, styles.btnPrimary]} onPress={handlePlayAgain}>
          <Text style={styles.btnText}>Jugar de nuevo</Text>
        </Pressable>
        <Pressable style={[styles.btn, styles.btnSecondary]} onPress={handleChangeCategory}>
          <Text style={[styles.btnText, styles.btnTextSecondary]}>Cambiar categoría</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  title: {
    ...typography.heading,
    color: colors.text,
  },
  categoryName: {
    ...typography.body,
    color: colors.textSecondary,
  },
  scoreContainer: {
    marginVertical: spacing.xl,
  },
  buttons: {
    width: '100%',
    gap: spacing.md,
  },
  btn: {
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
