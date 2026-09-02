// test/verb-bank.test.js
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { getConjugation, listAllVerbs } = require('../js/verb-bank.js');

test('getConjugation returns irregular verb data directly for essere', () => {
  const result = getConjugation('essere');
  assert.deepEqual(result.conjugation.presente, ['sono', 'sei', 'è', 'siamo', 'siete', 'sono']);
  assert.equal(result.infinitive, 'essere');
});

test('getConjugation computes regular verb data via the engine for parlare', () => {
  const result = getConjugation('parlare');
  assert.deepEqual(result.conjugation.presente, ['parlo', 'parli', 'parla', 'parliamo', 'parlate', 'parlano']);
  assert.equal(result.auxiliary, 'avere');
});

test('getConjugation returns undefined for an unknown infinitive', () => {
  assert.equal(getConjugation('nonexistente'), undefined);
});

test('listAllVerbs returns every regular and irregular verb, no duplicates', () => {
  const all = listAllVerbs();
  const infinitives = all.map(v => v.infinitive);
  assert.equal(new Set(infinitives).size, infinitives.length);
  assert.ok(infinitives.includes('parlare'));
  assert.ok(infinitives.includes('essere'));
});
