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

  throw new Error(`Unsupported tense in conjugateSimpleTense: ${tense}`);
}

module.exports = { PRONOUNS, AUXILIARIES, conjugateSimpleTense };
