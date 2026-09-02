// test/verbs-data.test.js
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { IRREGULAR_VERBS } = require('../js/verbs-data.js');

function verb(infinitive) {
  return IRREGULAR_VERBS.find(v => v.infinitive === infinitive);
}

test('essere is present with correct presente and passato_prossimo', () => {
  const v = verb('essere');
  assert.ok(v, 'essere should be in IRREGULAR_VERBS');
  assert.deepEqual(v.conjugation.presente, ['sono', 'sei', 'è', 'siamo', 'siete', 'sono']);
  assert.deepEqual(v.conjugation.passato_prossimo,
    ['sono stato', 'sei stato', 'è stato', 'siamo stati', 'siete stati', 'sono stati']);
});

test('avere is present with correct presente and imperativo', () => {
  const v = verb('avere');
  assert.deepEqual(v.conjugation.presente, ['ho', 'hai', 'ha', 'abbiamo', 'avete', 'hanno']);
  assert.deepEqual(v.conjugation.imperativo, ['abbi', 'abbia', 'abbiamo', 'abbiate', 'abbiano']);
});

test('andare is present with correct presente and futuro_semplice', () => {
  const v = verb('andare');
  assert.deepEqual(v.conjugation.presente, ['vado', 'vai', 'va', 'andiamo', 'andate', 'vanno']);
  assert.deepEqual(v.conjugation.futuro_semplice, ['andrò', 'andrai', 'andrà', 'andremo', 'andrete', 'andranno']);
  assert.equal(v.auxiliary, 'essere');
});

test('fare is present with correct presente and participio-based passato_prossimo', () => {
  const v = verb('fare');
  assert.deepEqual(v.conjugation.presente, ['faccio', 'fai', 'fa', 'facciamo', 'fate', 'fanno']);
  assert.deepEqual(v.conjugation.passato_prossimo,
    ['ho fatto', 'hai fatto', 'ha fatto', 'abbiamo fatto', 'avete fatto', 'hanno fatto']);
});

test('potere is present with correct presente and condizionale_presente', () => {
  const v = verb('potere');
  assert.deepEqual(v.conjugation.presente, ['posso', 'puoi', 'può', 'possiamo', 'potete', 'possono']);
  assert.deepEqual(v.conjugation.condizionale_presente,
    ['potrei', 'potresti', 'potrebbe', 'potremmo', 'potreste', 'potrebbero']);
});

test('every irregular verb has all 15 tense keys', () => {
  const expectedKeys = [
    'presente', 'imperfetto', 'passato_remoto', 'futuro_semplice',
    'congiuntivo_presente', 'congiuntivo_imperfetto', 'condizionale_presente', 'imperativo',
    'passato_prossimo', 'trapassato_prossimo', 'trapassato_remoto', 'futuro_anteriore',
    'congiuntivo_passato', 'congiuntivo_trapassato', 'condizionale_passato',
  ].sort();
  for (const v of IRREGULAR_VERBS) {
    assert.deepEqual(Object.keys(v.conjugation).sort(), expectedKeys, `${v.infinitive} is missing tense keys`);
  }
});
