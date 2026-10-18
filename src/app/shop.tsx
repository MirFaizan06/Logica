import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { T } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Confetti } from '@/components/Confetti';
import { Sheet } from '@/components/Sheet';
import { Tap } from '@/components/Tap';
import { Header, IconBadge, Pill, SectionTitle } from '@/components/ui';
import { toast } from '@/components/Toast';
import { useStore } from '@/store';
import { THEME_ORDER, THEMES, type ThemeId } from '@/theme/themes';
import { alpha, FONT, useTheme } from '@/theme/ThemeProvider';
import { haptic } from '@/services/haptics';

const FREEZE_PRICE = 30;

export default function Shop() {
  const t = useTheme();
  const progress = useStore((s) => s.progress);
  const settings = useStore((s) => s.settings);
  const buyTheme = useStore((s) => s.buyTheme);
  const buyFreeze = useStore((s) => s.buyFreeze);
  const setSettings = useStore((s) => s.setSettings);
  const [pending, setPending] = useState<ThemeId | null>(null);
  const [burst, setBurst] = useState(0);

  const pend = pending ? THEMES[pending] : null;

  const confirmBuy = () => {
    if (!pend) return;
    const ok = buyTheme(pend.id, pend.price);
    if (ok) {
      haptic.success();
      setSettings({ theme: pend.id });
      setBurst((b) => b + 1);
      toast(`${pend.name} unlocked and applied`, 'checkmark-circle-outline');
    } else {
      haptic.error();
      toast('Not enough gems yet. Keep learning to earn more.', 'diamond-outline');
    }
    setPending(null);
  };

  return (
    <View style={{ flex: 1 }}>
      <Screen scroll bottom={30}>
        <Header title="Gem shop" right={<Pill icon="diamond" text={progress.gems} color={t.info} />} />
        <T v="body" c="muted">
          Earn gems from lessons (5 each), perfect scores, unit tests (20), exams (50), daily goals (10) and achievements (15).
        </T>

        <SectionTitle>Streak freeze</SectionTitle>
        <Card style={styles.row}>
          <IconBadge name="snow" color={t.info} size={52} />
          <View style={{ flex: 1 }}>
            <T v="bodyB">Streak freeze</T>
            <T v="small" c="muted">
              Protects your streak for one missed day. You own {progress.freezes} (max 3).
            </T>
          </View>
          <View style={{ width: 96 }}>
            <Button
              title={`${FREEZE_PRICE}`}
              icon="diamond"
              small
              variant="secondary"
              disabled={progress.freezes >= 3}
              onPress={() => {
                if (buyFreeze(FREEZE_PRICE)) {
                  haptic.success();
                  toast('Streak freeze added', 'snow-outline');
                } else {
                  haptic.error();
                  toast(progress.freezes >= 3 ? 'You already hold the maximum.' : 'Not enough gems yet.', 'diamond-outline');
                }
              }}
            />
          </View>
        </Card>

        <SectionTitle>Themes</SectionTitle>
        <View style={styles.grid}>
          {THEME_ORDER.map((id, i) => {
            const th = THEMES[id];
            const owned = progress.unlockedThemes.includes(id);
            const active = settings.theme === id;
            return (
              <Animated.View key={id} entering={FadeInDown.delay(i * 60).duration(340)} style={{ width: '48%' }}>
                <Tap
                  feedback="tap"
                  scale={0.97}
                  onPress={() => (owned ? setSettings({ theme: id }) : setPending(id))}
                  style={[styles.themeCard, { backgroundColor: t.card, borderColor: active ? t.primary : t.border, borderRadius: t.radius - 2 }]}
                >
                  <View style={[styles.preview, { backgroundColor: th.bg, borderColor: th.border }]}>
                    <View style={[styles.bar, { backgroundColor: th.primary }]} />
                    <View style={[styles.mini, { backgroundColor: th.card, borderColor: th.border }]} />
                    <View style={{ flexDirection: 'row', gap: 4 }}>
                      <View style={[styles.dot, { backgroundColor: th.primary2 }]} />
                      <View style={[styles.dot, { backgroundColor: th.accent }]} />
                      <View style={[styles.dot, { backgroundColor: th.success }]} />
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                    <View style={{ flex: 1 }}>
                      <T v="bodyB" numberOfLines={1} style={{ fontSize: 14.5 }}>
                        {th.name}
                      </T>
                      <T v="small" c="muted" numberOfLines={1} style={{ fontSize: 11.5 }}>
                        {th.tagline}
                      </T>
                    </View>
                  </View>
                  <View style={{ marginTop: 8 }}>
                    {owned ? (
                      <View style={[styles.tag, { backgroundColor: alpha(active ? t.primary : t.success, 0.16) }]}>
                        <Ionicons name={active ? 'checkmark-circle' : 'checkmark'} size={14} color={active ? t.primary : t.success} />
                        <T v="small" style={{ color: active ? t.primary : t.success, fontFamily: FONT.heavy, fontSize: 12 }}>
                          {active ? 'In use' : 'Owned'}
                        </T>
                      </View>
                    ) : (
                      <View style={[styles.tag, { backgroundColor: alpha(t.info, 0.16) }]}>
                        <Ionicons name="diamond" size={13} color={t.info} />
                        <T v="small" style={{ color: t.info, fontFamily: FONT.heavy, fontSize: 12 }}>
                          {th.price}
                        </T>
                      </View>
                    )}
                  </View>
                </Tap>
              </Animated.View>
            );
          })}
        </View>
      </Screen>

      <Sheet visible={!!pend} onClose={() => setPending(null)} center>
        {pend && (
          <View style={{ alignItems: 'center', gap: 10 }}>
            <Animated.View entering={ZoomIn.duration(300)} style={[styles.bigPreview, { backgroundColor: pend.bg, borderColor: pend.border }]}>
              <View style={[styles.bar, { backgroundColor: pend.primary, width: '55%' }]} />
              <View style={[styles.mini, { backgroundColor: pend.card, borderColor: pend.border, height: 34 }]} />
              <View style={{ flexDirection: 'row', gap: 6 }}>
                <View style={[styles.dot, { backgroundColor: pend.primary2 }]} />
                <View style={[styles.dot, { backgroundColor: pend.accent }]} />
                <View style={[styles.dot, { backgroundColor: pend.success }]} />
              </View>
            </Animated.View>
            <T v="h2" center>
              Unlock {pend.name}?
            </T>
            <T v="body" c="muted" center>
              {pend.tagline}
            </T>
            <View style={{ alignSelf: 'stretch', gap: 8, marginTop: 6 }}>
              <Button title={`Unlock for ${pend.price} gems`} icon="diamond" disabled={progress.gems < pend.price} onPress={confirmBuy} />
              {progress.gems < pend.price && (
                <T v="small" c="danger" center>
                  You need {pend.price - progress.gems} more gems.
                </T>
              )}
              <Button title="Not now" variant="ghost" small onPress={() => setPending(null)} />
            </View>
          </View>
        )}
      </Sheet>
      {burst > 0 && <Confetti burst={burst} />}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12 },
  themeCard: { padding: 10, borderWidth: 2 },
  preview: { height: 78, borderRadius: 12, borderWidth: 1, padding: 8, gap: 5 },
  bigPreview: { width: 190, height: 120, borderRadius: 18, borderWidth: 1, padding: 14, gap: 8 },
  bar: { height: 9, borderRadius: 5, width: '60%' },
  mini: { height: 22, borderRadius: 7, borderWidth: 1 },
  dot: { width: 11, height: 11, borderRadius: 6 },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 99 },
});
