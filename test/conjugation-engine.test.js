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

test('conjugateSimpleTense produces imperfetto for -are/-ere/-ire', () => {
  assert.deepEqual(conjugateSimpleTense('parl', 'are', false, 'imperfetto'),
    ['parlavo', 'parlavi', 'parlava', 'parlavamo', 'parlavate', 'parlavano']);
  assert.deepEqual(conjugateSimpleTense('cred', 'ere', false, 'imperfetto'),
    ['credevo', 'credevi', 'credeva', 'credevamo', 'credevate', 'credevano']);
  assert.deepEqual(conjugateSimpleTense('cap', 'ire', true, 'imperfetto'),
    ['capivo', 'capivi', 'capiva', 'capivamo', 'capivate', 'capivano']);
});

test('conjugateSimpleTense produces passato_remoto for -are/-ere/-ire', () => {
  assert.deepEqual(conjugateSimpleTense('parl', 'are', false, 'passato_remoto'),
    ['parlai', 'parlasti', 'parlò', 'parlammo', 'parlaste', 'parlarono']);
  assert.deepEqual(conjugateSimpleTense('cred', 'ere', false, 'passato_remoto'),
    ['credei', 'credesti', 'credé', 'credemmo', 'credeste', 'crederono']);
  assert.deepEqual(conjugateSimpleTense('dorm', 'ire', false, 'passato_remoto'),
    ['dormii', 'dormisti', 'dormì', 'dormimmo', 'dormiste', 'dormirono']);
});

test('conjugateSimpleTense produces futuro_semplice for -are/-ere/-ire', () => {
  assert.deepEqual(conjugateSimpleTense('parl', 'are', false, 'futuro_semplice'),
    ['parlerò', 'parlerai', 'parlerà', 'parleremo', 'parlerete', 'parleranno']);
  assert.deepEqual(conjugateSimpleTense('cred', 'ere', false, 'futuro_semplice'),
    ['crederò', 'crederai', 'crederà', 'crederemo', 'crederete', 'crederanno']);
  assert.deepEqual(conjugateSimpleTense('dorm', 'ire', false, 'futuro_semplice'),
    ['dormirò', 'dormirai', 'dormirà', 'dormiremo', 'dormirete', 'dormiranno']);
});
