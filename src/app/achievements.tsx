import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { T } from '@/components/AppText';
import { Card } from '@/components/Card';
import { ProgressBar } from '@/components/Progress';
import { Header } from '@/components/ui';
import { ACHIEVEMENTS } from '@/content/achievements';
import { useStore } from '@/store';
import { alpha, useTheme } from '@/theme/ThemeProvider';

export default function Achievements() {
  const t = useTheme();
  const got = useStore((s) => s.achievements);
  const count = Object.keys(got).length;
  const sorted = [...ACHIEVEMENTS].sort((a, b) => Number(!!got[b.id]) - Number(!!got[a.id]));
  return (
    <Screen scroll bottom={30}>
      <Header title="Achievements" subtitle={`${count} of ${ACHIEVEMENTS.length} unlocked`} />
      <Card style={{ marginBottom: 14 }}>
        <ProgressBar value={count / ACHIEVEMENTS.length} height={12} colors={[t.accent, t.accent2]} />
        <T v="small" c="muted" style={{ marginTop: 8 }}>
          Each achievement also awards 15 gems.
        </T>
      </Card>
      <View style={styles.grid}>
        {sorted.map((a, i) => {
          const date = got[a.id];
          const on = !!date;
          return (
            <Animated.View key={a.id} entering={FadeInDown.delay(Math.min(i, 12) * 40).duration(320)} style={{ width: '48.5%' }}>
              <Card style={[styles.card, on && { borderColor: alpha(t.accent, 0.6) }]} glow={on && t.glow ? t.accent : undefined}>
                <View style={[styles.badge, { backgroundColor: on ? alpha(t.accent, 0.2) : alpha(t.textMuted, 0.14) }]}>
                  <Ionicons name={on ? (a.icon as keyof typeof Ionicons.glyphMap) : 'lock-closed'} size={26} color={on ? t.accent : t.textMuted} />
                </View>
                <T v="bodyB" center style={{ fontSize: 14, opacity: on ? 1 : 0.7 }} numberOfLines={1}>
                  {a.title}
                </T>
                <T v="small" c="muted" center style={{ fontSize: 12, minHeight: 34 }}>
                  {a.desc}
                </T>
                {on ? (
                  <T v="caption" c="success" style={{ fontSize: 10 }}>
                    {date}
                  </T>
                ) : null}
              </Card>
            </Animated.View>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12 },
  card: { alignItems: 'center', gap: 6, padding: 12 },
  badge: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
});
