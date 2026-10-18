import React from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { Avatar } from './Avatar';
import { T } from './AppText';
import { Pill } from './ui';
import { Tap } from './Tap';
import { effectiveStreak, levelProgress, useStore } from '@/store';
import { useTheme } from '@/theme/ThemeProvider';

/** Top-of-screen greeting with avatar, streak and gems. */
export function StatsBar({ title, subtitle }: { title?: string; subtitle?: string }) {
  const t = useTheme();
  const name = useStore((s) => s.profile.name);
  const avatar = useStore((s) => s.profile.avatar);
  const xp = useStore((s) => s.progress.xp);
  const gems = useStore((s) => s.progress.gems);
  const freezes = useStore((s) => s.progress.freezes);
  const streak = useStore((s) => s.streak);
  const level = levelProgress(xp).level;
  const eff = effectiveStreak(streak, freezes);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 }}>
      <Tap onPress={() => router.push('/me')} feedback="tap" scale={0.94}>
        <Avatar id={avatar} size={46} />
      </Tap>
      <View style={{ flex: 1 }}>
        <T v="h3" numberOfLines={1}>
          {title ?? (name ? `Hi, ${name}` : 'Welcome back')}
        </T>
        <T v="small" c="muted" numberOfLines={1}>
          {subtitle ?? `Level ${level}`}
        </T>
      </View>
      <Tap onPress={() => router.push('/progress')} feedback="tap" scale={0.94}>
        <Pill icon="flame" text={eff} color={eff > 0 ? t.accent : t.textMuted} />
      </Tap>
      <Tap onPress={() => router.push('/shop')} feedback="tap" scale={0.94}>
        <Pill icon="diamond" text={gems} color={t.info} />
      </Tap>
    </View>
  );
}
