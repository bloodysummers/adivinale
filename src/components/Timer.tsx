import { useTheme } from '../theme/ThemeProvider';
import { Text } from './Text';

interface TimerProps {
  timeLeft: number;
}

export function Timer({ timeLeft }: TimerProps) {
  const { theme } = useTheme();
  const isLow = timeLeft <= 10;
  const color = isLow ? theme.colors.error : theme.colors.accent;
  return (
    <Text variant="heading2" color={color}>
      {timeLeft}
    </Text>
  );
}
