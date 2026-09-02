// js/quiz.js
//
// Builds practice sessions ("tandas"): picks random verb+tense+pronoun combos
// from the tenses the user selected, and (for multiple-choice questions)
// generates plausible wrong answers from other pronoun forms of the same tense.

(function () {
const isNode = typeof module !== 'undefined' && module.exports;
const { PRONOUNS } = isNode ? require('./conjugation-engine.js') : window.ConjugationEngine;
const { getConjugation, listAllVerbs } = isNode ? require('./verb-bank.js') : window.VerbBank;

function pickRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Distractors: other pronoun forms of the SAME verb+tense (plausible near-misses),
// falling back to forms from other random verbs if the same verb doesn't have enough.
function generateDistractors(correctAnswer, infinitive, tense, count) {
  const verb = getConjugation(infinitive);
  const sameVerbForms = verb.conjugation[tense].filter(f => f !== correctAnswer);
  const pool = new Set(sameVerbForms);

  const allVerbs = listAllVerbs();
  let guard = 0;
  while (pool.size < count && guard < 200) {
    guard += 1;
    const other = getConjugation(pickRandom(allVerbs).infinitive);
    if (!other) continue;
    const form = pickRandom(other.conjugation[tense]);
    if (form !== correctAnswer) pool.add(form);
  }

  return [...pool].slice(0, count);
}

function buildQuestion(tenses, answerMode) {
  const allVerbs = listAllVerbs();
  const infinitive = pickRandom(allVerbs).infinitive;
  const tense = pickRandom(tenses);
  const pronounIndex = tense === 'imperativo'
    ? Math.floor(Math.random() * 5) // imperativo has 5 forms, no "io"
    : Math.floor(Math.random() * 6);
  const verb = getConjugation(infinitive);
  const correctAnswer = verb.conjugation[tense][pronounIndex];
  const pronoun = tense === 'imperativo' ? ['tu', 'Lei', 'noi', 'voi', 'Loro'][pronounIndex] : PRONOUNS[pronounIndex];

  const mode = answerMode === 'mixed' ? (Math.random() < 0.5 ? 'typed' : 'multiple') : answerMode;

  const question = { infinitive, tense, pronoun, correctAnswer, answerMode: mode };

  if (mode === 'multiple') {
    const distractors = generateDistractors(correctAnswer, infinitive, tense, 2);
    question.options = shuffle([correctAnswer, ...distractors]);
  }

  return question;
}

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function createSession({ tenses, answerMode, questionCount }) {
  const questions = [];
  for (let i = 0; i < questionCount; i += 1) {
    questions.push(buildQuestion(tenses, answerMode));
  }
  return { tenses, answerMode, questionCount, questions, currentIndex: 0, answers: [] };
}

function getCurrentQuestion(session) {
  return session.questions[session.currentIndex];
}

function normalize(str) {
  return str.trim().toLowerCase().replace(/\s+/g, ' ');
}

// Strips Italian accent marks to compare "the same word ignoring accents".
function stripAccents(str) {
  return str.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function checkAnswer(userAnswer, correctAnswer) {
  const normalizedUser = normalize(userAnswer);
  const normalizedCorrect = normalize(correctAnswer);
  if (normalizedUser === normalizedCorrect) {
    return { correct: true, accentOnly: false };
  }
  const accentOnly = stripAccents(normalizedUser) === stripAccents(normalizedCorrect);
  return { correct: false, accentOnly };
}

function recordAnswer(session, userAnswer) {
  const question = getCurrentQuestion(session);
  const result = checkAnswer(userAnswer, question.correctAnswer);
  session.answers.push({
    infinitive: question.infinitive,
    tense: question.tense,
    pronoun: question.pronoun,
    userAnswer,
    correctAnswer: question.correctAnswer,
    correct: result.correct,
    accentOnly: result.accentOnly,
  });
  session.currentIndex += 1;
  return result;
}

const Quiz = { createSession, getCurrentQuestion, generateDistractors, checkAnswer, recordAnswer };

if (isNode) {
  module.exports = Quiz;
} else {
  window.Quiz = Quiz;
}
})();
