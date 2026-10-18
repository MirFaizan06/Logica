import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { T } from '@/components/AppText';
import { Card } from '@/components/Card';
import { Tap } from '@/components/Tap';
import { Header, Segmented } from '@/components/ui';
import { Venn3 } from '@/components/Venn';
import { alpha, FONT, useTheme } from '@/theme/ThemeProvider';
import { analyze, statementText, vennFor, FORM_NAME, type Figure, type Form } from '@/logic/syllogism';
import { useStore } from '@/store';

const FORMS: Form[] = ['A', 'E', 'I', 'O'];
const PRESETS: { label: string; maj: Form; min: Form; con: Form; fig: Figure }[] = [
  { label: 'Barbara', maj: 'A', min: 'A', con: 'A', fig: 1 },
  { label: 'Celarent', maj: 'E', min: 'A', con: 'E', fig: 1 },
  { label: 'Darii', maj: 'A', min: 'I', con: 'I', fig: 1 },
  { label: 'Camestres', maj: 'A', min: 'E', con: 'E', fig: 2 },
  { label: 'Bocardo', maj: 'O', min: 'A', con: 'O', fig: 3 },
  { label: 'Undistributed middle', maj: 'A', min: 'A', con: 'A', fig: 2 },
];

function FormPicker({ label, value, onChange }: { label: string; value: Form; onChange: (f: Form) => void }) {
  const t = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <T v="small" c="muted" style={{ width: 98, fontFamily: FONT.bold }}>
        {label}
      </T>
      <View style={{ flex: 1, flexDirection: 'row', gap: 6 }}>
        {FORMS.map((f) => {
          const on = f === value;
          return (
            <Tap key={f} feedback="select" scale={0.92} onPress={() => onChange(f)} style={[styles.formBtn, { borderColor: on ? t.primary : t.border, backgroundColor: on ? alpha(t.primary, 0.18) : t.card }]}>
              <T v="bodyB" style={{ color: on ? t.primary : t.textMuted, fontFamily: FONT.heavy }}>
                {f}
              </T>
            </Tap>
          );
        })}
      </View>
    </View>
  );
}

function TermInput({ label, value, onChange, color }: { label: string; value: string; onChange: (s: string) => void; color: string }) {
  const t = useTheme();
  return (
    <View style={{ flex: 1, gap: 4 }}>
      <T v="caption" style={{ color }}>
        {label}
      </T>
      <TextInput
        value={value}
        onChangeText={(v) => onChange(v.slice(0, 14))}
        autoCapitalize="none"
        autoCorrect={false}
        style={[styles.term, { color: t.text, borderColor: alpha(color, 0.6), backgroundColor: t.card, fontFamily: FONT.semi }]}
      />
    </View>
  );
}

export default function SyllogismLab() {
  const t = useTheme();
  const [maj, setMaj] = useState<Form>('A');
  const [min, setMin] = useState<Form>('A');
  const [con, setCon] = useState<Form>('A');
  const [fig, setFig] = useState<Figure>(1);
  const [S, setS] = useState('dogs');
  const [P, setP] = useState('animals');
  const [M, setM] = useState('mammals');
  const noteLabUse = useStore((s) => s.noteLabUse);
  const names = useMemo(() => ({ S: S || 'S', P: P || 'P', M: M || 'M' }), [S, P, M]);

  const res = useMemo(() => analyze(maj, min, con, fig), [maj, min, con, fig]);
  const venn = useMemo(() => vennFor([res.statements[0], res.statements[1]]), [res]);

  useEffect(() => {
    const timer = setTimeout(noteLabUse, 3000);
    return () => clearTimeout(timer);
  }, [noteLabUse]);

  const color = res.verdict === 'valid' ? t.success : res.verdict === 'conditional' ? t.warn : t.danger;
  const title = res.verdict === 'valid' ? 'Valid' : res.verdict === 'conditional' ? 'Valid only with existential import' : 'Invalid';

  return (
    <Screen scroll bottom={30}>
      <Header title="Syllogism Checker" subtitle="Mood, figure, verdict and Venn diagram" />

      <View style={{ gap: 8 }}>
        <FormPicker label="Major premise" value={maj} onChange={setMaj} />
        <FormPicker label="Minor premise" value={min} onChange={setMin} />
        <FormPicker label="Conclusion" value={con} onChange={setCon} />
      </View>

      <View style={{ marginTop: 14 }}>
        <T v="caption" c="muted" style={{ marginBottom: 6 }}>
          Figure (where the middle term sits)
        </T>
        <Segmented options={([1, 2, 3, 4] as Figure[]).map((f) => ({ key: f, label: `Figure ${f}` }))} value={fig} onChange={setFig} />
      </View>

      <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
        <TermInput label="Minor term S" value={S} onChange={setS} color={t.primary} />
        <TermInput label="Major term P" value={P} onChange={setP} color={t.accent} />
        <TermInput label="Middle M" value={M} onChange={setM} color={t.success} />
      </View>

      <Card style={{ marginTop: 16, gap: 6 }}>
        {res.statements.map((st, i) => (
          <View key={i} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <View style={[styles.tag, { backgroundColor: alpha(t.primary, 0.14) }]}>
              <T v="small" c="primary" style={{ fontFamily: FONT.heavy }}>
                {st.form}
              </T>
            </View>
            <T v="body" style={{ flex: 1, fontFamily: FONT.semi }}>
              {i === 2 ? '∴ ' : ''}
              {statementText(st, names)}
            </T>
          </View>
        ))}
        <T v="small" c="muted" style={{ marginTop: 4 }}>
          {FORM_NAME[maj]} · {FORM_NAME[min]} · {FORM_NAME[con]}
        </T>
      </Card>

      <Animated.View key={res.mood} entering={FadeIn.duration(260)} style={[styles.verdict, { backgroundColor: alpha(color, t.dark ? 0.16 : 0.12), borderColor: alpha(color, 0.55) }]}>
        <Ionicons name={res.verdict === 'invalid' ? 'close-circle' : res.verdict === 'valid' ? 'checkmark-circle' : 'alert-circle'} size={30} color={color} />
        <View style={{ flex: 1 }}>
          <T v="h3" style={{ color }}>
            {title}
          </T>
          <T v="small" c="muted">
            {res.mood}
            {res.name ? ` · ${res.name}` : ''}
          </T>
          <T v="small" style={{ marginTop: 4 }}>
            {res.reason}
          </T>
        </View>
      </Animated.View>

      <Card style={{ marginTop: 14 }}>
        <T v="caption" c="muted">
          Venn diagram of the premises
        </T>
        <Venn3 empty={venn.empty} marks={venn.marks} names={names} />
        <T v="small" c="muted" center>
          Shaded regions are empty. × marks something that exists; a dashed link means “in one of these two regions”.
        </T>
      </Card>

      <T v="caption" c="muted" style={{ marginTop: 16, marginBottom: 8 }}>
        Famous forms
      </T>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {PRESETS.map((p) => (
          <Tap
            key={p.label}
            feedback="tap"
            scale={0.95}
            onPress={() => {
              setMaj(p.maj);
              setMin(p.min);
              setCon(p.con);
              setFig(p.fig);
            }}
            style={[styles.preset, { borderColor: alpha(t.primary, 0.4), backgroundColor: alpha(t.primary, 0.1) }]}
          >
            <T v="small" c="primary" style={{ fontFamily: FONT.bold }}>
              {p.label}
            </T>
          </Tap>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  formBtn: { flex: 1, height: 42, borderRadius: 12, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  term: { borderWidth: 2, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 10, fontSize: 15 },
  tag: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  verdict: { flexDirection: 'row', gap: 12, alignItems: 'center', padding: 14, borderRadius: 16, borderWidth: 1.5, marginTop: 14 },
  preset: { borderWidth: 1, borderRadius: 99, paddingHorizontal: 12, paddingVertical: 7 },
});
