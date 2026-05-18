import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../utils/theme';

interface WordDisplayProps {
  word: string;
  subtext?: string;
}

export function WordDisplay({ word, subtext }: WordDisplayProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.word} adjustsFontSizeToFit numberOfLines={2}>
        {word}
      </Text>
      {subtext ? (
        <Text style={styles.subtext} adjustsFontSizeToFit numberOfLines={1}>
          {subtext}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  word: {
    ...typography.word,
    color: colors.text,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 24,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
