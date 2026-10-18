import React from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Screen } from '@/components/Screen';
import { T } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { LessonBlocks } from '@/components/LessonBlocks';
import { Header, IconBadge } from '@/components/ui';
import { NOTES } from '@/content/notes';
import { UNIT_BY_ID } from '@/content/curriculum';
import { startPractice } from '@/services/sessions';
import { useTheme } from '@/theme/ThemeProvider';
import { unitColor } from '@/utils/color';

export default function UnitNotes() {
  const t = useTheme();
  const { unitId } = useLocalSearchParams<{ unitId: string }>();
  const unit = unitId ? UNIT_BY_ID[unitId] : undefined;
  const pages = unitId ? NOTES[unitId] : undefined;

  if (!unit || !pages) {
    return (
      <Screen>
        <Header title="Notes" />
        <T v="body" c="muted" center style={{ marginTop: 40 }}>
          There are no notes for this unit yet.
        </T>
      </Screen>
    );
  }
  const color = unitColor(unit.hue, t.dark);

  return (
    <Screen scroll bottom={30}>
      <Header title="Study notes" subtitle={unit.title} />
      <Animated.View entering={FadeInDown.duration(360)}>
        <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <IconBadge name={unit.icon} color={color} size={52} />
          <View style={{ flex: 1 }}>
            <T v="h3">{unit.title}</T>
            <T v="small" c="muted">
              {unit.blurb}
            </T>
          </View>
        </Card>
      </Animated.View>

      {pages.map((pg, i) => (
        <View key={i} style={{ marginTop: 22, gap: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: color, alignItems: 'center', justifyContent: 'center' }}>
              <T v="small" style={{ color: '#fff', fontFamily: 'PlusJakartaSans_800ExtraBold' }}>
                {i + 1}
              </T>
            </View>
            <T v="h2" style={{ flex: 1 }}>
              {pg.title}
            </T>
          </View>
          <LessonBlocks blocks={pg.blocks} />
        </View>
      ))}

      <View style={{ marginTop: 28 }}>
        <Button title="Practice this unit" icon="flash" onPress={() => startPractice({ unitId: unit.id })} />
      </View>
    </Screen>
  );
}
