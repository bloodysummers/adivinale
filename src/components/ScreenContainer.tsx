import React from 'react';
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeProvider';
import { spacing } from '../utils/theme';

interface ScreenContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: StyleProp<ViewStyle>;
  withGradient?: boolean;
}

export function ScreenContainer({
  children,
  scrollable = false,
  style,
  withGradient = false,
}: ScreenContainerProps) {
  const { theme, colorScheme } = useTheme();
  const gradientColors = theme.gradients.background[colorScheme] as [string, string, ...string[]];

  const innerStyle: StyleProp<ViewStyle> = [
    styles.inner,
    !withGradient && { backgroundColor: theme.colors.background },
    style,
  ];

  const content = scrollable ? (
    <ScrollView
      style={innerStyle}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[innerStyle, styles.fill]}>{children}</View>
  );

  if (withGradient) {
    return (
      <LinearGradient colors={gradientColors} style={styles.fill}>
        <SafeAreaView style={styles.fill}>
          <View style={[styles.inner, style, styles.fill]}>{children}</View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return <SafeAreaView style={[styles.fill, { backgroundColor: theme.colors.background }]}>{content}</SafeAreaView>;
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  inner: {
    paddingHorizontal: spacing[5],
  },
  scrollContent: {
    paddingHorizontal: spacing[5],
  },
});
