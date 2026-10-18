import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import type { Classify, Match, MCQ, Multi, Order, Question, TF, TT } from '@/content/types';
import { Rich, T } from './AppText';
import { Tap } from './Tap';
import { alpha, FONT, useTheme } from '@/theme/ThemeProvider';
import { assignments, parse, varsOf } from '@/logic/formula';
import { permFor, ttColumn, type AnswerValue } from '@/logic/grading';
import { haptic } from '@/services/haptics';

interface Props {
  q: Question;
  value: AnswerValue;
  onChange: (v: AnswerValue) => void;
  checked: boolean;
}

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

function useOptionStyle() {
  const t = useTheme();
  return (state: 'idle' | 'selected' | 'correct' | 'wrong' | 'reveal') => {
    switch (state) {
      case 'selected':
        return { borderColor: t.primary, backgroundColor: alpha(t.primary, t.dark ? 0.2 : 0.1) };
      case 'correct':
        return { borderColor: t.success, backgroundColor: t.successSoft };
      case 'wrong':
        return { borderColor: t.danger, backgroundColor: t.dangerSoft };
      case 'reveal':
        return { borderColor: t.success, backgroundColor: 'transparent', borderStyle: 'dashed' as const };
      default:
        return { borderColor: t.border, backgroundColor: t.card };
    }
  };
}

/* ------------------------------ MCQ / Multi ------------------------------ */

function OptionRow({
  index,
  text,
  state,
  onPress,
  disabled,
  multi,
  selected,
}: {
  index: number;
  text: string;
  state: 'idle' | 'selected' | 'correct' | 'wrong' | 'reveal';
  onPress: () => void;
  disabled: boolean;
  multi?: boolean;
  selected?: boolean;
}) {
  const t = useTheme();
  const style = useOptionStyle();
  const color = state === 'correct' ? t.success : state === 'wrong' ? t.danger : state === 'selected' ? t.primary : t.textMuted;
  return (
    <Animated.View entering={FadeInDown.delay(60 + index * 60).duration(320)}>
      <Tap onPress={onPress} disabled={disabled} dim={false} feedback="select" scale={0.98} style={[styles.option, { borderRadius: t.radius - 8 }, style(state)]}>
        <View style={[styles.letter, multi ? { borderRadius: 8 } : null, { borderColor: color, backgroundColor: selected || state === 'correct' || state === 'wrong' ? alpha(color, 0.18) : 'transparent' }]}>
          {state === 'correct' ? (
            <Ionicons name="checkmark" size={16} color={color} />
          ) : state === 'wrong' ? (
            <Ionicons name="close" size={16} color={color} />
          ) : multi && selected ? (
            <Ionicons name="checkmark" size={16} color={color} />
          ) : (
            <T v="small" style={{ fontFamily: FONT.heavy, color }}>
              {multi ? '' : LETTERS[index]}
            </T>
          )}
        </View>
        <View style={{ flex: 1 }}>
          <T v="body" style={{ fontFamily: FONT.semi }}>
            {text}
          </T>
        </View>
      </Tap>
    </Animated.View>
  );
}

function MCQView({ q, value, onChange, checked }: Props & { q: MCQ }) {
  return (
    <View style={{ gap: 10 }}>
      {q.options.map((o, i) => {
        const sel = value === i;
        let state: 'idle' | 'selected' | 'correct' | 'wrong' | 'reveal' = sel ? 'selected' : 'idle';
        if (checked) {
          if (i === q.answer) state = sel ? 'correct' : 'reveal';
          else if (sel) state = 'wrong';
          else state = 'idle';
        }
        return <OptionRow key={i} index={i} text={o} state={state} disabled={checked} selected={sel} onPress={() => onChange(i)} />;
      })}
    </View>
  );
}

function MultiView({ q, value, onChange, checked }: Props & { q: Multi }) {
  const sel = value as number[];
  return (
    <View style={{ gap: 10 }}>
      <T v="small" c="muted">
        Select all that apply.
      </T>
      {q.options.map((o, i) => {
        const on = sel.includes(i);
        const isAns = q.answer.includes(i);
        let state: 'idle' | 'selected' | 'correct' | 'wrong' | 'reveal' = on ? 'selected' : 'idle';
        if (checked) {
          if (on && isAns) state = 'correct';
          else if (on && !isAns) state = 'wrong';
          else if (!on && isAns) state = 'reveal';
          else state = 'idle';
        }
        return (
          <OptionRow
            key={i}
            index={i}
            text={o}
            multi
            selected={on}
            state={state}
            disabled={checked}
            onPress={() => onChange(on ? sel.filter((x) => x !== i) : [...sel, i])}
          />
        );
      })}
    </View>
  );
}

/* ------------------------------ True / False ------------------------------ */

function TFView({ q, value, onChange, checked }: Props & { q: TF }) {
  const t = useTheme();
  const style = useOptionStyle();
  const opts: [boolean, string, keyof typeof Ionicons.glyphMap][] = [
    [true, 'True', 'checkmark-circle-outline'],
    [false, 'False', 'close-circle-outline'],
  ];
  return (
    <View style={{ flexDirection: 'row', gap: 12 }}>
      {opts.map(([val, label, icon], i) => {
        const sel = value === val;
        let state: 'idle' | 'selected' | 'correct' | 'wrong' | 'reveal' = sel ? 'selected' : 'idle';
        if (checked) {
          if (val === q.answer) state = sel ? 'correct' : 'reveal';
          else if (sel) state = 'wrong';
          else state = 'idle';
        }
        const color = state === 'correct' ? t.success : state === 'wrong' ? t.danger : state === 'selected' ? t.primary : t.textMuted;
        return (
          <Animated.View key={label} entering={FadeInDown.delay(80 + i * 80).duration(320)} style={{ flex: 1 }}>
            <Tap
              onPress={() => onChange(val)}
              disabled={checked}
                  dim={false}
              feedback="select"
              scale={0.96}
              style={[styles.tf, { borderRadius: t.radius - 4 }, style(state)]}
            >
              <Ionicons name={icon} size={34} color={color} />
              <T v="h3" style={{ color, marginTop: 6 }}>
                {label}
              </T>
            </Tap>
          </Animated.View>
        );
      })}
    </View>
  );
}

/* ------------------------------ Ordering ------------------------------ */

function OrderView({ q, value, onChange, checked }: Props & { q: Order }) {
  const t = useTheme();
  const chosen = value as number[];
  const perm = useMemo(() => permFor(q, q.items.length), [q]);
  const bank = perm.filter((orig) => !chosen.includes(orig));
  return (
    <View style={{ gap: 16 }}>
      <View>
        <T v="caption" c="muted" style={{ marginBottom: 8 }}>
          Your order
        </T>
        <View style={[styles.slotBox, { borderColor: t.border, backgroundColor: alpha(t.textMuted, 0.06) }]}>
          {chosen.length === 0 && <T v="small" c="muted">Tap the steps below in the right order.</T>}
          {chosen.map((orig, pos) => {
            const ok = checked ? orig === pos : null;
            const col = ok === null ? t.primary : ok ? t.success : t.danger;
            return (
              <Animated.View key={orig} entering={ZoomIn.duration(220)}>
                <Tap
                  disabled={checked}
                  dim={false}
                  feedback="select"
                  onPress={() => onChange(chosen.filter((x) => x !== orig))}
                  style={[styles.chip, { borderColor: col, backgroundColor: alpha(col, 0.14) }]}
                >
                  <View style={[styles.num, { backgroundColor: col }]}>
                    <T v="small" c="onPrimary" style={{ fontFamily: FONT.heavy, fontSize: 12 }}>
                      {pos + 1}
                    </T>
                  </View>
                  <View style={{ flexShrink: 1 }}>
                    <T v="body" style={{ fontFamily: FONT.semi }}>
                      {q.items[orig]}
                    </T>
                  </View>
                </Tap>
              </Animated.View>
            );
          })}
        </View>
      </View>
      {!checked && (
        <View>
          <T v="caption" c="muted" style={{ marginBottom: 8 }}>
            Steps
          </T>
          <View style={styles.bank}>
            {bank.map((orig) => (
              <Tap
                key={orig}
                feedback="tap"
                onPress={() => onChange([...chosen, orig])}
                style={[styles.chip, { borderColor: t.border, backgroundColor: t.card }]}
              >
                <View style={{ flexShrink: 1 }}>
                  <T v="body" style={{ fontFamily: FONT.semi }}>
                    {q.items[orig]}
                  </T>
                </View>
              </Tap>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

/* ------------------------------ Matching ------------------------------ */

function MatchView({ q, value, onChange, checked }: Props & { q: Match }) {
  const t = useTheme();
  const map = value as Record<number, number>;
  const [selLeft, setSelLeft] = useState<number | null>(null);
  const perm = useMemo(() => permFor(q, q.pairs.length, 'm'), [q]);
  const palette = [t.primary, t.accent, t.success, t.info, t.warn, t.primary2];
  const leftOf = (right: number) => Object.keys(map).map(Number).find((l) => map[l] === right);

  const pressLeft = (i: number) => {
    if (checked) return;
    if (map[i] !== undefined) {
      const copy = { ...map };
      delete copy[i];
      onChange(copy);
      setSelLeft(null);
      return;
    }
    setSelLeft(selLeft === i ? null : i);
  };
  const pressRight = (r: number) => {
    if (checked) return;
    const existing = leftOf(r);
    if (selLeft === null) {
      if (existing !== undefined) {
        const copy = { ...map };
        delete copy[existing];
        onChange(copy);
      }
      return;
    }
    const copy = { ...map };
    if (existing !== undefined) delete copy[existing];
    copy[selLeft] = r;
    onChange(copy);
    setSelLeft(null);
    haptic.select();
  };

  const cell = (text: string, side: 'l' | 'r', idx: number) => {
    const paired = side === 'l' ? map[idx] !== undefined : leftOf(idx) !== undefined;
    const groupId = side === 'l' ? idx : leftOf(idx);
    const col = paired && groupId !== undefined ? palette[groupId % palette.length] : t.border;
    const selected = side === 'l' && selLeft === idx;
    let border = selected ? t.primary : col;
    let bg: string = paired && groupId !== undefined ? alpha(col, 0.16) : selected ? alpha(t.primary, 0.12) : t.card;
    if (checked) {
      const lid = side === 'l' ? idx : leftOf(idx);
      const ok = lid !== undefined && map[lid] === lid;
      border = ok ? t.success : t.danger;
      bg = ok ? t.successSoft : t.dangerSoft;
    }
    return (
      <Tap
        key={`${side}${idx}`}
        feedback="select"
        scale={0.97}
        onPress={() => (side === 'l' ? pressLeft(idx) : pressRight(idx))}
        style={[styles.matchCell, { borderColor: border, backgroundColor: bg, borderRadius: t.radius - 10 }]}
      >
        <T v="small" style={{ fontFamily: FONT.bold }} center>
          {text}
        </T>
      </Tap>
    );
  };

  return (
    <View style={{ gap: 10 }}>
      <T v="small" c="muted">
        Tap an item on the left, then its partner on the right.
      </T>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View style={{ flex: 1, gap: 10 }}>{q.pairs.map((p, i) => cell(p[0], 'l', i))}</View>
        <View style={{ flex: 1, gap: 10 }}>{perm.map((orig) => cell(q.pairs[orig][1], 'r', orig))}</View>
      </View>
    </View>
  );
}

/* ------------------------------ Truth table ------------------------------ */

function TTView({ q, value, onChange, checked }: Props & { q: TT }) {
  const t = useTheme();
  const cells = value as (boolean | null)[];
  const { vars, rows, correct } = useMemo(() => {
    const node = parse(q.formula);
    const vs = varsOf(node);
    return { vars: vs, rows: assignments(vs), correct: ttColumn(q) };
  }, [q]);
  const cycle = (i: number) => {
    if (checked) return;
    const next = [...cells];
    next[i] = cells[i] === null ? true : cells[i] === true ? false : true;
    onChange(next);
  };
  return (
    <View style={{ gap: 12 }}>
      <View style={[styles.formulaBox, { backgroundColor: t.card2, borderColor: t.border }]}>
        <T v="formula" c="primary" center style={{ fontSize: 22, lineHeight: 30 }}>
          {q.formula}
        </T>
      </View>
      <View style={[styles.ttTable, { borderColor: t.border, backgroundColor: t.card }]}>
        <View style={styles.ttRow}>
          {vars.map((v) => (
            <View key={v} style={[styles.ttCell, { borderColor: t.border }]}>
              <T v="small" c="muted" style={{ fontFamily: FONT.heavy }} center>
                {v}
              </T>
            </View>
          ))}
          <View style={[styles.ttCell, { flex: 1.6, borderColor: t.border, backgroundColor: alpha(t.primary, 0.12) }]}>
            <T v="small" c="primary" style={{ fontFamily: FONT.heavy }} center>
              result
            </T>
          </View>
        </View>
        {rows.map((env, i) => {
          const v = cells[i];
          const ok = checked ? v === correct[i] : null;
          const col = ok === null ? t.primary : ok ? t.success : t.danger;
          return (
            <View key={i} style={styles.ttRow}>
              {vars.map((n) => (
                <View key={n} style={[styles.ttCell, { borderColor: t.border }]}>
                  <T v="small" c={env[n] ? 'success' : 'danger'} style={{ fontFamily: FONT.bold }} center>
                    {env[n] ? 'T' : 'F'}
                  </T>
                </View>
              ))}
              <Tap
                onPress={() => cycle(i)}
                disabled={checked}
                  dim={false}
                feedback="select"
                scale={0.94}
                style={[
                  styles.ttCell,
                  styles.ttInput,
                  {
                    borderColor: v === null ? t.border : col,
                    backgroundColor: v === null ? 'transparent' : alpha(col, 0.15),
                    borderStyle: v === null ? 'dashed' : 'solid',
                  },
                ]}
              >
                <T v="bodyB" style={{ color: v === null ? t.textMuted : col }} center>
                  {v === null ? '?' : v ? 'T' : 'F'}
                </T>
                {checked && ok === false && (
                  <T v="small" c="success" style={{ position: 'absolute', right: 8, fontFamily: FONT.heavy }}>
                    {correct[i] ? 'T' : 'F'}
                  </T>
                )}
              </Tap>
            </View>
          );
        })}
      </View>
      {!checked && (
        <T v="small" c="muted" center>
          Tap a cell to set it to T or F.
        </T>
      )}
    </View>
  );
}

/* ------------------------------ Classify ------------------------------ */

function ClassifyView({ q, value, onChange, checked }: Props & { q: Classify }) {
  const t = useTheme();
  const sel = value as (number | null)[];
  const palette = [t.primary, t.accent, t.info, t.success];
  return (
    <View style={{ gap: 12 }}>
      {q.items.map((it, i) => {
        const ok = checked ? sel[i] === it.cat : null;
        return (
          <Animated.View
            key={i}
            entering={FadeInDown.delay(60 + i * 60).duration(300)}
            style={[
              styles.classifyCard,
              {
                backgroundColor: ok === null ? t.card : ok ? t.successSoft : t.dangerSoft,
                borderColor: ok === null ? t.border : ok ? t.success : t.danger,
                borderRadius: t.radius - 8,
              },
            ]}
          >
            <T v="small" style={{ fontFamily: FONT.semi, marginBottom: 8 }}>
              {it.text}
            </T>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {q.categories.map((c, ci) => {
                const on = sel[i] === ci;
                const col = palette[ci % palette.length];
                return (
                  <Tap
                    key={c}
                    disabled={checked}
                  dim={false}
                    feedback="select"
                    scale={0.95}
                    onPress={() => {
                      const next = [...sel];
                      next[i] = ci;
                      onChange(next);
                    }}
                    style={[
                      styles.catChip,
                      { borderColor: on ? col : t.border, backgroundColor: on ? alpha(col, 0.2) : 'transparent' },
                    ]}
                  >
                    <T v="small" style={{ fontFamily: FONT.bold, color: on ? col : t.textMuted, fontSize: 12.5 }}>
                      {c}
                    </T>
                  </Tap>
                );
              })}
            </View>
            {checked && ok === false && (
              <T v="small" c="success" style={{ marginTop: 6, fontFamily: FONT.bold }}>
                Correct: {q.categories[it.cat]}
              </T>
            )}
          </Animated.View>
        );
      })}
    </View>
  );
}

/* ------------------------------ Entry ------------------------------ */

export function QuestionView(props: Props) {
  const { q } = props;
  return (
    <View style={{ gap: 18 }}>
      <Animated.View entering={FadeInDown.duration(300)}>
        <Rich text={q.q} v="h2" style={{ fontSize: 19, lineHeight: 28 }} />
      </Animated.View>
      {q.type === 'mcq' && <MCQView {...props} q={q} />}
      {q.type === 'tf' && <TFView {...props} q={q} />}
      {q.type === 'multi' && <MultiView {...props} q={q} />}
      {q.type === 'order' && <OrderView {...props} q={q} />}
      {q.type === 'match' && <MatchView {...props} q={q} />}
      {q.type === 'tt' && <TTView {...props} q={q} />}
      {q.type === 'classify' && <ClassifyView {...props} q={q} />}
    </View>
  );
}

const styles = StyleSheet.create({
  option: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderWidth: 2 },
  letter: { width: 30, height: 30, borderRadius: 15, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  tf: { alignItems: 'center', justifyContent: 'center', paddingVertical: 28, borderWidth: 2 },
  slotBox: { minHeight: 64, borderWidth: 2, borderStyle: 'dashed', borderRadius: 16, padding: 10, gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, paddingHorizontal: 12, borderWidth: 1.5, borderRadius: 14 },
  num: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  bank: { gap: 8 },
  matchCell: { minHeight: 56, paddingHorizontal: 10, paddingVertical: 10, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  formulaBox: { borderWidth: 1, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 12 },
  ttTable: { borderWidth: 1, borderRadius: 16, overflow: 'hidden' },
  ttRow: { flexDirection: 'row' },
  ttCell: { flex: 1, paddingVertical: 10, alignItems: 'center', justifyContent: 'center', borderWidth: StyleSheet.hairlineWidth },
  ttInput: { flex: 1.6, borderWidth: 2, margin: 3, borderRadius: 10, flexDirection: 'row' },
  classifyCard: { borderWidth: 2, padding: 12 },
  catChip: { borderWidth: 1.5, borderRadius: 99, paddingHorizontal: 12, paddingVertical: 7 },
});
