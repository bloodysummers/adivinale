import { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { TitanOne_400Regular } from '@expo-google-fonts/titan-one';
import { Nunito_400Regular, Nunito_900Black } from '@expo-google-fonts/nunito';
import { ThemeProvider } from '../src/theme/ThemeProvider';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    TitanOne_400Regular,
    Nunito_400Regular,
    Nunito_900Black,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  // fontError: carga de fuentes falló — mostramos la app con fuentes del sistema
  if (!fontsLoaded && !fontError) return null;

  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="game" />
      </Stack>
    </ThemeProvider>
  );
}
