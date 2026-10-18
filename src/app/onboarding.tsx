import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown, SlideInRight, SlideOutLeft, ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Button } from '@/components/Button';
import { T } from '@/components/AppText';
import { Tap } from '@/components/Tap';
import { Mascot, type Mood } from '@/components/Mascot';
import { ProgressBar } from '@/components/Progress';
import { Avatar, AVATARS } from '@/components/Avatar';
import { IconBadge, IconButton } from '@/components/ui';
import { alpha, FONT, useTheme } from '@/theme/ThemeProvider';
import { THEMES, FREE_THEMES, type ThemeId } from '@/theme/themes';
import { useStore, type GoalId } from '@/store';
import { startPlacement } from '@/services/sessions';
import { TOTAL_LESSONS } from '@/content/curriculum';

const GOALS: { id: GoalId; label: string; sub: string; icon: string }[] = [
  { id: 'school', label: 'School or university', sub: 'A course I am taking', icon: 'school-outline' },
  { id: 'exam', label: 'Exam prep', sub: 'LSAT, GRE, philosophy or CS exams', icon: 'document-text-outline' },
  { id: 'cs', label: 'Programming and CS', sub: 'Proofs, verification, types', icon: 'code-slash-outline' },
  { id: 'philosophy', label: 'Philosophy', sub: 'Arguments, paradoxes and ideas', icon: 'library-outline' },
  { id: 'career', label: 'Sharper thinking at work', sub: 'Spot flaws, argue better', icon: 'briefcase-outline' },
  { id: 'curious', label: 'Pure curiosity', sub: 'I just love puzzles', icon: 'sparkles-outline' },
];

const EXPERIENCE: { v: 0 | 1 | 2 | 3; label: string; sub: string; icon: string }[] = [
  { v: 0, label: 'Brand new', sub: 'Never studied logic', icon: 'leaf-outline' },
  { v: 1, label: 'I know the basics', sub: 'And, or, not, if-then', icon: 'flame-outline' },
  { v: 2, label: 'Comfortable', sub: 'Truth tables, proofs, quantifiers', icon: 'rocket-outline' },
  { v: 3, label: 'Advanced', sub: 'I have studied it formally', icon: 'trophy-outline' },
];

const DAILY: { xp: number; label: string; sub: string }[] = [
  { xp: 20, label: 'Casual', sub: '20 XP · about 5 minutes' },
  { xp: 50, label: 'Regular', sub: '50 XP · about 10 minutes' },
  { xp: 100, label: 'Serious', sub: '100 XP · about 20 minutes' },
  { xp: 150, label: 'Intense', sub: '150 XP · about 30 minutes' },
];

const TOTAL_STEPS = 7;
let resumeStep = 0; // survives leaving for the placement test and coming back

function Option({
  icon,
  label,
  sub,
  selected,
  onPress,
  delay,
}: {
  icon: string;
  label: string;
  sub?: string;
  selected: boolean;
  onPress: () => void;
  delay: number;
}) {
  const t = useTheme();
  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(320)}>
      <Tap
        onPress={onPress}
        feedback="select"
        scale={0.98}
        style={[
          styles.option,
          {
            borderRadius: t.radius - 6,
            borderColor: selected ? t.primary : t.border,
            backgroundColor: selected ? alpha(t.primary, t.dark ? 0.2 : 0.1) : t.card,
          },
        ]}
      >
        <IconBadge name={icon} color={selected ? t.primary : t.textMuted} size={44} />
        <View style={{ flex: 1 }}>
          <T v="bodyB">{label}</T>
          {sub ? (
            <T v="small" c="muted">
              {sub}
            </T>
          ) : null}
        </View>
        <View style={[styles.radio, { borderColor: selected ? t.primary : t.border, backgroundColor: selected ? t.primary : 'transparent' }]}>
          {selected && <Ionicons name="checkmark" size={14} color={t.onPrimary} />}
        </View>
      </Tap>
    </Animated.View>
  );
}

function ThemeCard({ id, selected, onPress, delay }: { id: ThemeId | 'auto'; selected: boolean; onPress: () => void; delay: number }) {
  const t = useTheme();
  const th = id === 'auto' ? null : THEMES[id];
  return (
    <Animated.View entering={ZoomIn.delay(delay).duration(320)} style={{ width: '48%' }}>
      <Tap onPress={onPress} feedback="select" scale={0.96} style={[styles.themeCard, { borderColor: selected ? t.primary : t.border, backgroundColor: t.card, borderRadius: t.radius - 4 }]}>
        <View style={[styles.themePreview, { backgroundColor: th ? th.bg : t.card2, borderColor: th ? th.border : t.border }]}>
          {th ? (
            <>
              <View style={[styles.previewBar, { backgroundColor: th.primary }]} />
              <View style={[styles.previewCard, { backgroundColor: th.card, borderColor: th.border }]} />
              <View style={{ flexDirection: 'row', gap: 4, marginTop: 6 }}>
                <View style={[styles.previewDot, { backgroundColor: th.primary2 }]} />
                <View style={[styles.previewDot, { backgroundColor: th.accent }]} />
                <View style={[styles.previewDot, { backgroundColor: th.success }]} />
              </View>
            </>
          ) : (
            <Ionicons name="contrast-outline" size={30} color={t.textMuted} />
          )}
        </View>
        <T v="bodyB" style={{ marginTop: 8 }}>
          {th ? th.name : 'Match my phone'}
        </T>
        <T v="small" c="muted" numberOfLines={1}>
          {th ? th.tagline : 'Light by day, dark by night'}
        </T>
        {selected && (
          <View style={[styles.themeCheck, { backgroundColor: t.primary }]}>
            <Ionicons name="checkmark" size={14} color={t.onPrimary} />
          </View>
        )}
      </Tap>
    </Animated.View>
  );
}

export default function Onboarding() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const profile = useStore((s) => s.profile);
  const settings = useStore((s) => s.settings);
  const setProfile = useStore((s) => s.setProfile);
  const setSettings = useStore((s) => s.setSettings);
  const [step, setStepRaw] = useState(resumeStep);
  const setStep = (n: number) => {
    resumeStep = n;
    setStepRaw(n);
  };

  const finishWithoutTest = () => {
    setProfile({ onboarded: true, placementDone: false, startLevel: 0 });
    resumeStep = 0;
    router.replace('/learn');
  };

  const canContinue = (() => {
    switch (step) {
      case 2:
        return profile.goal !== null;
      default:
        return true;
    }
  })();

  const mood: Mood = step === 0 ? 'cheer' : step === 3 ? 'think' : step === 6 ? 'wow' : 'happy';
  const next = () => setStep(Math.min(TOTAL_STEPS - 1, step + 1));
  const name = profile.name.trim();

  const titles = [
    'Welcome to Logica',
    name ? `Nice to meet you, ${name}` : 'Who are you?',
    'What brings you here?',
    'How much logic do you know?',
    'Set a daily goal',
    'Make it yours',
    'Find your starting point',
  ];

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <StatusBar style={t.dark ? 'light' : 'dark'} />
      <LinearGradient colors={t.bgGradient} style={StyleSheet.absoluteFill} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, height: 42 }}>
            {step > 0 ? (
              <IconButton name="chevron-back" label="Back" onPress={() => setStep(step - 1)} />
            ) : (
              <View style={{ width: 42 }} />
            )}
            <View style={{ flex: 1 }}>
              <ProgressBar value={(step + 1) / TOTAL_STEPS} height={10} />
            </View>
            <T v="small" c="muted" style={{ width: 42 }} center>
              {step + 1}/{TOTAL_STEPS}
            </T>
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <Animated.View key={step} entering={SlideInRight.duration(300)} exiting={SlideOutLeft.duration(200)} style={styles.stepWrap}>
            <Animated.ScrollView contentContainerStyle={styles.stepContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <View style={{ alignItems: 'center', marginBottom: 6 }}>
                <Mascot size={step === 0 ? 150 : 96} mood={mood} />
              </View>
              <T v="title" center style={{ marginBottom: 6 }}>
                {titles[step]}
              </T>

              {step === 0 && (
                <View style={{ gap: 14, marginTop: 6 }}>
                  <T v="body" c="muted" center>
                    Formal logic from first principles to the frontier: short lessons, real practice, and tools that do the tedious parts for you.
                  </T>
                  <View style={{ gap: 10, marginTop: 10 }}>
                    {[
                      ['book-outline', `${TOTAL_LESSONS} lessons in three levels`],
                      ['create-outline', 'Practice that adapts to your mistakes'],
                      ['cloud-offline-outline', 'Fully offline, no account needed'],
                    ].map(([ic, tx], i) => (
                      <Animated.View key={tx} entering={FadeInDown.delay(250 + i * 120).duration(350)} style={styles.feature}>
                        <IconBadge name={ic} size={38} />
                        <T v="bodyB" style={{ flex: 1 }}>
                          {tx}
                        </T>
                      </Animated.View>
                    ))}
                  </View>
                </View>
              )}

              {step === 1 && (
                <View style={{ gap: 16, marginTop: 8 }}>
                  <T v="body" c="muted" center>
                    Pick a name and an avatar. They stay on this device.
                  </T>
                  <TextInput
                    value={profile.name}
                    onChangeText={(v) => setProfile({ name: v.slice(0, 24) })}
                    placeholder="Your name"
                    placeholderTextColor={t.textMuted}
                    maxLength={24}
                    autoCapitalize="words"
                    style={[styles.input, { color: t.text, borderColor: t.border, backgroundColor: t.card, borderRadius: t.radius - 8, fontFamily: FONT.semi }]}
                  />
                  <View style={styles.avatarGrid}>
                    {AVATARS.map((a, i) => {
                      const on = profile.avatar === a.id;
                      return (
                        <Animated.View key={a.id} entering={ZoomIn.delay(40 * i).duration(260)}>
                          <Tap onPress={() => setProfile({ avatar: a.id })} feedback="select" scale={0.9} style={[styles.avatarWrap, { borderColor: on ? t.primary : 'transparent' }]}>
                            <Avatar id={a.id} size={52} />
                          </Tap>
                        </Animated.View>
                      );
                    })}
                  </View>
                </View>
              )}

              {step === 2 && (
                <View style={{ gap: 10, marginTop: 8 }}>
                  {GOALS.map((g, i) => (
                    <Option key={g.id} icon={g.icon} label={g.label} sub={g.sub} selected={profile.goal === g.id} onPress={() => setProfile({ goal: g.id })} delay={60 + i * 55} />
                  ))}
                </View>
              )}

              {step === 3 && (
                <View style={{ gap: 10, marginTop: 8 }}>
                  {EXPERIENCE.map((e, i) => (
                    <Option key={e.v} icon={e.icon} label={e.label} sub={e.sub} selected={profile.experience === e.v} onPress={() => setProfile({ experience: e.v })} delay={60 + i * 70} />
                  ))}
                  <T v="small" c="muted" center style={{ marginTop: 4 }}>
                    A short test comes next to find your real starting point.
                  </T>
                </View>
              )}

              {step === 4 && (
                <View style={{ gap: 10, marginTop: 8 }}>
                  {DAILY.map((d, i) => (
                    <Option key={d.xp} icon="flag-outline" label={d.label} sub={d.sub} selected={profile.dailyGoalXp === d.xp} onPress={() => setProfile({ dailyGoalXp: d.xp })} delay={60 + i * 70} />
                  ))}
                  <T v="small" c="muted" center style={{ marginTop: 4 }}>
                    You can change this any time in settings.
                  </T>
                </View>
              )}

              {step === 5 && (
                <View style={{ marginTop: 8 }}>
                  <T v="body" c="muted" center style={{ marginBottom: 14 }}>
                    Tap one and watch the app change. More themes unlock as you earn gems.
                  </T>
                  <View style={styles.themeGrid}>
                    {FREE_THEMES.map((id, i) => (
                      <ThemeCard key={id} id={id} selected={settings.theme === id} onPress={() => setSettings({ theme: id })} delay={50 + i * 70} />
                    ))}
                    <ThemeCard id="auto" selected={settings.theme === 'auto'} onPress={() => setSettings({ theme: 'auto' })} delay={330} />
                  </View>
                </View>
              )}

              {step === 6 && (
                <View style={{ gap: 12, marginTop: 8 }}>
                  <T v="body" c="muted" center>
                    Take a 12-question placement test. We will unlock the right lessons for you and skip what you already know.
                  </T>
                  <View style={{ gap: 10, marginTop: 6 }}>
                    {[
                      ['timer-outline', 'About 4 minutes'],
                      ['trending-up-outline', 'Questions get harder as you go'],
                      ['shield-checkmark-outline', 'No pressure, it is not graded'],
                    ].map(([ic, tx], i) => (
                      <Animated.View key={tx} entering={FadeInDown.delay(200 + i * 110).duration(340)} style={styles.feature}>
                        <IconBadge name={ic} size={38} />
                        <T v="bodyB" style={{ flex: 1 }}>
                          {tx}
                        </T>
                      </Animated.View>
                    ))}
                  </View>
                </View>
              )}
            </Animated.ScrollView>
          </Animated.View>
        </View>

        <View style={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 14, paddingTop: 10, gap: 6 }}>
          {step < 6 ? (
            <Button title={step === 0 ? 'Get started' : 'Continue'} iconRight="arrow-forward" onPress={next} disabled={!canContinue} />
          ) : (
            <>
              <Button title="Start placement test" iconRight="arrow-forward" onPress={() => startPlacement()} />
              <Button title="Skip, start from the beginning" variant="ghost" small onPress={finishWithoutTest} />
            </>
          )}
          {step === 0 && (
            <T v="caption" c="muted" center style={{ textTransform: 'none', letterSpacing: 0, marginTop: 4 }}>
              by Tech Bytes Design
            </T>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  stepWrap: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0 },
  stepContent: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 20 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderWidth: 2 },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  feature: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  input: { borderWidth: 2, paddingHorizontal: 16, paddingVertical: 14, fontSize: 17 },
  avatarGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10 },
  avatarWrap: { padding: 3, borderRadius: 40, borderWidth: 3 },
  themeGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12 },
  themeCard: { padding: 10, borderWidth: 2 },
  themePreview: { height: 88, borderRadius: 14, borderWidth: 1, padding: 10, justifyContent: 'flex-start' },
  previewBar: { height: 10, borderRadius: 5, width: '60%' },
  previewCard: { height: 26, borderRadius: 8, borderWidth: 1, marginTop: 8 },
  previewDot: { width: 12, height: 12, borderRadius: 6 },
  themeCheck: { position: 'absolute', top: 14, right: 14, width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
});
