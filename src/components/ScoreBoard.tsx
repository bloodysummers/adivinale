import { StyleSheet, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Text } from './Text';
import { spacing } from '../utils/theme';

interface ScoreBoardProps {
  score: number;
  total: number;
}

export function ScoreBoard({ score, total }: ScoreBoardProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Text variant="heading1" color={theme.colors.success} align="center">
        {score}
      </Text>
      <Text variant="heading3" color={theme.colors.onSurfaceSecondary} align="center">
        / {total}
      </Text>
      <Text variant="label" color={theme.colors.onSurfaceSecondary} align="center" style={styles.label}>
        aciertos
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  label: {
    marginTop: spacing[2],
  },
});
