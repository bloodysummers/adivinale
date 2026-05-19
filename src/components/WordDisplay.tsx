import { StyleSheet, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Text } from './Text';
import { spacing } from '../utils/theme';

interface WordDisplayProps {
  word: string;
  subtext?: string;
}

export function WordDisplay({ word, subtext }: WordDisplayProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {/*
        variant="wordDisplay" has no lineHeight so adjustsFontSizeToFit can shrink freely.
        A fixed lineHeight clips text when the font is large or leaves excess space when shrunk.
      */}
      <Text
        variant="wordDisplay"
        color={theme.colors.onBackground}
        align="center"
        adjustsFontSizeToFit
        numberOfLines={3}
      >
        {word}
      </Text>
      {subtext ? (
        <Text variant="bodySmall" color={theme.colors.onSurfaceSecondary} align="center">
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
    paddingVertical: spacing[6],
    paddingHorizontal: spacing[8],
    gap: spacing[2],
  },
});
