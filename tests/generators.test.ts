import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { generate, type GenKind } from '../src/logic/generators';
import { grade, initialAnswer, isReady, randomizeQuestion, ttColumn } from '../src/logic/grading';
import { equivalent, parse, tryParse } from '../src/logic/formula';
import { nnf } from '../src/logic/generators2';
import type { MCQ, Question, TT } from '../src/content/types';

const KINDS: GenKind[] = ['eval', 'classify', 'equiv', 'count', 'tt', 'argvalid', 'argpattern', 'symbolize', 'syllogism', 'entails', 'demorgan', 'gate', 'binary', 'setop', 'quantneg', 'ruleapply', 'prob', 'bayes', 'kripke'];

describe('question generators', () => {
  it('only produce well-formed questions', () => {
    for (const kind of KINDS) {
      for (let i = 0; i < 40; i++) {
        const q = generate(kind);
        assert.ok(q.q.length > 0 && q.explain.length > 0, `${kind} text`);
        if (q.type === 'mcq') {
          assert.ok(q.answer >= 0 && q.answer < q.options.length, `${kind} answer index`);
          assert.equal(new Set(q.options).size, q.options.length, `${kind} duplicate options: ${q.options.join(' | ')}`);
          assert.ok(q.options.length >= 2, `${kind} needs options`);
        }
        if (q.type === 'tt') assert.ok(!tryParse(q.formula).error, `${kind} formula ${q.formula}`);
      }
    }
  });
});

describe('negation normal form', () => {
  it('is equivalent to the negation of the original', () => {
    for (const f of ['¬(p ∧ q)', '¬(p ∨ (q ∧ r))', '¬(p → (q ∧ r))', '¬((p ∨ q) → r)', '¬(¬p ∨ ¬q)']) {
      const node = parse(f);
      assert.ok(equivalent(nnf(node), node), f);
    }
  });
});

describe('grading', () => {
  const mcq: MCQ = { id: 'a', type: 'mcq', q: 'q', options: ['x', 'y', 'z'], answer: 1, explain: 'e' };
  const tt: TT = { id: 'f', type: 'tt', q: 'q', formula: 'p -> q', explain: 'e' };
  const sample: Question[] = [
    mcq,
    { id: 'b', type: 'tf', q: 'q', answer: true, explain: 'e' },
    { id: 'c', type: 'multi', q: 'q', options: ['1', '2', '3'], answer: [0, 2], explain: 'e' },
    { id: 'd', type: 'order', q: 'q', items: ['1', '2', '3'], explain: 'e' },
    { id: 'e', type: 'match', q: 'q', pairs: [['a', '1'], ['b', '2']], explain: 'e' },
    tt,
    { id: 'g', type: 'classify', q: 'q', categories: ['x', 'y'], items: [{ text: 'i', cat: 0 }, { text: 'j', cat: 1 }], explain: 'e' },
  ];

  it('starts every question unanswered', () => {
    for (const q of sample) assert.equal(isReady(q, initialAnswer(q)), false, q.type);
  });

  it('grades correct and wrong answers', () => {
    assert.equal(grade(sample[0], 1), true);
    assert.equal(grade(sample[0], 0), false);
    assert.equal(grade(sample[1], true), true);
    assert.equal(grade(sample[2], [2, 0]), true);
    assert.equal(grade(sample[2], [0]), false);
    assert.equal(grade(sample[3], [0, 1, 2]), true);
    assert.equal(grade(sample[3], [1, 0, 2]), false);
    assert.equal(grade(sample[4], { 0: 0, 1: 1 }), true);
    assert.equal(grade(sample[4], { 0: 1, 1: 0 }), false);
    assert.equal(grade(tt, ttColumn(tt)), true);
    assert.equal(grade(sample[6], [0, 1]), true);
    assert.equal(grade(sample[6], [1, 1]), false);
  });

  it('keeps the right answer when options are shuffled', () => {
    for (let i = 0; i < 30; i++) {
      const r = randomizeQuestion(mcq) as MCQ;
      assert.equal(r.options[r.answer], 'y');
    }
  });
});
