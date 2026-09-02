// js/stats.js
//
// Persists per-answer history to localStorage (or any getItem/setItem-compatible
// storage, e.g. a fake in tests) and aggregates accuracy by tense and by verb.

(function () {
const STORAGE_KEY = 'conjugare_answer_history';

function loadHistory(storage) {
  const raw = storage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveHistory(storage, history) {
  storage.setItem(STORAGE_KEY, JSON.stringify(history));
}

function recordSessionAnswers(storage, answers) {
  const history = loadHistory(storage);
  history.push(...answers);
  saveHistory(storage, history);
}

function aggregateBy(history, key) {
  const groups = {};
  for (const answer of history) {
    const k = answer[key];
    if (!groups[k]) groups[k] = { total: 0, correct: 0 };
    groups[k].total += 1;
    if (answer.correct) groups[k].correct += 1;
  }
  return groups;
}

function getStats(storage) {
  const history = loadHistory(storage);
  return {
    byTense: aggregateBy(history, 'tense'),
    byVerb: aggregateBy(history, 'infinitive'),
  };
}

function getWeakestTenses(storage, { minSamples = 3 } = {}) {
  const stats = getStats(storage);
  return Object.entries(stats.byTense)
    .filter(([, s]) => s.total >= minSamples)
    .map(([tense, s]) => ({ tense, accuracy: s.correct / s.total, total: s.total }))
    .sort((a, b) => a.accuracy - b.accuracy);
}

// Unlike getWeakestTenses, no minSamples filter — surfaces every verb ever practiced.
function getVerbBreakdown(storage) {
  const stats = getStats(storage);
  return Object.entries(stats.byVerb)
    .map(([infinitive, s]) => ({ infinitive, total: s.total, correct: s.correct, accuracy: s.correct / s.total }))
    .sort((a, b) => a.accuracy - b.accuracy || a.infinitive.localeCompare(b.infinitive));
}

const Stats = { recordSessionAnswers, getStats, getWeakestTenses, aggregateBy, getVerbBreakdown };

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Stats;
} else {
  window.Stats = Stats;
}
})();
