import type { Block, Classify, Lesson, Level, Match, MCQ, Multi, Order, Page, Question, TF, TT, Unit } from './types';

type NoId<T> = Omit<T, 'id'>;
export type QDraft = NoId<MCQ> | NoId<TF> | NoId<Multi> | NoId<Order> | NoId<Match> | NoId<TT> | NoId<Classify>;

/* ---------- question constructors (ids are assigned by lesson()) ---------- */

export const mcq = (q: string, options: string[], answer: number, explain: string, hint?: string): NoId<MCQ> => ({
  type: 'mcq',
  q,
  options,
  answer,
  explain,
  hint,
});

export const tf = (q: string, answer: boolean, explain: string, hint?: string): NoId<TF> => ({
  type: 'tf',
  q,
  answer,
  explain,
  hint,
});

export const multi = (q: string, options: string[], answer: number[], explain: string, hint?: string): NoId<Multi> => ({
  type: 'multi',
  q,
  options,
  answer,
  explain,
  hint,
});

export const order = (q: string, items: string[], explain: string, hint?: string): NoId<Order> => ({
  type: 'order',
  q,
  items,
  explain,
  hint,
});

export const match = (q: string, pairs: [string, string][], explain: string, hint?: string): NoId<Match> => ({
  type: 'match',
  q,
  pairs,
  explain,
  hint,
});

export const tt = (formula: string, explain: string, q = 'Fill in the final column of the truth table.', hint?: string): NoId<TT> => ({
  type: 'tt',
  q,
  formula,
  explain,
  hint,
});

export const classify = (
  q: string,
  categories: string[],
  items: [string, number][],
  explain: string,
  hint?: string
): NoId<Classify> => ({
  type: 'classify',
  q,
  categories,
  items: items.map(([text, cat]) => ({ text, cat })),
  explain,
  hint,
});

/* ---------- lesson block constructors ---------- */

export const p = (text: string): Block => ({ t: 'p', text });
export const h = (text: string): Block => ({ t: 'h', text });
export const ex = (lines: string[], label?: string): Block => ({ t: 'ex', label, lines });
export const tip = (text: string): Block => ({ t: 'tip', text });
export const warn = (text: string): Block => ({ t: 'warn', text });
export const list = (...items: string[]): Block => ({ t: 'list', items });
export const sym = (...items: { sym: string; name: string; note?: string }[]): Block => ({ t: 'sym', items });
export const ttb = (...formulas: string[]): Block => ({ t: 'tt', formulas });
export const rule = (name: string, premises: string[], conclusion: string): Block => ({ t: 'rule', name, premises, conclusion });
export const venn = (...forms: ('A' | 'E' | 'I' | 'O')[]): Block => ({ t: 'venn', forms });
export const cmp = (
  left: { title: string; lines: string[] },
  right: { title: string; lines: string[] }
): Block => ({ t: 'compare', left, right });

export const pg = (title: string, ...blocks: Block[]): Page => ({ title, blocks });

export function lesson(
  id: string,
  title: string,
  icon: string,
  blurb: string,
  minutes: number,
  pages: Page[],
  questions: QDraft[]
): Lesson {
  return {
    id,
    title,
    icon,
    blurb,
    minutes,
    pages,
    questions: questions.map((q, i) => ({ ...q, id: `${id}.${i + 1}` }) as Question),
  };
}

export function unit(
  id: string,
  level: Level,
  title: string,
  icon: string,
  hue: number,
  blurb: string,
  lessons: Lesson[]
): Unit {
  return { id, level, title, icon, hue, blurb, lessons };
}
