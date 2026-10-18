import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { T } from './AppText';
import { Tap } from './Tap';
import { alpha, useTheme } from '@/theme/ThemeProvider';

export type IconName = keyof typeof Ionicons.glyphMap;

export function Icon({ name, size = 20, color }: { name: string; size?: number; color?: string }) {
  const t = useTheme();
  return <Ionicons name={name as IconName} size={size} color={color ?? t.text} />;
}

export function IconBadge({ name, color, size = 44, soft = true }: { name: string; color?: string; size?: number; soft?: boolean }) {
  const t = useTheme();
  const c = color ?? t.primary;
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.34,
        backgroundColor: soft ? alpha(c, t.dark ? 0.2 : 0.14) : c,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Ionicons name={name as IconName} size={size * 0.5} color={soft ? c : t.onPrimary} />
    </View>
  );
}

export function IconButton({
  name,
  onPress,
  size = 22,
  style,
  color,
  label,
}: {
  name: string;
  onPress: () => void;
  size?: number;
  style?: StyleProp<ViewStyle>;
  color?: string;
  label?: string;
}) {
  const t = useTheme();
  return (
    <Tap
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label ?? name}
      style={[{ width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', backgroundColor: t.card, borderWidth: 1, borderColor: t.border }, style]}
    >
      <Ionicons name={name as IconName} size={size} color={color ?? t.text} />
    </Tap>
  );
}

export function Header({ title, subtitle, back = true, right }: { title: string; subtitle?: string; back?: boolean; right?: React.ReactNode }) {
  return (
    <View style={styles.header}>
      {back ? <IconButton name="chevron-back" label="Back" onPress={() => (router.canGoBack() ? router.back() : router.replace('/learn'))} /> : null}
      <View style={{ flex: 1 }}>
        <T v="h2" numberOfLines={1}>
          {title}
        </T>
        {subtitle ? (
          <T v="small" c="muted" numberOfLines={1}>
            {subtitle}
          </T>
        ) : null}
      </View>
      {right}
    </View>
  );
}

export function SectionTitle({ children, right }: { children: string; right?: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <T v="h3">{children}</T>
      {right}
    </View>
  );
}

export function Pill({ icon, text, color }: { icon: string; text: string | number; color?: string }) {
  const t = useTheme();
  const c = color ?? t.primary;
  return (
    <View style={[styles.pill, { backgroundColor: alpha(c, t.dark ? 0.18 : 0.12), borderColor: alpha(c, 0.3) }]}>
      <Ionicons name={icon as IconName} size={16} color={c} />
      <T v="small" style={{ color: c, fontFamily: 'PlusJakartaSans_800ExtraBold' }}>
        {text}
      </T>
    </View>
  );
}

export function Segmented<K extends string | number>({
  options,
  value,
  onChange,
}: {
  options: { key: K; label: string; sub?: string }[];
  value: K;
  onChange: (k: K) => void;
}) {
  const t = useTheme();
  return (
    <View style={[styles.seg, { backgroundColor: alpha(t.textMuted, 0.14) }]}>
      {options.map((o) => {
        const on = o.key === value;
        return (
          <Tap key={String(o.key)} feedback="select" scale={0.97} onPress={() => onChange(o.key)} style={[styles.segItem, on && { backgroundColor: t.card, boxShadow: `0px 2px 8px ${alpha(t.shadow, 0.18)}` }]}>
            <T v="small" style={{ fontFamily: 'PlusJakartaSans_700Bold', color: on ? t.primary : t.textMuted }} center numberOfLines={1}>
              {o.label}
            </T>
            {o.sub ? (
              <T v="small" style={{ fontSize: 11, lineHeight: 14, color: on ? t.primary : t.textMuted, opacity: 0.8 }} center>
                {o.sub}
              </T>
            ) : null}
          </Tap>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8, marginBottom: 6 },
  section: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 22, marginBottom: 10 },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 99, borderWidth: 1 },
  seg: { flexDirection: 'row', padding: 4, borderRadius: 14, gap: 2 },
  segItem: { flex: 1, paddingVertical: 9, borderRadius: 11 },
});
