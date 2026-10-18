import React from 'react';
import { Text as RNText, type TextProps, type TextStyle, StyleSheet } from 'react-native';
import { FONT, useTheme } from '@/theme/ThemeProvider';
import type { Theme } from '@/theme/themes';

export type Variant = 'display' | 'title' | 'h2' | 'h3' | 'body' | 'bodyB' | 'small' | 'caption' | 'formula' | 'btn';

export type ColorKey =
  | 'text'
  | 'muted'
  | 'primary'
  | 'onPrimary'
  | 'success'
  | 'danger'
  | 'accent'
  | 'warn'
  | 'info';

const STYLES: Record<Variant, TextStyle> = {
  display: { fontFamily: FONT.heavy, fontSize: 34, lineHeight: 40, letterSpacing: -0.5 },
  title: { fontFamily: FONT.heavy, fontSize: 26, lineHeight: 32, letterSpacing: -0.3 },
  h2: { fontFamily: FONT.bold, fontSize: 20, lineHeight: 26 },
  h3: { fontFamily: FONT.bold, fontSize: 16.5, lineHeight: 22 },
  body: { fontFamily: FONT.medium, fontSize: 15.5, lineHeight: 23 },
  bodyB: { fontFamily: FONT.bold, fontSize: 15.5, lineHeight: 23 },
  small: { fontFamily: FONT.medium, fontSize: 13.5, lineHeight: 19 },
  caption: { fontFamily: FONT.bold, fontSize: 11.5, lineHeight: 15, letterSpacing: 0.9, textTransform: 'uppercase' },
  formula: { fontFamily: FONT.semi, fontSize: 19, lineHeight: 28, letterSpacing: 0.3 },
  btn: { fontFamily: FONT.heavy, fontSize: 16, lineHeight: 20, letterSpacing: 0.4 },
};

export function colorOf(t: Theme, key: ColorKey | string | undefined): string {
  switch (key) {
    case undefined:
    case 'text':
      return t.text;
    case 'muted':
      return t.textMuted;
    case 'primary':
      return t.primary;
    case 'onPrimary':
      return t.onPrimary;
    case 'success':
      return t.success;
    case 'danger':
      return t.danger;
    case 'accent':
      return t.accent;
    case 'warn':
      return t.warn;
    case 'info':
      return t.info;
    default:
      return key;
  }
}

interface Props extends TextProps {
  v?: Variant;
  c?: ColorKey | string;
  center?: boolean;
}

/** Themed text. Supports **bold** and `code` inline markup when children is a string with `rich`. */
export function T({ v = 'body', c, center, style, children, ...rest }: Props) {
  const theme = useTheme();
  return (
    <RNText
      {...rest}
      style={[STYLES[v], { color: colorOf(theme, c) }, center && styles.center, style]}
    >
      {children}
    </RNText>
  );
}

/** Renders a string with **bold** and _italic_ spans. */
export function Rich({ text, v = 'body', c, center, style, boldColor }: {
  text: string;
  v?: Variant;
  c?: ColorKey | string;
  center?: boolean;
  style?: TextStyle;
  boldColor?: string;
}) {
  const theme = useTheme();
  const parts = text.split(/(\*\*[^*]+\*\*|__[^_]+__)/g).filter((p) => p !== '');
  return (
    <T v={v} c={c} center={center} style={style}>
      {parts.map((p, i) => {
        if (p.startsWith('**')) {
          return (
            <RNText key={i} style={{ fontFamily: FONT.heavy, color: boldColor ?? colorOf(theme, c) }}>
              {p.slice(2, -2)}
            </RNText>
          );
        }
        if (p.startsWith('__')) {
          return (
            <RNText key={i} style={{ fontFamily: FONT.semi, fontStyle: 'italic' }}>
              {p.slice(2, -2)}
            </RNText>
          );
        }
        return <RNText key={i}>{p}</RNText>;
      })}
    </T>
  );
}

const styles = StyleSheet.create({
  center: { textAlign: 'center' },
});
