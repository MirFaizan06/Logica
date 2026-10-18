import React, { useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { useStore } from '@/store';
import { useTheme } from '@/theme/ThemeProvider';

interface PieceSpec {
  x: number;
  delay: number;
  dur: number;
  size: number;
  drift: number;
  spin: number;
  color: string;
  round: boolean;
}

function Piece({ spec, h }: { spec: PieceSpec; h: number }) {
  const p = useSharedValue(0);
  React.useEffect(() => {
    p.value = withDelay(spec.delay, withTiming(1, { duration: spec.dur, easing: Easing.in(Easing.quad) }));
  }, [p, spec.delay, spec.dur]);
  const style = useAnimatedStyle(() => ({
    opacity: p.value < 0.85 ? 1 : (1 - p.value) / 0.15,
    transform: [
      { translateX: Math.sin(p.value * 9) * spec.drift },
      { translateY: -30 + p.value * (h + 60) },
      { rotate: `${p.value * spec.spin}deg` },
      { rotateX: `${p.value * spec.spin * 1.3}deg` },
    ],
  }));
  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: spec.x,
          top: 0,
          width: spec.size,
          height: spec.round ? spec.size : spec.size * 0.5,
          borderRadius: spec.round ? spec.size : 2,
          backgroundColor: spec.color,
        },
        style,
      ]}
    />
  );
}

function Burst({ count }: { count: number }) {
  const t = useTheme();
  const { width, height } = useWindowDimensions();
  // generated once per burst (the parent re-keys this component to replay)
  const [specs] = useState<PieceSpec[]>(() => {
    const palette = [t.primary, t.primary2, t.accent, t.accent2, t.success, t.info, '#FFFFFF'];
    return Array.from({ length: count }, () => ({
      x: Math.random() * width,
      delay: Math.random() * 500,
      dur: 1800 + Math.random() * 1400,
      size: 7 + Math.random() * 8,
      drift: 10 + Math.random() * 26,
      spin: 360 + Math.random() * 900,
      color: palette[Math.floor(Math.random() * palette.length)],
      round: Math.random() < 0.35,
    }));
  });
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {specs.map((s, i) => (
        <Piece key={i} spec={s} h={height} />
      ))}
    </View>
  );
}

/** Falling confetti overlay. Pass a changing `burst` key to replay. */
export function Confetti({ count = 46, burst = 0 }: { count?: number; burst?: number }) {
  const reduce = useStore((s) => s.settings.reduceMotion);
  if (reduce) return null;
  return <Burst key={burst} count={count} />;
}
