import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { alpha, useTheme } from '@/theme/ThemeProvider';
import { Tap } from './Tap';

interface Props {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  padded?: boolean;
  tone?: 'card' | 'card2' | 'primarySoft' | 'successSoft' | 'dangerSoft';
  glow?: string;
  feedback?: 'tap' | 'press' | 'select' | 'none';
}

export function Card({ children, style, onPress, padded = true, tone = 'card', glow, feedback }: Props) {
  const t = useTheme();
  const bg =
    tone === 'card'
      ? t.card
      : tone === 'card2'
      ? t.card2
      : tone === 'primarySoft'
      ? alpha(t.primary, t.dark ? 0.16 : 0.1)
      : tone === 'successSoft'
      ? t.successSoft
      : t.dangerSoft;
  const base: ViewStyle = {
    backgroundColor: bg,
    borderRadius: t.radius,
    borderWidth: 1,
    borderColor: tone === 'primarySoft' ? alpha(t.primary, 0.35) : t.border,
    padding: padded ? 16 : 0,
    boxShadow: glow
      ? `0px 0px 22px ${alpha(glow, 0.4)}`
      : t.dark
      ? '0px 4px 14px rgba(0,0,0,0.25)'
      : `0px 6px 18px ${alpha(t.shadow, 0.08)}`,
  };
  if (onPress) {
    return (
      <Tap onPress={onPress} style={[base, style]} scale={0.98} feedback={feedback ?? 'tap'}>
        {children}
      </Tap>
    );
  }
  return <View style={[base, style]}>{children}</View>;
}
