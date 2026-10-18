import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { T } from './AppText';
import { Tap } from './Tap';
import { alpha, useTheme } from '@/theme/ThemeProvider';

export function Chip({
  label,
  icon,
  color,
  emoji,
  onPress,
  active,
  style,
}: {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  emoji?: string;
  color?: string;
  onPress?: () => void;
  active?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const t = useTheme();
  const col = color ?? t.primary;
  const body = (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          paddingHorizontal: 12,
          paddingVertical: 7,
          borderRadius: 99,
          backgroundColor: active ? col : alpha(col, t.dark ? 0.18 : 0.12),
          borderWidth: 1,
          borderColor: active ? col : alpha(col, 0.35),
        },
        style,
      ]}
    >
      {emoji ? <T v="small">{emoji}</T> : null}
      {icon ? <Ionicons name={icon} size={15} color={active ? t.onPrimary : col} /> : null}
      <T v="small" c={active ? t.onPrimary : col} style={{ fontFamily: 'PlusJakartaSans_700Bold' }}>
        {label}
      </T>
    </View>
  );
  return onPress ? (
    <Tap onPress={onPress} feedback="select">
      {body}
    </Tap>
  ) : (
    body
  );
}
