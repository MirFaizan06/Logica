import React from 'react';
import { Share, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { T } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Confetti } from '@/components/Confetti';
import { Header } from '@/components/ui';
import { LEVEL_ICONS, LEVEL_NAMES, type Level } from '@/content/types';
import { useStore } from '@/store';
import { alpha, FONT, useTheme } from '@/theme/ThemeProvider';

export default function Certificate() {
  const t = useTheme();
  const { level } = useLocalSearchParams<{ level?: string }>();
  const lvl = (Number(level) || 0) as Level;
  const exam = useStore((s) => s.progress.exams[String(lvl)]);
  const name = useStore((s) => s.profile.name) || 'Logica Learner';

  if (!exam?.passed) {
    return (
      <Screen>
        <Header title="Certificate" />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <Ionicons name="lock-closed-outline" size={48} color={t.textMuted} />
          <T v="body" c="muted" center>
            Pass the {LEVEL_NAMES[lvl]} exam to earn this certificate.
          </T>
          <Button title="Back" onPress={() => router.back()} full={false} />
        </View>
      </Screen>
    );
  }

  const share = async () => {
    try {
      await Share.share({ message: `I passed the ${LEVEL_NAMES[lvl]} level of Logica with ${exam.best}%. Learn formal logic with Logica by Tech Bytes Design.` });
    } catch {
      /* sharing cancelled */
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Screen scroll bottom={30}>
        <Header title="Certificate" />
        <Animated.View entering={ZoomIn.duration(520).springify().damping(14)}>
          <LinearGradient colors={[t.primary, t.primary2]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.frame, { borderRadius: t.radius + 6, boxShadow: `0px 14px 40px ${alpha(t.primary, 0.45)}` }]}>
            <View style={[styles.inner, { backgroundColor: t.card, borderRadius: t.radius }]}>
              <View style={[styles.seal, { backgroundColor: alpha(t.accent, 0.18), borderColor: t.accent }]}>
                <Ionicons name={LEVEL_ICONS[lvl]} size={34} color={t.accent} />
              </View>
              <T v="caption" c="muted" style={{ marginTop: 14 }}>
                Certificate of completion
              </T>
              <T v="caption" c="muted" style={{ marginTop: 18 }}>
                This certifies that
              </T>
              <T v="display" center style={{ marginVertical: 6, fontSize: 32, lineHeight: 40 }}>
                {name}
              </T>
              <T v="body" c="muted" center>
                has completed the
              </T>
              <T v="title" c="primary" center style={{ marginVertical: 4 }}>
                {LEVEL_NAMES[lvl]} level of Formal Logic
              </T>
              <T v="body" c="muted" center>
                with an exam score of
              </T>
              <T v="display" style={{ color: t.success, marginTop: 4 }}>
                {exam.best}%
              </T>
              <View style={[styles.rule, { backgroundColor: t.border }]} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'stretch' }}>
                <View>
                  <T v="small" c="muted">
                    Date
                  </T>
                  <T v="bodyB">{exam.at}</T>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <T v="small" c="muted">
                    Issued by
                  </T>
                  <T v="bodyB" style={{ fontFamily: FONT.heavy }}>
                    Logica
                  </T>
                </View>
              </View>
              <T v="small" c="muted" center style={{ marginTop: 14, fontSize: 11 }}>
                Tech Bytes Design
              </T>
            </View>
          </LinearGradient>
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(500)} style={{ marginTop: 22, gap: 10 }}>
          <Button title="Share" icon="share-outline" onPress={share} />
          <Button title="Done" variant="secondary" onPress={() => router.back()} />
        </Animated.View>
      </Screen>
      <Confetti burst={1} />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { padding: 5 },
  inner: { alignItems: 'center', padding: 22, paddingBottom: 18 },
  seal: { width: 76, height: 76, borderRadius: 38, borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
  rule: { height: 1, alignSelf: 'stretch', marginVertical: 18 },
});
