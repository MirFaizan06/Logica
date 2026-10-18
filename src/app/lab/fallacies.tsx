import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { T } from '@/components/AppText';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { Header } from '@/components/ui';
import { SearchBox } from '@/components/SearchBox';
import { Button } from '@/components/Button';
import { FALLACIES } from '@/content/library';
import { startFallacyGame } from '@/services/sessions';
import { alpha, FONT, useTheme } from '@/theme/ThemeProvider';

type Kind = 'All' | 'Formal' | 'Informal';

export default function FallacyLibrary() {
  const t = useTheme();
  const [q, setQ] = useState('');
  const [kind, setKind] = useState<Kind>('All');
  const [open, setOpen] = useState<string | null>(null);
  const items = useMemo(() => {
    const s = q.trim().toLowerCase();
    return FALLACIES.filter((f) => (kind === 'All' || f.kind === kind) && (!s || f.name.toLowerCase().includes(s) || f.def.toLowerCase().includes(s)));
  }, [q, kind]);

  return (
    <Screen scroll bottom={30}>
      <Header title="Fallacy library" subtitle={`${FALLACIES.length} common reasoning errors`} />
      <SearchBox value={q} onChange={setQ} placeholder="Search fallacies" />
      <View style={{ flexDirection: 'row', gap: 8, paddingVertical: 12 }}>
        {(['All', 'Formal', 'Informal'] as Kind[]).map((k) => (
          <Chip key={k} label={k} active={kind === k} onPress={() => setKind(k)} />
        ))}
      </View>
      <View style={{ gap: 10 }}>
        {items.map((f, i) => {
          const on = open === f.id;
          const col = f.kind === 'Formal' ? t.primary : t.accent;
          return (
            <Animated.View key={f.id} entering={FadeInDown.delay(Math.min(i, 8) * 40).duration(260)} layout={LinearTransition.duration(200)}>
              <Card onPress={() => setOpen(on ? null : f.id)} style={{ padding: 14 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={{ flex: 1 }}>
                    <T v="bodyB">{f.name}</T>
                    <T v="small" c="muted" numberOfLines={on ? undefined : 1}>
                      {f.def}
                    </T>
                  </View>
                  <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99, backgroundColor: alpha(col, 0.16) }}>
                    <T v="caption" style={{ color: col, fontSize: 10 }}>
                      {f.kind}
                    </T>
                  </View>
                  <Ionicons name={on ? 'chevron-up' : 'chevron-down'} size={18} color={t.textMuted} />
                </View>
                {on && (
                  <Animated.View entering={FadeInDown.duration(220)} style={{ gap: 8, marginTop: 10 }}>
                    <View style={{ padding: 10, borderRadius: 12, backgroundColor: t.card2 }}>
                      <T v="caption" c="muted">
                        Example
                      </T>
                      <T v="body" style={{ fontFamily: FONT.semi }}>
                        “{f.example}”
                      </T>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      <Ionicons name="bulb-outline" size={18} color={t.info} style={{ marginTop: 2 }} />
                      <T v="small" style={{ flex: 1 }}>
                        <T v="small" style={{ fontFamily: FONT.bold }}>
                          How to answer:{' '}
                        </T>
                        {f.fix}
                      </T>
                    </View>
                  </Animated.View>
                )}
              </Card>
            </Animated.View>
          );
        })}
      </View>
      <View style={{ marginTop: 18 }}>
        <Button title="Play Fallacy Detective" icon="search" onPress={() => startFallacyGame()} />
      </View>
    </Screen>
  );
}
