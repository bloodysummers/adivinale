import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from '../../components/Text';

jest.mock('../../theme/ThemeProvider', () => ({
  useTheme: () => ({
    theme: {
      colors: { onBackground: '#1A1730', onSurfaceSecondary: '#6B6490' },
      typography: {
        fontSize: { xs: 11, sm: 13, md: 15, lg: 17, xl: 20, '2xl': 24, '3xl': 30, '4xl': 38 },
        fontFamily: { display: 'TitanOne_400Regular', body: 'Nunito_400Regular', wordDisplay: 'Nunito_900Black' },
        fontWeight: { regular: '400', medium: '500', semibold: '600', bold: '700', extrabold: '800' },
        lineHeight: { tight: 1.2, normal: 1.5, relaxed: 1.75 },
      },
    },
    colorScheme: 'light',
  }),
}));

describe('Text', () => {
  it('renderiza el texto', () => {
    const { getByText } = render(<Text>Hola mundo</Text>);
    expect(getByText('Hola mundo')).toBeTruthy();
  });

  it('heading1 tiene fontSize 38', () => {
    const { getByText } = render(<Text variant="heading1">Título</Text>);
    const el = getByText('Título');
    const flatStyle = Array.isArray(el.props.style)
      ? Object.assign({}, ...el.props.style.filter(Boolean))
      : el.props.style ?? {};
    expect(flatStyle.fontSize).toBe(38);
  });

  it('heading1 usa fontFamily body (Nunito)', () => {
    const { getByText } = render(<Text variant="heading1">Título</Text>);
    const el = getByText('Título');
    const flatStyle = Array.isArray(el.props.style)
      ? Object.assign({}, ...el.props.style.filter(Boolean))
      : el.props.style ?? {};
    expect(flatStyle.fontFamily).toBe('Nunito_400Regular');
  });

  it('caption usa color onSurfaceSecondary por defecto', () => {
    const { getByText } = render(<Text variant="caption">Pie de página</Text>);
    const el = getByText('Pie de página');
    const flatStyle = Array.isArray(el.props.style)
      ? Object.assign({}, ...el.props.style.filter(Boolean))
      : el.props.style ?? {};
    expect(flatStyle.color).toBe('#6B6490');
  });

  it('respeta prop color de override', () => {
    const { getByText } = render(<Text color="#FF0000">Rojo</Text>);
    const el = getByText('Rojo');
    const flatStyle = Array.isArray(el.props.style)
      ? Object.assign({}, ...el.props.style.filter(Boolean))
      : el.props.style ?? {};
    expect(flatStyle.color).toBe('#FF0000');
  });

  it('aplica textAlign cuando se pasa align', () => {
    const { getByText } = render(<Text align="center">Centrado</Text>);
    const el = getByText('Centrado');
    const flatStyle = Array.isArray(el.props.style)
      ? Object.assign({}, ...el.props.style.filter(Boolean))
      : el.props.style ?? {};
    expect(flatStyle.textAlign).toBe('center');
  });
});
