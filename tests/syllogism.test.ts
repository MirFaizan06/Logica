import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { allValidMoods, analyze } from '../src/logic/syllogism';

describe('categorical syllogisms', () => {
  it('finds exactly the 24 traditional valid forms', () => {
    const all = allValidMoods();
    assert.equal(all.length, 24);
    assert.equal(all.filter((m) => m.verdict === 'valid').length, 15);
    assert.equal(all.filter((m) => m.verdict === 'conditional').length, 9);
    assert.ok(all.every((m) => m.name), 'every valid form has a traditional name');
  });

  it('recognises Barbara and friends', () => {
    assert.equal(analyze('A', 'A', 'A', 1).name, 'Barbara');
    assert.equal(analyze('E', 'A', 'E', 1).name, 'Celarent');
    assert.equal(analyze('A', 'I', 'I', 1).name, 'Darii');
    assert.equal(analyze('E', 'I', 'O', 1).name, 'Ferio');
  });

  it('flags the undistributed middle', () => {
    assert.equal(analyze('A', 'A', 'A', 2).verdict, 'invalid');
  });

  it('marks weakened moods as needing existential import', () => {
    assert.equal(analyze('A', 'A', 'I', 1).verdict, 'conditional');
    assert.equal(analyze('A', 'A', 'I', 3).verdict, 'conditional');
  });
});
