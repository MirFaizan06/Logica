import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { ALL_QUESTIONS, UNITS } from '../src/content/curriculum';
import { NOTES } from '../src/content/notes';
import { GLOSSARY, FALLACIES, CARDS } from '../src/content/library';
import { grade, initialAnswer, isReady, ttColumn, type AnswerValue } from '../src/logic/grading';
import type { Question } from '../src/content/types';

function solution(q: Question): AnswerValue {
  switch (q.type) {
    case 'mcq':
    case 'tf':
    case 'multi':
      return q.answer;
    case 'order':
      return q.items.map((_, i) => i);
    case 'match':
      return Object.fromEntries(q.pairs.map((_, i) => [i, i]));
    case 'tt':
      return ttColumn(q);
    case 'classify':
      return q.items.map((i) => i.cat);
  }
}

describe('curriculum content', () => {
  it('has a substantial library', () => {
    assert.ok(UNITS.length >= 26);
    assert.ok(ALL_QUESTIONS.length >= 1400, `only ${ALL_QUESTIONS.length} questions`);
    assert.ok(GLOSSARY.length >= 150);
    assert.ok(FALLACIES.length >= 40);
    assert.ok(CARDS.length >= 250);
  });

  it('can solve every question with its own answer key', () => {
    for (const q of ALL_QUESTIONS) {
      assert.equal(isReady(q, initialAnswer(q)), false, `${q.id} starts unanswered`);
      assert.equal(isReady(q, solution(q)), true, `${q.id} solution is complete`);
      assert.equal(grade(q, solution(q)), true, `${q.id} solution is graded correct`);
    }
  });

  it('never has two identical questions in the same lesson', () => {
    for (const u of UNITS) {
      for (const l of u.lessons) {
        const seen = new Set<string>();
        for (const q of l.questions) {
          const key = (q.q + ('formula' in q ? q.formula : '') + ('items' in q ? JSON.stringify(q.items) : '') + ('pairs' in q ? JSON.stringify(q.pairs) : '')).trim().toLowerCase();
          assert.ok(!seen.has(key), `${l.id} repeats “${q.q.slice(0, 50)}”`);
          seen.add(key);
        }
      }
    }
  });

  it('has study notes for every unit', () => {
    for (const u of UNITS) assert.ok((NOTES[u.id]?.length ?? 0) >= 2, u.id);
  });
});
