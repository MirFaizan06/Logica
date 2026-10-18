import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Line, Polygon, Text as SvgText } from 'react-native-svg';
import { T } from './AppText';
import { alpha, FONT, useTheme } from '@/theme/ThemeProvider';
import { addDays, dayKey, parseDayKey } from '@/utils/date';

/* ------------------------------ bar chart ------------------------------ */

function Bar({ value, max, color, delay, height, highlight }: { value: number; max: number; color: string; delay: number; height: number; highlight: boolean }) {
  const h = useSharedValue(0);
  useEffect(() => {
    h.value = withDelay(delay, withTiming(max > 0 ? (value / max) * height : 0, { duration: 650, easing: Easing.out(Easing.cubic) }));
  }, [value, max, height, delay, h]);
  const style = useAnimatedStyle(() => ({ height: Math.max(h.value, value > 0 ? 6 : 3) }));
  return <Animated.View style={[{ width: '70%', borderRadius: 8, backgroundColor: value > 0 ? color : alpha(color, 0.25), opacity: highlight ? 1 : 0.85 }, style]} />;
}

export function BarChart({ data, height = 120, goal }: { data: { label: string; value: number; today?: boolean }[]; height?: number; goal?: number }) {
  const t = useTheme();
  const max = Math.max(1, ...data.map((d) => d.value), goal ?? 0);
  return (
    <View>
      <View style={{ height, flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}>
        {goal ? (
          <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, bottom: (goal / max) * height, borderTopWidth: 1.5, borderStyle: 'dashed', borderColor: alpha(t.accent, 0.7) }} />
        ) : null}
        {data.map((d, i) => (
          <View key={i} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
            {d.value > 0 && data.length <= 10 ? (
              <T v="small" c="muted" style={{ fontSize: 10.5, marginBottom: 2, fontFamily: FONT.bold }}>
                {d.value}
              </T>
            ) : null}
            <Bar value={d.value} max={max} height={height - 18} color={d.today ? t.accent : t.primary} delay={i * 40} highlight={!!d.today} />
          </View>
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: 4, marginTop: 6 }}>
        {data.map((d, i) => (
          <T key={i} v="small" c={d.today ? 'accent' : 'muted'} center style={{ flex: 1, fontSize: 11, fontFamily: d.today ? FONT.heavy : FONT.medium }}>
            {d.label}
          </T>
        ))}
      </View>
    </View>
  );
}

/* ------------------------------ radar ------------------------------ */

export function Radar({ axes, size = 260 }: { axes: { label: string; value: number }[]; size?: number }) {
  const t = useTheme();
  const s = useSharedValue(0.2);
  useEffect(() => {
    s.value = withSpring(1, { damping: 14, stiffness: 90 });
  }, [s]);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: s.value }], opacity: Math.min(1, s.value * 1.2) }));
  const n = axes.length;
  const c = size / 2;
  const r = size / 2 - 42;
  const pt = (i: number, v: number) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [c + Math.cos(a) * r * v, c + Math.sin(a) * r * v] as const;
  };
  const ring = (v: number) => axes.map((_, i) => pt(i, v).join(',')).join(' ');
  const shape = axes.map((a, i) => pt(i, Math.max(0.04, a.value)).join(',')).join(' ');
  return (
    <View style={{ alignItems: 'center' }}>
      <Svg width={size} height={size}>
        {[0.25, 0.5, 0.75, 1].map((v) => (
          <Polygon key={v} points={ring(v)} fill="none" stroke={alpha(t.textMuted, 0.3)} strokeWidth={1} />
        ))}
        {axes.map((_, i) => {
          const [x, y] = pt(i, 1);
          return <Line key={i} x1={c} y1={c} x2={x} y2={y} stroke={alpha(t.textMuted, 0.25)} strokeWidth={1} />;
        })}
        {axes.map((a, i) => {
          const [x, y] = pt(i, 1.2);
          return (
            <SvgText key={a.label} x={x} y={y + 4} fontSize={11.5} fontFamily={FONT.bold} fill={t.textMuted} textAnchor="middle">
              {a.label}
            </SvgText>
          );
        })}
      </Svg>
      <Animated.View style={[{ position: 'absolute', top: 0 }, anim]}>
        <Svg width={size} height={size}>
          <Polygon points={shape} fill={alpha(t.primary, 0.28)} stroke={t.primary} strokeWidth={2.5} strokeLinejoin="round" />
          {axes.map((a, i) => {
            const [x, y] = pt(i, Math.max(0.04, a.value));
            return <Circle key={i} cx={x} cy={y} r={4} fill={t.primary} stroke={t.card} strokeWidth={2} />;
          })}
        </Svg>
      </Animated.View>
    </View>
  );
}

/* ------------------------------ heatmap ------------------------------ */

export function Heatmap({ daily, weeks = 12, goal }: { daily: Record<string, number>; weeks?: number; goal: number }) {
  const t = useTheme();
  const today = dayKey();
  // align so the last column ends on today's weekday
  const dow = parseDayKey(today).getDay();
  const total = weeks * 7;
  const start = addDays(today, -(total - 1 - (6 - dow)));
  const cols: string[][] = [];
  for (let w = 0; w < weeks; w++) {
    const col: string[] = [];
    for (let d = 0; d < 7; d++) col.push(addDays(start, w * 7 + d));
    cols.push(col);
  }
  const color = (xp: number) => {
    if (xp <= 0) return alpha(t.textMuted, 0.15);
    const r = Math.min(1, xp / Math.max(goal, 1));
    return alpha(t.success, 0.3 + r * 0.7);
  };
  return (
    <View style={{ flexDirection: 'row', gap: 4, justifyContent: 'space-between' }}>
      {cols.map((col, ci) => (
        <View key={ci} style={{ gap: 4, flex: 1 }}>
          {col.map((d) => (
            <View
              key={d}
              style={{
                aspectRatio: 1,
                borderRadius: 4,
                backgroundColor: d > today ? 'transparent' : color(daily[d] ?? 0),
                borderWidth: d === today ? 2 : 0,
                borderColor: t.accent,
              }}
            />
          ))}
        </View>
      ))}
    </View>
  );
}
