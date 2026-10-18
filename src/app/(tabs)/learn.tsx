import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp, LinearTransition } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { StatsBar } from '@/components/StatsBar';
import { T } from '@/components/AppText';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Tap } from '@/components/Tap';
import { ProgressBar, ProgressRing } from '@/components/Progress';
import { Icon, IconBadge, Segmented } from '@/components/ui';
import { toast } from '@/components/Toast';
import { useStore } from '@/store';
import { UNITS, lessonsOfLevel } from '@/content/curriculum';
import { LEVEL_NAMES, type Level, type Unit } from '@/content/types';
import { examUnlocked, levelCompletion, lessonStatus, nextRecommended, unitComplete, unitProgress, unitUnlocked } from '@/logic/progression';
import { startExam, startUnitTest } from '@/services/sessions';
import { alpha, FONT, shade, useTheme } from '@/theme/ThemeProvider';
import { unitColor } from '@/utils/color';
import { dayKey } from '@/utils/date';
import { haptic } from '@/services/haptics';

function Stars({ n, size = 12 }: { n: number; size?: number }) {
  const t = useTheme();
  return (
    <View style={{ flexDirection: 'row', gap: 1 }}>
      {[1, 2, 3].map((i) => (
        <Ionicons key={i} name={i <= n ? 'star' : 'star-outline'} size={size} color={i <= n ? t.accent2 : alpha(t.textMuted, 0.6)} />
      ))}
    </View>
  );
}

function UnitCard({ unit, expanded, onToggle, index }: { unit: Unit; expanded: boolean; onToggle: () => void; index: number }) {
  const t = useTheme();
  const progress = useStore((s) => s.progress);
  const startLevel = useStore((s) => s.profile.startLevel);
  const color = unitColor(unit.hue, t.dark);
  const unlocked = unitUnlocked(progress, startLevel, unit);
  const { done, total, pct } = unitProgress(progress, unit);
  const complete = unitComplete(progress, unit);
  const test = progress.tests[unit.id];

  return (
    <Animated.View entering={FadeInDown.delay(60 + index * 60).duration(380)} layout={LinearTransition.springify().damping(20).stiffness(200)}>
      <View
        style={[
          styles.unit,
          {
            backgroundColor: t.card,
            borderColor: expanded ? alpha(color, 0.7) : t.border,
            borderRadius: t.radius,
            boxShadow: expanded ? `0px 8px 24px ${alpha(color, t.dark ? 0.28 : 0.2)}` : `0px 4px 14px ${alpha(t.shadow, t.dark ? 0.2 : 0.06)}`,
          },
        ]}
      >
        <Tap onPress={onToggle} feedback="tap" scale={0.99} style={styles.unitHead}>
          <View style={[styles.unitIcon, { backgroundColor: alpha(color, t.dark ? 0.2 : 0.14) }]}>
            <Icon name={unlocked ? unit.icon : 'lock-closed-outline'} size={26} color={color} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <T v="h3" numberOfLines={1} style={{ flexShrink: 1 }}>
                {unit.title}
              </T>
              {complete && <Ionicons name="checkmark-circle" size={18} color={t.success} />}
            </View>
            <T v="small" c="muted" numberOfLines={expanded ? 3 : 1}>
              {unit.blurb}
            </T>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 }}>
              <View style={{ flex: 1 }}>
                <ProgressBar value={pct} height={7} colors={[color, shade(color, 0.25)]} />
              </View>
              <T v="small" c="muted" style={{ fontFamily: FONT.bold, fontSize: 12 }}>
                {done}/{total}
              </T>
            </View>
          </View>
          <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={20} color={t.textMuted} />
        </Tap>

        {expanded && (
          <Animated.View entering={FadeInDown.duration(260)} style={{ paddingHorizontal: 14, paddingBottom: 14, gap: 4 }}>
            <View style={[styles.rule, { backgroundColor: t.border }]} />
            {unit.lessons.map((l, i) => {
              const st = lessonStatus(progress, startLevel, unit, i);
              const rec = progress.lessons[l.id];
              const locked = st === 'locked';
              return (
                <Tap
                  key={l.id}
                  feedback={locked ? 'none' : 'tap'}
                  scale={0.98}
                  onPress={() => {
                    if (locked) {
                      haptic.warn();
                      toast(unlocked ? 'Finish the previous lesson first.' : 'Complete the earlier units, or pass this unit’s test to skip ahead.', 'lock-closed-outline');
                      return;
                    }
                    router.push(`/lesson/${l.id}`);
                  }}
                  style={[styles.lesson, { opacity: locked ? 0.55 : 1 }]}
                >
                  <View style={styles.nodeCol}>
                    <View
                      style={[
                        styles.node,
                        st === 'done'
                          ? { backgroundColor: color, borderColor: color }
                          : st === 'open'
                          ? { backgroundColor: alpha(color, 0.16), borderColor: color }
                          : { backgroundColor: 'transparent', borderColor: t.border },
                      ]}
                    >
                      <Ionicons
                        name={st === 'done' ? 'checkmark' : st === 'open' ? 'play' : 'lock-closed'}
                        size={st === 'done' ? 18 : 14}
                        color={st === 'done' ? '#fff' : st === 'open' ? color : t.textMuted}
                      />
                    </View>
                    {i < unit.lessons.length - 1 && <View style={[styles.vline, { backgroundColor: st === 'done' ? color : t.border }]} />}
                  </View>
                  <View style={{ flex: 1, paddingVertical: 6 }}>
                    <T v="bodyB" numberOfLines={1}>
                      {l.title}
                    </T>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <T v="small" c="muted">
                        {l.minutes} min · {l.questions.length} questions
                      </T>
                      {rec ? <Stars n={rec.stars} /> : null}
                    </View>
                  </View>
                  <Icon name={l.icon} size={20} color={alpha(color, 0.9)} />
                </Tap>
              );
            })}
            <Tap
              feedback="tap"
              scale={0.98}
              onPress={() => router.push(`/notes/${unit.id}`)}
              style={[styles.testRow, { borderColor: t.border, backgroundColor: t.card2, borderStyle: 'solid', marginTop: 6 }]}
            >
              <IconBadge name="document-text-outline" color={color} size={38} />
              <View style={{ flex: 1 }}>
                <T v="bodyB">Study notes</T>
                <T v="small" c="muted">
                  Quick revision pages for this unit
                </T>
              </View>
              <Ionicons name="chevron-forward" size={18} color={t.textMuted} />
            </Tap>
            <Tap
              feedback="tap"
              scale={0.98}
              onPress={() => startUnitTest(unit.id)}
              style={[styles.testRow, { borderColor: alpha(color, 0.5), backgroundColor: alpha(color, t.dark ? 0.12 : 0.08) }]}
            >
              <IconBadge name={test?.passed ? 'ribbon-outline' : 'clipboard-outline'} color={color} size={38} />
              <View style={{ flex: 1 }}>
                <T v="bodyB">{test?.passed ? 'Unit test passed' : unlocked ? 'Unit test' : 'Test out of this unit'}</T>
                <T v="small" c="muted">
                  {test ? `Best ${test.best}% · tap to retry` : '10 questions · 70% to pass'}
                </T>
              </View>
              <Ionicons name="chevron-forward" size={18} color={t.textMuted} />
            </Tap>
          </Animated.View>
        )}
      </View>
    </Animated.View>
  );
}

function ExamCard({ level }: { level: Level }) {
  const t = useTheme();
  const progress = useStore((s) => s.progress);
  const startLevel = useStore((s) => s.profile.startLevel);
  const exam = progress.exams[String(level)];
  const open = examUnlocked(progress, startLevel, level);
  const comp = levelCompletion(progress, level);
  return (
    <Animated.View entering={FadeInUp.duration(400)}>
      <Card tone="primarySoft" style={{ marginTop: 6 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <IconBadge name={exam?.passed ? 'trophy' : 'trophy-outline'} color={t.accent} size={50} />
          <View style={{ flex: 1 }}>
            <T v="h3">{LEVEL_NAMES[level]} exam</T>
            <T v="small" c="muted">
              {exam?.passed
                ? `Passed with ${exam.best}%. Your certificate is ready.`
                : open
                ? '20 mixed questions · 75% earns a certificate'
                : `Unlocks at 60% of the level (${Math.round(comp.pct * 100)}% done)`}
            </T>
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
          {exam?.passed ? (
            <View style={{ flex: 1 }}>
              <Button title="Certificate" icon="ribbon-outline" variant="accent" small onPress={() => router.push({ pathname: '/certificate', params: { level: String(level) } })} />
            </View>
          ) : null}
          <View style={{ flex: 1 }}>
            <Button
              title={exam ? 'Retake exam' : 'Take the exam'}
              small
              variant={exam?.passed ? 'secondary' : 'primary'}
              disabled={!open}
              onPress={() => startExam(level)}
            />
          </View>
        </View>
      </Card>
    </Animated.View>
  );
}

export default function Learn() {
  const t = useTheme();
  const progress = useStore((s) => s.progress);
  const profile = useStore((s) => s.profile);
  const today = useStore((s) => s.stats.daily[dayKey()]);
  const rec = useMemo(() => nextRecommended(progress, profile.startLevel), [progress, profile.startLevel]);
  const [level, setLevel] = useState<Level>(rec?.unit.level ?? profile.startLevel);
  const [open, setOpen] = useState<string | null>(rec?.unit.id ?? null);

  const goal = profile.dailyGoalXp;
  const todayXp = today?.xp ?? 0;
  const levelUnits = UNITS.filter((u) => u.level === level);

  const options = ([0, 1, 2] as Level[]).map((l) => ({
    key: l,
    label: LEVEL_NAMES[l],
    sub: `${Math.round(levelCompletion(progress, l).pct * 100)}% done`,
  }));

  return (
    <Screen scroll bottom={120}>
      <StatsBar />

      <Animated.View entering={FadeInDown.duration(420)}>
        <LinearGradient
          colors={[t.primary, t.primary2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, { borderRadius: t.radius + 4, boxShadow: `0px 12px 30px ${alpha(t.primary, 0.4)}` }]}
        >
          <View style={{ flex: 1 }}>
            <T v="caption" style={{ color: alpha(t.onPrimary, 0.8) }}>
              {rec ? (progress.lessons[rec.unit.lessons[rec.lessonIndex].id] ? 'Practice again' : 'Up next') : 'All caught up'}
            </T>
            <T v="h2" style={{ color: t.onPrimary, marginTop: 4 }} numberOfLines={2}>
              {rec ? rec.unit.lessons[rec.lessonIndex].title : 'You finished every lesson'}
            </T>
            <T v="small" style={{ color: alpha(t.onPrimary, 0.8), marginTop: 2 }} numberOfLines={1}>
              {rec ? rec.unit.title : 'Try the exams or the Practice tab'}
            </T>
            <View style={{ marginTop: 14, alignSelf: 'flex-start' }}>
              <Tap
                feedback="press"
                onPress={() => (rec ? router.push(`/lesson/${rec.unit.lessons[rec.lessonIndex].id}`) : router.push('/practice'))}
                style={[styles.heroBtn, { backgroundColor: t.onPrimary === '#FFFFFF' ? '#FFFFFF' : t.bg }]}
              >
                <T v="btn" style={{ color: t.onPrimary === '#FFFFFF' ? t.primary : t.primary, fontSize: 15 }}>
                  {rec ? 'Start' : 'Practice'}
                </T>
                <Ionicons name="arrow-forward" size={16} color={t.primary} />
              </Tap>
            </View>
          </View>
          <View style={{ alignItems: 'center' }}>
            <ProgressRing value={Math.min(1, todayXp / goal)} size={84} stroke={9} colors={['#FFFFFF', '#FFFFFF']} track="rgba(255,255,255,0.25)">
              <T v="h3" style={{ color: t.onPrimary }}>
                {todayXp}
              </T>
              <T v="small" style={{ color: alpha(t.onPrimary, 0.8), fontSize: 11 }}>
                / {goal} XP
              </T>
            </ProgressRing>
            <T v="small" style={{ color: alpha(t.onPrimary, 0.85), marginTop: 6, fontSize: 12 }}>
              Daily goal
            </T>
          </View>
        </LinearGradient>
      </Animated.View>

      <View style={{ marginTop: 20 }}>
        <Segmented options={options} value={level} onChange={(l) => setLevel(l)} />
      </View>

      <View style={{ marginTop: 14, gap: 12 }}>
        {levelUnits.map((u, i) => (
          <UnitCard key={u.id} unit={u} index={i} expanded={open === u.id} onToggle={() => setOpen(open === u.id ? null : u.id)} />
        ))}
        <ExamCard level={level} />
        <T v="small" c="muted" center style={{ marginTop: 4 }}>
          {lessonsOfLevel(level).length} lessons · {LEVEL_NAMES[level]}
        </T>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 18 },
  heroBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 18, paddingVertical: 11, borderRadius: 14 },
  unit: { borderWidth: 1.5, overflow: 'hidden' },
  unitHead: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  unitIcon: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  rule: { height: 1, marginBottom: 6 },
  lesson: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  nodeCol: { width: 34, alignItems: 'center', alignSelf: 'stretch' },
  node: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  vline: { position: 'absolute', top: 40, bottom: -10, width: 3, borderRadius: 2 },
  testRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10, borderRadius: 14, borderWidth: 1.5, borderStyle: 'dashed', marginTop: 8 },
});

