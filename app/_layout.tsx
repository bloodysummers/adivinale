import { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { TitanOne_400Regular } from '@expo-google-fonts/titan-one';
import { Nunito_400Regular, Nunito_900Black } from '@expo-google-fonts/nunito';
import { ThemeProvider, useTheme } from '../src/theme/ThemeProvider';
import { OfflineModeProvider } from '../src/hooks/useOfflineMode';

SplashScreen.preventAutoHideAsync().catch(() => {});

function AppShell() {
  const [fontsLoaded, fontError] = useFonts({
    TitanOne_400Regular,
    Nunito_400Regular,
    Nunito_900Black,
  });
  const { themeLoaded } = useTheme();

  const ready = (fontsLoaded || !!fontError) && themeLoaded;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  if (!ready) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="game" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="submit-answer" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <OfflineModeProvider>
        <AppShell />
      </OfflineModeProvider>
    </ThemeProvider>
  );
}
