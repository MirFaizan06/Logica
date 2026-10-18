import React from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { T } from '@/components/AppText';
import { Card } from '@/components/Card';
import { Header, IconBadge, SectionTitle } from '@/components/ui';
import { UNITS } from '@/content/curriculum';
import { NOTES } from '@/content/notes';
import { LEVEL_NAMES, type Level } from '@/content/types';
import { useTheme } from '@/theme/ThemeProvider';
import { unitColor } from '@/utils/color';

export default function NotesIndex() {
  const t = useTheme();
  return (
    <Screen scroll bottom={30}>
      <Header title="Study notes" subtitle={`${UNITS.length} units of revision pages`} />
      {([0, 1, 2] as Level[]).map((lvl) => (
        <View key={lvl}>
          <SectionTitle>{LEVEL_NAMES[lvl]}</SectionTitle>
          <View style={{ gap: 10 }}>
            {UNITS.filter((u) => u.level === lvl).map((u, i) => (
              <Animated.View key={u.id} entering={FadeInDown.delay(Math.min(i, 8) * 40).duration(280)}>
                <Card onPress={() => router.push(`/notes/${u.id}`)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 }}>
                  <IconBadge name={u.icon} color={unitColor(u.hue, t.dark)} size={44} />
                  <View style={{ flex: 1 }}>
                    <T v="bodyB" numberOfLines={1}>
                      {u.title}
                    </T>
                    <T v="small" c="muted">
                      {NOTES[u.id]?.length ?? 0} pages
                    </T>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={t.textMuted} />
                </Card>
              </Animated.View>
            ))}
          </View>
        </View>
      ))}
    </Screen>
  );
}
