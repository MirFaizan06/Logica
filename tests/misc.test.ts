import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { compareVersions, parseVersion } from '../src/utils/version';
import { levelFromXp, levelProgress, xpForLevel } from '../src/store/levels';
import { computeReward, starsFor } from '../src/logic/rewards';
import { addDays, daysBetween, dayKey } from '../src/utils/date';
import { UNITS, ALL_LESSONS } from '../src/content/curriculum';

describe('versions', () => {
  it('parses tags', () => {
    assert.deepEqual(parseVersion('v1.2.3'), [1, 2, 3]);
    assert.deepEqual(parseVersion('2.0.10-beta.1'), [2, 0, 10]);
    assert.equal(parseVersion('latest'), null);
  });

  it('compares numerically, not as text', () => {
    assert.equal(compareVersions('1.10.0', '1.9.9'), 1);
    assert.equal(compareVersions('v1.0.0', '1.0.0'), 0);
    assert.equal(compareVersions('0.9.9', '1.0.0'), -1);
    assert.equal(compareVersions('garbage', '1.0.0'), 0);
  });
});

describe('levels', () => {
  it('has consistent thresholds', () => {
    for (let l = 1; l < 40; l++) {
      assert.equal(levelFromXp(xpForLevel(l)), l);
      assert.equal(levelFromXp(xpForLevel(l + 1) - 1), l);
    }
    const lp = levelProgress(xpForLevel(5) + 10);
    assert.equal(lp.level, 5);
    assert.equal(lp.into, 10);
  });
});

describe('rewards', () => {
  it('awards stars by accuracy', () => {
    assert.equal(starsFor(1), 3);
    assert.equal(starsFor(0.8), 2);
    assert.equal(starsFor(0.6), 1);
    assert.equal(starsFor(0.4), 0);
  });

  it('gives gems only for the first pass', () => {
    const first = computeReward({ mode: 'lesson', total: 5, correct: 5, hints: 0, passed: true, firstTime: true });
    const again = computeReward({ mode: 'lesson', total: 5, correct: 5, hints: 0, passed: true, firstTime: false });
    assert.ok(first.gems > 0);
    assert.equal(again.gems, 0);
    assert.ok(first.xp > again.xp);
  });
});

describe('dates', () => {
  it('does day arithmetic across month ends', () => {
    assert.equal(addDays('2026-01-31', 1), '2026-02-01');
    assert.equal(daysBetween('2026-02-27', '2026-03-02'), 3);
    assert.match(dayKey(), /^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('curriculum', () => {
  it('has unique lesson ids and enough questions', () => {
    const ids = new Set(ALL_LESSONS.map((l) => l.id));
    assert.equal(ids.size, ALL_LESSONS.length);
    for (const l of ALL_LESSONS) assert.ok(l.questions.length >= 5, l.id);
    assert.equal(UNITS.length, 26);
  });
});
