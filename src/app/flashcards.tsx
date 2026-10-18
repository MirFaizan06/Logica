import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import Animated, { Easing, FadeInDown, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Screen } from '@/components/Screen';
import { T } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { Tap } from '@/components/Tap';
import { Mascot } from '@/components/Mascot';
import { Header } from '@/components/ui';
import { ProgressBar } from '@/components/Progress';
import { CARDS, type Card } from '@/content/library';
import { useStore } from '@/store';
import { alpha, FONT, useTheme } from '@/theme/ThemeProvider';
import { dayKey, shuffle } from '@/utils/date';
import { haptic } from '@/services/haptics';

const TAGS = ['All', 'Basics', 'Propositional', 'Syllogistic', 'Predicate', 'Proof', 'Advanced', 'Fallacy', 'Symbol'];

function Flip({ card, flipped, onFlip }: { card: Card; flipped: boolean; onFlip: () => void }) {
  const t = useTheme();
  const p = useSharedValue(0);
  React.useEffect(() => {
    p.value = withTiming(flipped ? 1 : 0, { duration: 420, easing: Easing.inOut(Easing.cubic) });
  }, [flipped, p]);
  const front = useAnimatedStyle(() => ({ transform: [{ perspective: 900 }, { rotateY: `${p.value * 180}deg` }] }));
  const back = useAnimatedStyle(() => ({ transform: [{ perspective: 900 }, { rotateY: `${p.value * 180 + 180}deg` }] }));
  const face = [styles.face, { backgroundColor: t.card, borderColor: t.border, borderRadius: t.radius + 4, boxShadow: `0px 10px 28px ${alpha(t.shadow, t.dark ? 0.4 : 0.15)}` }];
  return (
    <Tap onPress={onFlip} feedback="tap" scale={0.99} style={styles.cardWrap}>
      <Animated.View style={[face, styles.abs, front]}>
        <T v="caption" c="muted">
          {card.tag}
        </T>
        <T v="title" center style={{ fontSize: card.front.length > 3 ? 26 : 56, lineHeight: card.front.length > 3 ? 34 : 64, marginTop: 10 }}>
          {card.front}
        </T>
        <T v="small" c="muted" style={{ position: 'absolute', bottom: 16 }}>
          Tap to reveal
        </T>
      </Animated.View>
      <Animated.View style={[face, styles.abs, back, { backgroundColor: alpha(t.primary, t.dark ? 0.16 : 0.08), borderColor: alpha(t.primary, 0.5) }]}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} showsVerticalScrollIndicator={false}>
          <T v="body" center style={{ fontFamily: FONT.semi, fontSize: 17, lineHeight: 26 }}>
            {card.back}
          </T>
        </ScrollView>
      </Animated.View>
    </Tap>
  );
}

export default function Flashcards() {
  const cards = useStore((s) => s.cards);
  const review = useStore((s) => s.reviewCard);
  const [tag, setTag] = useState('All');
  const [studyAhead, setStudyAhead] = useState(false);
  const today = dayKey();

  const pool = useMemo(() => {
    const inTag = CARDS.filter((c) => tag === 'All' || c.tag === tag);
    const due = inTag.filter((c) => !cards[c.id] || cards[c.id].due <= today);
    return studyAhead ? inTag : due;
    // the queue is rebuilt only when the filters change, not on every review
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tag, studyAhead]);

  const [queue, setQueue] = useState<Card[]>(() => shuffle(pool).slice(0, 20));
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);

  const restart = (nextPool: Card[]) => {
    setQueue(shuffle(nextPool).slice(0, 20));
    setI(0);
    setFlipped(false);
    setKnown(0);
  };

  const dueTotal = CARDS.filter((c) => !cards[c.id] || cards[c.id].due <= today).length;
  const card = queue[i];

  const answer = (knew: boolean) => {
    if (!card) return;
    review(card.id, knew);
    if (knew) haptic.success();
    else haptic.warn();
    if (knew) setKnown(known + 1);
    setFlipped(false);
    setTimeout(() => setI((n) => n + 1), 120);
  };

  return (
    <Screen bottom={0}>
      <Header title="Flashcards" subtitle={`${dueTotal} due today`} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 10 }} style={{ flexGrow: 0 }}>
        {TAGS.map((tg) => (
          <Chip
            key={tg}
            label={tg}
            active={tag === tg}
            onPress={() => {
              setTag(tg);
              const inTag = CARDS.filter((c) => tg === 'All' || c.tag === tg);
              const due = inTag.filter((c) => !cards[c.id] || cards[c.id].due <= today);
              restart(studyAhead ? inTag : due);
            }}
          />
        ))}
      </ScrollView>

      {card ? (
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 6 }}>
            <View style={{ flex: 1 }}>
              <ProgressBar value={i / queue.length} height={8} />
            </View>
            <T v="small" c="muted">
              {i + 1}/{queue.length}
            </T>
          </View>
          <Animated.View key={card.id} entering={FadeInDown.duration(300)} style={{ flex: 1, justifyContent: 'center', paddingVertical: 14 }}>
            <Flip card={card} flipped={flipped} onFlip={() => setFlipped(!flipped)} />
          </Animated.View>
          <View style={{ flexDirection: 'row', gap: 10, paddingBottom: 24 }}>
            <View style={{ flex: 1 }}>
              <Button title="Again" variant="secondary" icon="refresh" disabled={!flipped} onPress={() => answer(false)} />
            </View>
            <View style={{ flex: 1 }}>
              <Button title="Got it" variant="success" icon="checkmark" disabled={!flipped} onPress={() => answer(true)} />
            </View>
          </View>
        </View>
      ) : (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <Mascot size={130} mood={i > 0 ? 'cheer' : 'happy'} />
          <T v="title" center>
            {i > 0 ? 'Deck complete' : 'All caught up'}
          </T>
          <T v="body" c="muted" center>
            {i > 0 ? `You knew ${known} of ${queue.length}. Cards you missed will come back soon.` : 'No cards are due in this deck. Come back tomorrow, or study ahead.'}
          </T>
          <View style={{ alignSelf: 'stretch', gap: 8, marginTop: 8 }}>
            {!studyAhead && (
              <Button
                title="Study ahead anyway"
                variant="secondary"
                onPress={() => {
                  setStudyAhead(true);
                  restart(CARDS.filter((c) => tag === 'All' || c.tag === tag));
                }}
              />
            )}
            <Button title="Done" onPress={() => router.back()} />
          </View>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  cardWrap: { height: 300, width: '100%' },
  abs: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backfaceVisibility: 'hidden' },
  face: { borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', padding: 24 },
});
