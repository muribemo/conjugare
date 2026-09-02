// js/conjugation-engine.js

const PRONOUNS = ['io', 'tu', 'lui_lei', 'noi', 'voi', 'loro'];

// Auxiliary verbs (avere/essere) conjugated in every SIMPLE tense.
// These are needed to build every compound tense for every verb in the app,
// so they live here rather than only in verbs-data.js.
const AUXILIARIES = {
  avere: {
    presente: ['ho', 'hai', 'ha', 'abbiamo', 'avete', 'hanno'],
    imperfetto: ['avevo', 'avevi', 'aveva', 'avevamo', 'avevate', 'avevano'],
    passato_remoto: ['ebbi', 'avesti', 'ebbe', 'avemmo', 'aveste', 'ebbero'],
    futuro_semplice: ['avrò', 'avrai', 'avrà', 'avremo', 'avrete', 'avranno'],
    congiuntivo_presente: ['abbia', 'abbia', 'abbia', 'abbiamo', 'abbiate', 'abbiano'],
    congiuntivo_imperfetto: ['avessi', 'avessi', 'avesse', 'avessimo', 'aveste', 'avessero'],
    condizionale_presente: ['avrei', 'avresti', 'avrebbe', 'avremmo', 'avreste', 'avrebbero'],
  },
  essere: {
    presente: ['sono', 'sei', 'è', 'siamo', 'siete', 'sono'],
    imperfetto: ['ero', 'eri', 'era', 'eravamo', 'eravate', 'erano'],
    passato_remoto: ['fui', 'fosti', 'fu', 'fummo', 'foste', 'furono'],
    futuro_semplice: ['sarò', 'sarai', 'sarà', 'saremo', 'sarete', 'saranno'],
    congiuntivo_presente: ['sia', 'sia', 'sia', 'siamo', 'siate', 'siano'],
    congiuntivo_imperfetto: ['fossi', 'fossi', 'fosse', 'fossimo', 'foste', 'fossero'],
    condizionale_presente: ['sarei', 'saresti', 'sarebbe', 'saremmo', 'sareste', 'sarebbero'],
  },
};

// For -are verbs whose root ends in an unstressed 'i' (e.g. mangiare -> root
// 'mangi', studiare -> root 'studi'), a conjugation ending that also starts
// with 'i' collapses into a single 'i' rather than doubling: 'mangi' + 'i'
// -> 'mangi' (not 'mangii'), 'mangi' + 'iamo' -> 'mangiamo' (not
// 'mangiiamo'). This mirrors standard Italian orthography.
function attachAreEnding(root, ending) {
  if (root.endsWith('i') && ending.startsWith('i')) {
    return root + ending.slice(1);
  }
  return root + ending;
}

// For -are verbs whose root ends in a soft 'ci'/'gi' (e.g. mangiare -> root
// 'mangi', cominciare -> root 'cominci'), the stem 'i' is dropped before
// endings that start with 'e' (futuro semplice / condizionale presente),
// since 'ce'/'ge' are already soft and the 'i' would be redundant:
// 'mangi' + 'er...' -> 'manger...' (not 'mangier...'). This does NOT apply
// to -iare verbs whose root doesn't end in a soft c/g (e.g. studiare keeps
// 'studier...').
function areFuturoStem(root) {
  if (root.endsWith('ci') || root.endsWith('gi')) return root.slice(0, -1);
  return root;
}

// Endings for each simple tense, by group ('are'/'ere'/'ire').
// isc only changes 'presente', 'congiuntivo_presente' and 'imperativo' for -ire verbs.
function conjugateSimpleTense(root, group, isIsc, tense) {
  if (tense === 'presente') {
    if (group === 'are') {
      return ['o', 'i', 'a', 'iamo', 'ate', 'ano'].map(ending => attachAreEnding(root, ending));
    }
    if (group === 'ere') return [root + 'o', root + 'i', root + 'e', root + 'iamo', root + 'ete', root + 'ono'];
    // ire
    if (isIsc) return [root + 'isco', root + 'isci', root + 'isce', root + 'iamo', root + 'ite', root + 'iscono'];
    return [root + 'o', root + 'i', root + 'e', root + 'iamo', root + 'ite', root + 'ono'];
  }
  if (tense === 'imperfetto') {
    const vowel = group === 'are' ? 'a' : group === 'ere' ? 'e' : 'i';
    return [
      root + vowel + 'vo', root + vowel + 'vi', root + vowel + 'va',
      root + vowel + 'vamo', root + vowel + 'vate', root + vowel + 'vano',
    ];
  }

  if (tense === 'passato_remoto') {
    if (group === 'are') {
      return [root + 'ai', root + 'asti', root + 'ò', root + 'ammo', root + 'aste', root + 'arono'];
    }
    if (group === 'ere') {
      return [root + 'ei', root + 'esti', root + 'é', root + 'emmo', root + 'este', root + 'erono'];
    }
    // ire (isc does not affect passato remoto)
    return [root + 'ii', root + 'isti', root + 'ì', root + 'immo', root + 'iste', root + 'irono'];
  }

  if (tense === 'futuro_semplice') {
    const stem = group === 'ire' ? root + 'ir' : group === 'are' ? areFuturoStem(root) + 'er' : root + 'er';
    return [stem + 'ò', stem + 'ai', stem + 'à', stem + 'emo', stem + 'ete', stem + 'anno'];
  }

  if (tense === 'congiuntivo_presente') {
    if (group === 'are') return ['i', 'i', 'i', 'iamo', 'iate', 'ino'].map(ending => attachAreEnding(root, ending));
    if (group === 'ere') return [root + 'a', root + 'a', root + 'a', root + 'iamo', root + 'iate', root + 'ano'];
    if (isIsc) return [root + 'isca', root + 'isca', root + 'isca', root + 'iamo', root + 'iate', root + 'iscano'];
    return [root + 'a', root + 'a', root + 'a', root + 'iamo', root + 'iate', root + 'ano'];
  }

  if (tense === 'congiuntivo_imperfetto') {
    const vowel = group === 'are' ? 'a' : group === 'ere' ? 'e' : 'i';
    return [
      root + vowel + 'ssi', root + vowel + 'ssi', root + vowel + 'sse',
      root + vowel + 'ssimo', root + vowel + 'ste', root + vowel + 'ssero',
    ];
  }

  if (tense === 'condizionale_presente') {
    const stem = group === 'ire' ? root + 'ir' : group === 'are' ? areFuturoStem(root) + 'er' : root + 'er';
    return [stem + 'ei', stem + 'esti', stem + 'ebbe', stem + 'emmo', stem + 'este', stem + 'ebbero'];
  }

  throw new Error(`Unsupported tense in conjugateSimpleTense: ${tense}`);
}

// Imperativo presente has only 5 forms (no "io"): tu, Lei, noi, voi, Loro.
function conjugateImperativo(root, group, isIsc) {
  if (group === 'are') return ['a', 'i', 'iamo', 'ate', 'ino'].map(ending => attachAreEnding(root, ending));
  if (group === 'ere') return [root + 'i', root + 'a', root + 'iamo', root + 'ete', root + 'ano'];
  if (isIsc) return [root + 'isci', root + 'isca', root + 'iamo', root + 'ite', root + 'iscano'];
  return [root + 'i', root + 'a', root + 'iamo', root + 'ite', root + 'ano'];
}

function conjugateParticipio(root, group) {
  const ending = group === 'are' ? 'ato' : group === 'ere' ? 'uto' : 'ito';
  return { masc_sing: root + ending, masc_plur: root + ending.slice(0, -1) + 'i' };
}

// Builds the 7 compound tenses from an auxiliary's simple-tense conjugations
// and a participio. With "essere", the participio agrees in number with the
// subject: masc_sing for io/tu/lui_lei, masc_plur for noi/voi/loro (see design
// note: gender defaults to masculine). With "avere", the participio is
// invariant (always masc_sing), matching standard Italian grammar.
function buildCompoundTenses(auxiliaryName, participio) {
  const aux = AUXILIARIES[auxiliaryName];
  const forms = auxiliaryName === 'essere'
    ? [participio.masc_sing, participio.masc_sing, participio.masc_sing,
      participio.masc_plur, participio.masc_plur, participio.masc_plur]
    : [participio.masc_sing, participio.masc_sing, participio.masc_sing,
      participio.masc_sing, participio.masc_sing, participio.masc_sing];

  function combine(auxSimpleTense) {
    return aux[auxSimpleTense].map((auxForm, i) => `${auxForm} ${forms[i]}`);
  }

  return {
    passato_prossimo: combine('presente'),
    trapassato_prossimo: combine('imperfetto'),
    trapassato_remoto: combine('passato_remoto'),
    futuro_anteriore: combine('futuro_semplice'),
    congiuntivo_passato: combine('congiuntivo_presente'),
    congiuntivo_trapassato: combine('congiuntivo_imperfetto'),
    condizionale_passato: combine('condizionale_presente'),
  };
}

const SIMPLE_TENSE_NAMES = [
  'presente', 'imperfetto', 'passato_remoto', 'futuro_semplice',
  'congiuntivo_presente', 'congiuntivo_imperfetto', 'condizionale_presente',
];

// Builds the full 15-tense table for a regular verb.
// infinitive: full infinitive form (e.g. 'parlare'), used only as a label/key upstream.
// group: 'are' | 'ere' | 'ire'. isIsc: true for -ire verbs that take -isc- (e.g. capire).
// auxiliaryName: 'avere' | 'essere', which auxiliary this verb takes in compound tenses.
function conjugateRegularVerb(infinitive, group, isIsc, auxiliaryName) {
  // Italian regular infinitives always end in exactly 'are'/'ere'/'ire' (3 chars).
  const root = infinitive.slice(0, -3);
  const simple = {};
  for (const tense of SIMPLE_TENSE_NAMES) {
    simple[tense] = conjugateSimpleTense(root, group, isIsc, tense);
  }
  const imperativo = conjugateImperativo(root, group, isIsc);
  const participio = conjugateParticipio(root, group);
  const compound = buildCompoundTenses(auxiliaryName, participio);
  return { ...simple, imperativo, ...compound };
}

module.exports = {
  PRONOUNS, AUXILIARIES, conjugateSimpleTense, conjugateImperativo,
  conjugateParticipio, buildCompoundTenses, conjugateRegularVerb,
};
