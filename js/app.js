// js/app.js
//
// Wires the DOM to the pure modules (verb-bank, quiz, stats, accent-input).
// No exports, no automated tests — this file is UI glue, verified manually
// in the browser.

(function () {
  const state = { session: null, sessionFinished: false, displayedQuestion: null };

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
        errorEl.textContent = 'Elige al menos un tiempo verbal.';
        errorEl.hidden = false;
        return;
      }

      const favoritesOnly = document.getElementById('favorites-only-checkbox').checked;
      let verbPool;
      if (favoritesOnly) {
        verbPool = Favorites.getFavorites(window.localStorage);
        if (verbPool.length === 0) {
          errorEl.textContent = 'No tienes verbos favoritos guardados aún.';
          errorEl.hidden = false;
          return;
        }
      }
      errorEl.hidden = true;

      const answerMode = document.querySelector('input[name="answer-mode"]:checked').value;
      const questionCount = Number(document.querySelector('input[name="question-count"]:checked').value);

      startSession({ tenses, answerMode, questionCount, verbPool });
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

  // Display label for each PRONOUNS entry (the raw 'lui_lei' key isn't meant for display).
  const PRONOUN_LABELS = { io: 'io', tu: 'tu', lui_lei: 'lui/lei', noi: 'noi', voi: 'voi', loro: 'loro' };

  function renderQuestionImpl() {
    const question = Quiz.getCurrentQuestion(state.session);
    // Quiz.recordAnswer already advances session.currentIndex at answer time
    // (not at "next question" time), so once feedback is showing,
    // Quiz.getCurrentQuestion(state.session) points at the UPCOMING question,
    // not the one on screen. state.displayedQuestion is the one actually
    // rendered right now, for anything (like the verb helper buttons) that
    // needs to look up data for the question the user is currently looking at.
    state.displayedQuestion = question;
    document.getElementById('practice-progress').textContent =
      `Pregunta ${state.session.currentIndex + 1}/${state.session.questionCount}`;
    document.getElementById('practice-tense-label').textContent = TENSE_LABELS[question.tense];
    document.getElementById('practice-verb').textContent = question.infinitive;
    document.getElementById('practice-prompt').textContent = `${PRONOUN_LABELS[question.pronoun] || question.pronoun} ___`;
    updateFavoriteButton(question.infinitive);

    document.getElementById('practice-feedback').hidden = true;
    document.getElementById('next-question-btn').hidden = true;

    document.getElementById('verb-translation').hidden = true;
    document.getElementById('show-conjugation-btn').disabled = true;

    const typedMode = document.getElementById('practice-typed-mode');
    const multipleMode = document.getElementById('practice-multiple-mode');
    const input = document.getElementById('practice-input');

    // Also read by the Enter-key listener in initPracticeScreen to detect the current question's mode.
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
    document.getElementById('show-conjugation-btn').disabled = false;
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

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter') return;
      // Ignore OS auto-repeat keydown events fired while Enter is held down;
      // otherwise a single held press can submit/advance through several
      // questions in a row (see key-repeat cascade bug).
      if (event.repeat) return;
      if (document.getElementById('screen-practice').hidden) return;
      // Use the DOM's own typed/multiple-choice visibility, set per question
      // by renderQuestionImpl, rather than re-deriving the mode from
      // Quiz.getCurrentQuestion(state.session): after the LAST question of a
      // session is answered, Quiz.recordAnswer already advances
      // session.currentIndex past the end of session.questions (it happens
      // at answer time, not at "next" time), so getCurrentQuestion would
      // return undefined here and incorrectly skip the "finish session"
      // advance below. #practice-typed-mode's hidden state doesn't change
      // until the next question actually renders, so it stays correct
      // through the answer -> feedback -> advance/finish flow. The listener
      // is attached to `document` rather than #practice-input because a
      // disabled input cannot hold focus or receive its own keydown events,
      // so once the input is disabled after answering, an input-level
      // listener would never see the keypress that should advance to the
      // next question.
      if (document.getElementById('practice-typed-mode').hidden) return;

      const input = document.getElementById('practice-input');
      if (!input.disabled) {
        handleAnswer(input.value, null);
      } else {
        document.getElementById('next-question-btn').click();
      }
    });
  }

  function updateFavoriteButton(infinitive) {
    const favBtn = document.getElementById('toggle-favorite-btn');
    const favorited = Favorites.isFavorite(window.localStorage, infinitive);
    favBtn.textContent = favorited ? '★ Favorito' : '☆ Favorito';
  }

  function initVerbTools() {
    document.getElementById('toggle-favorite-btn').addEventListener('click', () => {
      const infinitive = state.displayedQuestion.infinitive;
      Favorites.toggleFavorite(window.localStorage, infinitive);
      updateFavoriteButton(infinitive);
    });

    const translationEl = document.getElementById('verb-translation');
    document.getElementById('show-translation-btn').addEventListener('click', () => {
      const question = state.displayedQuestion;
      const verb = VerbBank.getConjugation(question.infinitive);
      translationEl.textContent = verb.translation;
      translationEl.hidden = !translationEl.hidden;
    });

    const modal = document.getElementById('conjugation-modal');
    document.getElementById('show-conjugation-btn').addEventListener('click', () => {
      const question = state.displayedQuestion;
      const verb = VerbBank.getConjugation(question.infinitive);
      document.getElementById('conjugation-modal-verb').textContent = question.infinitive;

      const bodyEl = document.getElementById('conjugation-modal-body');
      bodyEl.innerHTML = Object.keys(TENSE_LABELS).map((tense) => {
        const forms = verb.conjugation[tense];
        const pronouns = tense === 'imperativo'
          ? ['tu', 'Lei', 'noi', 'voi', 'Loro']
          : ConjugationEngine.PRONOUNS.map((p) => PRONOUN_LABELS[p] || p);
        const lines = pronouns.map((pronoun, i) => `<p>${pronoun}: ${forms[i]}</p>`).join('');
        return `<div class="conjugation-tense-block"><h4>${TENSE_LABELS[tense]}</h4>${lines}</div>`;
      }).join('');

      modal.showModal();
    });

    document.getElementById('close-conjugation-modal-btn').addEventListener('click', () => {
      modal.close();
    });
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

    document.getElementById('retry-failed-btn').hidden = answers.every((a) => a.correct);
  }

  function initResultScreen() {
    document.getElementById('retry-failed-btn').addEventListener('click', () => {
      const failed = state.session.answers.filter((a) => !a.correct);
      state.session = Quiz.createReviewSession(failed, state.session.answerMode);
      state.sessionFinished = false;
      showScreen('screen-practice');
      renderQuestionImpl();
    });

    document.getElementById('retry-session-btn').addEventListener('click', () => {
      const { tenses, answerMode, questionCount, verbPool } = state.session;
      startSession({ tenses, answerMode, questionCount, verbPool });
    });

    document.getElementById('back-to-setup-btn').addEventListener('click', () => {
      showScreen('screen-setup');
    });
  }

  function renderFavoritesList() {
    const favoritesEl = document.getElementById('progress-favorites');
    favoritesEl.innerHTML = Favorites.getFavorites(window.localStorage).map((infinitive) =>
      `<div class="breakdown-row"><span>${infinitive}</span><button type="button" class="remove-favorite-btn" data-infinitive="${infinitive}">Quitar</button></div>`
    ).join('');
  }

  function renderProgressScreen() {
    // Favorites don't depend on answer history, so they're rendered
    // regardless of whether there's any tense/verb history to show below.
    renderFavoritesList();

    const stats = Stats.getStats(window.localStorage);
    const entries = Object.entries(stats.byTense);
    const emptyEl = document.getElementById('progress-empty');
    const weakestEl = document.getElementById('progress-weakest');
    const byTenseEl = document.getElementById('progress-by-tense');
    const byVerbEl = document.getElementById('progress-by-verb');

    if (entries.length === 0) {
      emptyEl.hidden = false;
      weakestEl.innerHTML = '';
      byTenseEl.innerHTML = '';
      byVerbEl.innerHTML = '';
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

    byVerbEl.innerHTML = Stats.getVerbBreakdown(window.localStorage).map((v) =>
      `<div class="breakdown-row" data-infinitive="${v.infinitive}"><span>${v.infinitive}</span><span>${v.correct}/${v.total} (${Math.round(v.accuracy * 100)}%)</span></div>`
    ).join('');
  }

  function matrixCell(combo) {
    if (!combo) return '<td class="matrix-cell-empty">&mdash;</td>';
    const cls = combo.correct === combo.total ? 'matrix-cell-correct' : 'matrix-cell-wrong';
    return `<td class="${cls}">${combo.correct}/${combo.total}</td>`;
  }

  function renderVerbMatrix(infinitive) {
    const combos = Stats.getVerbCombinations(window.localStorage, infinitive);
    document.getElementById('verb-matrix-verb').textContent = infinitive;

    const mainPronouns = ConjugationEngine.PRONOUNS;
    const mainTenses = Object.keys(TENSE_LABELS).filter((tense) => tense !== 'imperativo');
    const mainTable = `
      <table class="matrix-table">
        <tr><th></th>${mainPronouns.map((p) => `<th>${PRONOUN_LABELS[p]}</th>`).join('')}</tr>
        ${mainTenses.map((tense) => `
          <tr>
            <td>${TENSE_LABELS[tense]}</td>
            ${mainPronouns.map((p) => matrixCell(combos[tense] && combos[tense][p])).join('')}
          </tr>
        `).join('')}
      </table>
    `;

    const imperativoPronouns = ['tu', 'Lei', 'noi', 'voi', 'Loro'];
    const imperativoTable = `
      <h4>${TENSE_LABELS.imperativo}</h4>
      <table class="matrix-table">
        <tr>${imperativoPronouns.map((p) => `<th>${p}</th>`).join('')}</tr>
        <tr>${imperativoPronouns.map((p) => matrixCell(combos.imperativo && combos.imperativo[p])).join('')}</tr>
      </table>
    `;

    document.getElementById('verb-matrix-body').innerHTML = mainTable + imperativoTable;
    document.getElementById('verb-matrix-modal').showModal();
  }

  function initVerbMatrix() {
    document.getElementById('progress-by-verb').addEventListener('click', (event) => {
      const row = event.target.closest('[data-infinitive]');
      if (!row) return;
      renderVerbMatrix(row.dataset.infinitive);
    });
    document.getElementById('close-verb-matrix-modal-btn').addEventListener('click', () => {
      document.getElementById('verb-matrix-modal').close();
    });
  }

  function initProgressScreen() {
    document.getElementById('nav-progress').addEventListener('click', () => {
      const sessionInProgress = state.session && !state.sessionFinished && document.getElementById('screen-practice').hidden === false;
      if (sessionInProgress && !window.confirm('Vas a salir de la tanda actual. Se perderá tu progreso en esta tanda. ¿Continuar?')) {
        return;
      }
      showScreen('screen-progress');
      renderProgressScreen();
    });
    document.getElementById('back-from-progress-btn').addEventListener('click', () => {
      showScreen('screen-setup');
    });

    // Delegated: favorite rows are regenerated on every renderProgressScreen call.
    document.getElementById('progress-favorites').addEventListener('click', (event) => {
      const infinitive = event.target.dataset.infinitive;
      if (!infinitive) return;
      Favorites.toggleFavorite(window.localStorage, infinitive);
      renderFavoritesList();
    });

    document.getElementById('clear-progress-btn').addEventListener('click', () => {
      if (!window.confirm('Esto borra tu historial de respuestas (estadisticas). Tus favoritos no se tocan. ¿Continuar?')) {
        return;
      }
      Stats.clearHistory(window.localStorage);
      renderProgressScreen();
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initSetupScreen();
    initPracticeScreen();
    initVerbTools();
    initVerbMatrix();
    initResultScreen();
    initProgressScreen();
    showScreen('screen-setup');
  });
})();
