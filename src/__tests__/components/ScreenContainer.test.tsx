import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ScreenContainer } from '../../components/ScreenContainer';

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('../../theme/ThemeProvider', () => ({
  useTheme: () => ({
    theme: {
      colors: { background: '#F4F3FF' },
      gradients: { background: { light: ['#F4F3FF', '#EAE8FF'], dark: ['#1A1730', '#252140'] } },
    },
    colorScheme: 'light',
  }),
}));

describe('ScreenContainer', () => {
  it('renderiza children', () => {
    const { getByText } = render(
      <ScreenContainer><Text>Contenido</Text></ScreenContainer>
    );
    expect(getByText('Contenido')).toBeTruthy();
  });

  it('renderiza en modo scrollable', () => {
    const { getByText } = render(
      <ScreenContainer scrollable><Text>Scroll</Text></ScreenContainer>
    );
    expect(getByText('Scroll')).toBeTruthy();
  });

  it('renderiza con gradiente de fondo', () => {
    const { getByText } = render(
      <ScreenContainer withGradient><Text>Gradiente</Text></ScreenContainer>
    );
    expect(getByText('Gradiente')).toBeTruthy();
  });
});
