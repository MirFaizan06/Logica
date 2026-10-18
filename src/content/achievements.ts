import type { Data, SessionResult } from '@/store';
import { UNITS } from './curriculum';
import { levelFromXp } from '@/store/levels';

export interface Achievement {
  id: string;
  title: string;
  desc: string;
  icon: string;
  check: (d: Data, r?: SessionResult) => boolean;
}

const lessonsDone = (d: Data) => Object.keys(d.progress.lessons).length;
const unitsDone = (d: Data, lvl?: number) =>
  UNITS.filter(
    (u) => (lvl === undefined || u.level === lvl) && u.lessons.every((l) => d.progress.lessons[l.id])
  ).length;
const levelDone = (d: Data, lvl: number) =>
  UNITS.filter((u) => u.level === lvl).every((u) => u.lessons.every((l) => d.progress.lessons[l.id]));
const testsPassed = (d: Data) => Object.values(d.progress.tests).filter((t) => t.passed).length;
const examsPassed = (d: Data) => Object.values(d.progress.exams).filter((t) => t.passed).length;
const unitAccuracy = (d: Data, id: string) => {
  const u = d.stats.byUnit[id];
  return u && u.a >= 8 ? u.c / u.a : 0;
};

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-step', title: 'First Step', desc: 'Complete your first lesson.', icon: 'footsteps-outline', check: (d) => lessonsDone(d) >= 1 },
  { id: 'five-lessons', title: 'Getting Warmed Up', desc: 'Complete 5 lessons.', icon: 'flame-outline', check: (d) => lessonsDone(d) >= 5 },
  { id: 'fifteen-lessons', title: 'On a Roll', desc: 'Complete 15 lessons.', icon: 'trending-up-outline', check: (d) => lessonsDone(d) >= 15 },
  { id: 'thirty-lessons', title: 'Scholar', desc: 'Complete 30 lessons.', icon: 'library-outline', check: (d) => lessonsDone(d) >= 30 },
  { id: 'fifty-lessons', title: 'Half Century', desc: 'Complete 50 lessons.', icon: 'ribbon-outline', check: (d) => lessonsDone(d) >= 50 },
  { id: 'completionist', title: 'Completionist', desc: 'Complete every lesson in the app.', icon: 'checkmark-done-circle-outline', check: (d) => UNITS.every((u) => u.lessons.every((l) => d.progress.lessons[l.id])) },
  { id: 'q-2500', title: 'Logic Marathon', desc: 'Answer 2,500 questions.', icon: 'speedometer-outline', check: (d) => d.stats.answered >= 2500 },
  { id: 'perfect', title: 'Flawless', desc: 'Finish a lesson without a single mistake.', icon: 'diamond-outline', check: (_d, r) => !!r && r.mode === 'lesson' && r.total >= 4 && r.correct === r.total },
  { id: 'perfect-5', title: 'Perfectionist', desc: 'Get 5 perfect sessions.', icon: 'ribbon-outline', check: (d) => d.stats.perfect >= 5 },
  { id: 'q-50', title: 'Curious Mind', desc: 'Answer 50 questions.', icon: 'help-circle-outline', check: (d) => d.stats.answered >= 50 },
  { id: 'q-250', title: 'Question Machine', desc: 'Answer 250 questions.', icon: 'cog-outline', check: (d) => d.stats.answered >= 250 },
  { id: 'q-1000', title: 'Relentless', desc: 'Answer 1,000 questions.', icon: 'infinite-outline', check: (d) => d.stats.answered >= 1000 },
  { id: 'streak-3', title: 'Habit Forming', desc: 'Reach a 3-day streak.', icon: 'leaf-outline', check: (d) => d.streak.longest >= 3 },
  { id: 'streak-7', title: 'Week Warrior', desc: 'Reach a 7-day streak.', icon: 'calendar-outline', check: (d) => d.streak.longest >= 7 },
  { id: 'streak-30', title: 'Unbreakable', desc: 'Reach a 30-day streak.', icon: 'shield-checkmark-outline', check: (d) => d.streak.longest >= 30 },
  { id: 'goal-hit', title: 'Goal Getter', desc: 'Hit your daily XP goal.', icon: 'flag-outline', check: (d) => Object.values(d.stats.daily).some((x) => x.goal) },
  { id: 'goal-7', title: 'Consistent', desc: 'Hit your daily goal on 7 different days.', icon: 'stats-chart-outline', check: (d) => Object.values(d.stats.daily).filter((x) => x.goal).length >= 7 },
  { id: 'unit-1', title: 'Unit Cleared', desc: 'Complete every lesson in a unit.', icon: 'extension-puzzle-outline', check: (d) => unitsDone(d) >= 1 },
  { id: 'test-pass', title: 'Test Taker', desc: 'Pass a unit test.', icon: 'document-text-outline', check: (d) => testsPassed(d) >= 1 },
  { id: 'test-5', title: 'Straight A', desc: 'Pass 5 unit tests.', icon: 'school-outline', check: (d) => testsPassed(d) >= 5 },
  { id: 'level-1', title: 'Beginner Graduate', desc: 'Finish every Beginner lesson.', icon: 'leaf-outline', check: (d) => levelDone(d, 0) },
  { id: 'level-2', title: 'Intermediate Graduate', desc: 'Finish every Intermediate lesson.', icon: 'flame-outline', check: (d) => levelDone(d, 1) },
  { id: 'level-3', title: 'Advanced Graduate', desc: 'Finish every Advanced lesson.', icon: 'rocket-outline', check: (d) => levelDone(d, 2) },
  { id: 'exam-pass', title: 'Certified', desc: 'Pass a level exam.', icon: 'reader-outline', check: (d) => examsPassed(d) >= 1 },
  { id: 'exam-all', title: 'Grand Logician', desc: 'Pass all three level exams.', icon: 'trophy-outline', check: (d) => examsPassed(d) >= 3 },
  { id: 'daily-1', title: 'Daily Challenger', desc: 'Complete a Daily Challenge.', icon: 'sunny-outline', check: (d) => Object.keys(d.stats.dailyChallenges).length >= 1 },
  { id: 'daily-7', title: 'Daily Devotee', desc: 'Complete 7 Daily Challenges.', icon: 'sunny', check: (d) => Object.keys(d.stats.dailyChallenges).length >= 7 },
  { id: 'speed-10', title: 'Quick Thinker', desc: 'Score 10 in a Speed Round.', icon: 'flash-outline', check: (d) => d.stats.speedBest >= 10 },
  { id: 'speed-20', title: 'Lightning Logic', desc: 'Score 20 in a Speed Round.', icon: 'thunderstorm-outline', check: (d) => d.stats.speedBest >= 20 },
  { id: 'fallacy-20', title: 'Fallacy Hunter', desc: 'Spot 20 fallacies correctly.', icon: 'eye-outline', check: (d) => d.stats.fallacyCorrect >= 20 },
  { id: 'flash-50', title: 'Memory Palace', desc: 'Review 50 flashcards.', icon: 'albums-outline', check: (d) => d.stats.flashReviews >= 50 },
  { id: 'lab-10', title: 'Lab Rat', desc: 'Use the Lab tools 10 times.', icon: 'flask-outline', check: (d) => d.stats.labUses >= 10 },
  { id: 'mistakes-clear', title: 'Learning From Errors', desc: 'Clear your mistakes queue after a review.', icon: 'checkmark-done-outline', check: (d, r) => !!r && r.mode === 'mistakes' && d.mistakes.length === 0 && r.total >= 3 },
  { id: 'master-prop', title: 'Truth Table Titan', desc: 'Keep ≥ 85% accuracy over 8+ truth-table questions.', icon: 'calculator-outline', check: (d) => { const t = d.stats.byType.tt; return !!t && t.a >= 8 && t.c / t.a >= 0.85; } },
  { id: 'syllogism-ace', title: 'Syllogism Ace', desc: 'Keep ≥ 80% accuracy over 8+ syllogism questions.', icon: 'business-outline', check: (d) => unitAccuracy(d, 'syllogisms') >= 0.8 || unitAccuracy(d, 'syllogisms-deep') >= 0.8 },
  { id: 'xp-500', title: 'Rising Star', desc: 'Earn 500 XP.', icon: 'star-outline', check: (d) => d.progress.xp >= 500 },
  { id: 'xp-2500', title: 'Shining Star', desc: 'Earn 2,500 XP.', icon: 'star', check: (d) => d.progress.xp >= 2500 },
  { id: 'level-10', title: 'Double Digits', desc: 'Reach player level 10.', icon: 'medal-outline', check: (d) => levelFromXp(d.progress.xp) >= 10 },
  { id: 'theme-owner', title: 'Style Icon', desc: 'Unlock a premium theme.', icon: 'color-palette-outline', check: (d) => d.progress.unlockedThemes.length > 4 },
  { id: 'placement', title: 'Knows Their Level', desc: 'Complete the placement test.', icon: 'compass-outline', check: (d) => d.profile.placementDone },
];

export function evaluateAchievements(d: Data, r?: SessionResult): string[] {
  const out: string[] = [];
  for (const a of ACHIEVEMENTS) {
    if (d.achievements[a.id]) continue;
    try {
      if (a.check(d, r)) out.push(a.id);
    } catch {
      /* never let an achievement check break a session */
    }
  }
  return out;
}

export const achievementById = (id: string) => ACHIEVEMENTS.find((a) => a.id === id);
