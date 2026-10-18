import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { useStore } from '@/store';
import { THEMES, type Theme, type ThemeId } from './themes';

const ThemeContext = createContext<Theme>(THEMES.light);

export function resolveThemeId(pref: ThemeId | 'auto', scheme: 'light' | 'dark' | null | undefined): ThemeId {
  if (pref === 'auto') return scheme === 'dark' ? 'dark' : 'light';
  return THEMES[pref] ? pref : 'light';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const pref = useStore((s) => s.settings.theme);
  const unlocked = useStore((s) => s.progress.unlockedThemes);
  const scheme = useColorScheme();
  const theme = useMemo(() => {
    let id = resolveThemeId(pref, scheme);
    // never render a theme the user has not unlocked (e.g. after importing a backup)
    if (!unlocked.includes(id)) id = resolveThemeId('auto', scheme);
    return THEMES[id];
  }, [pref, scheme, unlocked]);
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);

export const FONT = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semi: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  heavy: 'PlusJakartaSans_800ExtraBold',
} as const;

/** Hex color with alpha, e.g. alpha('#ff0000', 0.5) */
export function alpha(hex: string, a: number): string {
  if (!hex.startsWith('#')) return hex;
  let h = hex.slice(1);
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

/** Darken/lighten a hex colour by amount in [-1, 1]. */
export function shade(hex: string, amt: number): string {
  if (!hex.startsWith('#')) return hex;
  let h = hex.slice(1);
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const num = parseInt(h, 16);
  const f = (v: number) => {
    const t = amt < 0 ? 0 : 255;
    const p = Math.abs(amt);
    return Math.round((t - v) * p + v);
  };
  const r = f((num >> 16) & 255);
  const g = f((num >> 8) & 255);
  const b = f(num & 255);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
