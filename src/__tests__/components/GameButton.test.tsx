import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { GameButton } from '../../components/GameButton';

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('../../theme/ThemeProvider', () => ({
  useTheme: () => ({
    theme: {
      colors: { onPrimary: '#fff', success: '#4ECDC4', accent: '#FF6B6B', primary: '#5B4FE8' },
      getShadow: () => ({ elevation: 8 }),
    },
    colorScheme: 'light',
  }),
}));

describe('GameButton', () => {
  it('renderiza el label correctamente', () => {
    const { getByText } = render(<GameButton label="Jugar" onPress={() => {}} />);
    expect(getByText('Jugar')).toBeTruthy();
  });

  it('llama onPress al presionar', () => {
    const onPress = jest.fn();
    const { getByText } = render(<GameButton label="Jugar" onPress={onPress} />);
    fireEvent.press(getByText('Jugar'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('no llama onPress cuando está deshabilitado', () => {
    const onPress = jest.fn();
    const { getByText } = render(<GameButton label="Jugar" onPress={onPress} disabled />);
    fireEvent.press(getByText('Jugar'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('renderiza con variant success', () => {
    const { getByText } = render(<GameButton label="Correcto" onPress={() => {}} variant="success" />);
    expect(getByText('Correcto')).toBeTruthy();
  });

  it('renderiza con size sm', () => {
    const { getByText } = render(<GameButton label="Pequeño" onPress={() => {}} size="sm" />);
    expect(getByText('Pequeño')).toBeTruthy();
  });
});
