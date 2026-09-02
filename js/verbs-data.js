// js/verbs-data.js
//
// Hand-written irregular verbs. Each entry:
// { infinitive, auxiliary: 'avere'|'essere', translation, conjugation: {...15 tenses...} }
// Compound tenses are built with buildCompoundTenses so they stay consistent
// with the engine's auxiliary tables instead of being hand-typed and error-prone.

const { AUXILIARIES, buildCompoundTenses } = typeof module !== 'undefined' && module.exports
  ? require('./conjugation-engine.js')
  : window.ConjugationEngine;

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
    // 'potere' has no true imperativo in standard Italian (you can't grammatically command
    // someone to "be able to"); indicativo presente forms are reused here as a pragmatic
    // filler so the app can still ask imperativo practice questions for every verb uniformly.
    imperativo: ['puoi', 'possa', 'possiamo', 'potete', 'possano'],
  }, { masc_sing: 'potuto', masc_plur: 'potuti' }),

  makeVerb('dire', 'avere', 'decir', {
    presente: ['dico', 'dici', 'dice', 'diciamo', 'dite', 'dicono'],
    imperfetto: ['dicevo', 'dicevi', 'diceva', 'dicevamo', 'dicevate', 'dicevano'],
    passato_remoto: ['dissi', 'dicesti', 'disse', 'dicemmo', 'diceste', 'dissero'],
    futuro_semplice: ['dirò', 'dirai', 'dirà', 'diremo', 'direte', 'diranno'],
    congiuntivo_presente: ['dica', 'dica', 'dica', 'diciamo', 'diciate', 'dicano'],
    congiuntivo_imperfetto: ['dicessi', 'dicessi', 'dicesse', 'dicessimo', 'diceste', 'dicessero'],
    condizionale_presente: ['direi', 'diresti', 'direbbe', 'diremmo', 'direste', 'direbbero'],
    imperativo: ['di\'', 'dica', 'diciamo', 'dite', 'dicano'],
  }, { masc_sing: 'detto', masc_plur: 'detti' }),

  makeVerb('dare', 'avere', 'dar', {
    presente: ['do', 'dai', 'dà', 'diamo', 'date', 'danno'],
    imperfetto: ['davo', 'davi', 'dava', 'davamo', 'davate', 'davano'],
    passato_remoto: ['diedi', 'desti', 'diede', 'demmo', 'deste', 'diedero'],
    futuro_semplice: ['darò', 'darai', 'darà', 'daremo', 'darete', 'daranno'],
    congiuntivo_presente: ['dia', 'dia', 'dia', 'diamo', 'diate', 'diano'],
    congiuntivo_imperfetto: ['dessi', 'dessi', 'desse', 'dessimo', 'deste', 'dessero'],
    condizionale_presente: ['darei', 'daresti', 'darebbe', 'daremmo', 'dareste', 'darebbero'],
    imperativo: ['da\'', 'dia', 'diamo', 'date', 'diano'],
  }, { masc_sing: 'dato', masc_plur: 'dati' }),

  makeVerb('stare', 'essere', 'estar', {
    presente: ['sto', 'stai', 'sta', 'stiamo', 'state', 'stanno'],
    imperfetto: ['stavo', 'stavi', 'stava', 'stavamo', 'stavate', 'stavano'],
    passato_remoto: ['stetti', 'stesti', 'stette', 'stemmo', 'steste', 'stettero'],
    futuro_semplice: ['starò', 'starai', 'starà', 'staremo', 'starete', 'staranno'],
    congiuntivo_presente: ['stia', 'stia', 'stia', 'stiamo', 'stiate', 'stiano'],
    congiuntivo_imperfetto: ['stessi', 'stessi', 'stesse', 'stessimo', 'steste', 'stessero'],
    condizionale_presente: ['starei', 'staresti', 'starebbe', 'staremmo', 'stareste', 'starebbero'],
    imperativo: ['sta\'', 'stia', 'stiamo', 'state', 'stiano'],
  }, { masc_sing: 'stato', masc_plur: 'stati' }),

  makeVerb('venire', 'essere', 'venir', {
    presente: ['vengo', 'vieni', 'viene', 'veniamo', 'venite', 'vengono'],
    imperfetto: ['venivo', 'venivi', 'veniva', 'venivamo', 'venivate', 'venivano'],
    passato_remoto: ['venni', 'venisti', 'venne', 'venimmo', 'veniste', 'vennero'],
    futuro_semplice: ['verrò', 'verrai', 'verrà', 'verremo', 'verrete', 'verranno'],
    congiuntivo_presente: ['venga', 'venga', 'venga', 'veniamo', 'veniate', 'vengano'],
    congiuntivo_imperfetto: ['venissi', 'venissi', 'venisse', 'venissimo', 'veniste', 'venissero'],
    condizionale_presente: ['verrei', 'verresti', 'verrebbe', 'verremmo', 'verreste', 'verrebbero'],
    imperativo: ['vieni', 'venga', 'veniamo', 'venite', 'vengano'],
  }, { masc_sing: 'venuto', masc_plur: 'venuti' }),

  makeVerb('sapere', 'avere', 'saber', {
    presente: ['so', 'sai', 'sa', 'sappiamo', 'sapete', 'sanno'],
    imperfetto: ['sapevo', 'sapevi', 'sapeva', 'sapevamo', 'sapevate', 'sapevano'],
    passato_remoto: ['seppi', 'sapesti', 'seppe', 'sapemmo', 'sapeste', 'seppero'],
    futuro_semplice: ['saprò', 'saprai', 'saprà', 'sapremo', 'saprete', 'sapranno'],
    congiuntivo_presente: ['sappia', 'sappia', 'sappia', 'sappiamo', 'sappiate', 'sappiano'],
    congiuntivo_imperfetto: ['sapessi', 'sapessi', 'sapesse', 'sapessimo', 'sapeste', 'sapessero'],
    condizionale_presente: ['saprei', 'sapresti', 'saprebbe', 'sapremmo', 'sapreste', 'saprebbero'],
    imperativo: ['sappi', 'sappia', 'sappiamo', 'sappiate', 'sappiano'],
  }, { masc_sing: 'saputo', masc_plur: 'saputi' }),

  makeVerb('uscire', 'essere', 'salir', {
    presente: ['esco', 'esci', 'esce', 'usciamo', 'uscite', 'escono'],
    imperfetto: ['uscivo', 'uscivi', 'usciva', 'uscivamo', 'uscivate', 'uscivano'],
    passato_remoto: ['uscii', 'uscisti', 'uscì', 'uscimmo', 'usciste', 'uscirono'],
    futuro_semplice: ['uscirò', 'uscirai', 'uscirà', 'usciremo', 'uscirete', 'usciranno'],
    congiuntivo_presente: ['esca', 'esca', 'esca', 'usciamo', 'usciate', 'escano'],
    congiuntivo_imperfetto: ['uscissi', 'uscissi', 'uscisse', 'uscissimo', 'usciste', 'uscissero'],
    condizionale_presente: ['uscirei', 'usciresti', 'uscirebbe', 'usciremmo', 'uscireste', 'uscirebbero'],
    imperativo: ['esci', 'esca', 'usciamo', 'uscite', 'escano'],
  }, { masc_sing: 'uscito', masc_plur: 'usciti' }),

  makeVerb('bere', 'avere', 'beber', {
    presente: ['bevo', 'bevi', 'beve', 'beviamo', 'bevete', 'bevono'],
    imperfetto: ['bevevo', 'bevevi', 'beveva', 'bevevamo', 'bevevate', 'bevevano'],
    passato_remoto: ['bevvi', 'bevesti', 'bevve', 'bevemmo', 'beveste', 'bevvero'],
    futuro_semplice: ['berrò', 'berrai', 'berrà', 'berremo', 'berrete', 'berranno'],
    congiuntivo_presente: ['beva', 'beva', 'beva', 'beviamo', 'beviate', 'bevano'],
    congiuntivo_imperfetto: ['bevessi', 'bevessi', 'bevesse', 'bevessimo', 'beveste', 'bevessero'],
    condizionale_presente: ['berrei', 'berresti', 'berrebbe', 'berremmo', 'berreste', 'berrebbero'],
    imperativo: ['bevi', 'beva', 'beviamo', 'bevete', 'bevano'],
  }, { masc_sing: 'bevuto', masc_plur: 'bevuti' }),

  makeVerb('volere', 'avere', 'querer', {
    presente: ['voglio', 'vuoi', 'vuole', 'vogliamo', 'volete', 'vogliono'],
    imperfetto: ['volevo', 'volevi', 'voleva', 'volevamo', 'volevate', 'volevano'],
    passato_remoto: ['volli', 'volesti', 'volle', 'volemmo', 'voleste', 'vollero'],
    futuro_semplice: ['vorrò', 'vorrai', 'vorrà', 'vorremo', 'vorrete', 'vorranno'],
    congiuntivo_presente: ['voglia', 'voglia', 'voglia', 'vogliamo', 'vogliate', 'vogliano'],
    congiuntivo_imperfetto: ['volessi', 'volessi', 'volesse', 'volessimo', 'voleste', 'volessero'],
    condizionale_presente: ['vorrei', 'vorresti', 'vorrebbe', 'vorremmo', 'vorreste', 'vorrebbero'],
    imperativo: ['vogli', 'voglia', 'vogliamo', 'vogliate', 'vogliano'],
  }, { masc_sing: 'voluto', masc_plur: 'voluti' }),

  makeVerb('dovere', 'avere', 'deber', {
    presente: ['devo', 'devi', 'deve', 'dobbiamo', 'dovete', 'devono'],
    imperfetto: ['dovevo', 'dovevi', 'doveva', 'dovevamo', 'dovevate', 'dovevano'],
    passato_remoto: ['dovei', 'dovesti', 'dové', 'dovemmo', 'doveste', 'doverono'],
    futuro_semplice: ['dovrò', 'dovrai', 'dovrà', 'dovremo', 'dovrete', 'dovranno'],
    congiuntivo_presente: ['debba', 'debba', 'debba', 'dobbiamo', 'dobbiate', 'debbano'],
    congiuntivo_imperfetto: ['dovessi', 'dovessi', 'dovesse', 'dovessimo', 'doveste', 'dovessero'],
    condizionale_presente: ['dovrei', 'dovresti', 'dovrebbe', 'dovremmo', 'dovreste', 'dovrebbero'],
    // 'dovere' has no true imperativo in standard Italian (you can't grammatically command
    // someone to "have to"); indicativo presente forms are reused here as a pragmatic
    // filler so the app can still ask imperativo practice questions for every verb uniformly.
    imperativo: ['devi', 'debba', 'dobbiamo', 'dovete', 'debbano'],
  }, { masc_sing: 'dovuto', masc_plur: 'dovuti' }),

  makeVerb('vedere', 'avere', 'ver', {
    presente: ['vedo', 'vedi', 'vede', 'vediamo', 'vedete', 'vedono'],
    imperfetto: ['vedevo', 'vedevi', 'vedeva', 'vedevamo', 'vedevate', 'vedevano'],
    passato_remoto: ['vidi', 'vedesti', 'vide', 'vedemmo', 'vedeste', 'videro'],
    futuro_semplice: ['vedrò', 'vedrai', 'vedrà', 'vedremo', 'vedrete', 'vedranno'],
    congiuntivo_presente: ['veda', 'veda', 'veda', 'vediamo', 'vediate', 'vedano'],
    congiuntivo_imperfetto: ['vedessi', 'vedessi', 'vedesse', 'vedessimo', 'vedeste', 'vedessero'],
    condizionale_presente: ['vedrei', 'vedresti', 'vedrebbe', 'vedremmo', 'vedreste', 'vedrebbero'],
    imperativo: ['vedi', 'veda', 'vediamo', 'vedete', 'vedano'],
  }, { masc_sing: 'visto', masc_plur: 'visti' }),

  makeVerb('tenere', 'avere', 'tener', {
    presente: ['tengo', 'tieni', 'tiene', 'teniamo', 'tenete', 'tengono'],
    imperfetto: ['tenevo', 'tenevi', 'teneva', 'tenevamo', 'tenevate', 'tenevano'],
    passato_remoto: ['tenni', 'tenesti', 'tenne', 'tenemmo', 'teneste', 'tennero'],
    futuro_semplice: ['terrò', 'terrai', 'terrà', 'terremo', 'terrete', 'terranno'],
    congiuntivo_presente: ['tenga', 'tenga', 'tenga', 'teniamo', 'teniate', 'tengano'],
    congiuntivo_imperfetto: ['tenessi', 'tenessi', 'tenesse', 'tenessimo', 'teneste', 'tenessero'],
    condizionale_presente: ['terrei', 'terresti', 'terrebbe', 'terremmo', 'terreste', 'terrebbero'],
    imperativo: ['tieni', 'tenga', 'teniamo', 'tenete', 'tengano'],
  }, { masc_sing: 'tenuto', masc_plur: 'tenuti' }),

  makeVerb('rimanere', 'essere', 'quedar', {
    presente: ['rimango', 'rimani', 'rimane', 'rimaniamo', 'rimanete', 'rimangono'],
    imperfetto: ['rimanevo', 'rimanevi', 'rimaneva', 'rimanevamo', 'rimanevate', 'rimanevano'],
    passato_remoto: ['rimasi', 'rimanesti', 'rimase', 'rimanemmo', 'rimaneste', 'rimasero'],
    futuro_semplice: ['rimarrò', 'rimarrai', 'rimarrà', 'rimarremo', 'rimarrete', 'rimarranno'],
    congiuntivo_presente: ['rimanga', 'rimanga', 'rimanga', 'rimaniamo', 'rimaniate', 'rimangano'],
    congiuntivo_imperfetto: ['rimanessi', 'rimanessi', 'rimanesse', 'rimanessimo', 'rimaneste', 'rimanessero'],
    condizionale_presente: ['rimarrei', 'rimarresti', 'rimarrebbe', 'rimarremmo', 'rimarreste', 'rimarrebbero'],
    imperativo: ['rimani', 'rimanga', 'rimaniamo', 'rimanete', 'rimangano'],
  }, { masc_sing: 'rimasto', masc_plur: 'rimasti' }),

  makeVerb('salire', 'essere', 'subir', {
    presente: ['salgo', 'sali', 'sale', 'saliamo', 'salite', 'salgono'],
    imperfetto: ['salivo', 'salivi', 'saliva', 'salivamo', 'salivate', 'salivano'],
    passato_remoto: ['salii', 'salisti', 'salì', 'salimmo', 'saliste', 'salirono'],
    futuro_semplice: ['salirò', 'salirai', 'salirà', 'saliremo', 'salirete', 'saliranno'],
    congiuntivo_presente: ['salga', 'salga', 'salga', 'saliamo', 'saliate', 'salgano'],
    congiuntivo_imperfetto: ['salissi', 'salissi', 'salisse', 'salissimo', 'saliste', 'salissero'],
    condizionale_presente: ['salirei', 'saliresti', 'salirebbe', 'saliremmo', 'salireste', 'salirebbero'],
    imperativo: ['sali', 'salga', 'saliamo', 'salite', 'salgano'],
  }, { masc_sing: 'salito', masc_plur: 'saliti' }),

  makeVerb('scegliere', 'avere', 'elegir', {
    presente: ['scelgo', 'scegli', 'sceglie', 'scegliamo', 'scegliete', 'scelgono'],
    imperfetto: ['sceglievo', 'sceglievi', 'sceglieva', 'sceglievamo', 'sceglievate', 'sceglievano'],
    passato_remoto: ['scelsi', 'scegliesti', 'scelse', 'scegliemmo', 'sceglieste', 'scelsero'],
    futuro_semplice: ['sceglierò', 'sceglierai', 'sceglierà', 'sceglieremo', 'sceglierete', 'sceglieranno'],
    congiuntivo_presente: ['scelga', 'scelga', 'scelga', 'scegliamo', 'scegliate', 'scelgano'],
    congiuntivo_imperfetto: ['scegliessi', 'scegliessi', 'scegliesse', 'scegliessimo', 'sceglieste', 'scegliessero'],
    condizionale_presente: ['sceglierei', 'sceglieresti', 'sceglierebbe', 'sceglieremmo', 'scegliereste', 'sceglierebbero'],
    imperativo: ['scegli', 'scelga', 'scegliamo', 'scegliete', 'scelgano'],
  }, { masc_sing: 'scelto', masc_plur: 'scelti' }),

  makeVerb('morire', 'essere', 'morir', {
    presente: ['muoio', 'muori', 'muore', 'moriamo', 'morite', 'muoiono'],
    imperfetto: ['morivo', 'morivi', 'moriva', 'morivamo', 'morivate', 'morivano'],
    passato_remoto: ['morii', 'moristi', 'morì', 'morimmo', 'moriste', 'morirono'],
    futuro_semplice: ['morirò', 'morirai', 'morirà', 'moriremo', 'morirete', 'moriranno'],
    congiuntivo_presente: ['muoia', 'muoia', 'muoia', 'moriamo', 'moriate', 'muoiano'],
    congiuntivo_imperfetto: ['morissi', 'morissi', 'morisse', 'morissimo', 'moriste', 'morissero'],
    condizionale_presente: ['morirei', 'moriresti', 'morirebbe', 'moriremmo', 'morireste', 'morirebbero'],
    imperativo: ['muori', 'muoia', 'moriamo', 'morite', 'muoiano'],
  }, { masc_sing: 'morto', masc_plur: 'morti' }),

  makeVerb('nascere', 'essere', 'nacer', {
    presente: ['nasco', 'nasci', 'nasce', 'nasciamo', 'nascete', 'nascono'],
    imperfetto: ['nascevo', 'nascevi', 'nasceva', 'nascevamo', 'nascevate', 'nascevano'],
    passato_remoto: ['nacqui', 'nascesti', 'nacque', 'nascemmo', 'nasceste', 'nacquero'],
    futuro_semplice: ['nascerò', 'nascerai', 'nascerà', 'nasceremo', 'nascerete', 'nasceranno'],
    congiuntivo_presente: ['nasca', 'nasca', 'nasca', 'nasciamo', 'nasciate', 'nascano'],
    congiuntivo_imperfetto: ['nascessi', 'nascessi', 'nascesse', 'nascessimo', 'nasceste', 'nascessero'],
    condizionale_presente: ['nascerei', 'nasceresti', 'nascerebbe', 'nasceremmo', 'nascereste', 'nascerebbero'],
    imperativo: ['nasci', 'nasca', 'nasciamo', 'nascete', 'nascano'],
  }, { masc_sing: 'nato', masc_plur: 'nati' }),

  makeVerb('piacere', 'essere', 'gustar', {
    presente: ['piaccio', 'piaci', 'piace', 'piacciamo', 'piacete', 'piacciono'],
    imperfetto: ['piacevo', 'piacevi', 'piaceva', 'piacevamo', 'piacevate', 'piacevano'],
    passato_remoto: ['piacqui', 'piacesti', 'piacque', 'piacemmo', 'piaceste', 'piacquero'],
    futuro_semplice: ['piacerò', 'piacerai', 'piacerà', 'piaceremo', 'piacerete', 'piaceranno'],
    congiuntivo_presente: ['piaccia', 'piaccia', 'piaccia', 'piacciamo', 'piacciate', 'piacciano'],
    congiuntivo_imperfetto: ['piacessi', 'piacessi', 'piacesse', 'piacessimo', 'piaceste', 'piacessero'],
    condizionale_presente: ['piacerei', 'piaceresti', 'piacerebbe', 'piaceremmo', 'piacereste', 'piacerebbero'],
    imperativo: ['piaci', 'piaccia', 'piacciamo', 'piacete', 'piacciano'],
  }, { masc_sing: 'piaciuto', masc_plur: 'piaciuti' }),

  makeVerb('vivere', 'avere', 'vivir', {
    presente: ['vivo', 'vivi', 'vive', 'viviamo', 'vivete', 'vivono'],
    imperfetto: ['vivevo', 'vivevi', 'viveva', 'vivevamo', 'vivevate', 'vivevano'],
    passato_remoto: ['vissi', 'vivesti', 'visse', 'vivemmo', 'viveste', 'vissero'],
    futuro_semplice: ['vivrò', 'vivrai', 'vivrà', 'vivremo', 'vivrete', 'vivranno'],
    congiuntivo_presente: ['viva', 'viva', 'viva', 'viviamo', 'viviate', 'vivano'],
    congiuntivo_imperfetto: ['vivessi', 'vivessi', 'vivesse', 'vivessimo', 'viveste', 'vivessero'],
    condizionale_presente: ['vivrei', 'vivresti', 'vivrebbe', 'vivremmo', 'vivreste', 'vivrebbero'],
    imperativo: ['vivi', 'viva', 'viviamo', 'vivete', 'vivano'],
  }, { masc_sing: 'vissuto', masc_plur: 'vissuti' }),

  makeVerb('chiedere', 'avere', 'pedir', {
    presente: ['chiedo', 'chiedi', 'chiede', 'chiediamo', 'chiedete', 'chiedono'],
    imperfetto: ['chiedevo', 'chiedevi', 'chiedeva', 'chiedevamo', 'chiedevate', 'chiedevano'],
    passato_remoto: ['chiesi', 'chiedesti', 'chiese', 'chiedemmo', 'chiedeste', 'chiesero'],
    futuro_semplice: ['chiederò', 'chiederai', 'chiederà', 'chiederemo', 'chiederete', 'chiederanno'],
    congiuntivo_presente: ['chieda', 'chieda', 'chieda', 'chiediamo', 'chiediate', 'chiedano'],
    congiuntivo_imperfetto: ['chiedessi', 'chiedessi', 'chiedesse', 'chiedessimo', 'chiedeste', 'chiedessero'],
    condizionale_presente: ['chiederei', 'chiederesti', 'chiederebbe', 'chiederemmo', 'chiedereste', 'chiederebbero'],
    imperativo: ['chiedi', 'chieda', 'chiediamo', 'chiedete', 'chiedano'],
  }, { masc_sing: 'chiesto', masc_plur: 'chiesti' }),

  makeVerb('chiudere', 'avere', 'cerrar', {
    presente: ['chiudo', 'chiudi', 'chiude', 'chiudiamo', 'chiudete', 'chiudono'],
    imperfetto: ['chiudevo', 'chiudevi', 'chiudeva', 'chiudevamo', 'chiudevate', 'chiudevano'],
    passato_remoto: ['chiusi', 'chiudesti', 'chiuse', 'chiudemmo', 'chiudeste', 'chiusero'],
    futuro_semplice: ['chiuderò', 'chiuderai', 'chiuderà', 'chiuderemo', 'chiuderete', 'chiuderanno'],
    congiuntivo_presente: ['chiuda', 'chiuda', 'chiuda', 'chiudiamo', 'chiudiate', 'chiudano'],
    congiuntivo_imperfetto: ['chiudessi', 'chiudessi', 'chiudesse', 'chiudessimo', 'chiudeste', 'chiudessero'],
    condizionale_presente: ['chiuderei', 'chiuderesti', 'chiuderebbe', 'chiuderemmo', 'chiudereste', 'chiuderebbero'],
    imperativo: ['chiudi', 'chiuda', 'chiudiamo', 'chiudete', 'chiudano'],
  }, { masc_sing: 'chiuso', masc_plur: 'chiusi' }),

  makeVerb('correre', 'avere', 'correr', {
    presente: ['corro', 'corri', 'corre', 'corriamo', 'correte', 'corrono'],
    imperfetto: ['correvo', 'correvi', 'correva', 'correvamo', 'correvate', 'correvano'],
    passato_remoto: ['corsi', 'corresti', 'corse', 'corremmo', 'correste', 'corsero'],
    futuro_semplice: ['correrò', 'correrai', 'correrà', 'correremo', 'correrete', 'correranno'],
    congiuntivo_presente: ['corra', 'corra', 'corra', 'corriamo', 'corriate', 'corrano'],
    congiuntivo_imperfetto: ['corressi', 'corressi', 'corresse', 'corressimo', 'correste', 'corressero'],
    condizionale_presente: ['correrei', 'correresti', 'correrebbe', 'correremmo', 'correreste', 'correrebbero'],
    imperativo: ['corri', 'corra', 'corriamo', 'correte', 'corrano'],
  }, { masc_sing: 'corso', masc_plur: 'corsi' }),

  makeVerb('decidere', 'avere', 'decidir', {
    presente: ['decido', 'decidi', 'decide', 'decidiamo', 'decidete', 'decidono'],
    imperfetto: ['decidevo', 'decidevi', 'decideva', 'decidevamo', 'decidevate', 'decidevano'],
    passato_remoto: ['decisi', 'decidesti', 'decise', 'decidemmo', 'decideste', 'decisero'],
    futuro_semplice: ['deciderò', 'deciderai', 'deciderà', 'decideremo', 'deciderete', 'decideranno'],
    congiuntivo_presente: ['decida', 'decida', 'decida', 'decidiamo', 'decidiate', 'decidano'],
    congiuntivo_imperfetto: ['decidessi', 'decidessi', 'decidesse', 'decidessimo', 'decideste', 'decidessero'],
    condizionale_presente: ['deciderei', 'decideresti', 'deciderebbe', 'decideremmo', 'decidereste', 'deciderebbero'],
    imperativo: ['decidi', 'decida', 'decidiamo', 'decidete', 'decidano'],
  }, { masc_sing: 'deciso', masc_plur: 'decisi' }),

  makeVerb('leggere', 'avere', 'leer', {
    presente: ['leggo', 'leggi', 'legge', 'leggiamo', 'leggete', 'leggono'],
    imperfetto: ['leggevo', 'leggevi', 'leggeva', 'leggevamo', 'leggevate', 'leggevano'],
    passato_remoto: ['lessi', 'leggesti', 'lesse', 'leggemmo', 'leggeste', 'lessero'],
    futuro_semplice: ['leggerò', 'leggerai', 'leggerà', 'leggeremo', 'leggerete', 'leggeranno'],
    congiuntivo_presente: ['legga', 'legga', 'legga', 'leggiamo', 'leggiate', 'leggano'],
    congiuntivo_imperfetto: ['leggessi', 'leggessi', 'leggesse', 'leggessimo', 'leggeste', 'leggessero'],
    condizionale_presente: ['leggerei', 'leggeresti', 'leggerebbe', 'leggeremmo', 'leggereste', 'leggerebbero'],
    imperativo: ['leggi', 'legga', 'leggiamo', 'leggete', 'leggano'],
  }, { masc_sing: 'letto', masc_plur: 'letti' }),

  makeVerb('mettere', 'avere', 'poner', {
    presente: ['metto', 'metti', 'mette', 'mettiamo', 'mettete', 'mettono'],
    imperfetto: ['mettevo', 'mettevi', 'metteva', 'mettevamo', 'mettevate', 'mettevano'],
    passato_remoto: ['misi', 'mettesti', 'mise', 'mettemmo', 'metteste', 'misero'],
    futuro_semplice: ['metterò', 'metterai', 'metterà', 'metteremo', 'metterete', 'metteranno'],
    congiuntivo_presente: ['metta', 'metta', 'metta', 'mettiamo', 'mettiate', 'mettano'],
    congiuntivo_imperfetto: ['mettessi', 'mettessi', 'mettesse', 'mettessimo', 'metteste', 'mettessero'],
    condizionale_presente: ['metterei', 'metteresti', 'metterebbe', 'metteremmo', 'mettereste', 'metterebbero'],
    imperativo: ['metti', 'metta', 'mettiamo', 'mettete', 'mettano'],
  }, { masc_sing: 'messo', masc_plur: 'messi' }),

  makeVerb('perdere', 'avere', 'perder', {
    presente: ['perdo', 'perdi', 'perde', 'perdiamo', 'perdete', 'perdono'],
    imperfetto: ['perdevo', 'perdevi', 'perdeva', 'perdevamo', 'perdevate', 'perdevano'],
    passato_remoto: ['persi', 'perdesti', 'perse', 'perdemmo', 'perdeste', 'persero'],
    futuro_semplice: ['perderò', 'perderai', 'perderà', 'perderemo', 'perderete', 'perderanno'],
    congiuntivo_presente: ['perda', 'perda', 'perda', 'perdiamo', 'perdiate', 'perdano'],
    congiuntivo_imperfetto: ['perdessi', 'perdessi', 'perdesse', 'perdessimo', 'perdeste', 'perdessero'],
    condizionale_presente: ['perderei', 'perderesti', 'perderebbe', 'perderemmo', 'perdereste', 'perderebbero'],
    imperativo: ['perdi', 'perda', 'perdiamo', 'perdete', 'perdano'],
  }, { masc_sing: 'perso', masc_plur: 'persi' }),

  makeVerb('prendere', 'avere', 'tomar', {
    presente: ['prendo', 'prendi', 'prende', 'prendiamo', 'prendete', 'prendono'],
    imperfetto: ['prendevo', 'prendevi', 'prendeva', 'prendevamo', 'prendevate', 'prendevano'],
    passato_remoto: ['presi', 'prendesti', 'prese', 'prendemmo', 'prendeste', 'presero'],
    futuro_semplice: ['prenderò', 'prenderai', 'prenderà', 'prenderemo', 'prenderete', 'prenderanno'],
    congiuntivo_presente: ['prenda', 'prenda', 'prenda', 'prendiamo', 'prendiate', 'prendano'],
    congiuntivo_imperfetto: ['prendessi', 'prendessi', 'prendesse', 'prendessimo', 'prendeste', 'prendessero'],
    condizionale_presente: ['prenderei', 'prenderesti', 'prenderebbe', 'prenderemmo', 'prendereste', 'prenderebbero'],
    imperativo: ['prendi', 'prenda', 'prendiamo', 'prendete', 'prendano'],
  }, { masc_sing: 'preso', masc_plur: 'presi' }),

  makeVerb('ridere', 'avere', 'reír', {
    presente: ['rido', 'ridi', 'ride', 'ridiamo', 'ridete', 'ridono'],
    imperfetto: ['ridevo', 'ridevi', 'rideva', 'ridevamo', 'ridevate', 'ridevano'],
    passato_remoto: ['risi', 'ridesti', 'rise', 'ridemmo', 'rideste', 'risero'],
    futuro_semplice: ['riderò', 'riderai', 'riderà', 'rideremo', 'riderete', 'rideranno'],
    congiuntivo_presente: ['rida', 'rida', 'rida', 'ridiamo', 'ridiate', 'ridano'],
    congiuntivo_imperfetto: ['ridessi', 'ridessi', 'ridesse', 'ridessimo', 'rideste', 'ridessero'],
    condizionale_presente: ['riderei', 'rideresti', 'riderebbe', 'rideremmo', 'ridereste', 'riderebbero'],
    imperativo: ['ridi', 'rida', 'ridiamo', 'ridete', 'ridano'],
  }, { masc_sing: 'riso', masc_plur: 'risi' }),

  makeVerb('rispondere', 'avere', 'responder', {
    presente: ['rispondo', 'rispondi', 'risponde', 'rispondiamo', 'rispondete', 'rispondono'],
    imperfetto: ['rispondevo', 'rispondevi', 'rispondeva', 'rispondevamo', 'rispondevate', 'rispondevano'],
    passato_remoto: ['risposi', 'rispondesti', 'rispose', 'rispondemmo', 'rispondeste', 'risposero'],
    futuro_semplice: ['risponderò', 'risponderai', 'risponderà', 'risponderemo', 'risponderete', 'risponderanno'],
    congiuntivo_presente: ['risponda', 'risponda', 'risponda', 'rispondiamo', 'rispondiate', 'rispondano'],
    congiuntivo_imperfetto: ['rispondessi', 'rispondessi', 'rispondesse', 'rispondessimo', 'rispondeste', 'rispondessero'],
    condizionale_presente: ['risponderei', 'risponderesti', 'risponderebbe', 'risponderemmo', 'rispondereste', 'risponderebbero'],
    imperativo: ['rispondi', 'risponda', 'rispondiamo', 'rispondete', 'rispondano'],
  }, { masc_sing: 'risposto', masc_plur: 'risposti' }),

  makeVerb('rompere', 'avere', 'romper', {
    presente: ['rompo', 'rompi', 'rompe', 'rompiamo', 'rompete', 'rompono'],
    imperfetto: ['rompevo', 'rompevi', 'rompeva', 'rompevamo', 'rompevate', 'rompevano'],
    passato_remoto: ['ruppi', 'rompesti', 'ruppe', 'rompemmo', 'rompeste', 'ruppero'],
    futuro_semplice: ['romperò', 'romperai', 'romperà', 'romperemo', 'romperete', 'romperanno'],
    congiuntivo_presente: ['rompa', 'rompa', 'rompa', 'rompiamo', 'rompiate', 'rompano'],
    congiuntivo_imperfetto: ['rompessi', 'rompessi', 'rompesse', 'rompessimo', 'rompeste', 'rompessero'],
    condizionale_presente: ['romperei', 'romperesti', 'romperebbe', 'romperemmo', 'rompereste', 'romperebbero'],
    imperativo: ['rompi', 'rompa', 'rompiamo', 'rompete', 'rompano'],
  }, { masc_sing: 'rotto', masc_plur: 'rotti' }),

  makeVerb('scendere', 'essere', 'bajar', {
    presente: ['scendo', 'scendi', 'scende', 'scendiamo', 'scendete', 'scendono'],
    imperfetto: ['scendevo', 'scendevi', 'scendeva', 'scendevamo', 'scendevate', 'scendevano'],
    passato_remoto: ['scesi', 'scendesti', 'scese', 'scendemmo', 'scendeste', 'scesero'],
    futuro_semplice: ['scenderò', 'scenderai', 'scenderà', 'scenderemo', 'scenderete', 'scenderanno'],
    congiuntivo_presente: ['scenda', 'scenda', 'scenda', 'scendiamo', 'scendiate', 'scendano'],
    congiuntivo_imperfetto: ['scendessi', 'scendessi', 'scendesse', 'scendessimo', 'scendeste', 'scendessero'],
    condizionale_presente: ['scenderei', 'scenderesti', 'scenderebbe', 'scenderemmo', 'scendereste', 'scenderebbero'],
    imperativo: ['scendi', 'scenda', 'scendiamo', 'scendete', 'scendano'],
  }, { masc_sing: 'sceso', masc_plur: 'scesi' }),

  makeVerb('scrivere', 'avere', 'escribir', {
    presente: ['scrivo', 'scrivi', 'scrive', 'scriviamo', 'scrivete', 'scrivono'],
    imperfetto: ['scrivevo', 'scrivevi', 'scriveva', 'scrivevamo', 'scrivevate', 'scrivevano'],
    passato_remoto: ['scrissi', 'scrivesti', 'scrisse', 'scrivemmo', 'scriveste', 'scrissero'],
    futuro_semplice: ['scriverò', 'scriverai', 'scriverà', 'scriveremo', 'scriverete', 'scriveranno'],
    congiuntivo_presente: ['scriva', 'scriva', 'scriva', 'scriviamo', 'scriviate', 'scrivano'],
    congiuntivo_imperfetto: ['scrivessi', 'scrivessi', 'scrivesse', 'scrivessimo', 'scriveste', 'scrivessero'],
    condizionale_presente: ['scriverei', 'scriveresti', 'scriverebbe', 'scriveremmo', 'scrivereste', 'scriverebbero'],
    imperativo: ['scrivi', 'scriva', 'scriviamo', 'scrivete', 'scrivano'],
  }, { masc_sing: 'scritto', masc_plur: 'scritti' }),

  makeVerb('spendere', 'avere', 'gastar', {
    presente: ['spendo', 'spendi', 'spende', 'spendiamo', 'spendete', 'spendono'],
    imperfetto: ['spendevo', 'spendevi', 'spendeva', 'spendevamo', 'spendevate', 'spendevano'],
    passato_remoto: ['spesi', 'spendesti', 'spese', 'spendemmo', 'spendeste', 'spesero'],
    futuro_semplice: ['spenderò', 'spenderai', 'spenderà', 'spenderemo', 'spenderete', 'spenderanno'],
    congiuntivo_presente: ['spenda', 'spenda', 'spenda', 'spendiamo', 'spendiate', 'spendano'],
    congiuntivo_imperfetto: ['spendessi', 'spendessi', 'spendesse', 'spendessimo', 'spendeste', 'spendessero'],
    condizionale_presente: ['spenderei', 'spenderesti', 'spenderebbe', 'spenderemmo', 'spendereste', 'spenderebbero'],
    imperativo: ['spendi', 'spenda', 'spendiamo', 'spendete', 'spendano'],
  }, { masc_sing: 'speso', masc_plur: 'spesi' }),

  makeVerb('vincere', 'avere', 'ganar', {
    presente: ['vinco', 'vinci', 'vince', 'vinciamo', 'vincete', 'vincono'],
    imperfetto: ['vincevo', 'vincevi', 'vinceva', 'vincevamo', 'vincevate', 'vincevano'],
    passato_remoto: ['vinsi', 'vincesti', 'vinse', 'vincemmo', 'vinceste', 'vinsero'],
    futuro_semplice: ['vincerò', 'vincerai', 'vincerà', 'vinceremo', 'vincerete', 'vinceranno'],
    congiuntivo_presente: ['vinca', 'vinca', 'vinca', 'vinciamo', 'vinciate', 'vincano'],
    congiuntivo_imperfetto: ['vincessi', 'vincessi', 'vincesse', 'vincessimo', 'vinceste', 'vincessero'],
    condizionale_presente: ['vincerei', 'vinceresti', 'vincerebbe', 'vinceremmo', 'vincereste', 'vincerebbero'],
    imperativo: ['vinci', 'vinca', 'vinciamo', 'vincete', 'vincano'],
  }, { masc_sing: 'vinto', masc_plur: 'vinti' }),

  makeVerb('tradurre', 'avere', 'traducir', {
    presente: ['traduco', 'traduci', 'traduce', 'traduciamo', 'traducete', 'traducono'],
    imperfetto: ['traducevo', 'traducevi', 'traduceva', 'traducevamo', 'traducevate', 'traducevano'],
    passato_remoto: ['tradussi', 'traducesti', 'tradusse', 'traducemmo', 'traduceste', 'tradussero'],
    futuro_semplice: ['tradurrò', 'tradurrai', 'tradurrà', 'tradurremo', 'tradurrete', 'tradurranno'],
    congiuntivo_presente: ['traduca', 'traduca', 'traduca', 'traduciamo', 'traduciate', 'traducano'],
    congiuntivo_imperfetto: ['traducessi', 'traducessi', 'traducesse', 'traducessimo', 'traduceste', 'traducessero'],
    condizionale_presente: ['tradurrei', 'tradurresti', 'tradurrebbe', 'tradurremmo', 'tradurreste', 'tradurrebbero'],
    imperativo: ['traduci', 'traduca', 'traduciamo', 'traducete', 'traducano'],
  }, { masc_sing: 'tradotto', masc_plur: 'tradotti' }),

  makeVerb('condurre', 'avere', 'conducir', {
    presente: ['conduco', 'conduci', 'conduce', 'conduciamo', 'conducete', 'conducono'],
    imperfetto: ['conducevo', 'conducevi', 'conduceva', 'conducevamo', 'conducevate', 'conducevano'],
    passato_remoto: ['condussi', 'conducesti', 'condusse', 'conducemmo', 'conduceste', 'condussero'],
    futuro_semplice: ['condurrò', 'condurrai', 'condurrà', 'condurremo', 'condurrete', 'condurranno'],
    congiuntivo_presente: ['conduca', 'conduca', 'conduca', 'conduciamo', 'conduciate', 'conducano'],
    congiuntivo_imperfetto: ['conducessi', 'conducessi', 'conducesse', 'conducessimo', 'conduceste', 'conducessero'],
    condizionale_presente: ['condurrei', 'condurresti', 'condurrebbe', 'condurremmo', 'condurreste', 'condurrebbero'],
    imperativo: ['conduci', 'conduca', 'conduciamo', 'conducete', 'conducano'],
  }, { masc_sing: 'condotto', masc_plur: 'condotti' }),

  makeVerb('produrre', 'avere', 'producir', {
    presente: ['produco', 'produci', 'produce', 'produciamo', 'producete', 'producono'],
    imperfetto: ['producevo', 'producevi', 'produceva', 'producevamo', 'producevate', 'producevano'],
    passato_remoto: ['produssi', 'producesti', 'produsse', 'producemmo', 'produceste', 'produssero'],
    futuro_semplice: ['produrrò', 'produrrai', 'produrrà', 'produrremo', 'produrrete', 'produrranno'],
    congiuntivo_presente: ['produca', 'produca', 'produca', 'produciamo', 'produciate', 'producano'],
    congiuntivo_imperfetto: ['producessi', 'producessi', 'producesse', 'producessimo', 'produceste', 'producessero'],
    condizionale_presente: ['produrrei', 'produrresti', 'produrrebbe', 'produrremmo', 'produrreste', 'produrrebbero'],
    imperativo: ['produci', 'produca', 'produciamo', 'producete', 'producano'],
  }, { masc_sing: 'prodotto', masc_plur: 'prodotti' }),

  makeVerb('porre', 'avere', 'poner/colocar', {
    presente: ['pongo', 'poni', 'pone', 'poniamo', 'ponete', 'pongono'],
    imperfetto: ['ponevo', 'ponevi', 'poneva', 'ponevamo', 'ponevate', 'ponevano'],
    passato_remoto: ['posi', 'ponesti', 'pose', 'ponemmo', 'poneste', 'posero'],
    futuro_semplice: ['porrò', 'porrai', 'porrà', 'porremo', 'porrete', 'porranno'],
    congiuntivo_presente: ['ponga', 'ponga', 'ponga', 'poniamo', 'poniate', 'pongano'],
    congiuntivo_imperfetto: ['ponessi', 'ponessi', 'ponesse', 'ponessimo', 'poneste', 'ponessero'],
    condizionale_presente: ['porrei', 'porresti', 'porrebbe', 'porremmo', 'porreste', 'porrebbero'],
    imperativo: ['poni', 'ponga', 'poniamo', 'ponete', 'pongano'],
  }, { masc_sing: 'posto', masc_plur: 'posti' }),

  makeVerb('proporre', 'avere', 'proponer', {
    presente: ['propongo', 'proponi', 'propone', 'proponiamo', 'proponete', 'propongono'],
    imperfetto: ['proponevo', 'proponevi', 'proponeva', 'proponevamo', 'proponevate', 'proponevano'],
    passato_remoto: ['proposi', 'proponesti', 'propose', 'proponemmo', 'proponeste', 'proposero'],
    futuro_semplice: ['proporrò', 'proporrai', 'proporrà', 'proporremo', 'proporrete', 'proporranno'],
    congiuntivo_presente: ['proponga', 'proponga', 'proponga', 'proponiamo', 'proponiate', 'propongano'],
    congiuntivo_imperfetto: ['proponessi', 'proponessi', 'proponesse', 'proponessimo', 'proponeste', 'proponessero'],
    condizionale_presente: ['proporrei', 'proporresti', 'proporrebbe', 'proporremmo', 'proporreste', 'proporrebbero'],
    imperativo: ['proponi', 'proponga', 'proponiamo', 'proponete', 'propongano'],
  }, { masc_sing: 'proposto', masc_plur: 'proposti' }),

  makeVerb('comporre', 'avere', 'componer', {
    presente: ['compongo', 'componi', 'compone', 'componiamo', 'componete', 'compongono'],
    imperfetto: ['componevo', 'componevi', 'componeva', 'componevamo', 'componevate', 'componevano'],
    passato_remoto: ['composi', 'componesti', 'compose', 'componemmo', 'componeste', 'composero'],
    futuro_semplice: ['comporrò', 'comporrai', 'comporrà', 'comporremo', 'comporrete', 'comporranno'],
    congiuntivo_presente: ['componga', 'componga', 'componga', 'componiamo', 'componiate', 'compongano'],
    congiuntivo_imperfetto: ['componessi', 'componessi', 'componesse', 'componessimo', 'componeste', 'componessero'],
    condizionale_presente: ['comporrei', 'comporresti', 'comporrebbe', 'comporremmo', 'comporreste', 'comporrebbero'],
    imperativo: ['componi', 'componga', 'componiamo', 'componete', 'compongano'],
  }, { masc_sing: 'composto', masc_plur: 'composti' }),

  makeVerb('opporre', 'avere', 'oponer', {
    presente: ['oppongo', 'opponi', 'oppone', 'opponiamo', 'opponete', 'oppongono'],
    imperfetto: ['opponevo', 'opponevi', 'opponeva', 'opponevamo', 'opponevate', 'opponevano'],
    passato_remoto: ['opposi', 'opponesti', 'oppose', 'opponemmo', 'opponeste', 'opposero'],
    futuro_semplice: ['opporrò', 'opporrai', 'opporrà', 'opporremo', 'opporrete', 'opporranno'],
    congiuntivo_presente: ['opponga', 'opponga', 'opponga', 'opponiamo', 'opponiate', 'oppongano'],
    congiuntivo_imperfetto: ['opponessi', 'opponessi', 'opponesse', 'opponessimo', 'opponeste', 'opponessero'],
    condizionale_presente: ['opporrei', 'opporresti', 'opporrebbe', 'opporremmo', 'opporreste', 'opporrebbero'],
    imperativo: ['opponi', 'opponga', 'opponiamo', 'opponete', 'oppongano'],
  }, { masc_sing: 'opposto', masc_plur: 'opposti' }),

  makeVerb('trarre', 'avere', 'sacar/extraer', {
    presente: ['traggo', 'trai', 'trae', 'traiamo', 'traete', 'traggono'],
    imperfetto: ['traevo', 'traevi', 'traeva', 'traevamo', 'traevate', 'traevano'],
    passato_remoto: ['trassi', 'traesti', 'trasse', 'traemmo', 'traeste', 'trassero'],
    futuro_semplice: ['trarrò', 'trarrai', 'trarrà', 'trarremo', 'trarrete', 'trarranno'],
    congiuntivo_presente: ['tragga', 'tragga', 'tragga', 'traiamo', 'traiate', 'traggano'],
    congiuntivo_imperfetto: ['traessi', 'traessi', 'traesse', 'traessimo', 'traeste', 'traessero'],
    condizionale_presente: ['trarrei', 'trarresti', 'trarrebbe', 'trarremmo', 'trarreste', 'trarrebbero'],
    imperativo: ['trai', 'tragga', 'traiamo', 'traete', 'traggano'],
  }, { masc_sing: 'tratto', masc_plur: 'tratti' }),

  makeVerb('sedere', 'avere', 'sentarse', {
    presente: ['siedo', 'siedi', 'siede', 'sediamo', 'sedete', 'siedono'],
    imperfetto: ['sedevo', 'sedevi', 'sedeva', 'sedevamo', 'sedevate', 'sedevano'],
    passato_remoto: ['sedei', 'sedesti', 'sedé', 'sedemmo', 'sedeste', 'sederono'],
    futuro_semplice: ['sederò', 'sederai', 'sederà', 'sederemo', 'sederete', 'sederanno'],
    congiuntivo_presente: ['sieda', 'sieda', 'sieda', 'sediamo', 'sediate', 'siedano'],
    congiuntivo_imperfetto: ['sedessi', 'sedessi', 'sedesse', 'sedessimo', 'sedeste', 'sedessero'],
    condizionale_presente: ['sederei', 'sederesti', 'sederebbe', 'sederemmo', 'sedereste', 'sederebbero'],
    imperativo: ['siedi', 'sieda', 'sediamo', 'sedete', 'siedano'],
  }, { masc_sing: 'seduto', masc_plur: 'seduti' }),

  makeVerb('riuscire', 'essere', 'lograr/tener éxito', {
    presente: ['riesco', 'riesci', 'riesce', 'riusciamo', 'riuscite', 'riescono'],
    imperfetto: ['riuscivo', 'riuscivi', 'riusciva', 'riuscivamo', 'riuscivate', 'riuscivano'],
    passato_remoto: ['riuscii', 'riuscisti', 'riuscì', 'riuscimmo', 'riusciste', 'riuscirono'],
    futuro_semplice: ['riuscirò', 'riuscirai', 'riuscirà', 'riusciremo', 'riuscirete', 'riusciranno'],
    congiuntivo_presente: ['riesca', 'riesca', 'riesca', 'riusciamo', 'riusciate', 'riescano'],
    congiuntivo_imperfetto: ['riuscissi', 'riuscissi', 'riuscisse', 'riuscissimo', 'riusciste', 'riuscissero'],
    condizionale_presente: ['riuscirei', 'riusciresti', 'riuscirebbe', 'riusciremmo', 'riuscireste', 'riuscirebbero'],
    imperativo: ['riesci', 'riesca', 'riusciamo', 'riuscite', 'riescano'],
  }, { masc_sing: 'riuscito', masc_plur: 'riusciti' }),

  makeVerb('apparire', 'essere', 'aparecer', {
    presente: ['appaio', 'appari', 'appare', 'appariamo', 'apparite', 'appaiono'],
    imperfetto: ['apparivo', 'apparivi', 'appariva', 'apparivamo', 'apparivate', 'apparivano'],
    passato_remoto: ['apparvi', 'apparisti', 'apparve', 'apparimmo', 'appariste', 'apparvero'],
    futuro_semplice: ['apparirò', 'apparirai', 'apparirà', 'appariremo', 'apparirete', 'appariranno'],
    congiuntivo_presente: ['appaia', 'appaia', 'appaia', 'appariamo', 'appariate', 'appaiano'],
    congiuntivo_imperfetto: ['apparissi', 'apparissi', 'apparisse', 'apparissimo', 'appariste', 'apparissero'],
    condizionale_presente: ['apparirei', 'appariresti', 'apparirebbe', 'appariremmo', 'apparireste', 'apparirebbero'],
    imperativo: ['appari', 'appaia', 'appariamo', 'apparite', 'appaiano'],
  }, { masc_sing: 'apparso', masc_plur: 'apparsi' }),

  makeVerb('valere', 'essere', 'valer', {
    presente: ['valgo', 'vali', 'vale', 'valiamo', 'valete', 'valgono'],
    imperfetto: ['valevo', 'valevi', 'valeva', 'valevamo', 'valevate', 'valevano'],
    passato_remoto: ['valsi', 'valesti', 'valse', 'valemmo', 'valeste', 'valsero'],
    futuro_semplice: ['varrò', 'varrai', 'varrà', 'varremo', 'varrete', 'varranno'],
    congiuntivo_presente: ['valga', 'valga', 'valga', 'valiamo', 'valiate', 'valgano'],
    congiuntivo_imperfetto: ['valessi', 'valessi', 'valesse', 'valessimo', 'valeste', 'valessero'],
    condizionale_presente: ['varrei', 'varresti', 'varrebbe', 'varremmo', 'varreste', 'varrebbero'],
    imperativo: ['vali', 'valga', 'valiamo', 'valete', 'valgano'],
  }, { masc_sing: 'valso', masc_plur: 'valsi' }),
];

const VerbsData = { IRREGULAR_VERBS };

if (typeof module !== 'undefined' && module.exports) {
  module.exports = VerbsData;
} else {
  window.VerbsData = VerbsData;
}
