# Verb Stats and Enter-Key Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a per-verb accuracy breakdown to the Progress screen, and let users confirm/advance typed-answer practice questions with the Enter key.

**Architecture:** Extend the existing `js/stats.js` module with a new `getVerbBreakdown` function (mirrors the existing `getWeakestTenses` shape, no new storage format needed — `byVerb` is already computed). Extend `js/app.js`'s existing `renderProgressScreen` to render the new section, and add one `document`-level `keydown` listener in `initPracticeScreen` for the Enter-key shortcut.

**Tech Stack:** Vanilla JS (same dual Node/browser export pattern as the rest of the app), `node:test` for automated tests, manual/simulated browser verification for DOM wiring.

---

## File Structure

```
conjugare/
├── index.html          → add "Por verbo" section to #screen-progress
├── style.css            → add .scrollable-breakdown
├── js/
│   ├── stats.js         → add getVerbBreakdown
│   └── app.js            → extend renderProgressScreen; add Enter-key listener in initPracticeScreen
└── test/
    └── stats.test.js     → tests for getVerbBreakdown
```

No new files. `js/app.js` remains UI glue with no automated tests (consistent with the rest of the file, verified manually/via simulation as established in prior tasks).

---

### Task 1: `getVerbBreakdown` in stats.js

**Files:**
- Modify: `js/stats.js`
- Modify: `test/stats.test.js`

- [ ] **Step 1: Write failing tests**

```javascript
// append to test/stats.test.js

test('getVerbBreakdown returns every practiced verb sorted worst-accuracy-first', () => {
  const storage = fakeStorage();
  recordSessionAnswers(storage, [
    { infinitive: 'parlare', tense: 'presente', pronoun: 'io', correct: true, accentOnly: false },
    { infinitive: 'parlare', tense: 'presente', pronoun: 'tu', correct: true, accentOnly: false },
    { infinitive: 'essere', tense: 'presente', pronoun: 'io', correct: false, accentOnly: false },
    { infinitive: 'essere', tense: 'presente', pronoun: 'tu', correct: true, accentOnly: false },
  ]);
  const breakdown = getVerbBreakdown(storage);
  assert.equal(breakdown.length, 2);
  assert.equal(breakdown[0].infinitive, 'essere');
  assert.equal(breakdown[0].total, 2);
  assert.equal(breakdown[0].correct, 1);
  assert.equal(breakdown[0].accuracy, 0.5);
  assert.equal(breakdown[1].infinitive, 'parlare');
  assert.equal(breakdown[1].accuracy, 1);
});

test('getVerbBreakdown breaks accuracy ties alphabetically by infinitive', () => {
  const storage = fakeStorage();
  recordSessionAnswers(storage, [
    { infinitive: 'vivere', tense: 'presente', pronoun: 'io', correct: true, accentOnly: false },
    { infinitive: 'andare', tense: 'presente', pronoun: 'io', correct: true, accentOnly: false },
  ]);
  const breakdown = getVerbBreakdown(storage);
  assert.deepEqual(breakdown.map((v) => v.infinitive), ['andare', 'vivere']);
});

test('getVerbBreakdown returns an empty array when there is no history', () => {
  const storage = fakeStorage();
  assert.deepEqual(getVerbBreakdown(storage), []);
});

test('getVerbBreakdown includes verbs with only 1 sample (no minSamples filter)', () => {
  const storage = fakeStorage();
  recordSessionAnswers(storage, [
    { infinitive: 'fare', tense: 'presente', pronoun: 'io', correct: true, accentOnly: false },
  ]);
  const breakdown = getVerbBreakdown(storage);
  assert.equal(breakdown.length, 1);
  assert.equal(breakdown[0].total, 1);
});
```

Add the new import at the top of the test file alongside the existing ones:
```javascript
const { recordSessionAnswers, getStats, getWeakestTenses, getVerbBreakdown } = require('../js/stats.js');
```
(Read `test/stats.test.js` first to see its exact current top-of-file require line before editing it — just add `getVerbBreakdown` to the existing destructured list, don't duplicate the `require` call.)

- [ ] **Step 2: Run tests, verify they fail**

Run: `npm test`
Expected: FAIL — `getVerbBreakdown is not a function`

- [ ] **Step 3: Implement getVerbBreakdown**

In `js/stats.js`, add this function right after `getWeakestTenses` (before the `const Stats = {...}` line):

```javascript
function getVerbBreakdown(storage) {
  const stats = getStats(storage);
  return Object.entries(stats.byVerb)
    .map(([infinitive, s]) => ({ infinitive, total: s.total, correct: s.correct, accuracy: s.correct / s.total }))
    .sort((a, b) => a.accuracy - b.accuracy || a.infinitive.localeCompare(b.infinitive));
}
```

Update the exports line from:
```javascript
const Stats = { recordSessionAnswers, getStats, getWeakestTenses, aggregateBy };
```
to:
```javascript
const Stats = { recordSessionAnswers, getStats, getWeakestTenses, aggregateBy, getVerbBreakdown };
```

- [ ] **Step 4: Run tests, verify they pass**

Run: `npm test`
Expected: all pass (should be 83 tests: 79 previous + 4 new)

- [ ] **Step 5: Commit**

```bash
git add js/stats.js test/stats.test.js
git commit -m "Add getVerbBreakdown: full per-verb accuracy list sorted worst-first"
```

---

### Task 2: "Por verbo" section — markup, styles, and wiring

**Files:**
- Modify: `index.html`
- Modify: `style.css`
- Modify: `js/app.js`

- [ ] **Step 1: Add the new section to `#screen-progress` in index.html**

Find this block in `index.html`:
```html
    <section id="screen-progress" class="screen" hidden>
      <h2>Tu progreso</h2>
      <p id="progress-empty" class="subtitle" hidden>Aun no tienes datos. Completa una tanda de practica primero.</p>
      <div id="progress-weakest"></div>
      <h3>Por tiempo verbal</h3>
      <div id="progress-by-tense"></div>
      <button id="back-from-progress-btn" type="button" class="primary-btn">Volver</button>
    </section>
```

Replace it with (adds the new "Por verbo" block between "Por tiempo verbal" and the "Volver" button):

```html
    <section id="screen-progress" class="screen" hidden>
      <h2>Tu progreso</h2>
      <p id="progress-empty" class="subtitle" hidden>Aun no tienes datos. Completa una tanda de practica primero.</p>
      <div id="progress-weakest"></div>
      <h3>Por tiempo verbal</h3>
      <div id="progress-by-tense"></div>
      <h3>Por verbo</h3>
      <div id="progress-by-verb" class="scrollable-breakdown"></div>
      <button id="back-from-progress-btn" type="button" class="primary-btn">Volver</button>
    </section>
```

- [ ] **Step 2: Add the scrollable-list style to style.css**

Append to `style.css`:

```css
.scrollable-breakdown { max-height: 300px; overflow-y: auto; }
```

- [ ] **Step 3: Extend renderProgressScreen in js/app.js**

Read the current `js/app.js` first — `renderProgressScreen` currently reads:

```javascript
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
```

Replace it with (adds `byVerbEl` lookup, clears it in the empty-state branch, and renders it at the end using `Stats.getVerbBreakdown`):

```javascript
  function renderProgressScreen() {
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
      `<div class="breakdown-row"><span>${v.infinitive}</span><span>${v.correct}/${v.total} (${Math.round(v.accuracy * 100)}%)</span></div>`
    ).join('');
  }
```

- [ ] **Step 4: Run the automated test suite (regression check)**

Run: `npm test`
Expected: all pass (83/83, unchanged by this task — pure DOM/markup work)

- [ ] **Step 5: Manually verify**

Using whatever tooling works in this environment (jsdom/vm-based simulation established in earlier tasks, or real browser tooling if available):
1. With empty `localStorage`, open the progress screen — confirm `#progress-by-verb` stays empty (covered by the existing empty-state early return).
2. Complete a practice session with at least 2 different verbs answered with different outcomes (e.g., one verb answered correctly both times it appears, another answered incorrectly at least once).
3. Open the progress screen — confirm `#progress-by-verb` shows one row per distinct verb that appeared, each showing `correct/total (X%)`, sorted with the worst accuracy first, ties broken alphabetically.
4. Confirm the existing "Por tiempo verbal" and "A reforzar" sections still render correctly (regression check — this task only adds a new section, must not break the existing ones).

- [ ] **Step 6: Commit**

```bash
git add index.html style.css js/app.js
git commit -m "Add per-verb accuracy breakdown to the progress screen"
```

---

### Task 3: Enter-key shortcut for typed-mode questions

**Files:**
- Modify: `js/app.js`

- [ ] **Step 1: Add the Enter-key listener inside initPracticeScreen**

Read the current `js/app.js` first — `initPracticeScreen` currently reads:

```javascript
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
```

Replace it with (adds a `document`-level `keydown` listener for Enter — attached at `document` level, not on `#practice-input`, because the input gets `disabled` after answering and a disabled element cannot hold focus or receive its own key events, so the "advance to next" half of this feature needs a listener that isn't tied to the input's own focus state):

```javascript
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
      if (document.getElementById('screen-practice').hidden) return;
      const question = Quiz.getCurrentQuestion(state.session);
      if (!question || question.answerMode !== 'typed') return;

      const input = document.getElementById('practice-input');
      if (!input.disabled) {
        handleAnswer(input.value, null);
      } else {
        document.getElementById('next-question-btn').click();
      }
    });
  }
```

Note: the "advance" branch calls `.click()` on `#next-question-btn` rather than duplicating its handler's logic — this keeps a single source of truth for "what happens when advancing" (the existing click listener registered just above), so Enter and the mouse always stay in sync.

- [ ] **Step 2: Run the automated test suite (regression check)**

Run: `npm test`
Expected: all pass (83/83, unchanged — this is DOM-only wiring)

- [ ] **Step 3: Manually verify**

Using whatever tooling works in this environment:
1. Start a typed-mode session. Before answering, simulate pressing Enter with the input empty or containing text — confirm it behaves exactly like clicking "Comprobar" (feedback shows, input becomes disabled).
2. With feedback showing, simulate pressing Enter again — confirm it behaves exactly like clicking "Siguiente" (advances to the next question, or finishes the session if it was the last question).
3. Start a multiple-choice-mode session, click an option with the mouse to answer, then simulate pressing Enter — confirm Enter does NOT advance in this mode (per the spec, Enter is scoped to typed mode only; the user must click "Siguiente").
4. From the setup screen (not on the practice screen at all), simulate pressing Enter — confirm nothing happens (no error, no unintended navigation).
5. With the accent popup open (having just typed an accentable vowel) and feedback not yet shown, simulate pressing Enter — confirm the popup closes AND the answer gets submitted in the same interaction (this is expected per the spec: Enter is a strong "I'm done typing" signal).

- [ ] **Step 4: Commit**

```bash
git add js/app.js
git commit -m "Add Enter-key shortcut to confirm and advance typed-mode questions"
```

---

## Plan Self-Review

**Spec coverage:** Section 2 (verb stats: `getVerbBreakdown`, no `minSamples` filter, worst-first sort with alphabetical tiebreak, scrollable list, new progress-screen section) → Tasks 1–2. Section 3 (Enter key: submit when not yet answered, advance when answered, scoped to typed mode only, `document`-level listener to survive the input being disabled) → Task 3. Section 4 (out of scope: the misspelled-verb bug, Enter in multiple-choice mode, pagination/search) → correctly not implemented by this plan.

**Placeholder scan:** No "TBD"/"TODO" in any step; every code block is complete, copy-pasteable code, not a description of code.

**Type/signature consistency:** `getVerbBreakdown(storage)` returns `{infinitive, total, correct, accuracy}[]`, matching the shape `getWeakestTenses` already established (`{tense, accuracy, total}`) for consistency. `Stats` export object in Task 1 includes all 5 functions (`recordSessionAnswers, getStats, getWeakestTenses, aggregateBy, getVerbBreakdown`) — verified against the current file's actual existing list rather than assumed. `renderProgressScreen`'s new `byVerbEl` variable and `#progress-by-verb` id match exactly between Task 2's HTML and JS steps.

**Scope:** Single cohesive increment to an already-shipped app — not decomposed further, consistent with the brainstorming scope check (the misspelled-verb bug was correctly excluded pending a repro case).
