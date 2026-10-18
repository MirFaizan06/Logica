import React, { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { T } from '@/components/AppText';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { Header } from '@/components/ui';
import { SearchBox } from '@/components/SearchBox';
import { GLOSSARY, type Term } from '@/content/library';
import { FONT, useTheme } from '@/theme/ThemeProvider';

const CATS: (Term['cat'] | 'All')[] = ['All', 'Basics', 'Propositional', 'Syllogistic', 'Predicate', 'Proof', 'Advanced'];

export default function Glossary() {
  const t = useTheme();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<(typeof CATS)[number]>('All');
  const [open, setOpen] = useState<string | null>(null);
  const items = useMemo(() => {
    const s = q.trim().toLowerCase();
    return GLOSSARY.filter((g) => (cat === 'All' || g.cat === cat) && (!s || g.term.toLowerCase().includes(s) || g.def.toLowerCase().includes(s))).sort((a, b) => a.term.localeCompare(b.term));
  }, [q, cat]);
  return (
    <Screen scroll bottom={30}>
      <Header title="Glossary" subtitle={`${GLOSSARY.length} terms`} />
      <SearchBox value={q} onChange={setQ} placeholder="Search terms and meanings" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 12 }}>
        {CATS.map((c) => (
          <Chip key={c} label={c} active={cat === c} onPress={() => setCat(c)} />
        ))}
      </ScrollView>
      <View style={{ gap: 10 }}>
        {items.map((g, i) => {
          const on = open === g.id;
          return (
            <Animated.View key={g.id} entering={FadeInDown.delay(Math.min(i, 8) * 40).duration(260)} layout={LinearTransition.duration(200)}>
              <Card onPress={() => setOpen(on ? null : g.id)} style={{ padding: 14 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={{ flex: 1 }}>
                    <T v="bodyB">{g.term}</T>
                    <T v="caption" c="muted" style={{ fontSize: 10.5 }}>
                      {g.cat}
                    </T>
                  </View>
                  <Ionicons name={on ? 'chevron-up' : 'chevron-down'} size={18} color={t.textMuted} />
                </View>
                {on && (
                  <Animated.View entering={FadeInDown.duration(220)}>
                    <T v="body" style={{ marginTop: 8, fontFamily: FONT.medium }}>
                      {g.def}
                    </T>
                  </Animated.View>
                )}
              </Card>
            </Animated.View>
          );
        })}
        {items.length === 0 && (
          <T v="body" c="muted" center style={{ marginTop: 30 }}>
            Nothing matches “{q}”.
          </T>
        )}
      </View>
    </Screen>
  );
}
