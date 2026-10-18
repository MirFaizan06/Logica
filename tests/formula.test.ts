import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  classify,
  entails,
  equivalent,
  minimalCNF,
  minimalDNF,
  parse,
  show,
  tryParse,
  truthColumn,
  varsOf,
} from '../src/logic/formula';

const p = (s: string) => parse(s);

describe('formula parser', () => {
  it('reads unicode and ascii operators alike', () => {
    assert.equal(show(p('p -> q')), show(p('p → q')));
    assert.equal(show(p('~(p & q) <-> (~p | ~q)')), '¬(p ∧ q) ↔ (¬p ∨ ¬q)');
    assert.equal(show(p('p implies q')), 'p → q');
    assert.equal(show(p('p xor q')), 'p ⊕ q');
  });

  it('applies the usual precedence', () => {
    assert.equal(show(p('p | q & r')), 'p ∨ (q ∧ r)');
    assert.equal(show(p('p -> q -> r')), 'p → (q → r)');
    assert.equal(show(p('~p & q')), '¬p ∧ q');
  });

  it('reports readable errors', () => {
    assert.ok(tryParse('(p & q').error);
    assert.ok(tryParse('p &').error);
    assert.ok(tryParse('p q').error);
    assert.ok(tryParse('').error);
    assert.ok(tryParse('hello').error);
  });
});

describe('truth tables', () => {
  it('lists rows with T first', () => {
    assert.deepEqual(truthColumn(p('p & q')), [true, false, false, false]);
    assert.deepEqual(truthColumn(p('p -> q')), [true, false, true, true]);
    assert.deepEqual(truthColumn(p('p <-> q')), [true, false, false, true]);
  });

  it('collects variables in order', () => {
    assert.deepEqual(varsOf(p('r & (p | q)')), ['p', 'q', 'r']);
  });

  it('classifies formulas', () => {
    assert.equal(classify(p('p | ~p')), 'tautology');
    assert.equal(classify(p('p & ~p')), 'contradiction');
    assert.equal(classify(p('p -> q')), 'contingent');
    assert.equal(classify(p('((p -> q) & (q -> r)) -> (p -> r)')), 'tautology');
  });
});

describe('equivalence and entailment', () => {
  it('knows the standard laws', () => {
    assert.ok(equivalent(p('p -> q'), p('~q -> ~p')));
    assert.ok(equivalent(p('~(p & q)'), p('~p | ~q')));
    assert.ok(equivalent(p('p -> q'), p('~p | q')));
    assert.ok(!equivalent(p('p -> q'), p('q -> p')));
  });

  it('accepts valid arguments', () => {
    assert.ok(entails([p('p -> q'), p('p')], p('q')).valid);
    assert.ok(entails([p('p -> q'), p('~q')], p('~p')).valid);
    assert.ok(entails([p('p | q'), p('~p')], p('q')).valid);
  });

  it('rejects fallacies and gives a counterexample', () => {
    const r = entails([p('p -> q'), p('q')], p('p'));
    assert.equal(r.valid, false);
    assert.deepEqual(r.counter, { p: false, q: true });
    assert.equal(entails([p('p -> q'), p('~p')], p('~q')).valid, false);
  });
});

describe('normal forms', () => {
  it('produces equivalent minimal DNF and CNF', () => {
    for (const f of ['p -> q', 'p <-> q', 'p xor q', 'p | (q & r)', '(p -> q) & (q -> r)']) {
      const node = p(f);
      assert.ok(equivalent(node, p(minimalDNF(node))), `DNF of ${f}`);
      assert.ok(equivalent(node, p(minimalCNF(node))), `CNF of ${f}`);
    }
  });

  it('handles constants', () => {
    assert.equal(minimalDNF(p('p & ~p')), '⊥');
    assert.equal(minimalCNF(p('p | ~p')), '⊤');
  });
});
