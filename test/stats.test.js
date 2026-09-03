const { test } = require('node:test');
const assert = require('node:assert/strict');
const { recordSessionAnswers, getStats, getWeakestTenses, aggregateBy, getVerbBreakdown, getVerbCombinations, clearHistory } = require('../js/stats.js');

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

test('aggregateBy groups items by key and tallies total/correct', () => {
  const items = [
    { tense: 'presente', correct: true },
    { tense: 'presente', correct: false },
    { tense: 'imperfetto', correct: true },
  ];
  const grouped = aggregateBy(items, 'tense');
  assert.deepEqual(grouped, {
    presente: { total: 2, correct: 1 },
    imperfetto: { total: 1, correct: 1 },
  });
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

test('getVerbBreakdown returns every practiced verb sorted worst-accuracy-first', () => {
  const storage = fakeStorage();
  recordSessionAnswers(storage, [
    { infinitive: 'parlare', tense: 'presente', pronoun: 'io', correct: true, accentOnly: false },
    { infinitive: 'parlare', tense: 'presente', pronoun: 'tu', correct: true, accentOnly: false },
    { infinitive: 'essere', tense: 'presente', pronoun: 'io', correct: false, accentOnly: false },
    { infinitive: 'essere', tense: 'presente', pronoun: 'tu', correct: true, accentOnly: false },
  ]);
  const breakdown = getVerbBreakdown(storage);
  assert.equal(breakdown.length, 2);
  assert.equal(breakdown[0].infinitive, 'essere');
  assert.equal(breakdown[0].total, 2);
  assert.equal(breakdown[0].correct, 1);
  assert.equal(breakdown[0].accuracy, 0.5);
  assert.equal(breakdown[1].infinitive, 'parlare');
  assert.equal(breakdown[1].accuracy, 1);
});

test('getVerbBreakdown breaks accuracy ties alphabetically by infinitive', () => {
  const storage = fakeStorage();
  recordSessionAnswers(storage, [
    { infinitive: 'vivere', tense: 'presente', pronoun: 'io', correct: true, accentOnly: false },
    { infinitive: 'andare', tense: 'presente', pronoun: 'io', correct: true, accentOnly: false },
  ]);
  const breakdown = getVerbBreakdown(storage);
  assert.deepEqual(breakdown.map((v) => v.infinitive), ['andare', 'vivere']);
});

test('getVerbBreakdown returns an empty array when there is no history', () => {
  const storage = fakeStorage();
  assert.deepEqual(getVerbBreakdown(storage), []);
});

test('getVerbBreakdown includes verbs with only 1 sample (no minSamples filter)', () => {
  const storage = fakeStorage();
  recordSessionAnswers(storage, [
    { infinitive: 'fare', tense: 'presente', pronoun: 'io', correct: true, accentOnly: false },
  ]);
  const breakdown = getVerbBreakdown(storage);
  assert.equal(breakdown.length, 1);
  assert.equal(breakdown[0].total, 1);
});

test('getVerbCombinations groups only the given verb answers by tense then pronoun', () => {
  const storage = fakeStorage();
  recordSessionAnswers(storage, [
    { infinitive: 'parlare', tense: 'presente', pronoun: 'io', correct: true, accentOnly: false },
    { infinitive: 'parlare', tense: 'presente', pronoun: 'io', correct: false, accentOnly: false },
    { infinitive: 'parlare', tense: 'presente', pronoun: 'tu', correct: true, accentOnly: false },
    { infinitive: 'parlare', tense: 'imperativo', pronoun: 'Lei', correct: true, accentOnly: false },
    { infinitive: 'essere', tense: 'presente', pronoun: 'io', correct: true, accentOnly: false },
  ]);
  const combos = getVerbCombinations(storage, 'parlare');
  assert.deepEqual(combos.presente.io, { total: 2, correct: 1 });
  assert.deepEqual(combos.presente.tu, { total: 1, correct: 1 });
  assert.deepEqual(combos.imperativo.Lei, { total: 1, correct: 1 });
  assert.equal(combos.presente.noi, undefined);
  assert.equal('essere' in combos, false);
});

test('getVerbCombinations returns an empty object for a verb never practiced', () => {
  const storage = fakeStorage();
  recordSessionAnswers(storage, [
    { infinitive: 'essere', tense: 'presente', pronoun: 'io', correct: true, accentOnly: false },
  ]);
  assert.deepEqual(getVerbCombinations(storage, 'parlare'), {});
});

test('clearHistory removes all recorded answers but does not throw on empty storage', () => {
  const storage = fakeStorage();
  recordSessionAnswers(storage, [
    { infinitive: 'parlare', tense: 'presente', pronoun: 'io', correct: true, accentOnly: false },
  ]);
  clearHistory(storage);
  assert.deepEqual(getStats(storage), { byTense: {}, byVerb: {} });
  assert.deepEqual(getVerbBreakdown(storage), []);
  clearHistory(storage); // clearing already-empty history should not throw
  assert.deepEqual(getStats(storage), { byTense: {}, byVerb: {} });
});
