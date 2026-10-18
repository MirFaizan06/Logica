import React from 'react';
import { View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Clipboard from 'expo-clipboard';
import { Screen } from '@/components/Screen';
import { T } from '@/components/AppText';
import { Tap } from '@/components/Tap';
import { Header, SectionTitle } from '@/components/ui';
import { toast } from '@/components/Toast';
import { SYMBOLS } from '@/content/library';
import { LEVEL_NAMES } from '@/content/types';
import { alpha, FONT, useTheme } from '@/theme/ThemeProvider';

export default function Symbols() {
  const t = useTheme();
  const copy = async (s: string) => {
    try {
      await Clipboard.setStringAsync(s);
      toast(`Copied ${s}`, 'copy-outline');
    } catch {
      toast('Could not copy', 'alert-circle-outline');
    }
  };
  return (
    <Screen scroll bottom={30}>
      <Header title="Symbol cheat sheet" subtitle="Tap any symbol to copy it" />
      {SYMBOLS.map((g, gi) => (
        <View key={g.title}>
          <SectionTitle>{`${g.title}  ·  ${LEVEL_NAMES[g.level]}`}</SectionTitle>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {g.items.map((s, i) => (
              <Animated.View key={s.sym} entering={FadeInDown.delay(gi * 60 + i * 30).duration(280)} style={{ width: '31.5%' }}>
                <Tap onPress={() => copy(s.sym)} feedback="tap" scale={0.95} style={{ backgroundColor: t.card, borderColor: t.border, borderWidth: 1, borderRadius: t.radius - 6, paddingVertical: 14, paddingHorizontal: 8, alignItems: 'center' }}>
                  <View style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: alpha(t.primary, 0.14), alignItems: 'center', justifyContent: 'center' }}>
                    <T v="title" c="primary" style={{ fontSize: s.sym.length > 2 ? 18 : 26, lineHeight: 32 }}>
                      {s.sym}
                    </T>
                  </View>
                  <T v="small" style={{ fontFamily: FONT.bold, marginTop: 8 }} center numberOfLines={1}>
                    {s.name}
                  </T>
                  <T v="small" c="muted" style={{ fontSize: 11.5 }} center numberOfLines={1}>
                    {s.note}
                  </T>
                </Tap>
              </Animated.View>
            ))}
          </View>
        </View>
      ))}
    </Screen>
  );
}
