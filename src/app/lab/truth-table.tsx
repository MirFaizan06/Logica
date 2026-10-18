import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { T } from '@/components/AppText';
import { Card } from '@/components/Card';
import { Tap } from '@/components/Tap';
import { Header, IconButton, Segmented } from '@/components/ui';
import { TruthTable } from '@/components/TruthTable';
import { alpha, FONT, useTheme } from '@/theme/ThemeProvider';
import {
  assignments,
  canonicalCNF,
  canonicalDNF,
  classify,
  entails,
  equivalent,
  evalNode,
  minimalCNF,
  minimalDNF,
  show,
  tryParse,
  truthColumn,
  varsOf,
  type Node,
} from '@/logic/formula';
import { useStore } from '@/store';

type Mode = 'table' | 'compare' | 'argument';

const KEYS = ['¬', '∧', '∨', '→', '↔', '⊕', '(', ')', 'p', 'q', 'r', 's'];
const EXAMPLES: Record<Mode, string[]> = {
  table: ['p → q', '(p → q) ∧ (q → r) → (p → r)', '¬(p ∧ q) ↔ (¬p ∨ ¬q)', 'p ⊕ q', '(p ∨ q) ∧ ¬p → q'],
  compare: ['p → q|¬q → ¬p', '¬(p ∨ q)|¬p ∧ ¬q', 'p → q|q → p'],
  argument: ['p → q, p ⊢ q', 'p ∨ q, ¬p ⊢ q', 'p → q, q ⊢ p'],
};

/** A text field with a symbol keypad that inserts at the cursor. */
function FormulaField({ value, onChange, placeholder, autoFocus }: { value: string; onChange: (v: string) => void; placeholder: string; autoFocus?: boolean }) {
  const t = useTheme();
  const [sel, setSel] = useState({ start: value.length, end: value.length });
  const insert = (k: string) => {
    const s = Math.min(sel.start, value.length);
    const e = Math.min(sel.end, value.length);
    const next = value.slice(0, s) + k + value.slice(e);
    onChange(next);
    const pos = s + k.length;
    setSel({ start: pos, end: pos });
  };
  return (
    <View style={{ gap: 8 }}>
      <View style={[styles.field, { backgroundColor: t.card, borderColor: t.border, borderRadius: t.radius - 8 }]}>
        <TextInput
          value={value}
          onChangeText={onChange}
          onSelectionChange={(e) => setSel(e.nativeEvent.selection)}
          selection={sel}
          placeholder={placeholder}
          placeholderTextColor={alpha(t.textMuted, 0.7)}
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
          autoFocus={autoFocus}
          style={[styles.input, { color: t.text, fontFamily: FONT.semi }]}
        />
        {value.length > 0 && <IconButton name="close-circle" size={22} color={t.textMuted} onPress={() => onChange('')} style={styles.clear} label="Clear" />}
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} keyboardShouldPersistTaps="always" contentContainerStyle={{ gap: 6 }}>
        {KEYS.map((k) => (
          <Tap key={k} feedback="tap" scale={0.9} onPress={() => insert(k)} style={[styles.key, { backgroundColor: t.card2, borderColor: t.border }]}>
            <T v="formula" c="primary" style={{ fontSize: 18, lineHeight: 24 }}>
              {k}
            </T>
          </Tap>
        ))}
        <Tap feedback="tap" scale={0.9} onPress={() => { onChange(value.slice(0, Math.max(0, sel.start - 1)) + value.slice(sel.end)); const p = Math.max(0, sel.start - 1); setSel({ start: p, end: p }); }} style={[styles.key, { backgroundColor: t.card2, borderColor: t.border }]}>
          <Ionicons name="backspace-outline" size={20} color={t.textMuted} />
        </Tap>
      </ScrollView>
    </View>
  );
}

function Chips({ items, onPick }: { items: string[]; onPick: (s: string) => void }) {
  const t = useTheme();
  return (
    <View style={{ gap: 6 }}>
      <T v="caption" c="muted">
        Try an example
      </T>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {items.map((e) => (
          <Tap key={e} feedback="tap" scale={0.95} onPress={() => onPick(e)} style={[styles.chip, { borderColor: alpha(t.primary, 0.4), backgroundColor: alpha(t.primary, 0.1) }]}>
            <T v="small" c="primary" style={{ fontFamily: FONT.bold }}>
              {e.replace('|', '   vs   ')}
            </T>
          </Tap>
        ))}
      </View>
    </View>
  );
}

function Verdict({ ok, title, sub, kind }: { ok: boolean | null; title: string; sub?: string; kind?: 'warn' }) {
  const t = useTheme();
  const color = kind === 'warn' ? t.warn : ok ? t.success : t.danger;
  return (
    <Animated.View entering={FadeIn.duration(260)} style={[styles.verdict, { backgroundColor: alpha(color, t.dark ? 0.16 : 0.12), borderColor: alpha(color, 0.5) }]}>
      <Ionicons name={kind === 'warn' ? 'information-circle' : ok ? 'checkmark-circle' : 'close-circle'} size={26} color={color} />
      <View style={{ flex: 1 }}>
        <T v="bodyB" style={{ color }}>
          {title}
        </T>
        {sub ? (
          <T v="small" c="muted">
            {sub}
          </T>
        ) : null}
      </View>
    </Animated.View>
  );
}

/* ----------------------------- modes ----------------------------- */

function TableMode() {
  const t = useTheme();
  const [text, setText] = useState('(p → q) ∧ (q → r) → (p → r)');
  const parsed = useMemo(() => tryParse(text), [text]);
  const node = parsed.node;
  const info = useMemo(() => {
    if (!node) return null;
    const vars = varsOf(node);
    if (vars.length > 5) return { tooBig: true as const };
    const col = truthColumn(node);
    return {
      tooBig: false as const,
      kind: classify(node),
      trues: col.filter(Boolean).length,
      rows: col.length,
      dnf: minimalDNF(node),
      cnf: minimalCNF(node),
      cdnf: canonicalDNF(node),
      ccnf: canonicalCNF(node),
      pretty: show(node),
    };
  }, [node]);

  const kindColor = info && !info.tooBig ? (info.kind === 'tautology' ? t.success : info.kind === 'contradiction' ? t.danger : t.warn) : t.primary;

  return (
    <View style={{ gap: 14 }}>
      <FormulaField value={text} onChange={setText} placeholder="e.g. (p → q) ∧ ¬r" />
      <Chips items={EXAMPLES.table} onPick={setText} />
      {parsed.error ? (
        <Verdict ok={false} title="Check your formula" sub={parsed.error} kind="warn" />
      ) : info && info.tooBig ? (
        <Verdict ok={false} title="Too many variables" sub="Use up to 5 variables (32 rows)." kind="warn" />
      ) : info && node ? (
        <>
          <Animated.View entering={FadeInDown.duration(300)} style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            <View style={[styles.stat, { backgroundColor: alpha(kindColor, 0.15), borderColor: alpha(kindColor, 0.5) }]}>
              <T v="caption" style={{ color: kindColor }}>
                {info.kind}
              </T>
            </View>
            <View style={[styles.stat, { backgroundColor: alpha(t.primary, 0.12), borderColor: alpha(t.primary, 0.4) }]}>
              <T v="caption" c="primary">
                true in {info.trues} of {info.rows} rows
              </T>
            </View>
            <View style={[styles.stat, { backgroundColor: alpha(t.info, 0.12), borderColor: alpha(t.info, 0.4) }]}>
              <T v="caption" style={{ color: t.info }}>
                {info.trues > 0 ? 'satisfiable' : 'unsatisfiable'}
              </T>
            </View>
          </Animated.View>
          <TruthTable formulas={[text]} />
          <Card style={{ gap: 10 }}>
            <T v="caption" c="muted">
              Normal forms
            </T>
            <View>
              <T v="small" c="muted">
                Minimal DNF
              </T>
              <T v="formula" style={{ fontSize: 16 }} selectable>
                {info.dnf}
              </T>
            </View>
            <View>
              <T v="small" c="muted">
                Minimal CNF
              </T>
              <T v="formula" style={{ fontSize: 16 }} selectable>
                {info.cnf}
              </T>
            </View>
            {info.cdnf.length < 160 && (
              <View>
                <T v="small" c="muted">
                  Canonical DNF
                </T>
                <T v="small" style={{ fontFamily: FONT.semi }} selectable>
                  {info.cdnf}
                </T>
              </View>
            )}
          </Card>
        </>
      ) : null}
    </View>
  );
}

function CompareMode() {
  const [a, setA] = useState('p → q');
  const [b, setB] = useState('¬q → ¬p');
  const pa = useMemo(() => tryParse(a), [a]);
  const pb = useMemo(() => tryParse(b), [b]);
  const result = useMemo(() => {
    if (!pa.node || !pb.node) return null;
    const vars = Array.from(new Set([...varsOf(pa.node), ...varsOf(pb.node)])).sort();
    if (vars.length > 5) return { big: true as const };
    const rows = assignments(vars);
    const diff = rows.find((env) => evalNode(pa.node as Node, env) !== evalNode(pb.node as Node, env));
    return { big: false as const, eq: equivalent(pa.node, pb.node), diff };
  }, [pa, pb]);
  return (
    <View style={{ gap: 14 }}>
      <View style={{ gap: 6 }}>
        <T v="caption" c="muted">
          First formula
        </T>
        <FormulaField value={a} onChange={setA} placeholder="p → q" />
      </View>
      <View style={{ gap: 6 }}>
        <T v="caption" c="muted">
          Second formula
        </T>
        <FormulaField value={b} onChange={setB} placeholder="¬q → ¬p" />
      </View>
      <Chips
        items={EXAMPLES.compare}
        onPick={(s) => {
          const [x, y] = s.split('|');
          setA(x);
          setB(y);
        }}
      />
      {pa.error || pb.error ? (
        <Verdict ok={false} kind="warn" title="Check your formulas" sub={pa.error || pb.error} />
      ) : result && result.big ? (
        <Verdict ok={false} kind="warn" title="Too many variables" sub="Use up to 5 variables in total." />
      ) : result ? (
        <>
          <Verdict
            ok={result.eq}
            title={result.eq ? 'Logically equivalent' : 'Not equivalent'}
            sub={
              result.eq
                ? 'They have the same truth value in every row.'
                : `They differ when ${Object.entries(result.diff ?? {})
                    .map(([k, v]) => `${k} = ${v ? 'T' : 'F'}`)
                    .join(', ')}.`
            }
          />
          <TruthTable formulas={[a, b]} />
        </>
      ) : null}
    </View>
  );
}

function ArgumentMode() {
  const t = useTheme();
  const [premises, setPremises] = useState<string[]>(['p → q', 'p']);
  const [concl, setConcl] = useState('q');
  const parsed = useMemo(() => premises.map((p) => tryParse(p)), [premises]);
  const pc = useMemo(() => tryParse(concl), [concl]);
  const bad = parsed.find((p) => p.error) || (pc.error ? pc : null);
  const res = useMemo(() => {
    if (bad || premises.length === 0) return null;
    const nodes = parsed.map((p) => p.node as Node);
    const r = entails(nodes, pc.node as Node);
    if (r.vars.length > 5) return { big: true as const };
    return { big: false as const, ...r };
  }, [parsed, pc, bad, premises.length]);

  return (
    <View style={{ gap: 14 }}>
      {premises.map((p, i) => (
        <View key={i} style={{ gap: 6 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <T v="caption" c="muted">
              Premise {i + 1}
            </T>
            {premises.length > 1 && (
              <Tap onPress={() => setPremises(premises.filter((_, j) => j !== i))} feedback="tap">
                <T v="small" c="danger" style={{ fontFamily: FONT.bold }}>
                  Remove
                </T>
              </Tap>
            )}
          </View>
          <FormulaField value={p} onChange={(v) => setPremises(premises.map((x, j) => (j === i ? v : x)))} placeholder="premise" />
        </View>
      ))}
      {premises.length < 4 && (
        <Tap onPress={() => setPremises([...premises, ''])} feedback="tap" style={[styles.addBtn, { borderColor: t.border }]}>
          <Ionicons name="add" size={18} color={t.primary} />
          <T v="small" c="primary" style={{ fontFamily: FONT.bold }}>
            Add premise
          </T>
        </Tap>
      )}
      <View style={{ gap: 6 }}>
        <T v="caption" c="muted">
          Conclusion
        </T>
        <FormulaField value={concl} onChange={setConcl} placeholder="conclusion" />
      </View>
      <Chips
        items={EXAMPLES.argument}
        onPick={(s) => {
          const [ps, c] = s.split('⊢');
          setPremises(ps.split(',').map((x) => x.trim()));
          setConcl(c.trim());
        }}
      />
      {bad ? (
        <Verdict ok={false} kind="warn" title="Check your formulas" sub={bad.error} />
      ) : res && res.big ? (
        <Verdict ok={false} kind="warn" title="Too many variables" sub="Use up to 5 variables." />
      ) : res ? (
        <>
          <Verdict
            ok={res.valid}
            title={res.valid ? 'Valid argument' : 'Invalid argument'}
            sub={
              res.valid
                ? 'Whenever all the premises are true, the conclusion is true too.'
                : `Counterexample: ${Object.entries(res.counter ?? {})
                    .map(([k, v]) => `${k} = ${v ? 'T' : 'F'}`)
                    .join(', ')} makes every premise true and the conclusion false.`
            }
          />
          <TruthTable formulas={[...premises, concl]} />
        </>
      ) : null}
    </View>
  );
}

export default function TruthTableLab() {
  const [mode, setMode] = useState<Mode>('table');
  const noteLabUse = useStore((s) => s.noteLabUse);
  const used = useRef(false);
  useEffect(() => {
    // count one lab use per visit, once the learner has actually used a mode
    if (used.current) return;
    const timer = setTimeout(() => {
      used.current = true;
      noteLabUse();
    }, 4000);
    return () => clearTimeout(timer);
  }, [noteLabUse]);
  return (
    <Screen scroll bottom={30}>
      <Header title="Truth Table Lab" subtitle="Any formula, instantly" />
      <Segmented
        options={[
          { key: 'table' as Mode, label: 'Table' },
          { key: 'compare' as Mode, label: 'Equivalence' },
          { key: 'argument' as Mode, label: 'Argument' },
        ]}
        value={mode}
        onChange={(m) => {
          setMode(m);
          noteLabUse();
        }}
      />
      <View style={{ marginTop: 16 }}>
        {mode === 'table' && <TableMode />}
        {mode === 'compare' && <CompareMode />}
        {mode === 'argument' && <ArgumentMode />}
      </View>
      <T v="small" c="muted" center style={{ marginTop: 20 }}>
        Operators: ¬ ~ !  ∧ & and  ∨ | or  → -&gt; implies  ↔ &lt;-&gt; iff  ⊕ xor
      </T>
    </Screen>
  );
}

const styles = StyleSheet.create({
  field: { flexDirection: 'row', alignItems: 'center', borderWidth: 2, paddingHorizontal: 14 },
  input: { flex: 1, fontSize: 18, paddingVertical: 14 },
  clear: { width: 32, height: 32, borderWidth: 0, backgroundColor: 'transparent' },
  key: { minWidth: 44, height: 44, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 },
  chip: { borderWidth: 1, borderRadius: 99, paddingHorizontal: 12, paddingVertical: 7 },
  verdict: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, borderWidth: 1.5 },
  stat: { borderWidth: 1, borderRadius: 99, paddingHorizontal: 12, paddingVertical: 6 },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 12, borderWidth: 1.5, borderStyle: 'dashed' },
});
