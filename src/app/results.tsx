import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/Button';
import { Rich, T } from '@/components/AppText';
import { Card } from '@/components/Card';
import { Confetti } from '@/components/Confetti';
import { Mascot } from '@/components/Mascot';
import { ProgressRing } from '@/components/Progress';
import { Tap } from '@/components/Tap';
import { IconBadge, Pill } from '@/components/ui';
import { useCountUp } from '@/components/hooks';
import { useSession } from '@/store/session';
import { rankForLevel, useStore } from '@/store';
import { achievementById } from '@/content/achievements';
import { LEVEL_ICONS, LEVEL_NAMES } from '@/content/types';
import { describeCorrect } from '@/logic/grading';
import { praise } from '@/logic/rewards';
import { startDaily, startExam, startFallacyGame, startLessonQuiz, startMistakes, startPractice, startSpeed, startUnitTest } from '@/services/sessions';
import { alpha, FONT, useTheme } from '@/theme/ThemeProvider';
import { formatDuration } from '@/utils/date';
import { haptic } from '@/services/haptics';

function Stat({ icon, label, value, color, delay }: { icon: string; label: string; value: string | number; color: string; delay: number }) {
  const t = useTheme();
  return (
    <Animated.View entering={ZoomIn.delay(delay).duration(380)} style={[styles.stat, { backgroundColor: alpha(color, t.dark ? 0.16 : 0.1), borderColor: alpha(color, 0.35) }]}>
      <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={22} color={color} />
      <T v="h2" style={{ color, marginTop: 4 }}>
        {value}
      </T>
      <T v="caption" c="muted" style={{ fontSize: 10.5 }}>
        {label}
      </T>
    </Animated.View>
  );
}

function ReviewItem({ rec }: { rec: { q: import('@/content/types').Question; correct: boolean } }) {
  const t = useTheme();
  const [open, setOpen] = useState(false);
  return (
    <Card style={{ padding: 12 }} tone="card2">
      <Tap onPress={() => setOpen(!open)} feedback="tap" scale={0.99} style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
        <Ionicons name="close-circle" size={20} color={t.danger} style={{ marginTop: 1 }} />
        <View style={{ flex: 1 }}>
          <T v="small" style={{ fontFamily: FONT.semi }} numberOfLines={open ? undefined : 2}>
            {rec.q.q.replace(/\n+/g, ' ')}
          </T>
          {open && (
            <View style={{ marginTop: 8, gap: 6 }}>
              <T v="small" c="success" style={{ fontFamily: FONT.bold }}>
                Answer: {describeCorrect(rec.q)}
              </T>
              <Rich text={rec.q.explain} v="small" c="muted" />
            </View>
          )}
        </View>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={t.textMuted} />
      </Tap>
    </Card>
  );
}

export default function Results() {
  const t = useTheme();
  const result = useSession((s) => s.result);
  const outcome = useSession((s) => s.outcome);
  const profile = useStore((s) => s.profile);
  const setProfile = useStore((s) => s.setProfile);
  const pct = result && result.total ? result.correct / result.total : 0;
  const xp = useCountUp(result?.xp ?? 0, 1100, 500);
  const acc = useCountUp(Math.round(pct * 100), 900, 300);
  const p = praise(pct);
  const missed = useMemo(() => result?.answers.filter((a) => !a.correct) ?? [], [result]);

  if (!result || !outcome) {
    return (
      <Screen>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14 }}>
          <T v="h2">Nothing to show</T>
          <Button title="Back to Learn" full={false} onPress={() => router.replace('/learn')} />
        </View>
      </Screen>
    );
  }

  const isPlacement = result.mode === 'placement';
  const gate = result.mode === 'lesson' || result.mode === 'unitTest' || result.mode === 'exam';
  const celebrate = isPlacement || (gate ? result.passed : pct >= 0.6);
  const title = isPlacement ? 'Placement complete' : gate ? (result.passed ? (result.mode === 'exam' ? 'Exam passed!' : result.mode === 'unitTest' ? 'Unit test passed!' : p.title) : 'Not this time') : p.title;
  const mood = isPlacement ? 'cheer' : gate && !result.passed ? 'think' : p.mood;

  const finishPlacement = () => {
    setProfile({ onboarded: true });
    router.replace('/learn');
  };

  const leave = () => {
    useSession.getState().clear();
    router.dismissAll();
  };

  const nextLesson = () => {
    const id = useSession.getState().config?.nextLessonId;
    useSession.getState().clear();
    router.dismissAll();
    if (id) setTimeout(() => router.push(`/lesson/${id}`), 60);
  };

  const retry = () => {
    const cfg = useSession.getState().config;
    if (!cfg) return;
    haptic.tap();
    switch (cfg.mode) {
      case 'lesson':
        return cfg.lessonId && startLessonQuiz(cfg.lessonId);
      case 'unitTest':
        return cfg.unitId && startUnitTest(cfg.unitId);
      case 'exam':
        return cfg.level !== undefined && startExam(cfg.level);
      case 'practice':
        return startPractice({ unitId: cfg.unitId });
      case 'speed':
        return startSpeed();
      case 'daily':
        return startDaily();
      case 'mistakes':
        return startMistakes();
      case 'fallacy':
        return startFallacyGame();
    }
  };

  const startLevel = profile.startLevel;
  const minutes = Math.max(5, Math.round(profile.dailyGoalXp / 4));

  return (
    <View style={{ flex: 1 }}>
      <Screen scroll bottom={30}>
        <View style={{ alignItems: 'center', marginTop: 6 }}>
          <Animated.View entering={ZoomIn.duration(500).springify().damping(12)}>
            <Mascot size={120} mood={mood} />
          </Animated.View>
          <Animated.View entering={FadeInUp.delay(200).duration(400)}>
            <T v="title" center style={{ marginTop: 8 }}>
              {title}
            </T>
            <T v="small" c="muted" center>
              {result.title}
            </T>
          </Animated.View>
        </View>

        {isPlacement ? (
          <Animated.View entering={FadeInDown.delay(300).duration(450)}>
            <Card tone="primarySoft" style={{ marginTop: 18, alignItems: 'center', gap: 6 }}>
              <T v="caption" c="primary">
                We recommend starting at
              </T>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Ionicons name={LEVEL_ICONS[startLevel]} size={30} color={t.primary} />
                <T v="display">{LEVEL_NAMES[startLevel]}</T>
              </View>
              <T v="body" c="muted" center>
                {startLevel === 0
                  ? 'We will begin with the foundations and build up step by step.'
                  : startLevel === 1
                  ? 'You already know the basics, so the Beginner units are open for revision. Your path begins at Intermediate.'
                  : 'You clearly know your logic. Everything before Advanced is open for revision, and your path begins at Advanced.'}
              </T>
              <T v="small" c="muted" center>
                Your plan: about {minutes} minutes a day to hit {profile.dailyGoalXp} XP.
              </T>
            </Card>
          </Animated.View>
        ) : null}

        <View style={styles.statRow}>
          <Animated.View entering={ZoomIn.delay(250).duration(400)} style={{ flex: 1.1, alignItems: 'center' }}>
            <ProgressRing value={pct} size={112} stroke={11} colors={[celebrate ? t.success : t.accent, celebrate ? t.primary : t.danger]}>
              <T v="title">{acc}%</T>
              <T v="caption" c="muted" style={{ fontSize: 10 }}>
                {result.correct}/{result.total} correct
              </T>
            </ProgressRing>
          </Animated.View>
          <View style={{ flex: 1.6, flexDirection: 'row', gap: 8 }}>
            <Stat icon="flash" label="XP earned" value={`+${xp}`} color={t.accent} delay={450} />
            <Stat icon="diamond" label="Gems" value={`+${result.gems}`} color={t.info} delay={560} />
          </View>
        </View>

        {result.mode === 'lesson' && result.passed ? (
          <Animated.View entering={FadeInDown.delay(500)} style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 14 }}>
            {[1, 2, 3].map((i) => (
              <Animated.View key={i} entering={ZoomIn.delay(600 + i * 220).springify().damping(9)}>
                <Ionicons name={i <= result.stars ? 'star' : 'star-outline'} size={40} color={i <= result.stars ? t.accent2 : t.textMuted} />
              </Animated.View>
            ))}
          </Animated.View>
        ) : null}

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 14 }}>
          <Pill icon="time-outline" text={formatDuration(result.secs)} color={t.textMuted} />
          {outcome.streakContinued && <Pill icon="flame" text="Streak extended" color={t.accent} />}
          {result.mode === 'speed' && <Pill icon="speedometer-outline" text={`Score ${result.speedScore ?? result.correct}`} color={t.primary} />}
          {gate && !result.passed && <Pill icon="information-circle-outline" text={`Need ${Math.round((useSession.getState().config?.passMark ?? 0) * 100)}% to pass`} color={t.danger} />}
        </View>

        {outcome.goalJustHit && (
          <Animated.View entering={FadeInDown.delay(700)}>
            <Card tone="successSoft" style={styles.banner}>
              <IconBadge name="flag" color={t.success} size={40} />
              <View style={{ flex: 1 }}>
                <T v="bodyB">Daily goal reached</T>
                <T v="small" c="muted">
                  Bonus +10 gems added.
                </T>
              </View>
            </Card>
          </Animated.View>
        )}

        {outcome.leveledUp && (
          <Animated.View entering={FadeInDown.delay(800)}>
            <Card tone="primarySoft" style={styles.banner}>
              <IconBadge name="trending-up" color={t.primary} size={40} />
              <View style={{ flex: 1 }}>
                <T v="bodyB">Level {outcome.newLevel}</T>
                <T v="small" c="muted">
                  You are now a {rankForLevel(outcome.newLevel)}.
                </T>
              </View>
            </Card>
          </Animated.View>
        )}

        {outcome.newAchievements.length > 0 && (
          <View style={{ marginTop: 18 }}>
            <T v="h3" style={{ marginBottom: 8 }}>
              Achievements unlocked
            </T>
            <View style={{ gap: 8 }}>
              {outcome.newAchievements.map((id, i) => {
                const a = achievementById(id);
                if (!a) return null;
                return (
                  <Animated.View key={id} entering={FadeInDown.delay(900 + i * 150).springify().damping(14)}>
                    <Card glow={t.accent} style={styles.banner}>
                      <IconBadge name={a.icon} color={t.accent} size={46} />
                      <View style={{ flex: 1 }}>
                        <T v="bodyB">{a.title}</T>
                        <T v="small" c="muted">
                          {a.desc} · +15 gems
                        </T>
                      </View>
                    </Card>
                  </Animated.View>
                );
              })}
            </View>
          </View>
        )}

        {missed.length > 0 && !isPlacement && (
          <View style={{ marginTop: 20 }}>
            <T v="h3" style={{ marginBottom: 8 }}>
              Review ({missed.length})
            </T>
            <View style={{ gap: 8 }}>
              {missed.slice(0, 8).map((m, i) => (
                <ReviewItem key={i} rec={m} />
              ))}
            </View>
            <T v="small" c="muted" style={{ marginTop: 8 }}>
              Missed questions are saved to your review queue in the Practice tab.
            </T>
          </View>
        )}

        <View style={{ gap: 10, marginTop: 24 }}>
          {isPlacement ? (
            <Button title="Start learning" iconRight="arrow-forward" onPress={finishPlacement} />
          ) : (
            <>
              {result.mode === 'lesson' && result.passed && useSession.getState().config?.nextLessonId ? (
                <Button title="Next lesson" iconRight="arrow-forward" onPress={nextLesson} />
              ) : (
                <Button title="Continue" onPress={leave} />
              )}
              {result.mode === 'exam' && result.passed && result.level !== undefined ? (
                <Button title="View certificate" icon="ribbon-outline" variant="accent" onPress={() => { useSession.getState().clear(); router.dismissAll(); setTimeout(() => router.push({ pathname: '/certificate', params: { level: String(result.level) } }), 60); }} />
              ) : null}
              {result.mode !== 'placement' && (
                <Button title={gate && !result.passed ? 'Try again' : 'Play again'} variant="secondary" icon="refresh" onPress={retry} />
              )}
              {result.mode === 'lesson' && result.passed && useSession.getState().config?.nextLessonId ? <Button title="Back to Learn" variant="ghost" small onPress={leave} /> : null}
            </>
          )}
        </View>
      </Screen>
      {celebrate && <Confetti burst={1} />}
    </View>
  );
}

const styles = StyleSheet.create({
  statRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 20 },
  stat: { flex: 1, borderRadius: 18, borderWidth: 1, paddingVertical: 14, alignItems: 'center' },
  banner: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12, padding: 12 },
});
