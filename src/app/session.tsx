import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeIn, FadeInDown, SlideInDown, SlideInRight, SlideOutLeft, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/Button';
import { Rich, T } from '@/components/AppText';
import { IconButton } from '@/components/ui';
import { ProgressBar } from '@/components/Progress';
import { QuestionView } from '@/components/QuestionView';
import { Sheet } from '@/components/Sheet';
import { Tap } from '@/components/Tap';
import { useSession, type SessionConfig } from '@/store/session';
import { useStore, type AnswerRecord, type SessionResult } from '@/store';
import { describeCorrect, grade, initialAnswer, isReady, type AnswerValue } from '@/logic/grading';
import { computeReward, starsFor } from '@/logic/rewards';
import { haptic } from '@/services/haptics';
import { placementLevel } from '@/services/sessions';
import { alpha, FONT, useTheme } from '@/theme/ThemeProvider';

/** Re-keyed per session so every run starts from clean state. */
export default function SessionScreen() {
  const config = useSession((s) => s.config);
  const nonce = useSession((s) => s.nonce);
  return <SessionBody key={nonce} config={config} />;
}

function SessionBody({ config }: { config: SessionConfig | null }) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState<AnswerValue>(() => {
    const first = config?.questions[0];
    return first ? initialAnswer(first) : null;
  });
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);
  const [leave, setLeave] = useState(false);
  const [combo, setCombo] = useState(0);
  const [score, setScore] = useState(0);
  const answers = useRef<AnswerRecord[]>([]);
  const hints = useRef(0);
  const hintedThis = useRef(false);
  const started = useRef(0);
  const finished = useRef(false);
  const shake = useSharedValue(0);

  const mode = config?.mode;
  const isSpeed = mode === 'speed';
  const isPlacement = mode === 'placement';
  const quick = isSpeed; // no explanation panel, auto advance
  const [timeLeft, setTimeLeft] = useState(config?.timeLimit ?? 0);

  const questions = useMemo(() => config?.questions ?? [], [config]);
  const q = questions[idx];

  useEffect(() => {
    started.current = Date.now();
  }, []);

  const finish = useCallback(() => {
    if (!config || finished.current) return;
    finished.current = true;
    const recs = answers.current;
    const total = recs.length || questions.length;
    const right = recs.filter((a) => a.correct).length;
    const pct = total ? right / total : 0;
    const passed = config.mode === 'placement' ? true : config.passMark ? pct >= config.passMark : true;
    const secs = Math.round((Date.now() - started.current) / 1000);
    const reward = computeReward({
      mode: config.mode,
      total,
      correct: right,
      hints: hints.current,
      passed,
      firstTime: !!config.firstTime,
      speedScore: config.mode === 'speed' ? right : undefined,
    });
    const result: SessionResult = {
      mode: config.mode,
      title: config.title,
      unitId: config.unitId,
      lessonId: config.lessonId,
      level: config.level,
      total,
      correct: right,
      secs,
      answers: recs,
      xp: reward.xp,
      gems: reward.gems,
      passed,
      stars: config.mode === 'lesson' ? starsFor(pct) : 0,
      firstTime: !!config.firstTime,
      speedScore: config.mode === 'speed' ? right : undefined,
    };
    if (config.mode === 'placement') {
      useStore.getState().setProfile({ placementDone: true, startLevel: placementLevel(recs), placementScore: right });
    }
    const outcome = useStore.getState().completeSession(result);
    useSession.getState().finish(result, outcome);
    router.replace('/results');
  }, [config, questions.length]);

  // speed round clock
  useEffect(() => {
    if (!isSpeed || !config?.timeLimit) return;
    const end = Date.now() + config.timeLimit * 1000;
    const timer = setInterval(() => {
      const left = Math.max(0, Math.ceil((end - Date.now()) / 1000));
      setTimeLeft(left);
      if (left <= 0) {
        clearInterval(timer);
        finish();
      }
    }, 250);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSpeed]);

  const advance = useCallback(() => {
    if (idx + 1 >= questions.length) {
      finish();
      return;
    }
    const nq = questions[idx + 1];
    setIdx(idx + 1);
    setAnswer(initialAnswer(nq));
    setChecked(false);
    setHintOpen(false);
    hintedThis.current = false;
  }, [idx, questions, finish]);

  const check = () => {
    if (!q || !isReady(q, answer) || checked) return;
    const ok = grade(q, answer);
    answers.current.push({ q, correct: ok });
    setCorrect(ok);
    setChecked(true);
    setCombo(ok ? combo + 1 : 0);
    if (ok) setScore((n) => n + 1);
    if (!isPlacement) {
      if (ok) haptic.success();
      else haptic.error();
    }
    if (!ok) {
      shake.value = withSequence(withTiming(-8, { duration: 50 }), withTiming(8, { duration: 80 }), withTiming(-6, { duration: 70 }), withTiming(0, { duration: 60 }));
    }
    if (quick) setTimeout(advance, ok ? 450 : 900);
    else if (isPlacement) setTimeout(advance, 150);
  };

  const showHint = () => {
    if (!q?.hint || checked) return;
    if (!hintedThis.current) {
      hintedThis.current = true;
      hints.current += 1;
    }
    setHintOpen(true);
    haptic.tap();
  };

  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shake.value }] }));
  const ready = q ? isReady(q, answer) : false;
  const pctDone = questions.length ? (idx + (checked ? 1 : 0)) / questions.length : 0;
  const reveal = useMemo(() => (q && checked && !correct ? describeCorrect(q) : ''), [q, checked, correct]);

  if (!config || !q) {
    return (
      <View style={{ flex: 1, backgroundColor: t.bg, alignItems: 'center', justifyContent: 'center', gap: 14, padding: 24 }}>
        <T v="h2" center>
          Nothing to practise
        </T>
        <Button title="Back" onPress={() => router.back()} full={false} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <StatusBar style={t.dark ? 'light' : 'dark'} />
      <LinearGradient colors={t.bgGradient} style={StyleSheet.absoluteFill} />
      <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 18 }}>
        <View style={styles.top}>
          <IconButton name="close" label="Leave session" onPress={() => setLeave(true)} />
          <View style={{ flex: 1 }}>
            {isSpeed ? (
              <ProgressBar value={timeLeft / (config.timeLimit || 60)} height={12} colors={[t.accent, t.danger]} />
            ) : (
              <ProgressBar value={pctDone} height={12} />
            )}
          </View>
          {isSpeed ? (
            <View style={[styles.chip, { backgroundColor: alpha(t.accent, 0.16) }]}>
              <Ionicons name="timer-outline" size={16} color={t.accent} />
              <T v="small" style={{ color: t.accent, fontFamily: FONT.heavy }}>
                {timeLeft}s
              </T>
            </View>
          ) : combo >= 2 ? (
            <Animated.View entering={FadeIn.duration(200)} style={[styles.chip, { backgroundColor: alpha(t.accent, 0.16) }]}>
              <Ionicons name="flame" size={16} color={t.accent} />
              <T v="small" style={{ color: t.accent, fontFamily: FONT.heavy }}>
                {combo}
              </T>
            </Animated.View>
          ) : (
            <T v="small" c="muted" style={{ width: 44 }} center>
              {idx + 1}/{questions.length}
            </T>
          )}
        </View>
        <T v="caption" c="muted" style={{ marginTop: 12 }} numberOfLines={1}>
          {config.title}
          {isSpeed ? `  ·  score ${score}` : ''}
        </T>
      </View>

      <View style={{ flex: 1 }}>
        <Animated.View key={idx} entering={SlideInRight.duration(260)} exiting={SlideOutLeft.duration(160)} style={StyleSheet.absoluteFill}>
          <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <Animated.View style={shakeStyle}>
              <QuestionView q={q} value={answer} onChange={setAnswer} checked={checked} />
            </Animated.View>
            {q.hint && !checked && !quick && !isPlacement && (
              <View style={{ marginTop: 18 }}>
                {hintOpen ? (
                  <Animated.View entering={FadeInDown.duration(260)} style={[styles.hint, { backgroundColor: alpha(t.info, 0.14), borderColor: alpha(t.info, 0.4) }]}>
                    <Ionicons name="bulb" size={18} color={t.info} />
                    <Rich text={q.hint} v="small" style={{ flex: 1 }} />
                  </Animated.View>
                ) : (
                  <Tap onPress={showHint} feedback="tap" style={styles.hintBtn}>
                    <Ionicons name="bulb-outline" size={18} color={t.info} />
                    <T v="small" style={{ color: t.info, fontFamily: FONT.bold }}>
                      Need a hint? (costs a little XP)
                    </T>
                  </Tap>
                )}
              </View>
            )}
            <View style={{ height: checked && !quick && !isPlacement ? 260 : 20 }} />
          </ScrollView>
        </Animated.View>
      </View>

      {!checked && (
        <View style={[styles.footer, { paddingBottom: insets.bottom + 12, borderTopColor: t.border }]}>
          <Button title={isPlacement && idx + 1 === questions.length ? 'Finish' : isPlacement ? 'Next' : 'Check'} onPress={check} disabled={!ready} />
        </View>
      )}

      {checked && !quick && !isPlacement && (
        <Animated.View
          entering={SlideInDown.springify().damping(18).stiffness(200)}
          style={[
            styles.panel,
            {
              backgroundColor: correct ? t.successSoft : t.dangerSoft,
              borderColor: correct ? t.success : t.danger,
              paddingBottom: insets.bottom + 14,
            },
          ]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <Ionicons name={correct ? 'checkmark-circle' : 'close-circle'} size={30} color={correct ? t.success : t.danger} />
            <T v="h2" style={{ color: correct ? t.success : t.danger }}>
              {correct ? ['Correct!', 'Nice one!', 'Exactly right', 'Well done!'][idx % 4] : 'Not quite'}
            </T>
          </View>
          <ScrollView style={{ maxHeight: 150 }} showsVerticalScrollIndicator={false}>
            {!correct && reveal ? (
              <T v="small" style={{ fontFamily: FONT.bold, marginBottom: 6 }}>
                Answer: {reveal}
              </T>
            ) : null}
            <Rich text={q.explain} v="small" />
          </ScrollView>
          <View style={{ marginTop: 12 }}>
            <Button title={idx + 1 >= questions.length ? 'Finish' : 'Continue'} variant={correct ? 'success' : 'danger'} onPress={advance} />
          </View>
        </Animated.View>
      )}

      <Sheet visible={leave} onClose={() => setLeave(false)} center>
        <T v="h2" center>
          Leave this session?
        </T>
        <T v="body" c="muted" center style={{ marginVertical: 12 }}>
          {isPlacement ? 'You can take the placement test later from your profile.' : 'Your answers so far will not be saved.'}
        </T>
        <View style={{ gap: 8 }}>
          <Button title="Keep going" onPress={() => setLeave(false)} />
          <Button
            title="Leave"
            variant="secondary"
            onPress={() => {
              setLeave(false);
              finished.current = true;
              useSession.getState().clear();
              router.back();
            }}
          />
        </View>
      </Sheet>
    </View>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 99, minWidth: 54, justifyContent: 'center' },
  body: { paddingHorizontal: 18, paddingTop: 16 },
  hint: { flexDirection: 'row', gap: 10, padding: 12, borderRadius: 14, borderWidth: 1, alignItems: 'flex-start' },
  hintBtn: { flexDirection: 'row', gap: 8, alignItems: 'center', alignSelf: 'flex-start', paddingVertical: 6 },
  footer: { paddingHorizontal: 18, paddingTop: 12, borderTopWidth: 1 },
  panel: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 18, paddingTop: 16, borderTopWidth: 3, borderTopLeftRadius: 28, borderTopRightRadius: 28 },
});
