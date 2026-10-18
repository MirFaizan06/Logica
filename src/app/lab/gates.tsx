import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import { Screen } from '@/components/Screen';
import { T } from '@/components/AppText';
import { Card } from '@/components/Card';
import { Tap } from '@/components/Tap';
import { Header } from '@/components/ui';
import { alpha, FONT, useTheme } from '@/theme/ThemeProvider';
import { useStore } from '@/store';

type GateId = 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR' | 'XNOR';
const GATES: { id: GateId; unary?: boolean; fn: (a: boolean, b: boolean) => boolean; expr: string; blurb: string }[] = [
  { id: 'AND', fn: (a, b) => a && b, expr: 'A · B', blurb: 'Output is 1 only when both inputs are 1.' },
  { id: 'OR', fn: (a, b) => a || b, expr: 'A + B', blurb: 'Output is 1 when at least one input is 1.' },
  { id: 'NOT', unary: true, fn: (a) => !a, expr: "A'", blurb: 'Flips its input.' },
  { id: 'NAND', fn: (a, b) => !(a && b), expr: "(A · B)'", blurb: 'AND followed by NOT. A universal gate.' },
  { id: 'NOR', fn: (a, b) => !(a || b), expr: "(A + B)'", blurb: 'OR followed by NOT. Also universal.' },
  { id: 'XOR', fn: (a, b) => a !== b, expr: 'A ⊕ B', blurb: 'Output is 1 when the inputs differ.' },
  { id: 'XNOR', fn: (a, b) => a === b, expr: '(A ⊕ B)\'', blurb: 'Output is 1 when the inputs are equal.' },
];

function Switch({ label, on, onToggle }: { label: string; on: boolean; onToggle: () => void }) {
  const t = useTheme();
  const x = useSharedValue(on ? 1 : 0);
  useEffect(() => {
    x.value = withSpring(on ? 1 : 0, { damping: 14, stiffness: 220 });
  }, [on, x]);
  const knob = useAnimatedStyle(() => ({ transform: [{ translateX: x.value * 30 }] }));
  return (
    <Tap onPress={onToggle} feedback="select" scale={0.94} style={{ alignItems: 'center', gap: 6 }}>
      <T v="caption" c="muted">
        Input {label}
      </T>
      <View style={[styles.track, { backgroundColor: on ? t.success : alpha(t.textMuted, 0.3) }]}>
        <Animated.View style={[styles.knob, knob]}>
          <T v="small" style={{ color: on ? t.success : t.textMuted, fontFamily: FONT.heavy }}>
            {on ? '1' : '0'}
          </T>
        </Animated.View>
      </View>
    </Tap>
  );
}

function GateDiagram({ gate, a, b, out }: { gate: GateId; a: boolean; b: boolean; out: boolean }) {
  const t = useTheme();
  const on = t.success;
  const off = alpha(t.textMuted, 0.5);
  const unary = gate === 'NOT';
  const inv = gate === 'NAND' || gate === 'NOR' || gate === 'XNOR' || gate === 'NOT';
  // body path by family
  let body = 'M 90 20 L 90 100 Q 150 100 170 60 Q 150 20 90 20 Z'; // AND shape
  if (gate === 'OR' || gate === 'NOR') body = 'M 80 20 Q 140 20 175 60 Q 140 100 80 100 Q 105 60 80 20 Z';
  if (gate === 'XOR' || gate === 'XNOR') body = 'M 90 20 Q 145 20 178 60 Q 145 100 90 100 Q 115 60 90 20 Z';
  if (gate === 'NOT') body = 'M 95 25 L 95 95 L 160 60 Z';
  const outX = inv ? 190 : 176;
  return (
    <Svg width="100%" height={150} viewBox="0 0 300 120">
      <Line x1={20} y1={unary ? 60 : 42} x2={unary ? 95 : 90} y2={unary ? 60 : 42} stroke={a ? on : off} strokeWidth={4} strokeLinecap="round" />
      {!unary && <Line x1={20} y1={78} x2={90} y2={78} stroke={b ? on : off} strokeWidth={4} strokeLinecap="round" />}
      <Path d={body} fill={alpha(t.primary, 0.14)} stroke={t.primary} strokeWidth={3} strokeLinejoin="round" />
      {(gate === 'XOR' || gate === 'XNOR') && <Path d="M 78 20 Q 103 60 78 100" fill="none" stroke={t.primary} strokeWidth={3} />}
      {inv && <Circle cx={gate === 'NOT' ? 167 : 183} cy={60} r={6} fill={t.card} stroke={t.primary} strokeWidth={3} />}
      <Line x1={outX} y1={60} x2={260} y2={60} stroke={out ? on : off} strokeWidth={4} strokeLinecap="round" />
      <Circle cx={272} cy={60} r={13} fill={out ? on : t.card2} stroke={out ? on : off} strokeWidth={3} />
    </Svg>
  );
}

export default function Gates() {
  const t = useTheme();
  const [id, setId] = useState<GateId>('AND');
  const [a, setA] = useState(false);
  const [b, setB] = useState(false);
  const noteLabUse = useStore((s) => s.noteLabUse);
  const gate = GATES.find((g) => g.id === id)!;
  const out = gate.fn(a, b);
  const glow = useSharedValue(out ? 1 : 0);
  useEffect(() => {
    glow.value = withTiming(out ? 1 : 0, { duration: 250 });
  }, [out, glow]);
  const glowStyle = useAnimatedStyle(() => ({ opacity: 0.25 + glow.value * 0.75 }));

  useEffect(() => {
    const timer = setTimeout(noteLabUse, 3000);
    return () => clearTimeout(timer);
  }, [noteLabUse]);

  const rows = gate.unary ? [false, true].map((x) => [x, false] as const) : ([false, true] as const).flatMap((x) => ([false, true] as const).map((y) => [x, y] as const));

  return (
    <Screen scroll bottom={30}>
      <Header title="Logic Gates" subtitle="Toggle the inputs, watch the output" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {GATES.map((g) => {
          const on = g.id === id;
          return (
            <Tap key={g.id} feedback="select" scale={0.94} onPress={() => setId(g.id)} style={[styles.gateBtn, { borderColor: on ? t.primary : t.border, backgroundColor: on ? alpha(t.primary, 0.16) : t.card }]}>
              <T v="bodyB" style={{ color: on ? t.primary : t.textMuted, fontFamily: FONT.heavy }}>
                {g.id}
              </T>
            </Tap>
          );
        })}
      </ScrollView>

      <Card style={{ marginTop: 16, alignItems: 'center' }}>
        <GateDiagram gate={id} a={a} b={b} out={out} />
        <View style={{ flexDirection: 'row', gap: 36, marginTop: 4 }}>
          <Switch label="A" on={a} onToggle={() => setA(!a)} />
          {!gate.unary && <Switch label="B" on={b} onToggle={() => setB(!b)} />}
        </View>
        <Animated.View style={[styles.out, { backgroundColor: out ? t.success : t.card2, borderColor: out ? t.success : t.border }, glowStyle]}>
          <T v="bodyB" style={{ color: out ? '#04150C' : t.textMuted }}>
            Output {out ? '1' : '0'}
          </T>
        </Animated.View>
      </Card>

      <Card style={{ marginTop: 14, gap: 6 }}>
        <T v="h3">{gate.id}</T>
        <T v="body" c="muted">
          {gate.blurb}
        </T>
        <T v="formula" c="primary" style={{ marginTop: 2 }}>
          {gate.expr}
        </T>
      </Card>

      <Card style={{ marginTop: 14 }} padded={false}>
        <View style={styles.thead}>
          <T v="caption" c="muted" style={styles.cell}>
            A
          </T>
          {!gate.unary && (
            <T v="caption" c="muted" style={styles.cell}>
              B
            </T>
          )}
          <T v="caption" c="primary" style={styles.cell}>
            Out
          </T>
        </View>
        {rows.map(([x, y]) => {
          const active = x === a && (gate.unary || y === b);
          const o = gate.fn(x, y);
          return (
            <View key={`${x}${y}`} style={[styles.thead, active && { backgroundColor: alpha(t.primary, 0.14) }]}>
              <T v="bodyB" style={styles.cell} c={x ? 'success' : 'muted'}>
                {x ? 1 : 0}
              </T>
              {!gate.unary && (
                <T v="bodyB" style={styles.cell} c={y ? 'success' : 'muted'}>
                  {y ? 1 : 0}
                </T>
              )}
              <T v="bodyB" style={styles.cell} c={o ? 'success' : 'muted'}>
                {o ? 1 : 0}
              </T>
            </View>
          );
        })}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  gateBtn: { paddingHorizontal: 16, height: 44, borderRadius: 14, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  track: { width: 66, height: 36, borderRadius: 18, padding: 3, justifyContent: 'center' },
  knob: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  out: { marginTop: 16, borderWidth: 2, borderRadius: 14, paddingHorizontal: 22, paddingVertical: 10 },
  thead: { flexDirection: 'row', paddingVertical: 10 },
  cell: { flex: 1, textAlign: 'center' },
});
