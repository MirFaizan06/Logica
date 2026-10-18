import type { MCQ, Question, TF, TT } from '@/content/types';
import { pick, shuffle } from '@/utils/date';
import {
  AND,
  BIN,
  IFF,
  IMP,
  NOT,
  OR,
  V,
  assignments,
  classify,
  entails,
  equivalent,
  evalNode,
  parse,
  rewrites,
  show,
  subformulas,
  truthColumn,
  varsOf,
  type Node,
  type Op,
} from './formula';
import { analyze, FORM_TEXT, type Figure, type Form } from './syllogism';
import { genBayes, genBinary, genDeMorgan, genGate, genKripke, genProb, genQuantNeg, genRuleApply, genSetOp } from './generators2';

type Rnd = () => number;
let counter = 0;
const gid = (k: string) => `gen:${k}:${Date.now().toString(36)}${(counter++).toString(36)}`;
const TF_ = (b: boolean) => (b ? 'T' : 'F');

function substitute(n: Node, map: Record<string, Node>): Node {
  switch (n.k) {
    case 'var':
      return map[n.n] ?? n;
    case 'const':
      return n;
    case 'not':
      return NOT(substitute(n.a, map));
    case 'bin':
      return BIN(n.op, substitute(n.a, map), substitute(n.b, map));
  }
}

/** Remove double negations: ¬¬x → x */
export function cleanNeg(n: Node): Node {
  switch (n.k) {
    case 'not': {
      const inner = cleanNeg(n.a);
      return inner.k === 'not' ? inner.a : NOT(inner);
    }
    case 'bin':
      return BIN(n.op, cleanNeg(n.a), cleanNeg(n.b));
    default:
      return n;
  }
}

/** Reject formulas with silly parts like (q → q) or (r ∨ r). */
function isTidy(f: Node): boolean {
  const check = (x: Node): boolean => {
    if (x.k === 'not') return check(x.a);
    if (x.k === 'bin') {
      if (show(x.a) === show(x.b)) return false;
      if (equivalent(x.a, NOT(x.b))) return false;
      return check(x.a) && check(x.b);
    }
    return true;
  };
  if (!check(f)) return false;
  return subformulas(f).every((s) => classify(s) === 'contingent');
}

function permMap(rnd: Rnd, vars: string[], pool: string[] = ['p', 'q', 'r'], negProb = 0.3): Record<string, Node> {
  const perm = shuffle(pool, rnd);
  const map: Record<string, Node> = {};
  vars.forEach((v, i) => {
    const t = V(perm[i % perm.length]);
    map[v] = rnd() < negProb ? NOT(t) : t;
  });
  return map;
}

function randomFormula(rnd: Rnd, vars: string[], d: number): Node {
  if (d <= 0 || (d < 2 && rnd() < 0.3)) {
    const v = V(pick(vars, rnd));
    return rnd() < 0.3 ? NOT(v) : v;
  }
  const ops: Op[] = ['and', 'or', 'imp', 'and', 'or', 'imp', 'iff', 'xor'];
  const op = pick(ops, rnd);
  return BIN(op, randomFormula(rnd, vars, d - 1), randomFormula(rnd, vars, d - 1));
}

function goodFormula(rnd: Rnd, nVars: number, depth: number): Node {
  const names = ['p', 'q', 'r'].slice(0, nVars);
  for (let i = 0; i < 300; i++) {
    const f = randomFormula(rnd, names, depth);
    const vs = varsOf(f);
    if (vs.length < Math.min(2, nVars)) continue;
    if (classify(f) !== 'contingent' || !isTidy(f)) continue;
    return f;
  }
  return parse(nVars > 2 ? '(p ∨ q) → ¬r' : 'p → ¬q');
}

/* ------------------------------------------------------------------ */

export function genEval(rnd: Rnd = Math.random): TF {
  const nVars = rnd() < 0.4 ? 3 : 2;
  const f = goodFormula(rnd, nVars, 2);
  const vars = varsOf(f);
  const env: Record<string, boolean> = {};
  vars.forEach((v) => (env[v] = rnd() < 0.5));
  const value = evalNode(f, env);
  const steps = subformulas(f)
    .map((s) => `${show(s)} = ${TF_(evalNode(s, env))}`)
    .join(' → ');
  return {
    id: gid('eval'),
    type: 'tf',
    unit: 'truth-tables',
    level: 0,
    q: `Let ${vars.map((v) => `${v} = ${TF_(env[v])}`).join(', ')}.\n\nIs  ${show(f)}  true?`,
    answer: value,
    hint: 'Work from the innermost brackets outward.',
    explain: `Evaluate step by step: ${steps}. So the whole formula is ${value ? 'TRUE' : 'FALSE'}.`,
  };
}

const TAUT: string[] = [
  'p ∨ ¬p',
  'p → p',
  '(p ∧ q) → p',
  'p → (p ∨ q)',
  'p → (q → p)',
  '(p → q) ↔ (¬q → ¬p)',
  '¬(p ∧ ¬p)',
  '(p ∧ (p → q)) → q',
  '((p → q) ∧ (q → r)) → (p → r)',
  '¬(p ∨ q) ↔ (¬p ∧ ¬q)',
  '(p ↔ q) ↔ ((p → q) ∧ (q → p))',
  '(¬q ∧ (p → q)) → ¬p',
];
const CONTRA: string[] = [
  'p ∧ ¬p',
  'p ↔ ¬p',
  '¬(p → p)',
  '(p ∧ q) ∧ ¬p',
  '(p → q) ∧ p ∧ ¬q',
  '¬(p ∨ ¬p)',
  '(p ∨ q) ∧ ¬p ∧ ¬q',
  '¬((p ∧ q) → p)',
];

export function genClassify(rnd: Rnd = Math.random): MCQ {
  const target = pick(['tautology', 'contradiction', 'contingent'] as const, rnd);
  let f: Node;
  if (target === 'contingent') {
    f = goodFormula(rnd, rnd() < 0.5 ? 2 : 3, 2);
  } else {
    const base = parse(pick(target === 'tautology' ? TAUT : CONTRA, rnd));
    const vs = varsOf(base);
    const map = permMap(rnd, vs);
    f = cleanNeg(substitute(base, map));
  }
  const kind = classify(f);
  const labels = { tautology: 'Tautology', contradiction: 'Contradiction', contingent: 'Contingent' };
  const col = truthColumn(f).map(TF_).join(' ');
  return {
    id: gid('classify'),
    type: 'mcq',
    unit: 'truth-tables',
    level: 0,
    q: `What kind of formula is\n\n${show(f)}`,
    options: ['Tautology', 'Contradiction', 'Contingent'],
    answer: ['tautology', 'contradiction', 'contingent'].indexOf(kind),
    hint: 'Tautology: always true. Contradiction: always false. Contingent: sometimes each.',
    explain: `Its truth-table column reads  ${col}, so it is a ${labels[kind].toLowerCase()}.`,
  };
}

const EQ_BASES: string[] = [
  'p → q',
  'p ∧ q',
  'p ∨ q',
  '¬(p ∧ q)',
  '¬(p ∨ q)',
  'p ↔ q',
  '¬p → q',
  'p → ¬q',
  '¬p ∨ q',
];

export function genEquivalence(rnd: Rnd = Math.random): MCQ {
  for (let tries = 0; tries < 30; tries++) {
    let base = parse(pick(EQ_BASES, rnd));
    if (rnd() < 0.4) {
      base = cleanNeg(substitute(base, permMap(rnd, ['p', 'q'], ['p', 'q', 'r'], 0.4)));
      if (varsOf(base).length < 2) continue;
    }
    const rws = rewrites(base)
      .map((r) => ({ ...r, node: cleanNeg(r.node) }))
      .filter((r) => show(r.node) !== show(base));
    const good = rws.filter((r) => r.valid);
    const bad = rws.filter((r) => !r.valid);
    if (!good.length || bad.length < 3) continue;
    const g = pick(good, rnd);
    const wrong = shuffle(bad, rnd).slice(0, 3);
    const opts = shuffle([g, ...wrong], rnd);
    return {
      id: gid('equiv'),
      type: 'mcq',
      unit: 'equivalences',
      level: 1,
      q: `Which formula is logically equivalent to\n\n${show(base)}`,
      options: opts.map((o) => show(o.node)),
      answer: opts.indexOf(g),
      hint: 'Compare truth tables, or recall a named law.',
      explain: `${show(g.node)} is equivalent (${g.name}). Not equivalent: ${wrong
        .map((w) => `${show(w.node)} (${w.name})`)
        .join('; ')}.`,
    };
  }
  return genClassify(rnd);
}

export function genCount(rnd: Rnd = Math.random): MCQ {
  const f = goodFormula(rnd, rnd() < 0.5 ? 2 : 3, 2);
  const col = truthColumn(f);
  const n = col.filter((x) => x).length;
  const total = col.length;
  const opts = new Set<number>([n]);
  while (opts.size < 4) {
    const c = Math.floor(rnd() * (total + 1));
    opts.add(c);
  }
  const options = shuffle(Array.from(opts), rnd);
  return {
    id: gid('count'),
    type: 'mcq',
    unit: 'truth-tables',
    level: 0,
    q: `In the truth table for\n\n${show(f)}\n\nin how many of the ${total} rows is the formula TRUE?`,
    options: options.map(String),
    answer: options.indexOf(n),
    hint: 'Build the table mentally, one row at a time.',
    explain: `The final column is  ${col.map(TF_).join(' ')},  which has ${n} T${n === 1 ? '' : 's'}.`,
  };
}

export function genTT(rnd: Rnd = Math.random): TT {
  const f = goodFormula(rnd, rnd() < 0.3 ? 3 : 2, 2);
  const col = truthColumn(f).map(TF_).join(' ');
  return {
    id: gid('tt'),
    type: 'tt',
    unit: 'truth-tables',
    level: 0,
    q: 'Fill in the final column of the truth table.',
    formula: show(f),
    explain: `Final column: ${col}.`,
    hint: 'Evaluate the innermost parts first.',
  };
}

/* ---------- natural-language arguments ---------- */

const PROPS: [string, string][] = [
  ['it is raining', 'it is not raining'],
  ['the street is wet', 'the street is not wet'],
  ['Sam studies', 'Sam does not study'],
  ['Sam passes the exam', 'Sam does not pass the exam'],
  ['the alarm sounds', 'the alarm does not sound'],
  ['someone is home', 'nobody is home'],
  ['the battery is charged', 'the battery is not charged'],
  ['the phone turns on', 'the phone does not turn on'],
  ['Ava trains daily', 'Ava does not train daily'],
  ['Ava wins the race', 'Ava does not win the race'],
  ['the server is down', 'the server is not down'],
  ['users see an error', 'users do not see an error'],
  ['the cake is baked', 'the cake is not baked'],
  ['the guests are happy', 'the guests are not happy'],
  ['the door is locked', 'the door is not locked'],
  ['the light is on', 'the light is off'],
];

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

interface ArgForm {
  name: string;
  short: string;
  valid: boolean;
  why: string;
  build: (P: [string, string], Q: [string, string], R: [string, string]) => { prem: string[]; concl: string };
}

const IF = (a: string, b: string) => `If ${a}, then ${b}.`;

export const ARG_FORMS: ArgForm[] = [
  {
    name: 'Modus ponens',
    short: 'MP',
    valid: true,
    why: 'Modus ponens: from P → Q and P, conclude Q. Always valid.',
    build: (P, Q) => ({ prem: [IF(P[0], Q[0]), `${cap(P[0])}.`], concl: `${cap(Q[0])}.` }),
  },
  {
    name: 'Modus tollens',
    short: 'MT',
    valid: true,
    why: 'Modus tollens: from P → Q and ¬Q, conclude ¬P. Always valid.',
    build: (P, Q) => ({ prem: [IF(P[0], Q[0]), `${cap(Q[1])}.`], concl: `${cap(P[1])}.` }),
  },
  {
    name: 'Hypothetical syllogism',
    short: 'HS',
    valid: true,
    why: 'Hypothetical syllogism chains conditionals: P → Q, Q → R ⊢ P → R. Always valid.',
    build: (P, Q, R) => ({ prem: [IF(P[0], Q[0]), IF(Q[0], R[0])], concl: IF(P[0], R[0]) }),
  },
  {
    name: 'Disjunctive syllogism',
    short: 'DS',
    valid: true,
    why: 'Disjunctive syllogism: from P ∨ Q and ¬P, conclude Q. Always valid.',
    build: (P, Q) => ({ prem: [`Either ${P[0]} or ${Q[0]}.`, `${cap(P[1])}.`], concl: `${cap(Q[0])}.` }),
  },
  {
    name: 'Affirming the consequent',
    short: 'AC',
    valid: false,
    why: 'Affirming the consequent: P → Q and Q do NOT give P — something else could cause Q.',
    build: (P, Q) => ({ prem: [IF(P[0], Q[0]), `${cap(Q[0])}.`], concl: `${cap(P[0])}.` }),
  },
  {
    name: 'Denying the antecedent',
    short: 'DA',
    valid: false,
    why: 'Denying the antecedent: P → Q and ¬P do NOT give ¬Q — Q may hold for other reasons.',
    build: (P, Q) => ({ prem: [IF(P[0], Q[0]), `${cap(P[1])}.`], concl: `${cap(Q[1])}.` }),
  },
  {
    name: 'Affirming a disjunct',
    short: 'AD',
    valid: false,
    why: 'Affirming a disjunct: P ∨ Q and P do NOT give ¬Q — “or” is inclusive, both may be true.',
    build: (P, Q) => ({ prem: [`Either ${P[0]} or ${Q[0]}.`, `${cap(P[0])}.`], concl: `${cap(Q[1])}.` }),
  },
  {
    name: 'Undistributed conditional chain',
    short: 'UC',
    valid: false,
    why: 'Two conditionals sharing the same consequent (P → R, Q → R) give no link between P and Q.',
    build: (P, Q, R) => ({ prem: [IF(P[0], R[0]), IF(Q[0], R[0])], concl: IF(P[0], Q[0]) }),
  },
];

function threeProps(rnd: Rnd): [[string, string], [string, string], [string, string]] {
  const s = shuffle(PROPS, rnd).slice(0, 3);
  return [s[0], s[1], s[2]];
}

export function genArgumentValidity(rnd: Rnd = Math.random): TF {
  const form = pick(ARG_FORMS, rnd);
  const [P, Q, R] = threeProps(rnd);
  const a = form.build(P, Q, R);
  return {
    id: gid('argvalid'),
    type: 'tf',
    unit: 'inference',
    level: 1,
    q: `${a.prem.join('\n')}\n∴ ${a.concl}\n\nIs this argument VALID?`,
    answer: form.valid,
    hint: 'Valid = if the premises were true, the conclusion could not be false.',
    explain: form.why,
  };
}

export function genArgumentPattern(rnd: Rnd = Math.random): MCQ {
  const form = pick(ARG_FORMS, rnd);
  const others = shuffle(
    ARG_FORMS.filter((f) => f.name !== form.name),
    rnd
  ).slice(0, 3);
  const opts = shuffle([form, ...others], rnd);
  const [P, Q, R] = threeProps(rnd);
  const a = form.build(P, Q, R);
  return {
    id: gid('argpattern'),
    type: 'mcq',
    unit: 'inference',
    level: 1,
    q: `Name the pattern of this argument:\n\n${a.prem.join('\n')}\n∴ ${a.concl}`,
    options: opts.map((o) => o.name),
    answer: opts.indexOf(form),
    hint: form.valid ? 'This is a valid form.' : 'This is a fallacy.',
    explain: form.why,
  };
}

/* ---------- symbolization ---------- */

interface SymTemplate {
  text: (P: [string, string], Q: [string, string]) => string;
  formula: string;
}
const SYM_TEMPLATES: SymTemplate[] = [
  { text: (P, Q) => `${cap(P[0])} only if ${Q[0]}.`, formula: 'p → q' },
  { text: (P, Q) => `${cap(P[0])} if ${Q[0]}.`, formula: 'q → p' },
  { text: (P, Q) => `${cap(P[0])} unless ${Q[0]}.`, formula: '¬q → p' },
  { text: (P, Q) => `${cap(P[1])}, and ${Q[1]}.`, formula: '¬p ∧ ¬q' },
  { text: (P, Q) => `${cap(P[0])}, but ${Q[1]}.`, formula: 'p ∧ ¬q' },
  { text: (P, Q) => `${cap(P[0])} if and only if ${Q[0]}.`, formula: 'p ↔ q' },
  { text: (P, Q) => `It is not the case that both ${P[0]} and ${Q[0]}.`, formula: '¬(p ∧ q)' },
  { text: (P, Q) => `Either ${P[0]} or ${Q[0]}, but not both.`, formula: 'p ⊕ q' },
  { text: (P, Q) => `If ${P[0]}, then ${Q[0]}.`, formula: 'p → q' },
  { text: (P, Q) => `${cap(P[0])} provided that ${Q[0]}.`, formula: 'q → p' },
  { text: (P, Q) => `${cap(P[0])} is enough to guarantee that ${Q[0]}.`, formula: 'p → q' },
  { text: (P, Q) => `${cap(P[0])} only when ${Q[0]}.`, formula: 'p → q' },
  { text: (P, Q) => `At least one of these holds: ${P[0]}, or ${Q[0]}.`, formula: 'p ∨ q' },
  { text: (P, Q) => `If ${P[1]}, then ${Q[0]}.`, formula: '¬p → q' },
];
const SYM_DISTRACTORS: string[] = ['p → q', 'q → p', 'p ∧ q', 'p ∨ q', '¬p ∨ q', '¬(p ∧ q)', '¬p ∧ ¬q', 'p ↔ q', 'p ⊕ q', 'p ∧ ¬q', '¬q → p', '¬p → ¬q'];

export function genSymbolize(rnd: Rnd = Math.random): MCQ {
  const t = pick(SYM_TEMPLATES, rnd);
  const [P, Q] = shuffle(PROPS, rnd).slice(0, 2);
  const correct = parse(t.formula);
  const distractors: string[] = [];
  for (const d of shuffle(SYM_DISTRACTORS, rnd)) {
    if (!equivalent(parse(d), correct) && !distractors.includes(d)) distractors.push(d);
    if (distractors.length === 3) break;
  }
  const opts = shuffle([show(correct), ...distractors.map((d) => show(parse(d)))], rnd);
  return {
    id: gid('symbolize'),
    type: 'mcq',
    unit: 'prop-basics',
    level: 0,
    q: `Let p = “${P[0]}” and q = “${Q[0]}”.\n\nBest symbolization of:\n“${t.text(P, Q)}”`,
    options: opts,
    answer: opts.indexOf(show(correct)),
    hint: 'Ask which statement is the sufficient one and which is the necessary one.',
    explain: `The sentence translates to ${show(correct)}.`,
  };
}

/* ---------- syllogisms ---------- */

const TERM_TRIPLES: [string, string, string][] = [
  ['dogs', 'mammals', 'animals'],
  ['poets', 'artists', 'dreamers'],
  ['roses', 'flowers', 'plants'],
  ['students', 'readers', 'thinkers'],
  ['programmers', 'engineers', 'problem-solvers'],
  ['whales', 'swimmers', 'mammals'],
  ['violins', 'instruments', 'wooden things'],
  ['cats', 'pets', 'furry things'],
];

export function genSyllogism(rnd: Rnd = Math.random): TF {
  const forms: Form[] = ['A', 'E', 'I', 'O'];
  for (let i = 0; i < 40; i++) {
    const a = pick(forms, rnd);
    const b = pick(forms, rnd);
    const c = pick(forms, rnd);
    const fig = pick([1, 2, 3, 4] as Figure[], rnd);
    const r = analyze(a, b, c, fig);
    if (r.verdict === 'conditional') continue;
    // bias to a balanced mix of valid and invalid
    const wantValid = rnd() < 0.5;
    if ((r.verdict === 'valid') !== wantValid) continue;
    const [S, P, M] = pick(TERM_TRIPLES, rnd);
    const names = { S, P, M };
    const lines = r.statements.map((st) => FORM_TEXT[st.form](names[st.subj], names[st.pred]));
    return {
      id: gid('syl'),
      type: 'tf',
      unit: 'syllogisms',
      level: 0,
      q: `${lines[0]}.\n${lines[1]}.\n∴ ${lines[2]}.\n\nIs this syllogism VALID?`,
      answer: r.verdict === 'valid',
      hint: 'Picture overlapping circles and ask whether the conclusion is forced.',
      explain: `Form ${r.mood}${r.name ? ` (${r.name})` : ''} — ${r.reason}`,
    };
  }
  return genArgumentValidity(rnd) as TF;
}

/* ---------- entailment ---------- */

export function genEntails(rnd: Rnd = Math.random): TF {
  const prems = [goodFormula(rnd, 2, 1), goodFormula(rnd, 2, 1)];
  let concl = goodFormula(rnd, 2, 1);
  let res = entails(prems, concl);
  // prefer an interesting mix
  for (let i = 0; i < 12 && (rnd() < 0.5) !== res.valid; i++) {
    concl = goodFormula(rnd, 2, 1);
    res = entails(prems, concl);
  }
  return {
    id: gid('entails'),
    type: 'tf',
    unit: 'truth-tables',
    level: 1,
    q: `Premises:\n${prems.map((x) => show(x)).join('\n')}\n\nConclusion:\n${show(concl)}\n\nDoes the conclusion follow logically?`,
    answer: res.valid,
    hint: 'Look for a row where all premises are true but the conclusion is false.',
    explain: res.valid
      ? 'In every row where all the premises are true, the conclusion is true too.'
      : `Counterexample: ${Object.entries(res.counter!)
          .map(([k, v]) => `${k}=${TF_(v)}`)
          .join(', ')} makes every premise true but the conclusion false.`,
  };
}

/* ---------- public API ---------- */

export type GenKind =
  | 'eval'
  | 'classify'
  | 'equiv'
  | 'count'
  | 'tt'
  | 'argvalid'
  | 'argpattern'
  | 'symbolize'
  | 'syllogism'
  | 'entails'
  | 'demorgan'
  | 'gate'
  | 'binary'
  | 'setop'
  | 'quantneg'
  | 'ruleapply'
  | 'prob'
  | 'bayes'
  | 'kripke';

const GENS: Record<GenKind, (rnd: Rnd) => Question> = {
  eval: genEval,
  classify: genClassify,
  equiv: genEquivalence,
  count: genCount,
  tt: genTT,
  argvalid: genArgumentValidity,
  argpattern: genArgumentPattern,
  symbolize: genSymbolize,
  syllogism: genSyllogism,
  entails: genEntails,
  demorgan: genDeMorgan,
  gate: genGate,
  binary: genBinary,
  setop: genSetOp,
  quantneg: genQuantNeg,
  ruleapply: genRuleApply,
  prob: genProb,
  bayes: genBayes,
  kripke: genKripke,
};

export function generate(kind: GenKind, rnd: Rnd = Math.random): Question {
  return GENS[kind](rnd);
}

export function generateMany(kinds: GenKind[], n: number, rnd: Rnd = Math.random): Question[] {
  const out: Question[] = [];
  for (let i = 0; i < n; i++) out.push(generate(kinds[i % kinds.length], rnd));
  return shuffle(out, rnd);
}

/** Generator kinds that suit a given curriculum unit. */
export const UNIT_GENERATORS: Record<string, GenKind[]> = {
  'prop-basics': ['symbolize', 'eval'],
  'truth-tables': ['eval', 'classify', 'count', 'tt', 'entails'],
  syllogisms: ['syllogism'],
  'syllogisms-deep': ['syllogism'],
  equivalences: ['equiv', 'classify', 'demorgan'],
  inference: ['argvalid', 'argpattern', 'ruleapply'],
  fallacies: ['argvalid', 'argpattern'],
  arguments: ['argvalid'],
  'predicate-1': ['quantneg'],
  boolean: ['gate', 'binary'],
  'sets-relations': ['setop'],
  probability: ['prob', 'bayes'],
  modal: ['kripke'],
};

export { assignments };
export { IFF, IMP, AND, OR };
