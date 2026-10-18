import React from 'react';
import { Linking, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Screen } from '@/components/Screen';
import { T } from '@/components/AppText';
import { Card } from '@/components/Card';
import { Group, ListRow } from '@/components/ListRow';
import { LogoMark } from '@/components/Mascot';
import { Header, SectionTitle } from '@/components/ui';
import { CHANGELOG } from '@/content/changelog';
import { TOTAL_LESSONS, ALL_QUESTIONS } from '@/content/curriculum';
import { GITHUB, RELEASES_PAGE, currentVersion } from '@/services/updates';
import { useTheme } from '@/theme/ThemeProvider';

const EMAIL = 'techbytesdesign@gmail.com';

export default function About() {
  const t = useTheme();
  const open = (url: string) => Linking.openURL(url).catch(() => {});
  return (
    <Screen scroll bottom={30}>
      <Header title="About" />
      <Animated.View entering={FadeInDown.duration(400)} style={{ alignItems: 'center', gap: 6, marginVertical: 14 }}>
        <LogoMark size={92} />
        <T v="display" style={{ marginTop: 10 }}>
          Logica
        </T>
        <T v="body" c="muted" center>
          Learn every kind of formal logic.
        </T>
        <T v="small" c="muted">
          Version {currentVersion()}
        </T>
      </Animated.View>

      <Card style={{ gap: 4, alignItems: 'center' }}>
        <T v="caption" c="muted">
          Developed by
        </T>
        <T v="h2">Tech Bytes Design</T>
        <T v="small" c="muted" style={{ marginTop: 6 }}>
          Developer
        </T>
        <T v="bodyB">Mir Faizan</T>
      </Card>

      <SectionTitle>Get in touch</SectionTitle>
      <Group>
        <ListRow icon="mail" color={t.primary} title="Contact" sub={EMAIL} onPress={() => open(`mailto:${EMAIL}?subject=Logica%20feedback`)} />
        <ListRow icon="logo-github" color={t.text} title="Source code" sub={`github.com/${GITHUB.owner}/${GITHUB.repo}`} onPress={() => open(`https://github.com/${GITHUB.owner}/${GITHUB.repo}`)} />
        <ListRow icon="bug" color={t.danger} title="Report a problem" sub="Open an issue on GitHub" onPress={() => open(`https://github.com/${GITHUB.owner}/${GITHUB.repo}/issues/new`)} />
        <ListRow icon="pricetags" color={t.success} title="Releases" sub="Every version and its notes" onPress={() => open(RELEASES_PAGE)} last />
      </Group>

      <SectionTitle>The app in numbers</SectionTitle>
      <Card>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          {[
            [TOTAL_LESSONS, 'lessons'],
            [ALL_QUESTIONS.length, 'questions'],
            [3, 'levels'],
          ].map(([n, l]) => (
            <View key={String(l)} style={{ alignItems: 'center' }}>
              <T v="title">{n}</T>
              <T v="small" c="muted">
                {l}
              </T>
            </View>
          ))}
        </View>
      </Card>

      <SectionTitle>What’s new</SectionTitle>
      <View style={{ gap: 10 }}>
        {CHANGELOG.map((c) => (
          <Card key={c.version} style={{ gap: 6 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <T v="bodyB">
                {c.version} · {c.title}
              </T>
              <T v="small" c="muted">
                {c.date}
              </T>
            </View>
            {c.notes.map((n, i) => (
              <T key={i} v="small" c="muted">
                • {n}
              </T>
            ))}
          </Card>
        ))}
      </View>

      <T v="small" c="muted" center style={{ marginTop: 22 }}>
        Logica is open source software released under the MIT license.
      </T>
      <T v="small" c="muted" center>
        © {new Date().getFullYear()} Tech Bytes Design
      </T>
    </Screen>
  );
}
