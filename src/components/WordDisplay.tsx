import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../utils/theme';

interface WordDisplayProps {
  word: string;
}

export function WordDisplay({ word }: WordDisplayProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.word} adjustsFontSizeToFit numberOfLines={2}>
        {word}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  word: {
    ...typography.word,
    color: colors.text,
    textAlign: 'center',
  },
});
