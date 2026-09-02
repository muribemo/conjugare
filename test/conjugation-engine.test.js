// test/conjugation-engine.test.js
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { AUXILIARIES, PRONOUNS, conjugateSimpleTense } = require('../js/conjugation-engine.js');

test('PRONOUNS has the 6 expected slots in order', () => {
  assert.deepEqual(PRONOUNS, ['io', 'tu', 'lui_lei', 'noi', 'voi', 'loro']);
});

test('AUXILIARIES.avere.presente is correct', () => {
  assert.deepEqual(AUXILIARIES.avere.presente, ['ho', 'hai', 'ha', 'abbiamo', 'avete', 'hanno']);
});

test('AUXILIARIES.essere.presente is correct', () => {
  assert.deepEqual(AUXILIARIES.essere.presente, ['sono', 'sei', 'è', 'siamo', 'siete', 'sono']);
});

test('conjugateSimpleTense produces indicativo presente for -are (parlare)', () => {
  const result = conjugateSimpleTense('parl', 'are', false, 'presente');
  assert.deepEqual(result, ['parlo', 'parli', 'parla', 'parliamo', 'parlate', 'parlano']);
});

test('conjugateSimpleTense produces indicativo presente for -ere (credere)', () => {
  const result = conjugateSimpleTense('cred', 'ere', false, 'presente');
  assert.deepEqual(result, ['credo', 'credi', 'crede', 'crediamo', 'credete', 'credono']);
});

test('conjugateSimpleTense produces indicativo presente for -ire no isc (dormire)', () => {
  const result = conjugateSimpleTense('dorm', 'ire', false, 'presente');
  assert.deepEqual(result, ['dormo', 'dormi', 'dorme', 'dormiamo', 'dormite', 'dormono']);
});

test('conjugateSimpleTense produces indicativo presente for -ire isc (capire)', () => {
  const result = conjugateSimpleTense('cap', 'ire', true, 'presente');
  assert.deepEqual(result, ['capisco', 'capisci', 'capisce', 'capiamo', 'capite', 'capiscono']);
});
