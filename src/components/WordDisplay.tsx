import { StyleSheet, Text as RNText, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Text } from './Text';
import { spacing, typography } from '../utils/theme';

interface WordDisplayProps {
  word: string;
  subtext?: string;
}

export function WordDisplay({ word, subtext }: WordDisplayProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {/*
        Uses RN's native Text to avoid the design-system Text component adding a
        body-variant lineHeight (22.5) that would be smaller than the fontSize (38+),
        clipping characters from top and bottom.
      */}
      <RNText
        style={[styles.word, { color: theme.colors.onBackground }]}
        adjustsFontSizeToFit
        numberOfLines={3}
      >
        {word}
      </RNText>
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
    // Generous vertical padding so the word never touches topBar or devButtons
    paddingVertical: spacing[6],
    paddingHorizontal: spacing[8],
    gap: spacing[2],
  },
  word: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.extrabold,
    textAlign: 'center',
    letterSpacing: 0.5,
    // No lineHeight — let RN compute the natural leading.
    // A fixed lineHeight would stay large when adjustsFontSizeToFit shrinks the font,
    // or stay small when the font is large, causing clipping either way.
  },
});
