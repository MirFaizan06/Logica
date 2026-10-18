import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { T } from '@/components/AppText';
import { Avatar } from '@/components/Avatar';
import { Group, ListRow } from '@/components/ListRow';
import { ProgressBar } from '@/components/Progress';
import { Tap } from '@/components/Tap';
import { SectionTitle } from '@/components/ui';
import { toast } from '@/components/Toast';
import { ACHIEVEMENTS } from '@/content/achievements';
import { levelProgress, rankForLevel, useStore } from '@/store';
import { THEME_ORDER, THEMES } from '@/theme/themes';
import { alpha, FONT, useTheme } from '@/theme/ThemeProvider';
import { startPlacement } from '@/services/sessions';
import { currentVersion } from '@/services/updates';

export default function Me() {
  const t = useTheme();
  const profile = useStore((s) => s.profile);
  const settings = useStore((s) => s.settings);
  const progress = useStore((s) => s.progress);
  const achievements = useStore((s) => s.achievements);
  const setSettings = useStore((s) => s.setSettings);
  const lvl = levelProgress(progress.xp);

  return (
    <Screen scroll bottom={120}>
      <Animated.View entering={FadeInDown.duration(400)}>
        <LinearGradient colors={[t.primary, t.primary2]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.hero, { borderRadius: t.radius + 4, boxShadow: `0px 12px 30px ${alpha(t.primary, 0.4)}` }]}>
          <View style={styles.avatarRing}>
            <Avatar id={profile.avatar} size={72} />
          </View>
          <View style={{ flex: 1 }}>
            <T v="title" style={{ color: t.onPrimary }} numberOfLines={1}>
              {profile.name || 'Learner'}
            </T>
            <T v="small" style={{ color: alpha(t.onPrimary, 0.85) }}>
              Level {lvl.level} · {rankForLevel(lvl.level)}
            </T>
            <View style={{ marginTop: 10 }}>
              <ProgressBar value={lvl.pct} height={9} colors={['#FFFFFF', '#FFFFFF']} track="rgba(255,255,255,0.28)" />
              <T v="small" style={{ color: alpha(t.onPrimary, 0.8), marginTop: 4, fontSize: 12 }}>
                {lvl.into} / {lvl.need} XP to level {lvl.level + 1}
              </T>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      <SectionTitle>Appearance</SectionTitle>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingRight: 8 }}>
        {[...THEME_ORDER, 'auto' as const].map((id) => {
          const th = id === 'auto' ? null : THEMES[id];
          const owned = id === 'auto' || progress.unlockedThemes.includes(id);
          const on = settings.theme === id;
          return (
            <Tap
              key={id}
              feedback="select"
              scale={0.94}
              onPress={() => {
                if (!owned) {
                  toast(`Unlock ${th?.name} in the shop (${th?.price} gems).`, 'lock-closed-outline');
                  router.push('/shop');
                  return;
                }
                setSettings({ theme: id });
              }}
              style={[styles.themeChip, { borderColor: on ? t.primary : t.border, backgroundColor: t.card }]}
            >
              <View style={[styles.swatch, { backgroundColor: th ? th.bg : t.card2, borderColor: th ? th.border : t.border }]}>
                {th ? (
                  <>
                    <View style={[styles.swatchDot, { backgroundColor: th.primary }]} />
                    <View style={[styles.swatchDot, { backgroundColor: th.accent }]} />
                  </>
                ) : (
                  <Ionicons name="contrast-outline" size={20} color={t.textMuted} />
                )}
                {!owned && (
                  <View style={styles.lock}>
                    <Ionicons name="lock-closed" size={16} color="#fff" />
                  </View>
                )}
              </View>
              <T v="small" style={{ fontFamily: FONT.bold, fontSize: 12 }} numberOfLines={1}>
                {th ? th.name.split(' ')[0] : 'Auto'}
              </T>
            </Tap>
          );
        })}
      </ScrollView>

      <SectionTitle>You</SectionTitle>
      <Group>
        <ListRow icon="trophy" color={t.accent} title="Achievements" sub={`${Object.keys(achievements).length} of ${ACHIEVEMENTS.length} unlocked`} onPress={() => router.push('/achievements')} />
        <ListRow icon="diamond" color={t.info} title="Gem shop" sub={`${progress.gems} gems · themes and streak freezes`} onPress={() => router.push('/shop')} />
        <ListRow icon="compass" color={t.success} title="Retake placement test" sub="Re-check where you should start" onPress={() => startPlacement()} last />
      </Group>

      <SectionTitle>App</SectionTitle>
      <Group>
        <ListRow icon="settings" color={t.primary2} title="Settings" sub="Goals, reminders, backup, updates" onPress={() => router.push('/settings')} />
        <ListRow icon="information-circle" color={t.info} title="About Logica" sub={`Version ${currentVersion()} · Tech Bytes Design`} onPress={() => router.push('/about')} last />
      </Group>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 18 },
  avatarRing: { padding: 4, borderRadius: 44, backgroundColor: 'rgba(255,255,255,0.35)' },
  themeChip: { width: 82, borderWidth: 2, borderRadius: 18, padding: 8, alignItems: 'center', gap: 6 },
  swatch: { width: 58, height: 44, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 4, overflow: 'hidden' },
  swatchDot: { width: 14, height: 14, borderRadius: 7 },
  lock: { ...({ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 } as const), backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
});
