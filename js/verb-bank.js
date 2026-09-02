// js/verb-bank.js
//
// Unified verb lookup: irregular verbs are returned as-is from verbs-data.js;
// regular verbs are conjugated on the fly via the engine, from regular-verbs-list.js.

(function () {
const isNode = typeof module !== 'undefined' && module.exports;
const { conjugateRegularVerb } = isNode ? require('./conjugation-engine.js') : window.ConjugationEngine;
const { REGULAR_VERBS } = isNode ? require('./regular-verbs-list.js') : window.RegularVerbsList;
const { IRREGULAR_VERBS } = isNode ? require('./verbs-data.js') : window.VerbsData;

const IRREGULAR_BY_INFINITIVE = new Map(IRREGULAR_VERBS.map(v => [v.infinitive, v]));
const REGULAR_BY_INFINITIVE = new Map(REGULAR_VERBS.map(v => [v.infinitive, v]));

function getConjugation(infinitive) {
  if (IRREGULAR_BY_INFINITIVE.has(infinitive)) {
    return IRREGULAR_BY_INFINITIVE.get(infinitive);
  }
  if (REGULAR_BY_INFINITIVE.has(infinitive)) {
    const entry = REGULAR_BY_INFINITIVE.get(infinitive);
    return {
      infinitive: entry.infinitive,
      auxiliary: entry.auxiliary,
      translation: entry.translation,
      conjugation: conjugateRegularVerb(entry.infinitive, entry.group, entry.isIsc, entry.auxiliary),
    };
  }
  return undefined;
}

function listAllVerbs() {
  return [...IRREGULAR_VERBS, ...REGULAR_VERBS.map(v => ({ infinitive: v.infinitive, translation: v.translation }))];
}

const VerbBank = { getConjugation, listAllVerbs };

if (isNode) {
  module.exports = VerbBank;
} else {
  window.VerbBank = VerbBank;
}
})();
