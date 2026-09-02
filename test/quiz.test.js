// test/quiz.test.js
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { PRONOUNS } = require('../js/conjugation-engine.js');
const { createSession, getCurrentQuestion, generateDistractors } = require('../js/quiz.js');

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
  assert.ok(modes.has('typed') || modes.has('multiple'));
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
