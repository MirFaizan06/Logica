import { router } from 'expo-router';
import { ALL_QUESTIONS, LESSON_BY_ID, UNIT_BY_ID, UNITS, nextLessonAfter, questionsOfLevel, questionsOfUnit } from '@/content/curriculum';
import { FALLACIES } from '@/content/library';
import type { Level, MCQ, Question } from '@/content/types';
import { generate, UNIT_GENERATORS, type GenKind } from '@/logic/generators';
import { PASS_MARK } from '@/logic/rewards';
import { randomizeQuestion } from '@/logic/grading';
import { useStore } from '@/store';
import { useSession, type SessionConfig } from '@/store/session';
import { dayKey, hashString, seededRandom, shuffle } from '@/utils/date';

const prep = (qs: Question[], rnd: () => number = Math.random) => qs.map((q) => randomizeQuestion(q, rnd));

function launch(config: SessionConfig) {
  useSession.getState().start(config);
  router.push('/session');
}

/** Mix static questions with generated ones where a unit has generators. */
function unitPool(unitId: string, nGenerated: number, rnd: () => number = Math.random): Question[] {
  const stat = questionsOfUnit(unitId);
  const kinds = UNIT_GENERATORS[unitId];
  const gen: Question[] = [];
  if (kinds && nGenerated > 0) {
    for (let i = 0; i < nGenerated; i++) {
      const q = generate(kinds[i % kinds.length], rnd);
      q.unit = unitId;
      gen.push(q);
    }
  }
  return [...stat, ...gen];
}

export function startLessonQuiz(lessonId: string) {
  const lesson = LESSON_BY_ID[lessonId];
  if (!lesson) return;
  const done = !!useStore.getState().progress.lessons[lessonId];
  const qs = shuffle(lesson.questions).slice(0, 5);
  const next = nextLessonAfter(lessonId);
  launch({
    mode: 'lesson',
    title: lesson.title,
    subtitle: UNIT_BY_ID[lesson.unitId].title,
    questions: prep(qs),
    lessonId,
    unitId: lesson.unitId,
    level: lesson.level,
    passMark: PASS_MARK.lesson,
    firstTime: !done,
    nextLessonId: next?.id ?? null,
  });
}

export function startUnitTest(unitId: string) {
  const unit = UNIT_BY_ID[unitId];
  if (!unit) return;
  const pool = shuffle(unitPool(unitId, 4));
  const qs = pool.slice(0, 10);
  launch({
    mode: 'unitTest',
    title: `${unit.title} test`,
    subtitle: 'Score 70% to pass',
    questions: prep(qs),
    unitId,
    level: unit.level,
    passMark: PASS_MARK.unitTest,
    firstTime: !useStore.getState().progress.tests[unitId]?.passed,
  });
}

export function startExam(level: Level) {
  const units = UNITS.filter((u) => u.level === level);
  const buckets = units.map((u) => shuffle(unitPool(u.id, 2)));
  const picked: Question[] = [];
  let i = 0;
  while (picked.length < 20 && buckets.some((b) => b.length)) {
    const b = buckets[i % buckets.length];
    const q = b.shift();
    if (q) picked.push(q);
    i++;
  }
  const names = ['Beginner', 'Intermediate', 'Advanced'];
  launch({
    mode: 'exam',
    title: `${names[level]} exam`,
    subtitle: 'Score 75% to earn your certificate',
    questions: prep(shuffle(picked)),
    level,
    passMark: PASS_MARK.exam,
    firstTime: !useStore.getState().progress.exams[String(level)]?.passed,
  });
}

export function startPractice(opts: { unitId?: string; level?: Level | 'all'; count?: number }) {
  const count = opts.count ?? 10;
  let pool: Question[];
  let title = 'Practice';
  if (opts.unitId) {
    pool = unitPool(opts.unitId, 6);
    title = UNIT_BY_ID[opts.unitId].title;
  } else if (opts.level !== undefined && opts.level !== 'all') {
    pool = UNITS.filter((u) => u.level === opts.level).flatMap((u) => unitPool(u.id, 2));
    title = ['Beginner', 'Intermediate', 'Advanced'][opts.level] + ' mix';
  } else {
    pool = UNITS.flatMap((u) => unitPool(u.id, 1));
    title = 'Mixed practice';
  }
  launch({
    mode: 'practice',
    title,
    subtitle: `${count} questions`,
    questions: prep(shuffle(pool).slice(0, count)),
    unitId: opts.unitId,
  });
}

export function startDaily() {
  const key = dayKey();
  const rnd = seededRandom(hashString('daily-' + key));
  const done = useStore.getState().stats.dailyChallenges[key] !== undefined;
  const staticPool = ALL_QUESTIONS.filter((q) => q.type === 'mcq' || q.type === 'tf' || q.type === 'multi');
  const chosen = shuffle(staticPool, rnd).slice(0, 3);
  const gens: GenKind[] = ['eval', 'classify', 'equiv', 'argpattern', 'symbolize', 'syllogism', 'count', 'entails'];
  const g = shuffle(gens, rnd).slice(0, 2).map((k) => generate(k, rnd));
  launch({
    mode: 'daily',
    title: 'Daily Challenge',
    subtitle: key,
    questions: prep(shuffle([...chosen, ...g], rnd), rnd),
    firstTime: !done,
  });
}

export function startSpeed() {
  const kinds: GenKind[] = ['eval', 'classify', 'argvalid', 'syllogism', 'entails', 'count', 'argpattern', 'symbolize'];
  const gens: Question[] = [];
  for (let i = 0; i < 40; i++) gens.push(generate(kinds[i % kinds.length]));
  const stat = shuffle(ALL_QUESTIONS.filter((q) => q.type === 'tf' || (q.type === 'mcq' && q.options.length <= 4))).slice(0, 30);
  launch({
    mode: 'speed',
    title: 'Speed Round',
    subtitle: '60 seconds on the clock',
    questions: prep(shuffle([...gens, ...stat])),
    timeLimit: 60,
  });
}

export function startMistakes() {
  const m = useStore.getState().mistakes;
  if (!m.length) return;
  launch({
    mode: 'mistakes',
    title: 'Mistakes review',
    subtitle: `${Math.min(10, m.length)} of ${m.length} to fix`,
    questions: prep(shuffle(m).slice(0, 10)),
  });
}

function fallacyQuestion(f: (typeof FALLACIES)[number]): MCQ {
  const others = shuffle(FALLACIES.filter((x) => x.id !== f.id && x.kind === f.kind)).slice(0, 3);
  const opts = shuffle([f, ...others]);
  return {
    id: `fallacy:${f.id}:${Math.random().toString(36).slice(2, 6)}`,
    type: 'mcq',
    unit: 'fallacies',
    level: 0,
    q: `Which fallacy is this?\n\n“${f.example}”`,
    options: opts.map((o) => o.name),
    answer: opts.indexOf(f),
    hint: f.kind === 'Formal' ? 'This one is about the structure of the argument.' : 'This one is about the content or tactic.',
    explain: `${f.name}: ${f.def} ${f.fix}`,
  };
}

export function startFallacyGame() {
  const qs = shuffle(FALLACIES).slice(0, 8).map(fallacyQuestion);
  launch({ mode: 'fallacy', title: 'Fallacy Detective', subtitle: 'Name the flaw', questions: qs });
}

/* ------------------------------ placement ------------------------------ */

const PLACEMENT_UNITS: Record<Level, string[]> = {
  0: ['arguments', 'prop-basics', 'truth-tables', 'syllogisms'],
  1: ['equivalences', 'inference', 'predicate-1', 'boolean'],
  2: ['predicate-2', 'deduction', 'modal', 'metalogic'],
};

export function buildPlacement(): Question[] {
  const out: Question[] = [];
  ([0, 1, 2] as Level[]).forEach((lvl) => {
    PLACEMENT_UNITS[lvl].forEach((uid, i) => {
      let q: Question | undefined;
      if (lvl === 0 && uid === 'truth-tables') q = generate('eval');
      else if (lvl === 1 && uid === 'equivalences') q = generate('equiv');
      else {
        const pool = questionsOfUnit(uid).filter((x) => x.type === 'mcq' || x.type === 'tf');
        q = shuffle(pool)[0];
      }
      if (q) out.push({ ...randomizeQuestion(q), level: lvl, unit: uid } as Question);
      void i;
    });
  });
  return out;
}

export function startPlacement() {
  launch({
    mode: 'placement',
    title: 'Placement test',
    subtitle: '12 questions, easy to hard',
    questions: buildPlacement(),
  });
}

export function placementLevel(answers: { q: Question; correct: boolean }[]): Level {
  const by = [0, 0, 0];
  answers.forEach((a) => {
    if (a.correct && a.q.level !== undefined) by[a.q.level]++;
  });
  let level: Level = 0;
  if (by[0] >= 3) level = 1;
  if (by[0] >= 3 && by[1] >= 3) level = 2;
  return level;
}

export { questionsOfLevel };
