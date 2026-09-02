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

test('conjugateSimpleTense produces congiuntivo_presente for -are/-ere/-ire/-ire isc', () => {
  assert.deepEqual(conjugateSimpleTense('parl', 'are', false, 'congiuntivo_presente'),
    ['parli', 'parli', 'parli', 'parliamo', 'parliate', 'parlino']);
  assert.deepEqual(conjugateSimpleTense('cred', 'ere', false, 'congiuntivo_presente'),
    ['creda', 'creda', 'creda', 'crediamo', 'crediate', 'credano']);
  assert.deepEqual(conjugateSimpleTense('dorm', 'ire', false, 'congiuntivo_presente'),
    ['dorma', 'dorma', 'dorma', 'dormiamo', 'dormiate', 'dormano']);
  assert.deepEqual(conjugateSimpleTense('cap', 'ire', true, 'congiuntivo_presente'),
    ['capisca', 'capisca', 'capisca', 'capiamo', 'capiate', 'capiscano']);
});

test('conjugateSimpleTense produces congiuntivo_imperfetto for -are/-ere/-ire', () => {
  assert.deepEqual(conjugateSimpleTense('parl', 'are', false, 'congiuntivo_imperfetto'),
    ['parlassi', 'parlassi', 'parlasse', 'parlassimo', 'parlaste', 'parlassero']);
  assert.deepEqual(conjugateSimpleTense('cred', 'ere', false, 'congiuntivo_imperfetto'),
    ['credessi', 'credessi', 'credesse', 'credessimo', 'credeste', 'credessero']);
  assert.deepEqual(conjugateSimpleTense('dorm', 'ire', false, 'congiuntivo_imperfetto'),
    ['dormissi', 'dormissi', 'dormisse', 'dormissimo', 'dormiste', 'dormissero']);
});

test('conjugateSimpleTense produces condizionale_presente for -are/-ere/-ire', () => {
  assert.deepEqual(conjugateSimpleTense('parl', 'are', false, 'condizionale_presente'),
    ['parlerei', 'parleresti', 'parlerebbe', 'parleremmo', 'parlereste', 'parlerebbero']);
  assert.deepEqual(conjugateSimpleTense('cred', 'ere', false, 'condizionale_presente'),
    ['crederei', 'crederesti', 'crederebbe', 'crederemmo', 'credereste', 'crederebbero']);
  assert.deepEqual(conjugateSimpleTense('dorm', 'ire', false, 'condizionale_presente'),
    ['dormirei', 'dormiresti', 'dormirebbe', 'dormiremmo', 'dormireste', 'dormirebbero']);
});

test('conjugateImperativo produces the 5 imperativo forms (tu, Lei, noi, voi, Loro)', () => {
  const { conjugateImperativo } = require('../js/conjugation-engine.js');
  assert.deepEqual(conjugateImperativo('parl', 'are', false),
    ['parla', 'parli', 'parliamo', 'parlate', 'parlino']);
  assert.deepEqual(conjugateImperativo('cred', 'ere', false),
    ['credi', 'creda', 'crediamo', 'credete', 'credano']);
  assert.deepEqual(conjugateImperativo('dorm', 'ire', false),
    ['dormi', 'dorma', 'dormiamo', 'dormite', 'dormano']);
  assert.deepEqual(conjugateImperativo('cap', 'ire', true),
    ['capisci', 'capisca', 'capiamo', 'capite', 'capiscano']);
});

test('conjugateParticipio returns { masc_sing, masc_plur } for each group', () => {
  const { conjugateParticipio } = require('../js/conjugation-engine.js');
  assert.deepEqual(conjugateParticipio('parl', 'are'), { masc_sing: 'parlato', masc_plur: 'parlati' });
  assert.deepEqual(conjugateParticipio('cred', 'ere'), { masc_sing: 'creduto', masc_plur: 'creduti' });
  assert.deepEqual(conjugateParticipio('dorm', 'ire'), { masc_sing: 'dormito', masc_plur: 'dormiti' });
});

test('buildCompoundTenses combines auxiliary + participio with avere (invariant)', () => {
  const { buildCompoundTenses } = require('../js/conjugation-engine.js');
  const participio = { masc_sing: 'parlato', masc_plur: 'parlati' };
  const result = buildCompoundTenses('avere', participio);
  assert.deepEqual(result.passato_prossimo,
    ['ho parlato', 'hai parlato', 'ha parlato', 'abbiamo parlato', 'avete parlato', 'hanno parlato']);
  assert.deepEqual(result.trapassato_prossimo,
    ['avevo parlato', 'avevi parlato', 'aveva parlato', 'avevamo parlato', 'avevate parlato', 'avevano parlato']);
});

test('buildCompoundTenses combines auxiliary + participio with essere (number agreement, masculine default)', () => {
  const { buildCompoundTenses } = require('../js/conjugation-engine.js');
  const participio = { masc_sing: 'andato', masc_plur: 'andati' };
  const result = buildCompoundTenses('essere', participio);
  assert.deepEqual(result.passato_prossimo,
    ['sono andato', 'sei andato', 'è andato', 'siamo andati', 'siete andati', 'sono andati']);
});

test('buildCompoundTenses produces all 7 compound tense keys', () => {
  const { buildCompoundTenses } = require('../js/conjugation-engine.js');
  const result = buildCompoundTenses('avere', { masc_sing: 'parlato', masc_plur: 'parlati' });
  assert.deepEqual(Object.keys(result).sort(), [
    'condizionale_passato', 'congiuntivo_passato', 'congiuntivo_trapassato',
    'futuro_anteriore', 'passato_prossimo', 'trapassato_prossimo', 'trapassato_remoto',
  ]);
});

test('conjugateRegularVerb produces all 15 tenses for parlare (avere)', () => {
  const { conjugateRegularVerb } = require('../js/conjugation-engine.js');
  const result = conjugateRegularVerb('parlare', 'are', false, 'avere');
  assert.deepEqual(result.presente, ['parlo', 'parli', 'parla', 'parliamo', 'parlate', 'parlano']);
  assert.deepEqual(result.passato_prossimo,
    ['ho parlato', 'hai parlato', 'ha parlato', 'abbiamo parlato', 'avete parlato', 'hanno parlato']);
  assert.deepEqual(result.imperativo, ['parla', 'parli', 'parliamo', 'parlate', 'parlino']);
  assert.equal(Object.keys(result).length, 15);
});

test('conjugateRegularVerb produces all 15 tenses for andare-shaped -are verb (essere)', () => {
  const { conjugateRegularVerb } = require('../js/conjugation-engine.js');
  const result = conjugateRegularVerb('arrivare', 'are', false, 'essere');
  assert.deepEqual(result.passato_prossimo,
    ['sono arrivato', 'sei arrivato', 'è arrivato', 'siamo arrivati', 'siete arrivati', 'sono arrivati']);
});
