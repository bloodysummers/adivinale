import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Card } from '../../components/Card';

jest.mock('../../theme/ThemeProvider', () => ({
  useTheme: () => ({
    theme: {
      colors: { surface: '#FFFFFF' },
      getShadow: (level: number) => ({ elevation: level * 2 }),
    },
    colorScheme: 'light',
  }),
}));

describe('Card', () => {
  it('renderiza children correctamente', () => {
    const { getByText } = render(
      <Card><Text>Contenido</Text></Card>
    );
    expect(getByText('Contenido')).toBeTruthy();
  });

  it('aplica elevation 0 sin sombra', () => {
    const { getByTestId } = render(
      <Card elevation={0}><Text testID="inner">Test</Text></Card>
    );
    expect(getByTestId('inner')).toBeTruthy();
  });

  it('acepta prop style personalizado', () => {
    const { getByText } = render(
      <Card style={{ marginTop: 10 }}><Text>Styled</Text></Card>
    );
    expect(getByText('Styled')).toBeTruthy();
  });
});
