import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { StatsBar } from '@/components/StatsBar';
import { T } from '@/components/AppText';
import { Card } from '@/components/Card';
import { Tap } from '@/components/Tap';
import { Icon, IconBadge, SectionTitle, Segmented } from '@/components/ui';
import { toast } from '@/components/Toast';
import { useStore } from '@/store';
import { UNITS } from '@/content/curriculum';
import { LEVEL_NAMES, type Level } from '@/content/types';
import { CARDS } from '@/content/library';
import { startDaily, startFallacyGame, startMistakes, startPractice, startSpeed } from '@/services/sessions';
import { alpha, FONT, useTheme } from '@/theme/ThemeProvider';
import { unitColor } from '@/utils/color';
import { dayKey } from '@/utils/date';

function ModeCard({
  icon,
  title,
  sub,
  color,
  onPress,
  badge,
  delay,
}: {
  icon: string;
  title: string;
  sub: string;
  color: string;
  onPress: () => void;
  badge?: string | number;
  delay: number;
}) {
  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(380)} style={{ width: '48.5%' }}>
      <Card onPress={onPress} style={{ gap: 10, minHeight: 128 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <IconBadge name={icon} color={color} size={46} />
          {badge !== undefined && (
            <View style={[styles.badge, { backgroundColor: alpha(color, 0.18) }]}>
              <T v="small" style={{ color, fontFamily: FONT.heavy }}>
                {badge}
              </T>
            </View>
          )}
        </View>
        <View>
          <T v="bodyB">{title}</T>
          <T v="small" c="muted">
            {sub}
          </T>
        </View>
      </Card>
    </Animated.View>
  );
}

export default function Practice() {
  const t = useTheme();
  const stats = useStore((s) => s.stats);
  const mistakes = useStore((s) => s.mistakes);
  const cards = useStore((s) => s.cards);
  const startLevel = useStore((s) => s.profile.startLevel);
  const [level, setLevel] = useState<Level>(startLevel);
  const today = dayKey();
  const dailyScore = stats.dailyChallenges[today];
  const dailyDone = dailyScore !== undefined;
  const dueCards = CARDS.filter((c) => !cards[c.id] || cards[c.id].due <= today).length;

  return (
    <Screen scroll bottom={120}>
      <StatsBar title="Practice" subtitle="Sharpen your skills" />

      <Animated.View entering={FadeInDown.duration(420)}>
        <LinearGradient
          colors={[t.accent, t.accent2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.daily, { borderRadius: t.radius + 4, boxShadow: `0px 12px 28px ${alpha(t.accent, 0.4)}` }]}
        >
          <View style={{ flex: 1 }}>
            <T v="caption" style={{ color: 'rgba(30,15,0,0.65)' }}>
              Daily challenge
            </T>
            <T v="h2" style={{ color: '#2A1300', marginTop: 4 }}>
              {dailyDone ? `You scored ${dailyScore}/5 today` : 'Five fresh questions'}
            </T>
            <T v="small" style={{ color: 'rgba(30,15,0,0.7)', marginTop: 2 }}>
              {dailyDone ? 'Come back tomorrow for a new set.' : 'The same set for everyone, every day. Bonus gems for finishing.'}
            </T>
            <Tap onPress={() => startDaily()} feedback="press" style={[styles.dailyBtn, { backgroundColor: '#2A1300' }]}>
              <T v="btn" style={{ color: t.accent2, fontSize: 15 }}>
                {dailyDone ? 'Play again' : 'Play now'}
              </T>
              <Ionicons name="arrow-forward" size={16} color={t.accent2} />
            </Tap>
          </View>
          <Ionicons name="sunny" size={64} color="rgba(255,255,255,0.55)" />
        </LinearGradient>
      </Animated.View>

      <SectionTitle>Game modes</SectionTitle>
      <View style={styles.grid}>
        <ModeCard icon="flash" title="Speed round" sub={stats.speedBest ? `Best score ${stats.speedBest}` : '60 seconds, go!'} color={t.accent} onPress={() => startSpeed()} delay={80} />
        <ModeCard icon="search" title="Fallacy detective" sub="Name the flaw" color={t.danger} onPress={() => startFallacyGame()} delay={140} />
        <ModeCard
          icon="refresh"
          title="Mistakes review"
          sub={mistakes.length ? 'Fix what tripped you up' : 'Nothing to fix. Nice!'}
          color={t.info}
          badge={mistakes.length || undefined}
          onPress={() => (mistakes.length ? startMistakes() : toast('No mistakes saved yet. Keep learning!', 'happy-outline'))}
          delay={200}
        />
        <ModeCard icon="albums" title="Flashcards" sub="Terms, symbols, fallacies" color={t.success} badge={dueCards} onPress={() => router.push('/flashcards')} delay={260} />
      </View>

      <SectionTitle>Practice by topic</SectionTitle>
      <Segmented
        options={([0, 1, 2] as Level[]).map((l) => ({ key: l, label: LEVEL_NAMES[l] }))}
        value={level}
        onChange={setLevel}
      />
      <View style={{ gap: 10, marginTop: 12 }}>
        <Card onPress={() => startPractice({ level })} tone="primarySoft" style={styles.topic}>
          <IconBadge name="shuffle" color={t.primary} size={44} />
          <View style={{ flex: 1 }}>
            <T v="bodyB">{LEVEL_NAMES[level]} mix</T>
            <T v="small" c="muted">
              10 questions from every unit in this level
            </T>
          </View>
          <Ionicons name="chevron-forward" size={18} color={t.textMuted} />
        </Card>
        {UNITS.filter((u) => u.level === level).map((u) => {
          const c = unitColor(u.hue, t.dark);
          const s = stats.byUnit[u.id];
          const acc = s && s.a ? Math.round((s.c / s.a) * 100) : null;
          return (
            <Card key={u.id} onPress={() => startPractice({ unitId: u.id })} style={styles.topic}>
              <IconBadge name={u.icon} color={c} size={44} />
              <View style={{ flex: 1 }}>
                <T v="bodyB" numberOfLines={1}>
                  {u.title}
                </T>
                <T v="small" c="muted">
                  {acc === null ? 'Not practised yet' : `${acc}% accuracy · ${s.a} answered`}
                </T>
              </View>
              <Icon name="play-circle-outline" size={26} color={c} />
            </Card>
          );
        })}
      </View>
      <Card onPress={() => startPractice({ level: 'all' })} style={[styles.topic, { marginTop: 10 }]}>
        <IconBadge name="infinite" color={t.accent} size={44} />
        <View style={{ flex: 1 }}>
          <T v="bodyB">Everything, shuffled</T>
          <T v="small" c="muted">
            {`A random mix from all ${UNITS.length} units`}
          </T>
        </View>
        <Ionicons name="chevron-forward" size={18} color={t.textMuted} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  daily: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 18 },
  dailyBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start', marginTop: 12, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12 },
  badge: { minWidth: 30, height: 28, paddingHorizontal: 8, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  topic: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 },
});
