// test/quiz.test.js
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { PRONOUNS } = require('../js/conjugation-engine.js');
const { createSession, getCurrentQuestion, generateDistractors, checkAnswer, recordAnswer, createReviewSession } = require('../js/quiz.js');

test('createSession builds the requested number of questions, only from selected tenses', () => {
  const session = createSession({
    tenses: ['presente', 'imperfetto'],
    answerMode: 'typed',
    questionCount: 10,
  });
  assert.equal(session.questions.length, 10);
  for (const q of session.questions) {
    assert.ok(['presente', 'imperfetto'].includes(q.tense));
    assert.ok(PRONOUNS.includes(q.pronoun));
    assert.ok(typeof q.infinitive === 'string' && q.infinitive.length > 0);
    assert.ok(typeof q.correctAnswer === 'string' && q.correctAnswer.length > 0);
    assert.equal(q.answerMode, 'typed');
  }
  assert.equal(session.currentIndex, 0);
  assert.equal(session.answers.length, 0);
});

test('createSession with answerMode "mixed" assigns typed or multiple to each question', () => {
  const session = createSession({ tenses: ['presente'], answerMode: 'mixed', questionCount: 20 });
  const modes = new Set(session.questions.map(q => q.answerMode));
  assert.ok(modes.has('typed') && modes.has('multiple'));
  for (const mode of modes) assert.ok(['typed', 'multiple'].includes(mode));
});

test('createSession with answerMode "multiple" attaches 3 options including the correct answer', () => {
  const session = createSession({ tenses: ['presente'], answerMode: 'multiple', questionCount: 5 });
  for (const q of session.questions) {
    assert.equal(q.options.length, 3);
    assert.ok(q.options.includes(q.correctAnswer));
    assert.equal(new Set(q.options).size, 3);
  }
});

test('getCurrentQuestion returns the question at currentIndex', () => {
  const session = createSession({ tenses: ['presente'], answerMode: 'typed', questionCount: 5 });
  assert.deepEqual(getCurrentQuestion(session), session.questions[0]);
  session.currentIndex = 2;
  assert.deepEqual(getCurrentQuestion(session), session.questions[2]);
});

test('generateDistractors returns 2 wrong answers different from the correct one', () => {
  const distractors = generateDistractors('parla', 'parlare', 'presente', 2);
  assert.equal(distractors.length, 2);
  assert.ok(!distractors.includes('parla'));
  assert.equal(new Set(distractors).size, 2);
});

test('checkAnswer: exact match is correct', () => {
  assert.deepEqual(checkAnswer('parlo', 'parlo'), { correct: true, accentOnly: false });
});

test('checkAnswer: case-insensitive and trims whitespace', () => {
  assert.deepEqual(checkAnswer('  Parlo  ', 'parlo'), { correct: true, accentOnly: false });
});

test('checkAnswer: wrong answer is incorrect', () => {
  assert.deepEqual(checkAnswer('parli', 'parlo'), { correct: false, accentOnly: false });
});

test('checkAnswer: accent-only mismatch is marked incorrect but flagged accentOnly', () => {
  assert.deepEqual(checkAnswer('parlo', 'parlò'), { correct: false, accentOnly: true });
});

test('checkAnswer: collapses internal whitespace in compound tense answers', () => {
  assert.deepEqual(checkAnswer('ho  parlato', 'ho parlato'), { correct: true, accentOnly: false });
});

test('createSession with a verbPool only draws verbs from that pool', () => {
  const session = createSession({
    tenses: ['presente'],
    answerMode: 'typed',
    questionCount: 20,
    verbPool: ['parlare', 'essere'],
  });
  assert.equal(session.questions.length, 20);
  for (const q of session.questions) {
    assert.ok(['parlare', 'essere'].includes(q.infinitive));
  }
  assert.deepEqual(session.verbPool, ['parlare', 'essere']);
});

test('createSession without a verbPool can draw from the full verb bank (regression check)', () => {
  const session = createSession({ tenses: ['presente'], answerMode: 'typed', questionCount: 30 });
  const infinitives = new Set(session.questions.map((q) => q.infinitive));
  assert.ok(infinitives.size > 2, 'expected more variety than a 2-verb pool would produce');
});

test('createReviewSession rebuilds the exact failed questions, typed mode', () => {
  const failed = [
    { infinitive: 'parlare', tense: 'presente', pronoun: 'io', correctAnswer: 'parlo' },
    { infinitive: 'essere', tense: 'presente', pronoun: 'tu', correctAnswer: 'sei' },
  ];
  const session = createReviewSession(failed, 'typed');
  assert.equal(session.questionCount, 2);
  assert.equal(session.questions.length, 2);
  assert.equal(session.currentIndex, 0);
  assert.equal(session.answers.length, 0);
  assert.deepEqual(session.questions[0], {
    infinitive: 'parlare', tense: 'presente', pronoun: 'io', correctAnswer: 'parlo', answerMode: 'typed',
  });
  assert.deepEqual(session.questions[1], {
    infinitive: 'essere', tense: 'presente', pronoun: 'tu', correctAnswer: 'sei', answerMode: 'typed',
  });
  assert.deepEqual(session.tenses, ['presente']);
});

test('createReviewSession attaches fresh multiple-choice options when mode is "multiple"', () => {
  const failed = [
    { infinitive: 'parlare', tense: 'presente', pronoun: 'io', correctAnswer: 'parlo' },
  ];
  const session = createReviewSession(failed, 'multiple');
  const question = session.questions[0];
  assert.equal(question.answerMode, 'multiple');
  assert.equal(question.options.length, 3);
  assert.ok(question.options.includes('parlo'));
  assert.equal(new Set(question.options).size, 3);
});

test('createReviewSession with "mixed" assigns typed or multiple per question', () => {
  const failed = Array.from({ length: 20 }, () => (
    { infinitive: 'parlare', tense: 'presente', pronoun: 'io', correctAnswer: 'parlo' }
  ));
  const session = createReviewSession(failed, 'mixed');
  const modes = new Set(session.questions.map((q) => q.answerMode));
  assert.ok(modes.has('typed') && modes.has('multiple'));
});

test('createReviewSession collects the unique tenses from the failed answers', () => {
  const failed = [
    { infinitive: 'parlare', tense: 'presente', pronoun: 'io', correctAnswer: 'parlo' },
    { infinitive: 'essere', tense: 'imperfetto', pronoun: 'tu', correctAnswer: 'eri' },
    { infinitive: 'avere', tense: 'presente', pronoun: 'noi', correctAnswer: 'abbiamo' },
  ];
  const session = createReviewSession(failed, 'typed');
  assert.deepEqual(session.tenses, ['presente', 'imperfetto']);
});

test('recordAnswer appends to session.answers and advances currentIndex', () => {
  const session = createSession({ tenses: ['presente'], answerMode: 'typed', questionCount: 3 });
  const question = getCurrentQuestion(session);
  recordAnswer(session, question.correctAnswer);
  assert.equal(session.answers.length, 1);
  assert.equal(session.answers[0].correct, true);
  assert.equal(session.answers[0].tense, question.tense);
  assert.equal(session.currentIndex, 1);
});
