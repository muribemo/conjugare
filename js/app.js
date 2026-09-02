// js/app.js
//
// Wires the DOM to the pure modules (verb-bank, quiz, stats, accent-input).
// No exports, no automated tests — this file is UI glue, verified manually
// in the browser.

(function () {
  const state = { session: null, sessionFinished: false };

  function showScreen(id) {
    document.querySelectorAll('.screen').forEach((el) => {
      el.hidden = el.id !== id;
    });
  }

  function initSetupScreen() {
    const startBtn = document.getElementById('start-session-btn');
    const errorEl = document.getElementById('setup-error');

    startBtn.addEventListener('click', () => {
      const tenses = [...document.querySelectorAll('input[name="tense"]:checked')].map((el) => el.value);
      if (tenses.length === 0) {
        errorEl.hidden = false;
        return;
      }
      errorEl.hidden = true;

      const answerMode = document.querySelector('input[name="answer-mode"]:checked').value;
      const questionCount = Number(document.querySelector('input[name="question-count"]:checked').value);

      state.session = Quiz.createSession({ tenses, answerMode, questionCount });
      state.sessionFinished = false;
      showScreen('screen-practice');
      renderQuestionImpl();
    });
  }

  const TENSE_LABELS = {
    presente: 'Indicativo presente', imperfetto: 'Indicativo imperfetto',
    passato_prossimo: 'Passato prossimo', trapassato_prossimo: 'Trapassato prossimo',
    passato_remoto: 'Passato remoto', trapassato_remoto: 'Trapassato remoto',
    futuro_semplice: 'Futuro semplice', futuro_anteriore: 'Futuro anteriore',
    congiuntivo_presente: 'Congiuntivo presente', congiuntivo_imperfetto: 'Congiuntivo imperfetto',
    congiuntivo_passato: 'Congiuntivo passato', congiuntivo_trapassato: 'Congiuntivo trapassato',
    condizionale_presente: 'Condizionale presente', condizionale_passato: 'Condizionale passato',
    imperativo: 'Imperativo presente',
  };

  function renderQuestionImpl() {
    const question = Quiz.getCurrentQuestion(state.session);
    document.getElementById('practice-progress').textContent =
      `Pregunta ${state.session.currentIndex + 1}/${state.session.questionCount}`;
    document.getElementById('practice-tense-label').textContent = TENSE_LABELS[question.tense];
    document.getElementById('practice-verb').textContent = question.infinitive;
    document.getElementById('practice-prompt').textContent = `${question.pronoun} ___`;

    document.getElementById('practice-feedback').hidden = true;
    document.getElementById('next-question-btn').hidden = true;

    const typedMode = document.getElementById('practice-typed-mode');
    const multipleMode = document.getElementById('practice-multiple-mode');
    const input = document.getElementById('practice-input');

    if (question.answerMode === 'typed') {
      typedMode.hidden = false;
      multipleMode.hidden = true;
      multipleMode.innerHTML = '';
      input.value = '';
      input.disabled = false;
      input.focus();
    } else {
      typedMode.hidden = true;
      multipleMode.hidden = false;
      multipleMode.innerHTML = '';
      question.options.forEach((option) => {
        const div = document.createElement('div');
        div.className = 'option';
        div.textContent = option;
        div.addEventListener('click', () => handleAnswer(option, div));
        multipleMode.appendChild(div);
      });
    }
  }

  function showFeedback(result, question) {
    const feedbackEl = document.getElementById('practice-feedback');
    feedbackEl.hidden = false;
    if (result.correct) {
      feedbackEl.textContent = 'Correcto!';
      feedbackEl.className = 'feedback-text correct';
    } else if (result.accentOnly) {
      feedbackEl.textContent = `Casi - falta el acento: ${question.correctAnswer}`;
      feedbackEl.className = 'feedback-text incorrect';
    } else {
      feedbackEl.textContent = `Incorrecto. Respuesta correcta: ${question.correctAnswer}`;
      feedbackEl.className = 'feedback-text incorrect';
    }
    document.getElementById('next-question-btn').hidden = false;
  }

  function handleAnswer(userAnswer, optionEl) {
    const question = Quiz.getCurrentQuestion(state.session);
    const result = Quiz.recordAnswer(state.session, userAnswer);

    if (question.answerMode === 'typed') {
      document.getElementById('practice-input').disabled = true;
    } else {
      [...document.getElementById('practice-multiple-mode').children].forEach((el) => {
        el.style.pointerEvents = 'none';
        if (el === optionEl) el.classList.add(result.correct ? 'selected-correct' : 'selected-wrong');
        if (el.textContent === question.correctAnswer) el.classList.add('selected-correct');
      });
    }

    showFeedback(result, question);
  }

  function initPracticeScreen() {
    document.getElementById('submit-answer-btn').addEventListener('click', () => {
      const input = document.getElementById('practice-input');
      if (input.disabled) return;
      handleAnswer(input.value, null);
    });

    document.getElementById('next-question-btn').addEventListener('click', () => {
      if (state.session.currentIndex >= state.session.questions.length) {
        finishSession();
        return;
      }
      renderQuestionImpl();
    });

    AccentInput.attachAccentInput(
      document.getElementById('practice-input'),
      document.getElementById('accent-popup'),
    );
  }

  function finishSession() {
    if (state.sessionFinished) return;
    state.sessionFinished = true;

    Stats.recordSessionAnswers(window.localStorage, state.session.answers);
    showScreen('screen-result');
    renderResultImpl();
  }

  function renderResultImpl() {
    const { answers, tenses, answerMode, questionCount } = state.session;
    const correctCount = answers.filter((a) => a.correct).length;
    const percent = Math.round((correctCount / answers.length) * 100);
    document.getElementById('result-summary').textContent =
      `${correctCount}/${answers.length} correctas (${percent}%)`;

    const byTense = {};
    for (const a of answers) {
      if (!byTense[a.tense]) byTense[a.tense] = { total: 0, correct: 0 };
      byTense[a.tense].total += 1;
      if (a.correct) byTense[a.tense].correct += 1;
    }

    const breakdownEl = document.getElementById('result-breakdown');
    breakdownEl.innerHTML = '';
    Object.entries(byTense).forEach(([tense, s]) => {
      const row = document.createElement('div');
      row.className = 'breakdown-row';
      row.innerHTML = `<span>${TENSE_LABELS[tense]}</span><span>${s.correct}/${s.total}</span>`;
      breakdownEl.appendChild(row);
    });

    state.lastConfig = { tenses, answerMode, questionCount };
  }

  function initResultScreen() {
    document.getElementById('retry-session-btn').addEventListener('click', () => {
      state.session = Quiz.createSession(state.lastConfig);
      state.sessionFinished = false;
      showScreen('screen-practice');
      renderQuestionImpl();
    });

    document.getElementById('back-to-setup-btn').addEventListener('click', () => {
      showScreen('screen-setup');
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initSetupScreen();
    initPracticeScreen();
    initResultScreen();
    showScreen('screen-setup');
  });
})();
