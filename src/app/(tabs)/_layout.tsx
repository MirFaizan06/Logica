import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Tabs } from 'expo-router';
import Animated, { LinearTransition, FadeIn, FadeOut, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { T } from '@/components/AppText';
import { alpha, useTheme } from '@/theme/ThemeProvider';
import { haptic } from '@/services/haptics';

type TabBarProps = Parameters<NonNullable<React.ComponentProps<typeof Tabs>['tabBar']>>[0];

const TABS: Record<string, { label: string; icon: keyof typeof Ionicons.glyphMap; active: keyof typeof Ionicons.glyphMap }> = {
  learn: { label: 'Learn', icon: 'school-outline', active: 'school' },
  practice: { label: 'Practice', icon: 'barbell-outline', active: 'barbell' },
  lab: { label: 'Lab', icon: 'flask-outline', active: 'flask' },
  progress: { label: 'Progress', icon: 'stats-chart-outline', active: 'stats-chart' },
  me: { label: 'Me', icon: 'person-outline', active: 'person' },
};

function TabItem({ name, focused, onPress }: { name: string; focused: boolean; onPress: () => void }) {
  const t = useTheme();
  const meta = TABS[name];
  const s = useSharedValue(1);
  const press = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  if (!meta) return null;
  return (
    <Animated.View layout={LinearTransition.springify().damping(18).stiffness(220)} style={[press, focused ? { flexGrow: 1.7 } : { flexGrow: 1 }, { flexBasis: 0 }]}>
      <Pressable
        onPress={() => {
          haptic.select();
          onPress();
        }}
        onPressIn={() => (s.value = withSpring(0.9, { damping: 15, stiffness: 400 }))}
        onPressOut={() => (s.value = withSpring(1, { damping: 10, stiffness: 300 }))}
        accessibilityRole="tab"
        accessibilityLabel={meta.label}
        accessibilityState={{ selected: focused }}
        style={[styles.item, focused && { backgroundColor: alpha(t.primary, t.dark ? 0.22 : 0.14) }]}
      >
        <Ionicons name={focused ? meta.active : meta.icon} size={22} color={focused ? t.primary : t.textMuted} />
        {focused && (
          <Animated.View entering={FadeIn.duration(180)} exiting={FadeOut.duration(80)}>
            <T v="small" c="primary" style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', marginLeft: 6 }} numberOfLines={1}>
              {meta.label}
            </T>
          </Animated.View>
        )}
      </Pressable>
    </Animated.View>
  );
}

function TabBar({ state, navigateToTab }: TabBarProps) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 10) }]} pointerEvents="box-none">
      <View
        style={[
          styles.bar,
          {
            backgroundColor: t.tabBar,
            borderColor: t.border,
            borderRadius: 30,
            boxShadow: t.glow ? `0px 0px 24px ${alpha(t.primary, 0.35)}` : `0px 8px 28px ${alpha(t.shadow, t.dark ? 0.5 : 0.18)}`,
          },
        ]}
      >
        {state.routes.map((route, i) => (
          <TabItem key={route.key} name={route.name} focused={state.index === i} onPress={() => navigateToTab(route.key)} />
        ))}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="learn" />
      <Tabs.Screen name="practice" />
      <Tabs.Screen name="lab" />
      <Tabs.Screen name="progress" />
      <Tabs.Screen name="me" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 14 },
  bar: { flexDirection: 'row', alignItems: 'center', padding: 6, gap: 4, borderWidth: 1 },
  item: { height: 48, borderRadius: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
});
