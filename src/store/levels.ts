export function xpForLevel(level: number): number {
  return 25 * level * (level - 1);
}

export function levelFromXp(xp: number): number {
  return Math.max(1, Math.floor((1 + Math.sqrt(1 + (4 * xp) / 25)) / 2));
}

export const RANKS = [
  'Curious Mind',
  'Apprentice Thinker',
  'Premise Spotter',
  'Truth Seeker',
  'Syllogist',
  'Deducer',
  'Proof Crafter',
  'Dialectician',
  'Logician',
  'Master Reasoner',
  'Grand Logician',
  'Aristotle’s Heir',
];

export function rankForLevel(level: number): string {
  return RANKS[Math.min(RANKS.length - 1, Math.floor((level - 1) / 2))];
}

/** progress (0..1) within the current level */
export function levelProgress(xp: number): { level: number; into: number; need: number; pct: number } {
  const level = levelFromXp(xp);
  const base = xpForLevel(level);
  const need = xpForLevel(level + 1) - base;
  const into = xp - base;
  return { level, into, need, pct: Math.max(0, Math.min(1, into / need)) };
}
