import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { T } from './AppText';
import { alpha, FONT, useTheme } from '@/theme/ThemeProvider';
import { assignments, evalNode, show, subformulas, tryParse, varsOf, type Node } from '@/logic/formula';

interface Props {
  formulas: string[];
  /** show every sub-formula as its own column (default when a single formula) */
  steps?: boolean;
  compact?: boolean;
}

export function TruthTable({ formulas, steps, compact }: Props) {
  const t = useTheme();
  const model = useMemo(() => {
    const nodes: Node[] = [];
    for (const f of formulas) {
      const r = tryParse(f);
      if (r.node) nodes.push(r.node);
    }
    if (!nodes.length) return null;
    const vars = Array.from(new Set(nodes.flatMap((n) => varsOf(n)))).sort();
    const showSteps = steps ?? nodes.length === 1;
    const cols: Node[] = showSteps
      ? (() => {
          const seen = new Set<string>();
          const out: Node[] = [];
          for (const n of nodes) {
            for (const s of subformulas(n)) {
              const k = show(s);
              if (!seen.has(k)) {
                seen.add(k);
                out.push(s);
              }
            }
          }
          return out;
        })()
      : nodes;
    const finals = new Set(nodes.map((n) => show(n)));
    const rows = assignments(vars).map((env) => ({
      vals: vars.map((v) => env[v]),
      out: cols.map((c) => evalNode(c, env)),
    }));
    return { vars, cols, finals, rows };
  }, [formulas, steps]);

  if (!model) return null;
  const cellW = compact ? 40 : 46;
  const fs = compact ? 13 : 14;

  const header = (label: string, final: boolean, w: number) => (
    <View
      key={label}
      style={[
        styles.cell,
        { width: w, backgroundColor: final ? alpha(t.primary, 0.16) : 'transparent', borderColor: t.border },
      ]}
    >
      <T v="small" style={{ fontFamily: FONT.bold, fontSize: fs }} c={final ? 'primary' : 'muted'} center>
        {label}
      </T>
    </View>
  );

  const colW = (n: Node) => Math.max(cellW + 8, Math.min(190, show(n).length * 8.2 + 22));

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ alignSelf: 'stretch' }}>
      <View style={[styles.table, { borderColor: t.border, backgroundColor: t.card2 }]}>
        <View style={styles.row}>
          {model.vars.map((v) => header(v, false, cellW))}
          {model.cols.map((c) => header(show(c), model.finals.has(show(c)), colW(c)))}
        </View>
        {model.rows.map((r, i) => (
          <View key={i} style={styles.row}>
            {r.vals.map((v, j) => (
              <View key={j} style={[styles.cell, { width: cellW, borderColor: t.border }]}>
                <T v="small" c={v ? 'success' : 'danger'} style={{ fontFamily: FONT.bold, fontSize: fs }} center>
                  {v ? 'T' : 'F'}
                </T>
              </View>
            ))}
            {r.out.map((v, j) => {
              const final = model.finals.has(show(model.cols[j]));
              return (
                <View
                  key={j}
                  style={[
                    styles.cell,
                    {
                      width: colW(model.cols[j]),
                      borderColor: t.border,
                      backgroundColor: final ? alpha(v ? t.success : t.danger, 0.14) : 'transparent',
                    },
                  ]}
                >
                  <T v="small" c={v ? 'success' : 'danger'} style={{ fontFamily: FONT.heavy, fontSize: fs }} center>
                    {v ? 'T' : 'F'}
                  </T>
                </View>
              );
            })}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  table: { borderWidth: 1, borderRadius: 14, overflow: 'hidden' },
  row: { flexDirection: 'row' },
  cell: { paddingVertical: 8, borderWidth: StyleSheet.hairlineWidth, alignItems: 'center', justifyContent: 'center' },
});
