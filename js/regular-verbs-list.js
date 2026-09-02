// js/regular-verbs-list.js
//
// Regular verbs only (no irregular stems, no irregular participio). Each entry:
// { infinitive, group: 'are'|'ere'|'ire', isIsc: boolean, auxiliary: 'avere'|'essere', translation }
// isIsc = true for -ire verbs conjugated with -isc- in presente/congiuntivo presente/imperativo.
// Most -ire verbs in this list are NOT -isc- (dormire-type); isIsc ones are marked explicitly.

(function () {
const REGULAR_VERBS = [
  { infinitive: 'parlare', group: 'are', isIsc: false, auxiliary: 'avere', translation: 'hablar' },
  { infinitive: 'mangiare', group: 'are', isIsc: false, auxiliary: 'avere', translation: 'comer' },
  { infinitive: 'lavorare', group: 'are', isIsc: false, auxiliary: 'avere', translation: 'trabajar' },
  { infinitive: 'studiare', group: 'are', isIsc: false, auxiliary: 'avere', translation: 'estudiar' },
  { infinitive: 'guardare', group: 'are', isIsc: false, auxiliary: 'avere', translation: 'mirar' },
  { infinitive: 'ascoltare', group: 'are', isIsc: false, auxiliary: 'avere', translation: 'escuchar' },
  { infinitive: 'comprare', group: 'are', isIsc: false, auxiliary: 'avere', translation: 'comprar' },
  { infinitive: 'cucinare', group: 'are', isIsc: false, auxiliary: 'avere', translation: 'cocinar' },
  { infinitive: 'trovare', group: 'are', isIsc: false, auxiliary: 'avere', translation: 'encontrar' },
  { infinitive: 'aiutare', group: 'are', isIsc: false, auxiliary: 'avere', translation: 'ayudar' },
  { infinitive: 'arrivare', group: 'are', isIsc: false, auxiliary: 'essere', translation: 'llegar' },
  { infinitive: 'entrare', group: 'are', isIsc: false, auxiliary: 'essere', translation: 'entrar' },
  { infinitive: 'tornare', group: 'are', isIsc: false, auxiliary: 'essere', translation: 'regresar' },
  { infinitive: 'ricevere', group: 'ere', isIsc: false, auxiliary: 'avere', translation: 'recibir' },
  { infinitive: 'credere', group: 'ere', isIsc: false, auxiliary: 'avere', translation: 'creer' },
  { infinitive: 'vendere', group: 'ere', isIsc: false, auxiliary: 'avere', translation: 'vender' },
  { infinitive: 'ripetere', group: 'ere', isIsc: false, auxiliary: 'avere', translation: 'repetir' },
  { infinitive: 'temere', group: 'ere', isIsc: false, auxiliary: 'avere', translation: 'temer' },
  { infinitive: 'dormire', group: 'ire', isIsc: false, auxiliary: 'avere', translation: 'dormir' },
  { infinitive: 'partire', group: 'ire', isIsc: false, auxiliary: 'essere', translation: 'partir' },
  { infinitive: 'sentire', group: 'ire', isIsc: false, auxiliary: 'avere', translation: 'sentir/oir' },
  { infinitive: 'seguire', group: 'ire', isIsc: false, auxiliary: 'avere', translation: 'seguir' },
  { infinitive: 'vestire', group: 'ire', isIsc: false, auxiliary: 'avere', translation: 'vestir' },
  { infinitive: 'capire', group: 'ire', isIsc: true, auxiliary: 'avere', translation: 'entender' },
  { infinitive: 'finire', group: 'ire', isIsc: true, auxiliary: 'avere', translation: 'terminar' },
  { infinitive: 'preferire', group: 'ire', isIsc: true, auxiliary: 'avere', translation: 'preferir' },
  { infinitive: 'pulire', group: 'ire', isIsc: true, auxiliary: 'avere', translation: 'limpiar' },
  { infinitive: 'costruire', group: 'ire', isIsc: true, auxiliary: 'avere', translation: 'construir' },
];

const RegularVerbsList = { REGULAR_VERBS };

if (typeof module !== 'undefined' && module.exports) {
  module.exports = RegularVerbsList;
} else {
  window.RegularVerbsList = RegularVerbsList;
}
})();
