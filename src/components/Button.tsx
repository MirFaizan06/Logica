import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { T } from './AppText';
import { alpha, shade, useTheme } from '@/theme/ThemeProvider';
import { haptic } from '@/services/haptics';

type Variant = 'primary' | 'secondary' | 'ghost' | 'success' | 'danger' | 'accent';

interface Props {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  icon?: keyof typeof Ionicons.glyphMap;
  iconRight?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  disabled?: boolean;
  small?: boolean;
  style?: StyleProp<ViewStyle>;
  full?: boolean;
}

export function Button({ title, onPress, variant = 'primary', icon, iconRight, loading, disabled, small, style, full = true }: Props) {
  const t = useTheme();
  const y = useSharedValue(0);
  const face = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  const edge = small ? 3 : 5;

  let colors: [string, string] = [t.primary, t.primary2];
  let edgeColor = shade(t.primary, -0.35);
  let textColor = t.onPrimary;
  if (variant === 'secondary') {
    colors = [t.card, t.card];
    edgeColor = t.border;
    textColor = t.primary;
  } else if (variant === 'success') {
    colors = [t.success, shade(t.success, 0.15)];
    edgeColor = shade(t.success, -0.35);
    textColor = t.dark ? '#04150C' : '#FFFFFF';
  } else if (variant === 'danger') {
    colors = [t.danger, shade(t.danger, 0.12)];
    edgeColor = shade(t.danger, -0.35);
    textColor = '#FFFFFF';
  } else if (variant === 'accent') {
    colors = [t.accent, t.accent2];
    edgeColor = shade(t.accent, -0.35);
    textColor = '#2A1300';
  } else if (variant === 'ghost') {
    colors = ['transparent', 'transparent'];
    edgeColor = 'transparent';
    textColor = t.primary;
  }

  const isDisabled = disabled || loading;
  const raised = variant !== 'ghost';

  return (
    <Pressable
      disabled={isDisabled}
      onPressIn={() => {
        if (raised) y.value = withTiming(edge - 1, { duration: 70 });
      }}
      onPressOut={() => {
        y.value = withTiming(0, { duration: 120 });
      }}
      onPress={() => {
        haptic.press();
        onPress?.();
      }}
      style={[full && styles.full, isDisabled && { opacity: 0.5 }, style]}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <View
        style={[
          { backgroundColor: edgeColor, borderRadius: small ? 14 : t.radius - 4, paddingBottom: raised ? edge : 0 },
          t.glow && variant === 'primary' && { boxShadow: `0px 0px 18px ${alpha(t.primary, 0.55)}` },
        ]}
      >
        <Animated.View style={face}>
          <LinearGradient
            colors={colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.face,
              {
                borderRadius: small ? 14 : t.radius - 4,
                paddingVertical: small ? 10 : 16,
                paddingHorizontal: small ? 16 : 22,
              },
              variant === 'secondary' && { borderWidth: 1.5, borderColor: t.border },
            ]}
          >
            {loading ? (
              <ActivityIndicator color={textColor} />
            ) : (
              <>
                {icon && <Ionicons name={icon} size={small ? 18 : 20} color={textColor} style={{ marginRight: 8 }} />}
                <T v="btn" c={textColor} style={small && { fontSize: 14 }}>
                  {title}
                </T>
                {iconRight && <Ionicons name={iconRight} size={small ? 18 : 20} color={textColor} style={{ marginLeft: 8 }} />}
              </>
            )}
          </LinearGradient>
        </Animated.View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  full: { alignSelf: 'stretch' },
  face: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
});
