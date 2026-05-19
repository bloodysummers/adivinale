import { StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Text } from './Text';
import { typography } from '../utils/theme';

interface TimerProps {
  timeLeft: number;
}

export function Timer({ timeLeft }: TimerProps) {
  const { theme } = useTheme();
  const isLow = timeLeft <= 10;
  const color = isLow ? theme.colors.error : theme.colors.accent;

  return (
    <Text style={[styles.timer, { color }]}>
      {timeLeft}
    </Text>
  );
}

const styles = StyleSheet.create({
  timer: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.extrabold,
  },
});
