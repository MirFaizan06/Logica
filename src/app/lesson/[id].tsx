import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInDown, SlideInLeft, SlideInRight, SlideOutLeft, SlideOutRight } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Button } from '@/components/Button';
import { T } from '@/components/AppText';
import { IconButton, Icon } from '@/components/ui';
import { LessonBlocks } from '@/components/LessonBlocks';
import { Sheet } from '@/components/Sheet';
import { LESSON_BY_ID, UNIT_BY_ID } from '@/content/curriculum';
import { startLessonQuiz } from '@/services/sessions';
import { alpha, useTheme } from '@/theme/ThemeProvider';
import { unitColor } from '@/utils/color';

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const lesson = id ? LESSON_BY_ID[id] : undefined;
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [confirm, setConfirm] = useState(false);

  if (!lesson) {
    return (
      <View style={{ flex: 1, backgroundColor: t.bg, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <T v="h2" center>
          Lesson not found
        </T>
        <View style={{ height: 16 }} />
        <Button title="Back" onPress={() => router.back()} full={false} />
      </View>
    );
  }

  const unit = UNIT_BY_ID[lesson.unitId];
  const color = unitColor(unit.hue, t.dark);
  const total = lesson.pages.length;
  const current = lesson.pages[page];
  const last = page === total - 1;

  const go = (n: number) => {
    setDir(n > page ? 1 : -1);
    setPage(n);
  };

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <StatusBar style={t.dark ? 'light' : 'dark'} />
      <LinearGradient colors={t.bgGradient} style={StyleSheet.absoluteFill} />
      <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 18 }}>
        <View style={styles.top}>
          <IconButton name="close" label="Close lesson" onPress={() => (page === 0 ? router.back() : setConfirm(true))} />
          <View style={styles.segments}>
            {Array.from({ length: total + 1 }).map((_, i) => (
              <View key={i} style={[styles.seg, { backgroundColor: i <= page ? color : alpha(t.textMuted, 0.25) }, i === total && i > page && { backgroundColor: alpha(t.accent, 0.35) }]} />
            ))}
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 14 }}>
          <View style={[styles.badge, { backgroundColor: alpha(color, t.dark ? 0.22 : 0.15) }]}>
            <Icon name={lesson.icon} size={22} color={color} />
          </View>
          <View style={{ flex: 1 }}>
            <T v="caption" style={{ color }} numberOfLines={1}>
              {unit.title} · lesson {lesson.index + 1} of {unit.lessons.length}
            </T>
            <T v="small" c="muted" numberOfLines={1}>
              {lesson.title} · {lesson.minutes} min
            </T>
          </View>
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <Animated.View
          key={page}
          entering={(dir === 1 ? SlideInRight : SlideInLeft).duration(280)}
          exiting={(dir === 1 ? SlideOutLeft : SlideOutRight).duration(200)}
          style={StyleSheet.absoluteFill}
        >
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <Animated.View entering={FadeInDown.duration(360)}>
              <T v="title" style={{ marginBottom: 14 }}>
                {current.title}
              </T>
            </Animated.View>
            <LessonBlocks blocks={current.blocks} />
          </ScrollView>
        </Animated.View>
      </View>

      <View style={[styles.bottom, { paddingBottom: insets.bottom + 12, borderTopColor: t.border, backgroundColor: alpha(t.bg, 0.92) }]}>
        {page > 0 && (
          <View style={{ width: 64 }}>
            <Button title="" icon="arrow-back" variant="secondary" onPress={() => go(page - 1)} />
          </View>
        )}
        <View style={{ flex: 1 }}>
          <Button
            title={last ? 'Start the quiz' : 'Next'}
            iconRight={last ? 'flash' : 'arrow-forward'}
            variant={last ? 'accent' : 'primary'}
            onPress={() => (last ? startLessonQuiz(lesson.id) : go(page + 1))}
          />
        </View>
      </View>

      <Sheet visible={confirm} onClose={() => setConfirm(false)} center>
        <T v="h2" center>
          Leave this lesson?
        </T>
        <T v="body" c="muted" center style={{ marginVertical: 12 }}>
          You can come back to it any time.
        </T>
        <View style={{ gap: 8 }}>
          <Button title="Keep reading" onPress={() => setConfirm(false)} />
          <Button
            title="Leave"
            variant="secondary"
            onPress={() => {
              setConfirm(false);
              router.back();
            }}
          />
        </View>
      </Sheet>
    </View>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  segments: { flex: 1, flexDirection: 'row', gap: 5 },
  seg: { flex: 1, height: 8, borderRadius: 4 },
  badge: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: 18, paddingTop: 22, paddingBottom: 30 },
  bottom: { flexDirection: 'row', gap: 10, paddingHorizontal: 18, paddingTop: 12, borderTopWidth: 1 },
});
