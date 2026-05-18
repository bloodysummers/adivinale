import { Stack } from 'expo-router';

export default function GameLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ready" />
      <Stack.Screen name="play" options={{ gestureEnabled: false }} />
      <Stack.Screen name="results" />
    </Stack>
  );
}
