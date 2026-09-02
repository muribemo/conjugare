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

// Endings for each simple tense, by group ('are'/'ere'/'ire').
// isc only changes 'presente', 'congiuntivo_presente' and 'imperativo' for -ire verbs.
function conjugateSimpleTense(root, group, isIsc, tense) {
  if (tense === 'presente') {
    if (group === 'are') return [root + 'o', root + 'i', root + 'a', root + 'iamo', root + 'ate', root + 'ano'];
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
    const stem = group === 'ire' ? root + 'ir' : root + 'er';
    return [stem + 'ò', stem + 'ai', stem + 'à', stem + 'emo', stem + 'ete', stem + 'anno'];
  }

  if (tense === 'congiuntivo_presente') {
    if (group === 'are') return [root + 'i', root + 'i', root + 'i', root + 'iamo', root + 'iate', root + 'ino'];
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
    const stem = group === 'ire' ? root + 'ir' : root + 'er';
    return [stem + 'ei', stem + 'esti', stem + 'ebbe', stem + 'emmo', stem + 'este', stem + 'ebbero'];
  }

  throw new Error(`Unsupported tense in conjugateSimpleTense: ${tense}`);
}

// Imperativo presente has only 5 forms (no "io"): tu, Lei, noi, voi, Loro.
function conjugateImperativo(root, group, isIsc) {
  if (group === 'are') return [root + 'a', root + 'i', root + 'iamo', root + 'ate', root + 'ino'];
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

module.exports = {
  PRONOUNS, AUXILIARIES, conjugateSimpleTense, conjugateImperativo,
  conjugateParticipio, buildCompoundTenses,
};
