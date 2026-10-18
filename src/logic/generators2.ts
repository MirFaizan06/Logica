import type { MCQ, TF } from '@/content/types';
import { pick, shuffle } from '@/utils/date';
import { AND, BIN, NOT, OR, V, equivalent, evalNode, parse, show, type Node, type Op } from './formula';

type Rnd = () => number;
let counter = 0;
const gid = (k: string) => `gen:${k}:${Date.now().toString(36)}${(counter++).toString(36)}`;

/* ------------------------------------------------------------------ */
/* Negation normal form                                                */
/* ------------------------------------------------------------------ */

export function nnf(n: Node, neg = false): Node {
  switch (n.k) {
    case 'var':
      return neg ? NOT(n) : n;
    case 'const':
      return { k: 'const', v: neg ? !n.v : n.v };
    case 'not':
      return nnf(n.a, !neg);
    case 'bin': {
      if (n.op === 'and') return neg ? OR(nnf(n.a, true), nnf(n.b, true)) : AND(nnf(n.a), nnf(n.b));
      if (n.op === 'or') return neg ? AND(nnf(n.a, true), nnf(n.b, true)) : OR(nnf(n.a), nnf(n.b));
      if (n.op === 'imp') return nnf(OR(NOT(n.a), n.b), neg);
      return neg ? nnf(BIN('xor', n.a, n.b)) : n;
    }
  }
}

function mutate(n: Node, rnd: Rnd): Node {
  // flip one connective or one literal sign somewhere in the tree
  const sites: Node[] = [];
  const walk = (x: Node) => {
    sites.push(x);
    if (x.k === 'not') walk(x.a);
    if (x.k === 'bin') {
      walk(x.a);
      walk(x.b);
    }
  };
  walk(n);
  const target = pick(sites, rnd);
  const rebuild = (x: Node): Node => {
    if (x === target) {
      if (x.k === 'bin' && (x.op === 'and' || x.op === 'or')) return BIN(x.op === 'and' ? 'or' : 'and', x.a, x.b);
      if (x.k === 'var') return NOT(x);
      if (x.k === 'not') return x.a;
      return x;
    }
    if (x.k === 'not') return NOT(rebuild(x.a));
    if (x.k === 'bin') return BIN(x.op, rebuild(x.a), rebuild(x.b));
    return x;
  };
  return rebuild(n);
}

const DM_FORMS = [
  '¬(p ∧ q)',
  '¬(p ∨ q)',
  '¬(p ∧ (q ∨ r))',
  '¬(p ∨ (q ∧ r))',
  '¬((p ∧ q) ∨ r)',
  '¬((p ∨ q) ∧ r)',
  '¬(p → q)',
  '¬(p → (q ∧ r))',
  '¬((p ∨ q) → r)',
  '¬(¬p ∧ q)',
  '¬(¬p ∨ ¬q)',
];

export function genDeMorgan(rnd: Rnd = Math.random): MCQ {
  const f = parse(pick(DM_FORMS, rnd));
  const correct = nnf(f);
  const opts = new Map<string, Node>([[show(correct), correct]]);
  let guard = 0;
  while (opts.size < 4 && guard++ < 60) {
    const m = mutate(correct, rnd);
    if (!equivalent(m, f)) opts.set(show(m), m);
  }
  const options = shuffle(Array.from(opts.keys()), rnd);
  return {
    id: gid('demorgan'),
    type: 'mcq',
    unit: 'equivalences',
    level: 1,
    q: `Push the negation inwards. Which formula is equivalent to\n\n${show(f)}`,
    options,
    answer: options.indexOf(show(correct)),
    hint: 'Flip each connective (∧ and ∨) and negate each piece. Remember ¬(p → q) ≡ p ∧ ¬q.',
    explain: `${show(f)} ≡ ${show(correct)}. Each ∧ becomes ∨ (and the reverse) as the negation passes through, and double negations cancel.`,
  };
}

/* ------------------------------------------------------------------ */
/* Logic gates                                                         */
/* ------------------------------------------------------------------ */

function gateText(n: Node): string {
  switch (n.k) {
    case 'var':
      return n.n.toUpperCase();
    case 'const':
      return n.v ? '1' : '0';
    case 'not':
      return `NOT ${n.a.k === 'bin' ? gateText(n.a) : gateText(n.a)}`;
    case 'bin': {
      const word: Partial<Record<Op, string>> = { and: 'AND', or: 'OR', xor: 'XOR', nand: 'NAND', nor: 'NOR' };
      return `(${gateText(n.a)} ${word[n.op] ?? n.op} ${gateText(n.b)})`;
    }
  }
}

export function genGate(rnd: Rnd = Math.random): MCQ {
  const ops: Op[] = ['and', 'or', 'xor', 'nand', 'nor'];
  const leaf = (): Node => {
    const v = V(pick(['a', 'b', 'c'], rnd));
    return rnd() < 0.3 ? NOT(v) : v;
  };
  const f = BIN(pick(ops, rnd), BIN(pick(ops, rnd), leaf(), leaf()), leaf());
  const env = { a: rnd() < 0.5, b: rnd() < 0.5, c: rnd() < 0.5 };
  const out = evalNode(f, env);
  const bit = (x: boolean) => (x ? 1 : 0);
  return {
    id: gid('gate'),
    type: 'mcq',
    unit: 'boolean',
    level: 1,
    q: `A = ${bit(env.a)}, B = ${bit(env.b)}, C = ${bit(env.c)}.\n\nWhat is the output of\n${gateText(f)} ?`,
    options: ['0', '1'],
    answer: bit(out),
    hint: 'Work from the innermost gate outwards.',
    explain: `Evaluating step by step gives ${bit(out)}.`,
  };
}

/* ------------------------------------------------------------------ */
/* Binary numbers                                                      */
/* ------------------------------------------------------------------ */

export function genBinary(rnd: Rnd = Math.random): MCQ {
  const kind = Math.floor(rnd() * 3);
  const bin = (n: number, w = 0) => n.toString(2).padStart(w, '0');
  let q = '';
  let correct = '';
  let distract: string[] = [];
  let explain = '';
  if (kind === 0) {
    const n = 5 + Math.floor(rnd() * 58);
    q = `Convert ${n} to binary.`;
    correct = bin(n);
    distract = [bin(n + 1), bin(n - 1), bin(n ^ 4), bin(n + 2)];
    explain = `${n} = ${bin(n)} in binary.`;
  } else if (kind === 1) {
    const n = 5 + Math.floor(rnd() * 58);
    q = `What is ${bin(n)} (binary) in decimal?`;
    correct = String(n);
    distract = [String(n + 1), String(n - 1), String(n + 2), String(n ^ 1)];
    explain = `${bin(n)} = ${n}.`;
  } else {
    const a = 1 + Math.floor(rnd() * 14);
    const b = 1 + Math.floor(rnd() * 14);
    q = `Add in binary:\n\n${bin(a, 4)} + ${bin(b, 4)}`;
    correct = bin(a + b);
    distract = [bin(a + b + 1), bin(a + b - 1), bin(a | b), bin((a + b) ^ 2)];
    explain = `${a} + ${b} = ${a + b}, which is ${bin(a + b)} in binary.`;
  }
  const opts = new Set<string>([correct]);
  for (const d of distract) if (d !== correct && !d.startsWith('-')) opts.add(d);
  const options = shuffle(Array.from(opts).slice(0, 4), rnd);
  if (!options.includes(correct)) options[0] = correct;
  return { id: gid('binary'), type: 'mcq', unit: 'boolean', level: 1, q, options, answer: options.indexOf(correct), hint: 'Powers of two from the right: 1, 2, 4, 8, 16, 32.', explain };
}

/* ------------------------------------------------------------------ */
/* Sets                                                                */
/* ------------------------------------------------------------------ */

const fmt = (s: number[]) => (s.length ? `{${s.join(', ')}}` : '∅');

export function genSetOp(rnd: Rnd = Math.random): MCQ {
  const pool = [1, 2, 3, 4, 5, 6, 7, 8];
  const A = shuffle(pool, rnd).slice(0, 3 + Math.floor(rnd() * 3)).sort((x, y) => x - y);
  const B = shuffle(pool, rnd).slice(0, 3 + Math.floor(rnd() * 3)).sort((x, y) => x - y);
  const union = pool.filter((x) => A.includes(x) || B.includes(x));
  const inter = pool.filter((x) => A.includes(x) && B.includes(x));
  const diff = A.filter((x) => !B.includes(x));
  const sym = pool.filter((x) => A.includes(x) !== B.includes(x));
  const ops = [
    { name: 'A ∪ B', val: union },
    { name: 'A ∩ B', val: inter },
    { name: 'A \\ B', val: diff },
    { name: 'A Δ B (in exactly one of them)', val: sym },
  ];
  const op = pick(ops, rnd);
  const options = new Map<string, number[]>([[fmt(op.val), op.val]]);
  for (const o of shuffle(ops, rnd)) if (!options.has(fmt(o.val))) options.set(fmt(o.val), o.val);
  const extra = [fmt(B.filter((x) => !A.includes(x))), fmt(union.filter((x) => !inter.includes(x) && A.includes(x)))];
  for (const e of extra) if (options.size < 4 && !options.has(e)) options.set(e, []);
  const list = shuffle(Array.from(options.keys()), rnd).slice(0, 4);
  if (!list.includes(fmt(op.val))) list[0] = fmt(op.val);
  const final = shuffle(list, rnd);
  return {
    id: gid('setop'),
    type: 'mcq',
    unit: 'sets-relations',
    level: 1,
    q: `A = ${fmt(A)} and B = ${fmt(B)}.\n\nWhat is ${op.name}?`,
    options: final,
    answer: final.indexOf(fmt(op.val)),
    hint: 'Union: in either. Intersection: in both. Difference: in A but not B.',
    explain: `${op.name} = ${fmt(op.val)}.`,
  };
}

/* ------------------------------------------------------------------ */
/* Quantifier negation                                                 */
/* ------------------------------------------------------------------ */

const QUANT: { f: string; neg: string; wrong: string[] }[] = [
  { f: '∀x (P(x) → Q(x))', neg: '∃x (P(x) ∧ ¬Q(x))', wrong: ['∀x (P(x) → ¬Q(x))', '∃x (P(x) → ¬Q(x))', '∀x (P(x) ∧ ¬Q(x))'] },
  { f: '∃x (P(x) ∧ Q(x))', neg: '∀x (P(x) → ¬Q(x))', wrong: ['∃x (¬P(x) ∧ ¬Q(x))', '∀x (¬P(x) ∧ ¬Q(x))', '∃x (P(x) → ¬Q(x))'] },
  { f: '∀x P(x)', neg: '∃x ¬P(x)', wrong: ['∀x ¬P(x)', '¬∃x ¬P(x)', '∃x P(x)'] },
  { f: '∃x P(x)', neg: '∀x ¬P(x)', wrong: ['∃x ¬P(x)', '¬∀x ¬P(x)', '∀x P(x)'] },
  { f: '∀x ∃y R(x, y)', neg: '∃x ∀y ¬R(x, y)', wrong: ['∀x ∃y ¬R(x, y)', '∃x ∃y ¬R(x, y)', '∀x ∀y ¬R(x, y)'] },
  { f: '∃x ∀y R(x, y)', neg: '∀x ∃y ¬R(x, y)', wrong: ['∃x ∀y ¬R(x, y)', '∀x ∀y ¬R(x, y)', '∃x ∃y ¬R(x, y)'] },
  { f: '∀x ∀y R(x, y)', neg: '∃x ∃y ¬R(x, y)', wrong: ['∀x ∀y ¬R(x, y)', '∃x ∀y ¬R(x, y)', '∀x ∃y ¬R(x, y)'] },
  { f: '∀x (P(x) ∨ Q(x))', neg: '∃x (¬P(x) ∧ ¬Q(x))', wrong: ['∀x (¬P(x) ∧ ¬Q(x))', '∃x (¬P(x) ∨ ¬Q(x))', '∀x (¬P(x) ∨ ¬Q(x))'] },
];

export function genQuantNeg(rnd: Rnd = Math.random): MCQ {
  const item = pick(QUANT, rnd);
  const options = shuffle([item.neg, ...item.wrong], rnd);
  return {
    id: gid('quantneg'),
    type: 'mcq',
    unit: 'predicate-1',
    level: 1,
    q: `Which formula is equivalent to the negation of\n\n${item.f}`,
    options,
    answer: options.indexOf(item.neg),
    hint: 'Push ¬ through each quantifier, flipping ∀ and ∃, then negate the matrix.',
    explain: `¬(${item.f}) ≡ ${item.neg}.`,
  };
}

/* ------------------------------------------------------------------ */
/* Applying inference rules                                            */
/* ------------------------------------------------------------------ */

export function genRuleApply(rnd: Rnd = Math.random): MCQ {
  const [a, b, c] = shuffle(['p', 'q', 'r', 's'], rnd);
  const NONE = 'Nothing follows';
  const kinds = [
    { prem: [`${a} → ${b}`, a], good: b, bad: [`¬${b}`, `${a} ∧ ¬${b}`, NONE], why: 'Modus ponens.' },
    { prem: [`${a} → ${b}`, `¬${b}`], good: `¬${a}`, bad: [a, b, NONE], why: 'Modus tollens.' },
    { prem: [`${a} → ${b}`, `${b} → ${c}`], good: `${a} → ${c}`, bad: [`${c} → ${a}`, `${a} ∧ ${c}`, NONE], why: 'Hypothetical syllogism.' },
    { prem: [`${a} ∨ ${b}`, `¬${a}`], good: b, bad: [`¬${b}`, a, NONE], why: 'Disjunctive syllogism.' },
    { prem: [`${a} ∧ ${b}`], good: b, bad: [`¬${b}`, `${a} → ¬${b}`, NONE], why: 'Simplification.' },
    { prem: [a, b], good: `${a} ∧ ${b}`, bad: [`${a} → ${b}`, `${a} ∨ ¬${b}`, NONE], why: 'Conjunction.' },
    { prem: [`${a} → ${b}`, b], good: NONE, bad: [a, `¬${a}`, `¬${b}`], why: 'Affirming the consequent is a fallacy: b may have other causes.' },
    { prem: [`${a} → ${b}`, `¬${a}`], good: NONE, bad: [b, `¬${b}`, a], why: 'Denying the antecedent is a fallacy: a false antecedent says nothing about b.' },
    { prem: [`${a} ∨ ${b}`, a], good: NONE, bad: [`¬${b}`, b, `¬${a}`], why: 'Affirming a disjunct is a fallacy: both may be true.' },
  ];
  const k = pick(kinds, rnd);
  const options = shuffle([k.good, ...k.bad], rnd);
  return {
    id: gid('ruleapply'),
    type: 'mcq',
    unit: 'inference',
    level: 1,
    q: `Premises:\n${k.prem.join('\n')}\n\nWhat can you validly conclude?`,
    options,
    answer: options.indexOf(k.good),
    hint: 'Match the premises to a known valid rule, or look for a counterexample row.',
    explain: k.why,
  };
}

/* ------------------------------------------------------------------ */
/* Probability                                                         */
/* ------------------------------------------------------------------ */

const gcd = (x: number, y: number): number => (y === 0 ? x : gcd(y, x % y));
const frac = (n: number, d: number) => {
  const g = gcd(n, d);
  return d / g === 1 ? `${n / g}` : `${n / g}/${d / g}`;
};

export function genProb(rnd: Rnd = Math.random): MCQ {
  const kind = Math.floor(rnd() * 4);
  let q = '';
  let correct = '';
  let wrong: string[] = [];
  let explain = '';
  if (kind === 0) {
    const k = 2 + Math.floor(rnd() * 11);
    const ways = 6 - Math.abs(k - 7);
    q = `Two fair dice are rolled. What is the probability that the sum is ${k}?`;
    correct = frac(ways, 36);
    wrong = [frac(ways + 1, 36), frac(ways > 1 ? ways - 1 : ways + 2, 36), frac(1, 12), frac(ways, 12)];
    explain = `${ways} of the 36 equally likely outcomes give a sum of ${k}.`;
  } else if (kind === 1) {
    const n = 2 + Math.floor(rnd() * 4);
    q = `A fair coin is flipped ${n} times. What is the probability of at least one head?`;
    correct = frac(2 ** n - 1, 2 ** n);
    wrong = [frac(1, 2 ** n), frac(1, 2), frac(n, 2 ** n), frac(2 ** (n - 1), 2 ** n)];
    explain = `The only way to have no heads is all tails, probability 1/${2 ** n}. So 1 − 1/${2 ** n}.`;
  } else if (kind === 2) {
    const total = 40;
    const fr = 20 + Math.floor(rnd() * 3) * 2;
    const sp = 12 + Math.floor(rnd() * 3) * 2;
    const both = 6 + Math.floor(rnd() * 3) * 2;
    q = `In a class of ${total}, ${fr} study French, ${sp} study Spanish and ${both} study both. A student who studies Spanish is chosen. What is the probability they also study French?`;
    correct = frac(both, sp);
    wrong = [frac(both, fr), frac(both, total), frac(fr, total), frac(sp, total)];
    explain = `Among the ${sp} Spanish students, ${both} also study French: ${frac(both, sp)}.`;
  } else {
    const a = [10, 20, 25, 40, 50][Math.floor(rnd() * 5)];
    const b = [10, 20, 25, 40, 50][Math.floor(rnd() * 5)];
    q = `Independent events A and B have P(A) = ${a}% and P(B) = ${b}%. What is P(A and B)?`;
    const prod = (a * b) / 100;
    correct = `${prod}%`;
    wrong = [`${a + b}%`, `${Math.abs(a - b) || 5}%`, `${(a + b) / 2}%`, `${prod * 2}%`];
    explain = `For independent events multiply: ${a}% × ${b}% = ${prod}%.`;
  }
  const opts = new Set<string>([correct]);
  for (const w of wrong) if (w !== correct && opts.size < 4) opts.add(w);
  const options = shuffle(Array.from(opts), rnd);
  return { id: gid('prob'), type: 'mcq', unit: 'probability', level: 1, q, options, answer: options.indexOf(correct), hint: 'Count favourable outcomes over all outcomes, or multiply for independent events.', explain };
}

export function genBayes(rnd: Rnd = Math.random): MCQ {
  const prev = pick([0.01, 0.02, 0.05, 0.1], rnd);
  const sens = pick([0.9, 0.95, 0.99], rnd);
  const fpr = pick([0.05, 0.1], rnd);
  const tp = prev * sens;
  const fp = (1 - prev) * fpr;
  const post = Math.round((tp / (tp + fp)) * 100);
  const pct = (x: number) => `${Math.round(x * 100)}%`;
  const opts = new Set<string>([`${post}%`]);
  for (const w of [pct(sens), pct(prev), pct(1 - fpr), pct((sens + prev) / 2), `${Math.min(99, post + 25)}%`]) {
    if (opts.size < 4 && w !== `${post}%`) opts.add(w);
  }
  const options = shuffle(Array.from(opts), rnd);
  return {
    id: gid('bayes'),
    type: 'mcq',
    unit: 'probability',
    level: 1,
    q: `A condition affects ${pct(prev)} of people. A test detects ${pct(sens)} of cases and wrongly flags ${pct(fpr)} of healthy people.\n\nYou test positive. Roughly how likely are you to have the condition?`,
    options,
    answer: options.indexOf(`${post}%`),
    hint: 'Imagine 1,000 people and count the true and false positives.',
    explain: `Of 1,000 people, ${Math.round(1000 * tp)} are ill and test positive, while about ${Math.round(1000 * fp)} healthy people also test positive. The chance is about ${post}%.`,
  };
}

/* ------------------------------------------------------------------ */
/* Kripke models                                                       */
/* ------------------------------------------------------------------ */

export function genKripke(rnd: Rnd = Math.random): TF {
  const W = ['w1', 'w2', 'w3'];
  const edges: [number, number][] = [];
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) if (rnd() < 0.4) edges.push([i, j]);
  const pTrue = W.map(() => rnd() < 0.5);
  const at = Math.floor(rnd() * 3);
  const box = rnd() < 0.5;
  const succ = edges.filter(([i]) => i === at).map(([, j]) => j);
  const value = box ? succ.every((j) => pTrue[j]) : succ.some((j) => pTrue[j]);
  const arrows = edges.length ? edges.map(([i, j]) => `${W[i]} → ${W[j]}`).join(', ') : 'none';
  const ptxt = W.filter((_, i) => pTrue[i]).join(', ') || 'no world';
  return {
    id: gid('kripke'),
    type: 'tf',
    unit: 'modal',
    level: 2,
    q: `Worlds: w1, w2, w3.\nAccessible from a world: ${arrows}.\np is true at: ${ptxt}.\n\nIs ${box ? '□' : '◇'}p true at ${W[at]}?`,
    answer: value,
    hint: box ? 'The box needs p at every accessible world (vacuously true if there are none).' : 'The diamond needs p at some accessible world.',
    explain: `From ${W[at]} the accessible worlds are ${succ.length ? succ.map((j) => W[j]).join(', ') : 'none'}. ${box ? '□p requires p at all of them' : '◇p requires p at one of them'}${succ.length === 0 ? (box ? ', which holds vacuously' : ', and there are none') : ''}, so it is ${value ? 'true' : 'false'}.`,
  };
}
