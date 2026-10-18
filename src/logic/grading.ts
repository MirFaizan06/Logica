import type { Classify, Match, MCQ, Multi, Order, Question, TT } from '@/content/types';
import { hashString, seededRandom, shuffle } from '@/utils/date';
import { assignments, evalNode, parse, varsOf } from './formula';

/**
 * The answer value stored per question type:
 *  mcq      number | null              index into (shuffled) options
 *  tf       boolean | null
 *  multi    number[]                   selected option indexes
 *  order    number[]                   chosen original-item indexes, in the order tapped
 *  match    Record<number, number>     left index -> right (original) index
 *  tt       (boolean | null)[]         one cell per truth-table row
 *  classify (number | null)[]          category per item
 */
export type AnswerValue = number | boolean | null | number[] | Record<number, number> | (boolean | null)[] | (number | null)[];

export function initialAnswer(q: Question): AnswerValue {
  switch (q.type) {
    case 'mcq':
      return null;
    case 'tf':
      return null;
    case 'multi':
      return [];
    case 'order':
      return [];
    case 'match':
      return {};
    case 'tt':
      return new Array(1 << varsOf(parse(q.formula)).length).fill(null);
    case 'classify':
      return new Array(q.items.length).fill(null);
  }
}

export function isReady(q: Question, a: AnswerValue): boolean {
  switch (q.type) {
    case 'mcq':
      return a !== null;
    case 'tf':
      return a !== null;
    case 'multi':
      return (a as number[]).length > 0;
    case 'order':
      return (a as number[]).length === q.items.length;
    case 'match':
      return Object.keys(a as Record<number, number>).length === q.pairs.length;
    case 'tt':
      return (a as (boolean | null)[]).every((c) => c !== null);
    case 'classify':
      return (a as (number | null)[]).every((c) => c !== null);
  }
}

export function ttColumn(q: TT): boolean[] {
  const n = parse(q.formula);
  return assignments(varsOf(n)).map((env) => evalNode(n, env));
}

export function grade(q: Question, a: AnswerValue): boolean {
  switch (q.type) {
    case 'mcq':
      return a === q.answer;
    case 'tf':
      return a === q.answer;
    case 'multi': {
      const sel = [...(a as number[])].sort();
      const ans = [...q.answer].sort();
      return sel.length === ans.length && sel.every((v, i) => v === ans[i]);
    }
    case 'order':
      return (a as number[]).every((v, i) => v === i);
    case 'match': {
      const m = a as Record<number, number>;
      return q.pairs.every((_, i) => m[i] === i);
    }
    case 'tt': {
      const col = ttColumn(q);
      return (a as (boolean | null)[]).every((c, i) => c === col[i]);
    }
    case 'classify':
      return (a as (number | null)[]).every((c, i) => c === q.items[i].cat);
  }
}

/** Stable shuffled permutation for a question (used by order and match views). */
export function permFor(q: Question, n: number, salt = ''): number[] {
  const idx = Array.from({ length: n }, (_, i) => i);
  const rnd = seededRandom(hashString(q.id + salt));
  let p = shuffle(idx, rnd);
  // never present an already-solved arrangement
  if (n > 1 && p.every((v, i) => v === i)) p = [...p.slice(1), p[0]];
  return p;
}

const KEEP_ORDER = new Set(['true', 'false', 'yes', 'no', 'tautology', 'contradiction', 'contingent', 'valid', 'invalid', 'deductive', 'inductive', 'abductive']);

function shouldKeepOrder(options: string[]): boolean {
  if (options.every((o) => o.length <= 3)) return true;
  if (options.every((o) => /^[\d.\s]+$/.test(o))) return true;
  if (options.some((o) => /^(all|both|neither|none|nothing|any of|cannot|it depends)\b/i.test(o.trim()))) return true;
  if (options.every((o) => KEEP_ORDER.has(o.toLowerCase()))) return true;
  return false;
}

/** Returns a copy with options shuffled (answer indexes remapped) so correct answers are not predictable. */
export function randomizeQuestion(q: Question, rnd: () => number = Math.random): Question {
  if (q.type === 'mcq' || q.type === 'multi') {
    if (shouldKeepOrder(q.options)) return q;
    const perm = shuffle(
      q.options.map((_, i) => i),
      rnd
    );
    const options = perm.map((i) => q.options[i]);
    if (q.type === 'mcq') {
      return { ...(q as MCQ), options, answer: perm.indexOf(q.answer) };
    }
    return { ...(q as Multi), options, answer: (q as Multi).answer.map((a) => perm.indexOf(a)) };
  }
  if (q.type === 'classify') {
    const perm = shuffle(
      q.items.map((_, i) => i),
      rnd
    );
    return { ...(q as Classify), items: perm.map((i) => q.items[i]) };
  }
  return q;
}

export function describeCorrect(q: Question): string {
  switch (q.type) {
    case 'mcq':
      return q.options[q.answer];
    case 'tf':
      return q.answer ? 'True' : 'False';
    case 'multi':
      return q.answer.map((i) => q.options[i]).join(' · ');
    case 'order':
      return q.items.join('  →  ');
    case 'match':
      return (q as Match).pairs.map(([l, r]) => `${l} = ${r}`).join('\n');
    case 'tt':
      return ttColumn(q)
        .map((b) => (b ? 'T' : 'F'))
        .join(' ');
    case 'classify':
      return (q as Classify).items.map((i) => `${i.text} → ${(q as Classify).categories[i.cat]}`).join('\n');
  }
}

export type { Order };
