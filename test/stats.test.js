const { test } = require('node:test');
const assert = require('node:assert/strict');
const { recordSessionAnswers, getStats, getWeakestTenses } = require('../js/stats.js');

function fakeStorage() {
  const data = new Map();
  return {
    getItem: (key) => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => data.set(key, value),
  };
}

test('recordSessionAnswers stores answers and getStats aggregates by tense', () => {
  const storage = fakeStorage();
  recordSessionAnswers(storage, [
    { infinitive: 'parlare', tense: 'presente', pronoun: 'io', correct: true, accentOnly: false },
    { infinitive: 'parlare', tense: 'presente', pronoun: 'tu', correct: false, accentOnly: false },
    { infinitive: 'credere', tense: 'imperfetto', pronoun: 'io', correct: true, accentOnly: false },
  ]);
  const stats = getStats(storage);
  assert.equal(stats.byTense.presente.total, 2);
  assert.equal(stats.byTense.presente.correct, 1);
  assert.equal(stats.byTense.imperfetto.total, 1);
  assert.equal(stats.byTense.imperfetto.correct, 1);
});

test('recordSessionAnswers accumulates across multiple calls', () => {
  const storage = fakeStorage();
  recordSessionAnswers(storage, [{ infinitive: 'parlare', tense: 'presente', pronoun: 'io', correct: true, accentOnly: false }]);
  recordSessionAnswers(storage, [{ infinitive: 'parlare', tense: 'presente', pronoun: 'tu', correct: true, accentOnly: false }]);
  const stats = getStats(storage);
  assert.equal(stats.byTense.presente.total, 2);
  assert.equal(stats.byTense.presente.correct, 2);
});

test('getStats on empty storage returns an empty-but-valid shape', () => {
  const storage = fakeStorage();
  const stats = getStats(storage);
  assert.deepEqual(stats.byTense, {});
  assert.deepEqual(stats.byVerb, {});
});

test('getWeakestTenses sorts ascending by accuracy, requires a minimum sample size', () => {
  const storage = fakeStorage();
  recordSessionAnswers(storage, [
    { infinitive: 'parlare', tense: 'presente', pronoun: 'io', correct: true, accentOnly: false },
    { infinitive: 'parlare', tense: 'presente', pronoun: 'tu', correct: true, accentOnly: false },
    { infinitive: 'parlare', tense: 'presente', pronoun: 'lui_lei', correct: true, accentOnly: false },
    { infinitive: 'credere', tense: 'imperfetto', pronoun: 'io', correct: false, accentOnly: false },
    { infinitive: 'credere', tense: 'imperfetto', pronoun: 'tu', correct: false, accentOnly: false },
    { infinitive: 'credere', tense: 'imperfetto', pronoun: 'noi', correct: true, accentOnly: false },
  ]);
  const weakest = getWeakestTenses(storage, { minSamples: 3 });
  assert.equal(weakest[0].tense, 'imperfetto');
  assert.ok(weakest[0].accuracy < weakest[1].accuracy); // imperfetto (1/3) < presente (3/3)
});
