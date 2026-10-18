import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { StatsBar } from '@/components/StatsBar';
import { T } from '@/components/AppText';
import { Card } from '@/components/Card';
import { ProgressBar, ProgressRing } from '@/components/Progress';
import { BarChart, Heatmap, Radar } from '@/components/Charts';
import { IconBadge, SectionTitle, Segmented } from '@/components/ui';
import { ACHIEVEMENTS } from '@/content/achievements';
import { TOTAL_LESSONS, UNIT_BY_ID } from '@/content/curriculum';
import { LEVEL_NAMES, TYPE_LABELS, type Level, type QuestionType } from '@/content/types';
import { effectiveStreak, levelProgress, rankForLevel, useStore } from '@/store';
import { levelCompletion } from '@/logic/progression';
import { startPractice } from '@/services/sessions';
import { FONT, useTheme } from '@/theme/ThemeProvider';
import { unitColor } from '@/utils/color';
import { dayKey, formatDuration, lastNDays, shortDay } from '@/utils/date';

const GROUPS: { label: string; units: string[] }[] = [
  { label: 'Foundations', units: ['arguments', 'fallacies', 'puzzles', 'critical-thinking', 'puzzles-2'] },
  { label: 'Uncertainty', units: ['probability'] },
  { label: 'Propositional', units: ['prop-basics', 'truth-tables', 'equivalences', 'boolean'] },
  { label: 'Syllogisms', units: ['syllogisms', 'syllogisms-deep'] },
  { label: 'Proof', units: ['inference', 'proofs', 'deduction'] },
  { label: 'Quantifiers', units: ['predicate-1', 'predicate-2', 'sets-relations'] },
  { label: 'Frontier', units: ['metalogic', 'modal', 'temporal-epistemic', 'nonclassical', 'computing-logic', 'higher-order', 'complexity', 'paradoxes'] },
];

function StatTile({ icon, label, value, color, delay }: { icon: string; label: string; value: string | number; color: string; delay: number }) {
  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(360)} style={{ width: '31.5%' }}>
      <Card style={{ padding: 12, alignItems: 'center', gap: 4 }}>
        <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={20} color={color} />
        <T v="h3" style={{ fontSize: 18 }}>
          {value}
        </T>
        <T v="caption" c="muted" center style={{ fontSize: 9.5, letterSpacing: 0.5 }}>
          {label}
        </T>
      </Card>
    </Animated.View>
  );
}

export default function Progress() {
  const t = useTheme();
  const progress = useStore((s) => s.progress);
  const stats = useStore((s) => s.stats);
  const streak = useStore((s) => s.streak);
  const goal = useStore((s) => s.profile.dailyGoalXp);
  const achievements = useStore((s) => s.achievements);
  const [range, setRange] = useState<7 | 30>(7);

  const lvl = levelProgress(progress.xp);
  const eff = effectiveStreak(streak, progress.freezes);
  const today = dayKey();
  const accuracy = stats.answered ? Math.round((stats.correct / stats.answered) * 100) : 0;
  const lessonsDone = Object.keys(progress.lessons).length;

  const bars = useMemo(
    () =>
      lastNDays(range).map((d) => ({
        label: range === 7 ? shortDay(d) : d.slice(8) === '01' || d === today ? d.slice(8) : '',
        value: stats.daily[d]?.xp ?? 0,
        today: d === today,
      })),
    [range, stats.daily, today]
  );
  const weekXp = lastNDays(7).reduce((a, d) => a + (stats.daily[d]?.xp ?? 0), 0);

  const axes = GROUPS.map((g) => {
    let a = 0;
    let c = 0;
    g.units.forEach((u) => {
      a += stats.byUnit[u]?.a ?? 0;
      c += stats.byUnit[u]?.c ?? 0;
    });
    return { label: g.label, value: a ? c / a : 0, answered: a };
  });
  const anyData = axes.some((a) => a.answered > 0);

  const rated = Object.entries(stats.byUnit)
    .filter(([id, v]) => v.a >= 5 && UNIT_BY_ID[id])
    .map(([id, v]) => ({ id, acc: v.c / v.a, n: v.a }))
    .sort((a, b) => b.acc - a.acc);
  const strong = rated.slice(0, 3);
  const weak = [...rated].reverse().filter((r) => r.acc < 0.85).slice(0, 3);

  const types = (Object.entries(stats.byType) as [QuestionType, { a: number; c: number }][]).filter(([, v]) => v.a > 0).sort((a, b) => b[1].a - a[1].a);
  const dailyXp = useMemo(() => Object.fromEntries(Object.entries(stats.daily).map(([k, v]) => [k, v.xp])), [stats.daily]);
  const goalDays = Object.values(stats.daily).filter((d) => d.goal).length;
  const unlocked = Object.keys(achievements).length;

  return (
    <Screen scroll bottom={120}>
      <StatsBar title="Progress" subtitle="Your learning" />

      <Animated.View entering={FadeInDown.duration(380)} style={{ flexDirection: 'row', gap: 12 }}>
        <Card style={{ flex: 1.2, alignItems: 'center', gap: 6 }}>
          <ProgressRing value={lvl.pct} size={104} stroke={10}>
            <T v="caption" c="muted" style={{ fontSize: 10 }}>
              Level
            </T>
            <T v="title">{lvl.level}</T>
          </ProgressRing>
          <T v="bodyB" center numberOfLines={1}>
            {rankForLevel(lvl.level)}
          </T>
          <T v="small" c="muted" center>
            {lvl.into} / {lvl.need} XP
          </T>
        </Card>
        <Card style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          <Ionicons name="flame" size={44} color={eff > 0 ? t.accent : t.textMuted} />
          <T v="display" style={{ fontSize: 40, lineHeight: 46 }}>
            {eff}
          </T>
          <T v="small" c="muted" center>
            day streak
          </T>
          <T v="small" c="muted" center style={{ fontSize: 11.5 }}>
            Best {streak.longest}
            {progress.freezes > 0 ? ` · ${progress.freezes} freeze${progress.freezes > 1 ? 's' : ''}` : ''}
          </T>
        </Card>
      </Animated.View>

      <SectionTitle right={<Segmented options={[{ key: 7 as const, label: '7d' }, { key: 30 as const, label: '30d' }]} value={range} onChange={setRange} />}>
        XP earned
      </SectionTitle>
      <Card>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
          <T v="small" c="muted">
            This week: <T v="small" style={{ fontFamily: FONT.heavy }}>{weekXp} XP</T>
          </T>
          <T v="small" c="muted">
            Goal {goal}/day
          </T>
        </View>
        <BarChart data={bars} goal={goal} />
      </Card>

      <View style={[styles.tiles, { marginTop: 14 }]}>
        <StatTile icon="school" label="LESSONS" value={`${lessonsDone}/${TOTAL_LESSONS}`} color={t.primary} delay={80} />
        <StatTile icon="help-circle" label="ANSWERED" value={stats.answered} color={t.info} delay={130} />
        <StatTile icon="checkmark-done" label="ACCURACY" value={`${accuracy}%`} color={t.success} delay={180} />
        <StatTile icon="time" label="STUDY TIME" value={formatDuration(stats.secs)} color={t.accent} delay={230} />
        <StatTile icon="diamond" label="PERFECT" value={stats.perfect} color={t.primary2} delay={280} />
        <StatTile icon="flash" label="TOTAL XP" value={progress.xp} color={t.warn} delay={330} />
      </View>

      <SectionTitle>Skill map</SectionTitle>
      <Card style={{ alignItems: 'center' }}>
        {anyData ? (
          <>
            <Radar axes={axes} size={Math.min(320, 290)} />
            <T v="small" c="muted" center style={{ marginTop: 4 }}>
              Accuracy per topic group. Keep practising to fill the shape.
            </T>
          </>
        ) : (
          <T v="body" c="muted" center style={{ padding: 20 }}>
            Answer a few questions and your skill map will appear here.
          </T>
        )}
      </Card>

      <SectionTitle>Level mastery</SectionTitle>
      <Card style={{ gap: 14 }}>
        {([0, 1, 2] as Level[]).map((l) => {
          const c = levelCompletion(progress, l);
          const exam = progress.exams[String(l)];
          return (
            <View key={l} style={{ gap: 6 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <T v="bodyB">{LEVEL_NAMES[l]}</T>
                <T v="small" c="muted">
                  {c.done}/{c.total} lessons {exam?.passed ? ' · exam passed' : ''}
                </T>
              </View>
              <ProgressBar value={c.pct} height={10} colors={exam?.passed ? [t.success, t.primary] : undefined} />
            </View>
          );
        })}
      </Card>

      <SectionTitle>Consistency</SectionTitle>
      <Card>
        <Heatmap daily={dailyXp} goal={goal} />
        <T v="small" c="muted" style={{ marginTop: 10 }}>
          Last 12 weeks · you hit your daily goal on {goalDays} day{goalDays === 1 ? '' : 's'}.
        </T>
      </Card>

      {types.length > 0 && (
        <>
          <SectionTitle>By question type</SectionTitle>
          <Card style={{ gap: 12 }}>
            {types.map(([ty, v]) => {
              const pct = v.c / v.a;
              return (
                <View key={ty} style={{ gap: 5 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <T v="small" style={{ fontFamily: FONT.bold }}>
                      {TYPE_LABELS[ty]}
                    </T>
                    <T v="small" c="muted">
                      {Math.round(pct * 100)}% · {v.a}
                    </T>
                  </View>
                  <ProgressBar value={pct} height={8} colors={pct >= 0.75 ? [t.success, t.primary] : pct >= 0.5 ? [t.warn, t.accent] : [t.danger, t.accent]} />
                </View>
              );
            })}
          </Card>
        </>
      )}

      {(strong.length > 0 || weak.length > 0) && (
        <>
          <SectionTitle>Insights</SectionTitle>
          <View style={{ gap: 10 }}>
            {weak.map((w) => {
              const u = UNIT_BY_ID[w.id];
              return (
                <Card key={w.id} onPress={() => startPractice({ unitId: w.id })} style={styles.insight} tone="dangerSoft">
                  <IconBadge name="trending-down" color={t.danger} size={42} />
                  <View style={{ flex: 1 }}>
                    <T v="bodyB">Needs work: {u.title}</T>
                    <T v="small" c="muted">
                      {Math.round(w.acc * 100)}% accuracy over {w.n} answers. Tap to practise.
                    </T>
                  </View>
                  <Ionicons name="play-circle" size={26} color={t.danger} />
                </Card>
              );
            })}
            {strong.map((s) => {
              const u = UNIT_BY_ID[s.id];
              return (
                <Card key={s.id} style={styles.insight} tone="successSoft">
                  <IconBadge name={u.icon} color={unitColor(u.hue, t.dark)} size={42} />
                  <View style={{ flex: 1 }}>
                    <T v="bodyB">Strong: {u.title}</T>
                    <T v="small" c="muted">
                      {Math.round(s.acc * 100)}% accuracy over {s.n} answers.
                    </T>
                  </View>
                  <Ionicons name="checkmark-circle" size={24} color={t.success} />
                </Card>
              );
            })}
          </View>
        </>
      )}

      <Card onPress={() => router.push('/achievements')} style={[styles.insight, { marginTop: 22 }]}>
        <IconBadge name="trophy" color={t.accent} size={46} />
        <View style={{ flex: 1 }}>
          <T v="h3">Achievements</T>
          <T v="small" c="muted">
            {unlocked} of {ACHIEVEMENTS.length} unlocked
          </T>
          <View style={{ marginTop: 6 }}>
            <ProgressBar value={unlocked / ACHIEVEMENTS.length} height={7} colors={[t.accent, t.accent2]} />
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={t.textMuted} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  tiles: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10 },
  insight: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 },
});

