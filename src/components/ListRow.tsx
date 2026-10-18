import React from 'react';
import { Switch, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { T } from './AppText';
import { Tap } from './Tap';
import { IconBadge } from './ui';
import { alpha, useTheme } from '@/theme/ThemeProvider';

export function ListRow({
  icon,
  title,
  sub,
  onPress,
  color,
  right,
  chevron = true,
  last,
}: {
  icon: string;
  title: string;
  sub?: string;
  onPress?: () => void;
  color?: string;
  right?: React.ReactNode;
  chevron?: boolean;
  last?: boolean;
}) {
  const t = useTheme();
  const body = (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 14, borderBottomWidth: last ? 0 : 1, borderBottomColor: alpha(t.border, 0.8) }}>
      <IconBadge name={icon} color={color ?? t.primary} size={40} />
      <View style={{ flex: 1 }}>
        <T v="bodyB" style={{ fontSize: 15 }}>
          {title}
        </T>
        {sub ? (
          <T v="small" c="muted">
            {sub}
          </T>
        ) : null}
      </View>
      {right}
      {onPress && chevron ? <Ionicons name="chevron-forward" size={18} color={t.textMuted} /> : null}
    </View>
  );
  return onPress ? (
    <Tap onPress={onPress} feedback="tap" scale={0.99}>
      {body}
    </Tap>
  ) : (
    body
  );
}

export function ToggleRow({ icon, title, sub, value, onChange, color, last }: { icon: string; title: string; sub?: string; value: boolean; onChange: (v: boolean) => void; color?: string; last?: boolean }) {
  const t = useTheme();
  return (
    <ListRow
      icon={icon}
      title={title}
      sub={sub}
      color={color}
      last={last}
      chevron={false}
      right={<Switch value={value} onValueChange={onChange} trackColor={{ false: alpha(t.textMuted, 0.35), true: t.primary }} thumbColor="#FFFFFF" ios_backgroundColor={alpha(t.textMuted, 0.35)} />}
    />
  );
}

export function Group({ children }: { children: React.ReactNode }) {
  const t = useTheme();
  return (
    <View style={{ backgroundColor: t.card, borderRadius: t.radius, borderWidth: 1, borderColor: t.border, overflow: 'hidden' }}>{children}</View>
  );
}
