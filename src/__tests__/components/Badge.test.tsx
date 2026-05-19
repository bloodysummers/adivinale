import React from 'react';
import { render } from '@testing-library/react-native';
import { Badge } from '../../components/Badge';

const mockTypography = {
  fontSize: { xs: 11, sm: 13, md: 15, lg: 17, xl: 20, '2xl': 24, '3xl': 30, '4xl': 38 },
  fontFamily: { display: 'TitanOne_400Regular', body: 'Nunito_400Regular', wordDisplay: 'Nunito_900Black' },
  fontWeight: { regular: '400', medium: '500', semibold: '600', bold: '700', extrabold: '800' },
  lineHeight: { tight: 1.2, normal: 1.5, relaxed: 1.75 },
};

jest.mock('../../theme/ThemeProvider', () => ({
  useTheme: () => ({
    theme: {
      colors: {
        primary: '#5B4FE8',
        success: '#4ECDC4',
        accent: '#FF6B6B',
        onSurfaceSecondary: '#6B6490',
        onBackground: '#1A1730',
      },
      typography: mockTypography,
    },
    colorScheme: 'light',
  }),
}));

describe('Badge', () => {
  it('renderiza el label', () => {
    const { getByText } = render(<Badge label="Películas" />);
    expect(getByText('Películas')).toBeTruthy();
  });

  it('usa color primary por defecto', () => {
    const { getByText } = render(<Badge label="Test" />);
    const el = getByText('Test');
    const flatStyle = Array.isArray(el.props.style)
      ? Object.assign({}, ...el.props.style.filter(Boolean))
      : el.props.style ?? {};
    expect(flatStyle.color).toBe('#5B4FE8');
  });

  it('usa color success cuando se especifica', () => {
    const { getByText } = render(<Badge label="OK" color="success" />);
    const el = getByText('OK');
    const flatStyle = Array.isArray(el.props.style)
      ? Object.assign({}, ...el.props.style.filter(Boolean))
      : el.props.style ?? {};
    expect(flatStyle.color).toBe('#4ECDC4');
  });

  it('renderiza en tamaño sm', () => {
    const { getByText } = render(<Badge label="Small" size="sm" />);
    expect(getByText('Small')).toBeTruthy();
  });
});
