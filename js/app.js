// js/app.js
//
// Wires the DOM to the pure modules (verb-bank, quiz, stats, accent-input).
// No exports, no automated tests — this file is UI glue, verified manually
// in the browser.

(function () {
  const state = { session: null };

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
      showScreen('screen-practice');
      renderQuestion();
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initSetupScreen();
    showScreen('screen-setup');
  });

  // renderQuestion is defined in a later task and referenced here; declared
  // with `var` at module scope via the IIFE so future work can extend this file.
  var renderQuestion = function () {
    throw new Error('renderQuestion not implemented yet (see practice screen task)');
  };
})();
