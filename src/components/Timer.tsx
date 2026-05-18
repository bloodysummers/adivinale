import { StyleSheet, Text } from 'react-native';
import { colors, typography } from '../utils/theme';

interface TimerProps {
  timeLeft: number;
}

export function Timer({ timeLeft }: TimerProps) {
  const isLow = timeLeft <= 10;
  return (
    <Text style={[styles.timer, isLow && styles.timerLow]}>
      {timeLeft}
    </Text>
  );
}

const styles = StyleSheet.create({
  timer: {
    ...typography.timer,
    color: colors.timer,
  },
  timerLow: {
    color: colors.timerLow,
  },
});
