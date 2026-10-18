import { ALL_LESSONS, UNITS, lessonsOfLevel } from '@/content/curriculum';
import type { Level, Unit } from '@/content/types';
import type { Progress } from '@/store';

export type LessonStatus = 'done' | 'open' | 'locked';

export function lessonDone(pr: Progress, id: string): boolean {
  return !!pr.lessons[id];
}

export function unitComplete(pr: Progress, u: Unit): boolean {
  return u.lessons.every((l) => lessonDone(pr, l.id)) || !!pr.tests[u.id]?.passed;
}

export function unitProgress(pr: Progress, u: Unit): { done: number; total: number; pct: number } {
  const done = u.lessons.filter((l) => lessonDone(pr, l.id)).length;
  return { done, total: u.lessons.length, pct: done / u.lessons.length };
}

/** Is the unit open for study? Earlier levels are open after placement; the rest unlock in order. */
export function unitUnlocked(pr: Progress, startLevel: Level, u: Unit): boolean {
  if (u.level < startLevel) return true;
  const idx = UNITS.indexOf(u);
  if (idx === 0) return true;
  const firstOfStartLevel = UNITS.find((x) => x.level === startLevel);
  if (u === firstOfStartLevel) return true;
  return unitComplete(pr, UNITS[idx - 1]);
}

export function lessonStatus(pr: Progress, startLevel: Level, u: Unit, lessonIndex: number): LessonStatus {
  const l = u.lessons[lessonIndex];
  if (lessonDone(pr, l.id)) return 'done';
  if (pr.tests[u.id]?.passed) return 'open';
  if (!unitUnlocked(pr, startLevel, u)) return 'locked';
  if (lessonIndex === 0) return 'open';
  return lessonDone(pr, u.lessons[lessonIndex - 1].id) ? 'open' : 'locked';
}

/** The lesson the learner should do next (first open, not-done lesson in curriculum order). */
export function nextRecommended(pr: Progress, startLevel: Level): { unit: Unit; lessonIndex: number } | null {
  // prefer the start level, then continue forward, then earlier ones
  const order = [...UNITS.filter((u) => u.level >= startLevel), ...UNITS.filter((u) => u.level < startLevel)];
  for (const u of order) {
    for (let i = 0; i < u.lessons.length; i++) {
      if (lessonStatus(pr, startLevel, u, i) === 'open') return { unit: u, lessonIndex: i };
    }
  }
  return null;
}

export function levelCompletion(pr: Progress, level: Level): { done: number; total: number; pct: number } {
  const ls = lessonsOfLevel(level);
  const done = ls.filter((l) => lessonDone(pr, l.id)).length;
  return { done, total: ls.length, pct: ls.length ? done / ls.length : 0 };
}

/** A level exam opens once 60% of that level's lessons are done (or the user placed above it). */
export function examUnlocked(pr: Progress, startLevel: Level, level: Level): boolean {
  if (level < startLevel) return true;
  return levelCompletion(pr, level).pct >= 0.6;
}

export const TOTAL = ALL_LESSONS.length;
