import React, { useEffect, useState } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { alpha, useTheme } from '@/theme/ThemeProvider';

export function ProgressBar({
  value,
  height = 12,
  colors,
  track,
  style,
  delay = 0,
}: {
  value: number; // 0..1
  height?: number;
  colors?: [string, string];
  track?: string;
  style?: StyleProp<ViewStyle>;
  delay?: number;
}) {
  const t = useTheme();
  const w = useSharedValue(0);
  useEffect(() => {
    w.value = withDelay(delay, withTiming(Math.max(0, Math.min(1, value)), { duration: 700, easing: Easing.out(Easing.cubic) }));
  }, [value, delay, w]);
  const a = useAnimatedStyle(() => ({ width: `${w.value * 100}%` }));
  return (
    <View
      style={[
        { height, borderRadius: height, backgroundColor: track ?? alpha(t.textMuted, 0.2), overflow: 'hidden' },
        style,
      ]}
    >
      <Animated.View style={[{ height: '100%', borderRadius: height, overflow: 'hidden' }, a]}>
        <LinearGradient
          colors={colors ?? [t.primary, t.primary2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1 }}
        />
      </Animated.View>
    </View>
  );
}

const ACircle = Animated.createAnimatedComponent(Circle);

export function ProgressRing({
  value,
  size = 96,
  stroke = 10,
  colors,
  children,
  track,
  duration = 900,
}: {
  value: number;
  size?: number;
  stroke?: number;
  colors?: [string, string];
  children?: React.ReactNode;
  track?: string;
  duration?: number;
}) {
  const t = useTheme();
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withTiming(Math.max(0, Math.min(1, value)), { duration, easing: Easing.out(Easing.cubic) });
  }, [value, duration, p]);
  const props = useAnimatedProps(() => ({ strokeDashoffset: c * (1 - p.value) }));
  const [id] = useState(() => 'g' + Math.random().toString(36).slice(2, 8));
  const cols = colors ?? [t.primary, t.primary2];
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
        <Defs>
          <SvgGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={cols[0]} />
            <Stop offset="1" stopColor={cols[1]} />
          </SvgGradient>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={track ?? alpha(t.textMuted, 0.2)} strokeWidth={stroke} fill="none" />
        <ACircle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={`url(#${id})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          animatedProps={props}
        />
      </Svg>
      {children}
    </View>
  );
}
