import type { Lesson, Level, Question, Unit } from './types';
import { argumentsUnit, propBasicsUnit, truthTablesUnit } from './beginner1';
import { fallaciesUnit, puzzlesUnit, syllogismsUnit } from './beginner2';
import { equivalencesUnit, inferenceUnit, proofsUnit } from './intermediate1';
import { booleanUnit, predicate1Unit, setsUnit, syllogismsDeepUnit } from './intermediate2';
import { deductionUnit, metalogicUnit, predicate2Unit } from './advanced1';
import { modalUnit, nonclassicalUnit, temporalUnit } from './advanced2';
import { computingUnit, paradoxesUnit } from './advanced3';
import { criticalThinkingUnit, probabilityUnit } from './extra1';
import { complexityUnit, higherOrderUnit, puzzles2Unit } from './extra2';
import { BANK } from './banks';

export const UNITS: Unit[] = [
  // Beginner
  argumentsUnit,
  propBasicsUnit,
  truthTablesUnit,
  syllogismsUnit,
  fallaciesUnit,
  puzzlesUnit,
  criticalThinkingUnit,
  // Intermediate
  equivalencesUnit,
  inferenceUnit,
  proofsUnit,
  syllogismsDeepUnit,
  predicate1Unit,
  booleanUnit,
  setsUnit,
  probabilityUnit,
  puzzles2Unit,
  // Advanced
  predicate2Unit,
  deductionUnit,
  metalogicUnit,
  modalUnit,
  temporalUnit,
  nonclassicalUnit,
  computingUnit,
  higherOrderUnit,
  complexityUnit,
  paradoxesUnit,
];

// Merge the extra question banks into their lessons. Ids continue after the lesson's own questions.
for (const u of UNITS) {
  for (const l of u.lessons) {
    const extra = BANK[l.id];
    if (!extra) continue;
    for (const q of extra) l.questions.push({ ...q, id: `${l.id}.${l.questions.length + 1}` } as Question);
  }
}

// Tag every question with its unit and level so analytics and mixed sessions work.
for (const u of UNITS) {
  for (const l of u.lessons) {
    for (const q of l.questions) {
      q.unit = u.id;
      q.level = u.level;
    }
  }
}

export interface LessonRef extends Lesson {
  unitId: string;
  level: Level;
  index: number;
}

export const ALL_LESSONS: LessonRef[] = UNITS.flatMap((u) =>
  u.lessons.map((l, i) => ({ ...l, unitId: u.id, level: u.level, index: i }))
);

export const UNIT_BY_ID: Record<string, Unit> = Object.fromEntries(UNITS.map((u) => [u.id, u]));
export const LESSON_BY_ID: Record<string, LessonRef> = Object.fromEntries(ALL_LESSONS.map((l) => [l.id, l]));

export const ALL_QUESTIONS: Question[] = ALL_LESSONS.flatMap((l) => l.questions);

export const unitsOfLevel = (level: Level) => UNITS.filter((u) => u.level === level);
export const lessonsOfLevel = (level: Level) => ALL_LESSONS.filter((l) => l.level === level);
export const questionsOfUnit = (unitId: string) => UNIT_BY_ID[unitId]?.lessons.flatMap((l) => l.questions) ?? [];
export const questionsOfLevel = (level: Level) => ALL_QUESTIONS.filter((q) => q.level === level);

export function nextLessonAfter(lessonId: string): LessonRef | null {
  const i = ALL_LESSONS.findIndex((l) => l.id === lessonId);
  return i >= 0 && i + 1 < ALL_LESSONS.length ? ALL_LESSONS[i + 1] : null;
}

export const TOTAL_LESSONS = ALL_LESSONS.length;
