import React from 'react';
import { render } from '@testing-library/react-native';
import { Badge } from '../../components/Badge';

jest.mock('../../theme/ThemeProvider', () => ({
  useTheme: () => ({
    theme: {
      colors: {
        primary: '#5B4FE8',
        success: '#4ECDC4',
        accent: '#FF6B6B',
        onSurfaceSecondary: '#6B6490',
      },
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
