import React from 'react';
import { Text as RNText, StyleProp, TextStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

type Variant = 'heading1' | 'heading2' | 'heading3' | 'body' | 'bodySmall' | 'label' | 'caption' | 'button' | 'buttonSm' | 'buttonLg' | 'title' | 'countdown' | 'wordDisplay';

interface TextProps {
  children: React.ReactNode;
  variant?: Variant;
  color?: string;
  align?: 'left' | 'center' | 'right';
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  adjustsFontSizeToFit?: boolean;
}

export function Text({ children, variant = 'body', color, align, style, numberOfLines, adjustsFontSizeToFit }: TextProps) {
  const { theme } = useTheme();
  const { fontSize, fontFamily, lineHeight } = theme.typography;

  const isCaption = variant === 'caption';
  const resolvedColor = color ?? (isCaption ? theme.colors.onSurfaceSecondary : theme.colors.onBackground);

  // fontWeight is intentionally omitted — React Native cannot switch weights within a single
  // loaded font file (Nunito_400Regular). Size alone carries the typographic hierarchy here.
  const variantStyle: TextStyle = ({
    heading1:  { fontFamily: fontFamily.body, fontSize: fontSize['4xl'], lineHeight: fontSize['4xl'] * lineHeight.tight },
    heading2:  { fontFamily: fontFamily.body, fontSize: fontSize['3xl'], lineHeight: fontSize['3xl'] * lineHeight.tight },
    heading3:  { fontFamily: fontFamily.body, fontSize: fontSize['2xl'], lineHeight: fontSize['2xl'] * lineHeight.tight },
    body:      { fontFamily: fontFamily.body, fontSize: fontSize.md,     lineHeight: fontSize.md    * lineHeight.normal },
    bodySmall: { fontFamily: fontFamily.body, fontSize: fontSize.sm,     lineHeight: fontSize.sm    * lineHeight.normal },
    label:     { fontFamily: fontFamily.body, fontSize: fontSize.sm,     lineHeight: fontSize.sm    * lineHeight.normal },
    caption:   { fontFamily: fontFamily.body, fontSize: fontSize.xs,     lineHeight: fontSize.xs    * lineHeight.normal },
    button:      { fontFamily: fontFamily.display, fontSize: fontSize.lg,  lineHeight: fontSize.lg    * lineHeight.normal },
    buttonSm:    { fontFamily: fontFamily.display, fontSize: fontSize.sm,  lineHeight: fontSize.sm    * lineHeight.normal },
    buttonLg:    { fontFamily: fontFamily.display, fontSize: fontSize.xl,  lineHeight: fontSize.xl    * lineHeight.normal },
    title:       { fontFamily: fontFamily.display, fontSize: fontSize['4xl'], lineHeight: fontSize['4xl'] * lineHeight.tight },
    countdown:   { fontFamily: fontFamily.display, fontSize: fontSize['6xl'], lineHeight: fontSize['6xl'] * lineHeight.tight },
    // No lineHeight — required so adjustsFontSizeToFit can shrink the font freely
    wordDisplay: { fontFamily: fontFamily.wordDisplay, fontSize: fontSize['4xl'], letterSpacing: 0.5 },
  } as const)[variant];

  return (
    <RNText
      style={[variantStyle, { color: resolvedColor }, align != null && { textAlign: align }, style]}
      numberOfLines={numberOfLines}
      adjustsFontSizeToFit={adjustsFontSizeToFit}
    >
      {children}
    </RNText>
  );
}
