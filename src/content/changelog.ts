export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  notes: string[];
}

/** Newest first. Shown in "What's new" after an update and on the About screen. */
export const CHANGELOG: ChangelogEntry[] = [
  {
    version: '1.0.0',
    date: '2026-10-18',
    title: 'First release',
    notes: [
      '83 lessons in 26 units across three levels, from basic arguments to modal logic, type theory and complexity.',
      'About 1,400 questions with explanations, 19 generators for endless drills, and study notes for every unit.',
      'Placement test, unit tests and level exams with certificates.',
      'Truth Table Lab, Syllogism Checker, a 180-term glossary, 45 fallacies and flashcards.',
      'Daily challenge, speed round and a review queue for your mistakes.',
      'Eight themes, XP, streaks, gems and achievements.',
      'Works fully offline. Updates arrive through GitHub Releases.',
    ],
  },
];
