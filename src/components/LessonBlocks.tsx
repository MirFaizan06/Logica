import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import type { Block } from '@/content/types';
import { Rich, T } from './AppText';
import { TruthTable } from './TruthTable';
import { VennMini } from './Venn';
import { alpha, FONT, useTheme } from '@/theme/ThemeProvider';

function BlockView({ b }: { b: Block }) {
  const t = useTheme();
  switch (b.t) {
    case 'p':
      return <Rich text={b.text} />;
    case 'h':
      return <T v="h2">{b.text}</T>;
    case 'ex':
      return (
        <View style={[styles.box, { backgroundColor: t.card2, borderColor: t.border }]}>
          {b.label ? (
            <T v="caption" c="primary" style={{ marginBottom: 8 }}>
              {b.label}
            </T>
          ) : null}
          {b.lines.map((l, i) => (
            <T key={i} v="formula" style={{ fontSize: 16.5, lineHeight: 25, minHeight: l ? undefined : 10 }}>
              {l}
            </T>
          ))}
        </View>
      );
    case 'tip':
      return (
        <View style={[styles.callout, { backgroundColor: alpha(t.info, t.dark ? 0.16 : 0.1), borderColor: alpha(t.info, 0.4) }]}>
          <Ionicons name="bulb-outline" size={20} color={t.info} style={styles.calloutIcon} />
          <View style={{ flex: 1 }}>
            <Rich text={b.text} v="small" />
          </View>
        </View>
      );
    case 'warn':
      return (
        <View style={[styles.callout, { backgroundColor: alpha(t.warn, t.dark ? 0.16 : 0.12), borderColor: alpha(t.warn, 0.5) }]}>
          <Ionicons name="warning-outline" size={20} color={t.warn} style={styles.calloutIcon} />
          <View style={{ flex: 1 }}>
            <Rich text={b.text} v="small" />
          </View>
        </View>
      );
    case 'list':
      return (
        <View style={{ gap: 8 }}>
          {b.items.map((it, i) => (
            <View key={i} style={styles.li}>
              <View style={[styles.bullet, { backgroundColor: t.primary }]} />
              <View style={{ flex: 1 }}>
                <Rich text={it} />
              </View>
            </View>
          ))}
        </View>
      );
    case 'sym':
      return (
        <View style={{ gap: 8 }}>
          {b.items.map((it, i) => (
            <View key={i} style={[styles.symRow, { backgroundColor: t.card, borderColor: t.border }]}>
              <View style={[styles.symBadge, { backgroundColor: alpha(t.primary, 0.14) }]}>
                <T v="formula" c="primary" style={{ fontSize: it.sym.length > 6 ? 13 : 20, lineHeight: 26 }} center>
                  {it.sym}
                </T>
              </View>
              <View style={{ flex: 1 }}>
                <T v="bodyB" style={{ fontSize: 14.5, lineHeight: 20 }}>
                  {it.name}
                </T>
                {it.note ? (
                  <T v="small" c="muted">
                    {it.note}
                  </T>
                ) : null}
              </View>
            </View>
          ))}
        </View>
      );
    case 'tt':
      return <TruthTable formulas={b.formulas} />;
    case 'rule':
      return (
        <View style={[styles.rule, { backgroundColor: t.card, borderColor: t.border }]}>
          <T v="caption" c="primary" style={{ marginBottom: 8 }}>
            {b.name}
          </T>
          {b.premises.map((p, i) => (
            <T key={i} v="formula" style={{ fontSize: 17 }}>
              {p}
            </T>
          ))}
          <View style={[styles.line, { backgroundColor: t.text }]} />
          <T v="formula" c="primary" style={{ fontSize: 17 }}>
            ∴ {b.conclusion}
          </T>
        </View>
      );
    case 'venn':
      return (
        <View style={styles.vennRow}>
          {b.forms.map((f) => (
            <VennMini key={f} form={f} />
          ))}
        </View>
      );
    case 'compare':
      return (
        <View style={styles.compare}>
          {[b.left, b.right].map((side, i) => (
            <View key={i} style={[styles.side, { backgroundColor: t.card, borderColor: i === 0 ? alpha(t.success, 0.5) : alpha(t.accent, 0.5) }]}>
              <T v="caption" c={i === 0 ? 'success' : 'accent'} style={{ marginBottom: 6 }}>
                {side.title}
              </T>
              {side.lines.map((l, j) => (
                <T key={j} v="small" style={{ fontFamily: FONT.semi, marginBottom: 3 }}>
                  {l}
                </T>
              ))}
            </View>
          ))}
        </View>
      );
  }
}

export function LessonBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <View style={{ gap: 14 }}>
      {blocks.map((b, i) => (
        <Animated.View key={i} entering={FadeInDown.delay(80 + i * 70).duration(380)}>
          <BlockView b={b} />
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { borderRadius: 16, borderWidth: 1, padding: 14 },
  callout: { flexDirection: 'row', borderRadius: 14, borderWidth: 1, padding: 12, gap: 10 },
  calloutIcon: { marginTop: 1 },
  li: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  bullet: { width: 7, height: 7, borderRadius: 4, marginTop: 9 },
  symRow: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 14, borderWidth: 1, padding: 10 },
  symBadge: { minWidth: 52, maxWidth: 140, paddingHorizontal: 8, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  rule: { borderRadius: 16, borderWidth: 1, padding: 14 },
  line: { height: 2, marginVertical: 8, borderRadius: 1, width: '100%', opacity: 0.8 },
  vennRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10 },
  compare: { flexDirection: 'row', gap: 10 },
  side: { flex: 1, borderRadius: 14, borderWidth: 1.5, padding: 12 },
});
