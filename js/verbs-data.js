// js/verbs-data.js
//
// Hand-written irregular verbs. Each entry:
// { infinitive, auxiliary: 'avere'|'essere', translation, conjugation: {...15 tenses...} }
// Compound tenses are built with buildCompoundTenses so they stay consistent
// with the engine's auxiliary tables instead of being hand-typed and error-prone.

const { AUXILIARIES, buildCompoundTenses } = require('./conjugation-engine.js');

function makeVerb(infinitive, auxiliary, translation, simpleAndImperativo, participio) {
  const compound = buildCompoundTenses(auxiliary, participio);
  return {
    infinitive,
    auxiliary,
    translation,
    conjugation: { ...simpleAndImperativo, ...compound },
  };
}

const IRREGULAR_VERBS = [
  makeVerb('essere', 'essere', 'ser/estar', {
    presente: AUXILIARIES.essere.presente,
    imperfetto: AUXILIARIES.essere.imperfetto,
    passato_remoto: AUXILIARIES.essere.passato_remoto,
    futuro_semplice: AUXILIARIES.essere.futuro_semplice,
    congiuntivo_presente: AUXILIARIES.essere.congiuntivo_presente,
    congiuntivo_imperfetto: AUXILIARIES.essere.congiuntivo_imperfetto,
    condizionale_presente: AUXILIARIES.essere.condizionale_presente,
    imperativo: ['sii', 'sia', 'siamo', 'siate', 'siano'],
  }, { masc_sing: 'stato', masc_plur: 'stati' }),

  makeVerb('avere', 'avere', 'tener/haber', {
    presente: AUXILIARIES.avere.presente,
    imperfetto: AUXILIARIES.avere.imperfetto,
    passato_remoto: AUXILIARIES.avere.passato_remoto,
    futuro_semplice: AUXILIARIES.avere.futuro_semplice,
    congiuntivo_presente: AUXILIARIES.avere.congiuntivo_presente,
    congiuntivo_imperfetto: AUXILIARIES.avere.congiuntivo_imperfetto,
    condizionale_presente: AUXILIARIES.avere.condizionale_presente,
    imperativo: ['abbi', 'abbia', 'abbiamo', 'abbiate', 'abbiano'],
  }, { masc_sing: 'avuto', masc_plur: 'avuti' }),

  makeVerb('andare', 'essere', 'ir', {
    presente: ['vado', 'vai', 'va', 'andiamo', 'andate', 'vanno'],
    imperfetto: ['andavo', 'andavi', 'andava', 'andavamo', 'andavate', 'andavano'],
    passato_remoto: ['andai', 'andasti', 'andò', 'andammo', 'andaste', 'andarono'],
    futuro_semplice: ['andrò', 'andrai', 'andrà', 'andremo', 'andrete', 'andranno'],
    congiuntivo_presente: ['vada', 'vada', 'vada', 'andiamo', 'andiate', 'vadano'],
    congiuntivo_imperfetto: ['andassi', 'andassi', 'andasse', 'andassimo', 'andaste', 'andassero'],
    condizionale_presente: ['andrei', 'andresti', 'andrebbe', 'andremmo', 'andreste', 'andrebbero'],
    imperativo: ['va\'', 'vada', 'andiamo', 'andate', 'vadano'],
  }, { masc_sing: 'andato', masc_plur: 'andati' }),

  makeVerb('fare', 'avere', 'hacer', {
    presente: ['faccio', 'fai', 'fa', 'facciamo', 'fate', 'fanno'],
    imperfetto: ['facevo', 'facevi', 'faceva', 'facevamo', 'facevate', 'facevano'],
    passato_remoto: ['feci', 'facesti', 'fece', 'facemmo', 'faceste', 'fecero'],
    futuro_semplice: ['farò', 'farai', 'farà', 'faremo', 'farete', 'faranno'],
    congiuntivo_presente: ['faccia', 'faccia', 'faccia', 'facciamo', 'facciate', 'facciano'],
    congiuntivo_imperfetto: ['facessi', 'facessi', 'facesse', 'facessimo', 'faceste', 'facessero'],
    condizionale_presente: ['farei', 'faresti', 'farebbe', 'faremmo', 'fareste', 'farebbero'],
    imperativo: ['fa\'', 'faccia', 'facciamo', 'fate', 'facciano'],
  }, { masc_sing: 'fatto', masc_plur: 'fatti' }),

  makeVerb('potere', 'avere', 'poder', {
    presente: ['posso', 'puoi', 'può', 'possiamo', 'potete', 'possono'],
    imperfetto: ['potevo', 'potevi', 'poteva', 'potevamo', 'potevate', 'potevano'],
    passato_remoto: ['potei', 'potesti', 'poté', 'potemmo', 'poteste', 'poterono'],
    futuro_semplice: ['potrò', 'potrai', 'potrà', 'potremo', 'potrete', 'potranno'],
    congiuntivo_presente: ['possa', 'possa', 'possa', 'possiamo', 'possiate', 'possano'],
    congiuntivo_imperfetto: ['potessi', 'potessi', 'potesse', 'potessimo', 'poteste', 'potessero'],
    condizionale_presente: ['potrei', 'potresti', 'potrebbe', 'potremmo', 'potreste', 'potrebbero'],
    imperativo: ['puoi', 'possa', 'possiamo', 'potete', 'possano'],
  }, { masc_sing: 'potuto', masc_plur: 'potuti' }),
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { IRREGULAR_VERBS };
}
