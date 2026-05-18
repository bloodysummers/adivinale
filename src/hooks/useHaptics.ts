import * as Haptics from 'expo-haptics';

// Module-level constants: stable references across renders, never recreated.
// Uses expo-haptics exclusively (confirmed working in Expo managed workflow).
// "Long" feedback is simulated by chaining multiple pulses.

export const vibrateCountdown = () =>
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

export const vibrateCorrect = () =>
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

export const vibrateSkip = () =>
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

export const vibrateGo = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 160);
  setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 320);
};

export const vibrateGameEnd = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 300);
  setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 520);
};
