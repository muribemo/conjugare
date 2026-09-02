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

  function startSession(config) {
    state.session = Quiz.createSession(config);
    state.sessionFinished = false;
    showScreen('screen-practice');
    renderQuestionImpl();
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

      startSession({ tenses, answerMode, questionCount });
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
    const { answers } = state.session;
    const correctCount = answers.filter((a) => a.correct).length;
    const percent = Math.round((correctCount / answers.length) * 100);
    document.getElementById('result-summary').textContent =
      `${correctCount}/${answers.length} correctas (${percent}%)`;

    const byTense = Stats.aggregateBy(answers, 'tense');

    const breakdownEl = document.getElementById('result-breakdown');
    breakdownEl.innerHTML = '';
    Object.entries(byTense).forEach(([tense, s]) => {
      const row = document.createElement('div');
      row.className = 'breakdown-row';
      row.innerHTML = `<span>${TENSE_LABELS[tense]}</span><span>${s.correct}/${s.total}</span>`;
      breakdownEl.appendChild(row);
    });
  }

  function initResultScreen() {
    document.getElementById('retry-session-btn').addEventListener('click', () => {
      const { tenses, answerMode, questionCount } = state.session;
      startSession({ tenses, answerMode, questionCount });
    });

    document.getElementById('back-to-setup-btn').addEventListener('click', () => {
      showScreen('screen-setup');
    });
  }

  function renderProgressScreen() {
    const stats = Stats.getStats(window.localStorage);
    const entries = Object.entries(stats.byTense);
    const emptyEl = document.getElementById('progress-empty');
    const weakestEl = document.getElementById('progress-weakest');
    const byTenseEl = document.getElementById('progress-by-tense');

    if (entries.length === 0) {
      emptyEl.hidden = false;
      weakestEl.innerHTML = '';
      byTenseEl.innerHTML = '';
      return;
    }
    emptyEl.hidden = true;

    const weakest = Stats.getWeakestTenses(window.localStorage, { minSamples: 3 }).slice(0, 3);
    weakestEl.innerHTML = weakest.length
      ? `<h3>A reforzar</h3>${weakest.map((w) =>
          `<div class="breakdown-row"><span>${TENSE_LABELS[w.tense]}</span><span>${Math.round(w.accuracy * 100)}%</span></div>`
        ).join('')}`
      : '';

    byTenseEl.innerHTML = entries.map(([tense, s]) =>
      `<div class="breakdown-row"><span>${TENSE_LABELS[tense]}</span><span>${s.correct}/${s.total}</span></div>`
    ).join('');
  }

  function initProgressScreen() {
    document.getElementById('nav-progress').addEventListener('click', () => {
      const sessionInProgress = state.session && !state.sessionFinished && document.getElementById('screen-practice').hidden === false;
      if (sessionInProgress && !window.confirm('Vas a salir de la tanda actual. Se perdera tu progreso en esta tanda. ¿Continuar?')) {
        return;
      }
      showScreen('screen-progress');
      renderProgressScreen();
    });
    document.getElementById('back-from-progress-btn').addEventListener('click', () => {
      showScreen('screen-setup');
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initSetupScreen();
    initPracticeScreen();
    initResultScreen();
    initProgressScreen();
    showScreen('screen-setup');
  });
})();
