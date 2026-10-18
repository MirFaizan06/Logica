import React from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { StatsBar } from '@/components/StatsBar';
import { T } from '@/components/AppText';
import { Card } from '@/components/Card';
import { IconBadge, SectionTitle } from '@/components/ui';
import { useTheme } from '@/theme/ThemeProvider';

interface Tool {
  route: string;
  icon: string;
  title: string;
  sub: string;
  color: 'primary' | 'accent' | 'success' | 'info' | 'danger' | 'warn';
}

const BUILD: Tool[] = [
  { route: '/lab/truth-table', icon: 'grid', title: 'Truth Table Lab', sub: 'Type any formula, get the table, normal forms, equivalence and argument checks', color: 'primary' },
  { route: '/lab/syllogism', icon: 'ellipse', title: 'Syllogism Checker', sub: 'Pick a mood and figure, see the verdict and the Venn diagram', color: 'accent' },
  { route: '/lab/gates', icon: 'hardware-chip', title: 'Logic Gates', sub: 'Flip the inputs and watch AND, OR, NAND, XOR and friends respond', color: 'info' },
];

const REFERENCE: Tool[] = [
  { route: '/lab/notes', icon: 'document-text', title: 'Study notes', sub: 'Revision pages for every unit', color: 'primary' },
  { route: '/lab/glossary', icon: 'book', title: 'Glossary', sub: 'Every key term, searchable', color: 'success' },
  { route: '/lab/fallacies', icon: 'warning', title: 'Fallacy library', sub: 'Formal and informal, with examples', color: 'danger' },
  { route: '/lab/symbols', icon: 'text', title: 'Symbol cheat sheet', sub: 'Every symbol, tap to copy', color: 'warn' },
];

export default function Lab() {
  const t = useTheme();
  const col = (c: Tool['color']) => ({ primary: t.primary, accent: t.accent, success: t.success, info: t.info, danger: t.danger, warn: t.warn })[c];
  return (
    <Screen scroll bottom={120}>
      <StatsBar title="Lab" subtitle="Tools and reference" />
      <View style={{ gap: 12 }}>
        {BUILD.map((tool, i) => (
          <Animated.View key={tool.route} entering={FadeInDown.delay(60 + i * 80).duration(380)}>
            <Card onPress={() => router.push(tool.route as never)} style={styles.big} glow={t.glow ? col(tool.color) : undefined}>
              <IconBadge name={tool.icon} color={col(tool.color)} size={58} />
              <View style={{ flex: 1 }}>
                <T v="h3">{tool.title}</T>
                <T v="small" c="muted">
                  {tool.sub}
                </T>
              </View>
              <Ionicons name="chevron-forward" size={20} color={t.textMuted} />
            </Card>
          </Animated.View>
        ))}
      </View>

      <SectionTitle>Reference</SectionTitle>
      <View style={{ gap: 10 }}>
        {REFERENCE.map((tool, i) => (
          <Animated.View key={tool.route} entering={FadeInDown.delay(320 + i * 70).duration(360)}>
            <Card onPress={() => router.push(tool.route as never)} style={styles.small}>
              <IconBadge name={tool.icon} color={col(tool.color)} size={44} />
              <View style={{ flex: 1 }}>
                <T v="bodyB">{tool.title}</T>
                <T v="small" c="muted">
                  {tool.sub}
                </T>
              </View>
              <Ionicons name="chevron-forward" size={18} color={t.textMuted} />
            </Card>
          </Animated.View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  big: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 },
  small: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 },
});
