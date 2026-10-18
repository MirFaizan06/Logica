/**
 * Propositional logic engine: parser, evaluator, truth tables, normal forms.
 * Accepts unicode (¬ ∧ ∨ → ↔ ⊕) and ASCII (~ & | -> <-> ^ , and/or/not/implies/iff/xor).
 */

export type Op = 'and' | 'or' | 'imp' | 'iff' | 'xor' | 'nand' | 'nor';

export type Node =
  | { k: 'var'; n: string }
  | { k: 'const'; v: boolean }
  | { k: 'not'; a: Node }
  | { k: 'bin'; op: Op; a: Node; b: Node };

export const OP_SYMBOL: Record<Op, string> = {
  and: '∧',
  or: '∨',
  imp: '→',
  iff: '↔',
  xor: '⊕',
  nand: '↑',
  nor: '↓',
};

const PREC: Record<Op, number> = { iff: 1, imp: 2, or: 3, xor: 4, nand: 5, nor: 5, and: 6 };

export class ParseError extends Error {}

type Tok =
  | { t: 'lp' }
  | { t: 'rp' }
  | { t: 'not' }
  | { t: 'op'; op: Op }
  | { t: 'var'; n: string }
  | { t: 'const'; v: boolean };

const WORD_OPS: Record<string, Tok> = {
  not: { t: 'not' },
  and: { t: 'op', op: 'and' },
  or: { t: 'op', op: 'or' },
  implies: { t: 'op', op: 'imp' },
  then: { t: 'op', op: 'imp' },
  iff: { t: 'op', op: 'iff' },
  xor: { t: 'op', op: 'xor' },
  nand: { t: 'op', op: 'nand' },
  nor: { t: 'op', op: 'nor' },
  true: { t: 'const', v: true },
  false: { t: 'const', v: false },
};

const SYMBOLS: [string, Tok][] = [
  ['<->', { t: 'op', op: 'iff' }],
  ['<=>', { t: 'op', op: 'iff' }],
  ['->', { t: 'op', op: 'imp' }],
  ['=>', { t: 'op', op: 'imp' }],
  ['/\\', { t: 'op', op: 'and' }],
  ['\\/', { t: 'op', op: 'or' }],
  ['&&', { t: 'op', op: 'and' }],
  ['||', { t: 'op', op: 'or' }],
  ['¬', { t: 'not' }],
  ['~', { t: 'not' }],
  ['!', { t: 'not' }],
  ['∧', { t: 'op', op: 'and' }],
  ['&', { t: 'op', op: 'and' }],
  ['∨', { t: 'op', op: 'or' }],
  ['|', { t: 'op', op: 'or' }],
  ['→', { t: 'op', op: 'imp' }],
  ['⇒', { t: 'op', op: 'imp' }],
  ['⊃', { t: 'op', op: 'imp' }],
  ['↔', { t: 'op', op: 'iff' }],
  ['⇔', { t: 'op', op: 'iff' }],
  ['≡', { t: 'op', op: 'iff' }],
  ['⊕', { t: 'op', op: 'xor' }],
  ['^', { t: 'op', op: 'xor' }],
  ['↑', { t: 'op', op: 'nand' }],
  ['↓', { t: 'op', op: 'nor' }],
  ['⊤', { t: 'const', v: true }],
  ['⊥', { t: 'const', v: false }],
  ['(', { t: 'lp' }],
  [')', { t: 'rp' }],
];

function tokenize(src: string): Tok[] {
  const out: Tok[] = [];
  let i = 0;
  while (i < src.length) {
    const ch = src[i];
    if (/\s/.test(ch) || ch === ',') {
      i++;
      continue;
    }
    const sym = SYMBOLS.find(([s]) => src.startsWith(s, i));
    if (sym) {
      out.push(sym[1]);
      i += sym[0].length;
      continue;
    }
    if (ch === '1' || ch === '0') {
      out.push({ t: 'const', v: ch === '1' });
      i++;
      continue;
    }
    if (/[A-Za-z]/.test(ch)) {
      let j = i;
      while (j < src.length && /[A-Za-z]/.test(src[j])) j++;
      const word = src.slice(i, j);
      const kw = WORD_OPS[word.toLowerCase()];
      if (kw) {
        out.push(kw);
        i = j;
        continue;
      }
      if (word.length === 1) {
        let k = j;
        while (k < src.length && /[0-9]/.test(src[k])) k++;
        out.push({ t: 'var', n: src.slice(i, k) });
        i = k;
        continue;
      }
      throw new ParseError(`Unknown word “${word}”. Use single letters like p, q, r.`);
    }
    throw new ParseError(`Unexpected character “${ch}”.`);
  }
  return out;
}

export function parse(src: string): Node {
  const toks = tokenize(src);
  if (toks.length === 0) throw new ParseError('Type a formula, e.g. (p → q) ∧ ¬r');
  let pos = 0;

  const parseBin = (minPrec: number): Node => {
    let left = parseUnary();
    for (;;) {
      const t = toks[pos];
      if (!t || t.t !== 'op') break;
      const p = PREC[t.op];
      if (p < minPrec) break;
      pos++;
      // implication is right-associative, everything else left-associative
      const right = parseBin(t.op === 'imp' ? p : p + 1);
      left = { k: 'bin', op: t.op, a: left, b: right };
    }
    return left;
  };

  const parseUnary = (): Node => {
    const t = toks[pos];
    if (!t) throw new ParseError('The formula ends too early.');
    if (t.t === 'not') {
      pos++;
      return { k: 'not', a: parseUnary() };
    }
    if (t.t === 'lp') {
      pos++;
      const inner = parseBin(1);
      if (!toks[pos] || toks[pos].t !== 'rp') throw new ParseError('Missing a closing parenthesis.');
      pos++;
      return inner;
    }
    if (t.t === 'var') {
      pos++;
      return { k: 'var', n: t.n };
    }
    if (t.t === 'const') {
      pos++;
      return { k: 'const', v: t.v };
    }
    if (t.t === 'rp') throw new ParseError('Unexpected closing parenthesis.');
    throw new ParseError('An operator is missing a side.');
  };

  const node = parseBin(1);
  if (pos < toks.length) {
    throw new ParseError(toks[pos].t === 'rp' ? 'Unexpected closing parenthesis.' : 'Two statements need an operator between them.');
  }
  return node;
}

export function tryParse(src: string): { node?: Node; error?: string } {
  try {
    return { node: parse(src) };
  } catch (e) {
    return { error: e instanceof ParseError ? e.message : 'Could not read that formula.' };
  }
}

export type Env = Record<string, boolean>;

export function evalNode(n: Node, env: Env): boolean {
  switch (n.k) {
    case 'var':
      return !!env[n.n];
    case 'const':
      return n.v;
    case 'not':
      return !evalNode(n.a, env);
    case 'bin': {
      const a = evalNode(n.a, env);
      const b = evalNode(n.b, env);
      switch (n.op) {
        case 'and':
          return a && b;
        case 'or':
          return a || b;
        case 'imp':
          return !a || b;
        case 'iff':
          return a === b;
        case 'xor':
          return a !== b;
        case 'nand':
          return !(a && b);
        case 'nor':
          return !(a || b);
      }
    }
  }
}

export function varsOf(n: Node, acc: Set<string> = new Set()): string[] {
  if (n.k === 'var') acc.add(n.n);
  else if (n.k === 'not') varsOf(n.a, acc);
  else if (n.k === 'bin') {
    varsOf(n.a, acc);
    varsOf(n.b, acc);
  }
  return Array.from(acc).sort();
}

export function show(n: Node, top = true): string {
  switch (n.k) {
    case 'var':
      return n.n;
    case 'const':
      return n.v ? '⊤' : '⊥';
    case 'not':
      return '¬' + (n.a.k === 'bin' ? `(${show(n.a, true)})` : show(n.a, false));
    case 'bin': {
      const wrap = (c: Node) => {
        if (c.k !== 'bin') return show(c, false);
        const same = c.op === n.op && (n.op === 'and' || n.op === 'or');
        return same ? show(c, false) : `(${show(c, true)})`;
      };
      const s = `${wrap(n.a)} ${OP_SYMBOL[n.op]} ${wrap(n.b)}`;
      return s;
    }
  }
}

export const V = (n: string): Node => ({ k: 'var', n });
export const NOT = (a: Node): Node => ({ k: 'not', a });
export const BIN = (op: Op, a: Node, b: Node): Node => ({ k: 'bin', op, a, b });
export const AND = (a: Node, b: Node) => BIN('and', a, b);
export const OR = (a: Node, b: Node) => BIN('or', a, b);
export const IMP = (a: Node, b: Node) => BIN('imp', a, b);
export const IFF = (a: Node, b: Node) => BIN('iff', a, b);

export function sameNode(a: Node, b: Node): boolean {
  return show(a) === show(b);
}

/** All assignments, TTT… first (the textbook order). */
export function assignments(vars: string[]): Env[] {
  const n = vars.length;
  const rows: Env[] = [];
  for (let i = 0; i < 1 << n; i++) {
    const env: Env = {};
    vars.forEach((v, j) => {
      env[v] = !((i >> (n - 1 - j)) & 1);
    });
    rows.push(env);
  }
  return rows;
}

export function truthColumn(n: Node, vars?: string[]): boolean[] {
  const vs = vars ?? varsOf(n);
  return assignments(vs).map((env) => evalNode(n, env));
}

export type Kind = 'tautology' | 'contradiction' | 'contingent';

export function classify(n: Node): Kind {
  const col = truthColumn(n);
  if (col.every((x) => x)) return 'tautology';
  if (col.every((x) => !x)) return 'contradiction';
  return 'contingent';
}

export function equivalent(a: Node, b: Node): boolean {
  const vs = varsOf(BIN('and', a, b));
  return assignments(vs).every((env) => evalNode(a, env) === evalNode(b, env));
}

/** premises ⊨ conclusion ? returns counterexample row if not. */
export function entails(premises: Node[], conclusion: Node): { valid: boolean; counter?: Env; vars: string[] } {
  let all: Node = conclusion;
  for (const p of premises) all = BIN('and', all, p);
  const vars = varsOf(all);
  for (const env of assignments(vars)) {
    if (premises.every((p) => evalNode(p, env)) && !evalNode(conclusion, env)) {
      return { valid: false, counter: env, vars };
    }
  }
  return { valid: true, vars };
}

/** Sub-formulas in evaluation order (leaves excluded), for truth-table columns. */
export function subformulas(n: Node): Node[] {
  const seen = new Set<string>();
  const out: Node[] = [];
  const walk = (x: Node) => {
    if (x.k === 'var' || x.k === 'const') return;
    if (x.k === 'not') walk(x.a);
    else {
      walk(x.a);
      walk(x.b);
    }
    const key = show(x);
    if (!seen.has(key)) {
      seen.add(key);
      out.push(x);
    }
  };
  walk(n);
  return out;
}

export function depth(n: Node): number {
  if (n.k === 'not') return 1 + depth(n.a);
  if (n.k === 'bin') return 1 + Math.max(depth(n.a), depth(n.b));
  return 0;
}

/* ------------------------------------------------------------------ */
/* Normal forms (Quine–McCluskey)                                      */
/* ------------------------------------------------------------------ */

interface Implicant {
  mask: number; // bits that are "don't care"
  value: number;
}

function qm(minterms: number[], nBits: number): Implicant[] {
  if (minterms.length === 0) return [];
  let current: Implicant[] = minterms.map((m) => ({ mask: 0, value: m }));
  const primes: Implicant[] = [];
  const key = (i: Implicant) => `${i.mask}:${i.value}`;
  while (current.length) {
    const used = new Set<string>();
    const next = new Map<string, Implicant>();
    for (let a = 0; a < current.length; a++) {
      for (let b = a + 1; b < current.length; b++) {
        const x = current[a];
        const y = current[b];
        if (x.mask !== y.mask) continue;
        const diff = x.value ^ y.value;
        if (diff && (diff & (diff - 1)) === 0) {
          const merged = { mask: x.mask | diff, value: x.value & ~diff };
          next.set(key(merged), merged);
          used.add(key(x));
          used.add(key(y));
        }
      }
    }
    for (const c of current) if (!used.has(key(c))) primes.push(c);
    current = Array.from(next.values());
  }
  // cover minterms: essential primes first, then greedy
  const covers = (p: Implicant, m: number) => (m & ~p.mask) === p.value;
  const remaining = new Set(minterms);
  const chosen: Implicant[] = [];
  for (const m of minterms) {
    const cands = primes.filter((p) => covers(p, m));
    if (cands.length === 1 && !chosen.includes(cands[0])) {
      chosen.push(cands[0]);
    }
  }
  chosen.forEach((p) => minterms.forEach((m) => covers(p, m) && remaining.delete(m)));
  while (remaining.size) {
    let best: Implicant | null = null;
    let bestCount = -1;
    for (const p of primes) {
      const c = Array.from(remaining).filter((m) => covers(p, m)).length;
      if (c > bestCount) {
        best = p;
        bestCount = c;
      }
    }
    if (!best || bestCount <= 0) break;
    chosen.push(best);
    minterms.forEach((m) => covers(best!, m) && remaining.delete(m));
  }
  void nBits;
  return chosen;
}

function literalList(imp: Implicant, vars: string[], negate: boolean): string[] {
  const n = vars.length;
  const lits: string[] = [];
  vars.forEach((v, j) => {
    const bit = 1 << (n - 1 - j);
    if (imp.mask & bit) return;
    const isOne = !!(imp.value & bit);
    // In the table encoding below, bit=1 means variable is FALSE (rows start with all-true = index 0)
    const positive = negate ? isOne : !isOne;
    lits.push(positive ? v : `¬${v}`);
  });
  return lits;
}

function indicesWhere(n: Node, vars: string[], target: boolean): number[] {
  const col = truthColumn(n, vars);
  const idx: number[] = [];
  col.forEach((val, i) => {
    if (val === target) idx.push(i);
  });
  return idx;
}

/** Minimal sum-of-products. */
export function minimalDNF(n: Node): string {
  const vars = varsOf(n);
  if (vars.length === 0) return evalNode(n, {}) ? '⊤' : '⊥';
  const ones = indicesWhere(n, vars, true);
  if (ones.length === 0) return '⊥';
  if (ones.length === 1 << vars.length) return '⊤';
  const imps = qm(ones.slice(), vars.length);
  const terms = imps.map((imp) => {
    const l = literalList(imp, vars, false);
    return l.length > 1 ? `(${l.join(' ∧ ')})` : l[0];
  });
  return terms.join(' ∨ ');
}

/** Minimal product-of-sums. */
export function minimalCNF(n: Node): string {
  const vars = varsOf(n);
  if (vars.length === 0) return evalNode(n, {}) ? '⊤' : '⊥';
  const zeros = indicesWhere(n, vars, false);
  if (zeros.length === 0) return '⊤';
  if (zeros.length === 1 << vars.length) return '⊥';
  const imps = qm(zeros.slice(), vars.length);
  const clauses = imps.map((imp) => {
    const l = literalList(imp, vars, true);
    return l.length > 1 ? `(${l.join(' ∨ ')})` : l[0];
  });
  return clauses.join(' ∧ ');
}

/** Canonical DNF listing each true row. */
export function canonicalDNF(n: Node): string {
  const vars = varsOf(n);
  const rows = assignments(vars);
  const ones = rows.filter((env) => evalNode(n, env));
  if (!vars.length) return evalNode(n, {}) ? '⊤' : '⊥';
  if (!ones.length) return '⊥';
  return ones.map((env) => '(' + vars.map((v) => (env[v] ? v : `¬${v}`)).join(' ∧ ') + ')').join(' ∨ ');
}

export function canonicalCNF(n: Node): string {
  const vars = varsOf(n);
  const rows = assignments(vars);
  const zeros = rows.filter((env) => !evalNode(n, env));
  if (!vars.length) return evalNode(n, {}) ? '⊤' : '⊥';
  if (!zeros.length) return '⊤';
  return zeros.map((env) => '(' + vars.map((v) => (env[v] ? `¬${v}` : v)).join(' ∨ ') + ')').join(' ∧ ');
}

/* ------------------------------------------------------------------ */
/* Equivalence rewrites (used by generators and the Lab "laws" tab)    */
/* ------------------------------------------------------------------ */

export interface Rewrite {
  name: string;
  node: Node;
  valid: boolean;
}

/** Produce valid and fallacious rewrites of an implication/other formula for quiz distractors. */
export function rewrites(n: Node): Rewrite[] {
  const out: Rewrite[] = [];
  const add = (name: string, node: Node) => out.push({ name, node, valid: equivalent(n, node) });
  if (n.k === 'bin' && n.op === 'imp') {
    add('Contrapositive', IMP(NOT(n.b), NOT(n.a)));
    add('Material implication', OR(NOT(n.a), n.b));
    add('Converse', IMP(n.b, n.a));
    add('Inverse', IMP(NOT(n.a), NOT(n.b)));
    add('Negated disjunction', OR(n.a, NOT(n.b)));
    add('Conjunction', AND(NOT(n.a), n.b));
    add('Wrong negation', NOT(IMP(n.a, n.b)));
  } else if (n.k === 'bin' && n.op === 'and') {
    add('Commutative', AND(n.b, n.a));
    add('De Morgan', NOT(OR(NOT(n.a), NOT(n.b))));
    add('As implication', NOT(IMP(n.a, NOT(n.b))));
    add('Wrong De Morgan', OR(NOT(n.a), NOT(n.b)));
    add('Disjunction', OR(n.a, n.b));
  } else if (n.k === 'bin' && n.op === 'or') {
    add('Commutative', OR(n.b, n.a));
    add('De Morgan', NOT(AND(NOT(n.a), NOT(n.b))));
    add('As implication', IMP(NOT(n.a), n.b));
    add('Wrong implication', IMP(n.a, n.b));
    add('Conjunction', AND(n.a, n.b));
  } else if (n.k === 'not' && n.a.k === 'bin' && n.a.op === 'and') {
    add('De Morgan', OR(NOT(n.a.a), NOT(n.a.b)));
    add('Wrong De Morgan', AND(NOT(n.a.a), NOT(n.a.b)));
    add('Wrong De Morgan 2', OR(n.a.a, n.a.b));
  } else if (n.k === 'not' && n.a.k === 'bin' && n.a.op === 'or') {
    add('De Morgan', AND(NOT(n.a.a), NOT(n.a.b)));
    add('Wrong De Morgan', OR(NOT(n.a.a), NOT(n.a.b)));
    add('Wrong De Morgan 2', AND(n.a.a, n.a.b));
  } else if (n.k === 'bin' && n.op === 'iff') {
    add('Two implications', AND(IMP(n.a, n.b), IMP(n.b, n.a)));
    add('Same truth value', OR(AND(n.a, n.b), AND(NOT(n.a), NOT(n.b))));
    add('Only one direction', IMP(n.a, n.b));
    add('Opposite', OR(AND(n.a, NOT(n.b)), AND(NOT(n.a), n.b)));
  }
  return out;
}
