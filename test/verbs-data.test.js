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

test('IRREGULAR_VERBS has 50 verbs (5 original + 23 batch A + 22 batch B)', () => {
  assert.equal(IRREGULAR_VERBS.length, 50);
});

test('dire is present with correct presente', () => {
  const v = verb('dire');
  assert.ok(v, 'dire should be in IRREGULAR_VERBS');
  assert.deepEqual(v.conjugation.presente, ['dico', 'dici', 'dice', 'diciamo', 'dite', 'dicono']);
});

test('venire is present with correct presente', () => {
  const v = verb('venire');
  assert.ok(v, 'venire should be in IRREGULAR_VERBS');
  assert.deepEqual(v.conjugation.presente, ['vengo', 'vieni', 'viene', 'veniamo', 'venite', 'vengono']);
});

test('bere is present with correct presente', () => {
  const v = verb('bere');
  assert.ok(v, 'bere should be in IRREGULAR_VERBS');
  assert.deepEqual(v.conjugation.presente, ['bevo', 'bevi', 'beve', 'beviamo', 'bevete', 'bevono']);
});

test('dovere is present with correct presente', () => {
  const v = verb('dovere');
  assert.ok(v, 'dovere should be in IRREGULAR_VERBS');
  assert.deepEqual(v.conjugation.presente, ['devo', 'devi', 'deve', 'dobbiamo', 'dovete', 'devono']);
});

test('nascere is present with correct presente', () => {
  const v = verb('nascere');
  assert.ok(v, 'nascere should be in IRREGULAR_VERBS');
  assert.deepEqual(v.conjugation.presente, ['nasco', 'nasci', 'nasce', 'nasciamo', 'nascete', 'nascono']);
});

test('mettere is present with correct presente', () => {
  const v = verb('mettere');
  assert.ok(v, 'mettere should be in IRREGULAR_VERBS');
  assert.deepEqual(v.conjugation.presente, ['metto', 'metti', 'mette', 'mettiamo', 'mettete', 'mettono']);
});

test('scrivere is present with correct presente', () => {
  const v = verb('scrivere');
  assert.ok(v, 'scrivere should be in IRREGULAR_VERBS');
  assert.deepEqual(v.conjugation.presente, ['scrivo', 'scrivi', 'scrive', 'scriviamo', 'scrivete', 'scrivono']);
});

test('tradurre is present with correct presente', () => {
  const v = verb('tradurre');
  assert.ok(v, 'tradurre should be in IRREGULAR_VERBS');
  assert.deepEqual(v.conjugation.presente, ['traduco', 'traduci', 'traduce', 'traduciamo', 'traducete', 'traducono']);
});

test('porre is present with correct presente', () => {
  const v = verb('porre');
  assert.ok(v, 'porre should be in IRREGULAR_VERBS');
  assert.deepEqual(v.conjugation.presente, ['pongo', 'poni', 'pone', 'poniamo', 'ponete', 'pongono']);
});

test('trarre is present with correct presente', () => {
  const v = verb('trarre');
  assert.ok(v, 'trarre should be in IRREGULAR_VERBS');
  assert.deepEqual(v.conjugation.presente, ['traggo', 'trai', 'trae', 'traiamo', 'traete', 'traggono']);
});

test('sedere is present with correct presente', () => {
  const v = verb('sedere');
  assert.ok(v, 'sedere should be in IRREGULAR_VERBS');
  assert.deepEqual(v.conjugation.presente, ['siedo', 'siedi', 'siede', 'sediamo', 'sedete', 'siedono']);
});

test('rompere is correct for passato_remoto, imperativo and participio', () => {
  const v = verb('rompere');
  assert.ok(v, 'rompere should be in IRREGULAR_VERBS');
  assert.deepEqual(v.conjugation.passato_remoto, ['ruppi', 'rompesti', 'ruppe', 'rompemmo', 'rompeste', 'ruppero']);
  assert.deepEqual(v.conjugation.imperativo, ['rompi', 'rompa', 'rompiamo', 'rompete', 'rompano']);
  assert.deepEqual(v.conjugation.passato_prossimo,
    ['ho rotto', 'hai rotto', 'ha rotto', 'abbiamo rotto', 'avete rotto', 'hanno rotto']);
});

test('porre is correct for passato_remoto, imperativo and participio', () => {
  const v = verb('porre');
  assert.deepEqual(v.conjugation.passato_remoto, ['posi', 'ponesti', 'pose', 'ponemmo', 'poneste', 'posero']);
  assert.deepEqual(v.conjugation.imperativo, ['poni', 'ponga', 'poniamo', 'ponete', 'pongano']);
  assert.deepEqual(v.conjugation.passato_prossimo,
    ['ho posto', 'hai posto', 'ha posto', 'abbiamo posto', 'avete posto', 'hanno posto']);
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
