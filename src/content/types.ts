export type Level = 0 | 1 | 2; // 0 beginner, 1 intermediate, 2 advanced

export const LEVEL_NAMES = ['Beginner', 'Intermediate', 'Advanced'] as const;
export const LEVEL_ICONS = ['leaf-outline', 'flame-outline', 'rocket-outline'] as const;

interface QBase {
  id: string;
  q: string;
  hint?: string;
  explain: string;
  /** Unit this question belongs to — used for analytics. Filled in by the curriculum loader. */
  unit?: string;
  level?: Level;
}

export interface MCQ extends QBase {
  type: 'mcq';
  options: string[];
  answer: number;
}

export interface TF extends QBase {
  type: 'tf';
  answer: boolean;
}

export interface Multi extends QBase {
  type: 'multi';
  options: string[];
  answer: number[];
}

export interface Order extends QBase {
  type: 'order';
  /** items in the CORRECT order */
  items: string[];
}

export interface Match extends QBase {
  type: 'match';
  pairs: [string, string][];
}

export interface TT extends QBase {
  type: 'tt';
  /** formula in the engine's syntax, e.g. "p -> (q & r)" */
  formula: string;
}

export interface Classify extends QBase {
  type: 'classify';
  categories: string[];
  items: { text: string; cat: number }[];
}

export type Question = MCQ | TF | Multi | Order | Match | TT | Classify;
export type QuestionType = Question['type'];

export const TYPE_LABELS: Record<QuestionType, string> = {
  mcq: 'Multiple choice',
  tf: 'True / False',
  multi: 'Select all',
  order: 'Ordering',
  match: 'Matching',
  tt: 'Truth tables',
  classify: 'Classifying',
};

/* ---------- lesson content ---------- */

export type Block =
  | { t: 'p'; text: string }
  | { t: 'h'; text: string }
  | { t: 'ex'; label?: string; lines: string[] }
  | { t: 'tip'; text: string }
  | { t: 'warn'; text: string }
  | { t: 'list'; items: string[] }
  | { t: 'sym'; items: { sym: string; name: string; note?: string }[] }
  | { t: 'tt'; formulas: string[] }
  | { t: 'rule'; name: string; premises: string[]; conclusion: string }
  | { t: 'venn'; forms: ('A' | 'E' | 'I' | 'O')[] }
  | { t: 'compare'; left: { title: string; lines: string[] }; right: { title: string; lines: string[] } };

export interface Page {
  title: string;
  blocks: Block[];
}

export interface Lesson {
  id: string;
  title: string;
  blurb: string;
  icon: string;
  minutes: number;
  pages: Page[];
  questions: Question[];
}

export interface Unit {
  id: string;
  level: Level;
  title: string;
  blurb: string;
  icon: string;
  /** theme color key used for the unit banner gradient */
  hue: number;
  lessons: Lesson[];
}
