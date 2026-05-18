import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../utils/theme';

interface ScoreBoardProps {
  score: number;
  total: number;
}

export function ScoreBoard({ score, total }: ScoreBoardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.score}>{score}</Text>
      <Text style={styles.divider}>/</Text>
      <Text style={styles.total}>{total}</Text>
      <Text style={styles.label}>aciertos</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  score: {
    ...typography.score,
    color: colors.correct,
  },
  divider: {
    ...typography.heading,
    color: colors.textSecondary,
    marginVertical: -spacing.sm,
  },
  total: {
    ...typography.score,
    color: colors.text,
  },
  label: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
});
