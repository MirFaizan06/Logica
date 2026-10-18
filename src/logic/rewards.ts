import type { SessionMode } from '@/store';

export interface RewardInput {
  mode: SessionMode;
  total: number;
  correct: number;
  hints: number;
  /** was the pass condition satisfied (unit test, exam, lesson) */
  passed: boolean;
  /** first time this lesson/test/exam was passed */
  firstTime: boolean;
  speedScore?: number;
}

export interface Reward {
  xp: number;
  gems: number;
  stars: number;
}

export const PASS_MARK = {
  lesson: 0.6,
  unitTest: 0.7,
  exam: 0.75,
  placement: 0,
} as const;

export function starsFor(pct: number): number {
  if (pct >= 1) return 3;
  if (pct >= 0.8) return 2;
  if (pct >= 0.6) return 1;
  return 0;
}

export function computeReward(i: RewardInput): Reward {
  const pct = i.total ? i.correct / i.total : 0;
  const hintPenalty = Math.min(i.hints, i.correct);
  let xp = 0;
  let gems = 0;
  let stars = 0;

  switch (i.mode) {
    case 'lesson': {
      stars = starsFor(pct);
      xp = i.correct * 4 + (pct === 1 ? 10 : 0) - hintPenalty;
      if (i.passed) {
        xp += 6;
        gems = i.firstTime ? 5 + (pct === 1 ? 5 : 0) : 0;
      } else xp = Math.round(xp / 2);
      if (!i.firstTime) xp = Math.round(xp * 0.6);
      break;
    }
    case 'unitTest': {
      xp = i.correct * 5 + (i.passed ? 25 : 0) - hintPenalty;
      gems = i.passed && i.firstTime ? 20 : 0;
      break;
    }
    case 'exam': {
      xp = i.correct * 4 + (i.passed ? 60 : 0);
      gems = i.passed && i.firstTime ? 50 : 0;
      break;
    }
    case 'practice':
      xp = i.correct * 3 - hintPenalty;
      gems = pct === 1 && i.total >= 5 ? 2 : 0;
      break;
    case 'mistakes':
      xp = i.correct * 4;
      gems = pct === 1 && i.total >= 3 ? 3 : 0;
      break;
    case 'daily':
      xp = i.correct * 5 + 15;
      gems = i.firstTime ? 10 : 0;
      break;
    case 'speed':
      xp = (i.speedScore ?? i.correct) * 2;
      gems = (i.speedScore ?? 0) >= 15 ? 5 : 0;
      break;
    case 'fallacy':
      xp = i.correct * 3;
      gems = pct === 1 && i.total >= 6 ? 3 : 0;
      break;
    case 'placement':
      xp = 30;
      gems = 10;
      break;
  }
  return { xp: Math.max(0, Math.round(xp)), gems, stars };
}

export function praise(pct: number): { title: string; mood: 'cheer' | 'happy' | 'think' | 'sad' } {
  if (pct >= 1) return { title: 'Flawless!', mood: 'cheer' };
  if (pct >= 0.8) return { title: 'Great work!', mood: 'cheer' };
  if (pct >= 0.6) return { title: 'Nice effort!', mood: 'happy' };
  if (pct >= 0.4) return { title: 'Getting there', mood: 'think' };
  return { title: 'Keep practising', mood: 'sad' };
}
