# Conjugare Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build "conjugare", a static web app for practicing Italian verb conjugation across 15 tenses and 6 pronouns, with a regular-verb rule engine, a hand-written irregular-verb table, an accent-input helper, timed practice sessions, and localStorage-based progress tracking.

**Architecture:** Single-page static site (HTML/CSS/vanilla JS, no build tools, no frameworks). Each JS file is written in a UMD-style pattern (plain top-level functions/consts, with a `module.exports` guard at the bottom) so the exact same file loads as a `<script>` global in the browser AND is `require()`-able from Node for tests. Tests run via Node's built-in test runner (`node --test`), no dependencies. Progress persists in `localStorage`; no backend.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript (ES2020, CommonJS-compatible), Node.js built-in test runner (`node:test`, `node:assert/strict`).

---

## Design note carried into implementation: participio agreement simplification

Italian past participles agree in gender/number with the subject when the auxiliary is "essere" (e.g., andato/andata/andati/andate). The app's pronoun set is `io, tu, lui_lei, noi, voi, loro` — gender is not determinable from `io/tu/noi/voi` alone. This plan implements **number agreement only, defaulting to masculine gender**: `io/tu/lui_lei` use the singular masculine participle (`andato`), `noi/voi/loro` use the plural masculine participle (`andati`). This is documented in code comments and the README as a known simplification — feminine agreement is out of scope for this version.

---

## File Structure

```
conjugare/
├── index.html
├── style.css
├── package.json
├── README.md
├── js/
│   ├── conjugation-engine.js   → auxiliary tables + regular conjugation rules (all 15 tenses)
│   ├── regular-verbs-list.js   → list of regular verbs (infinitive, group, isc flag, auxiliary)
│   ├── verbs-data.js           → hand-written irregular verbs (full 15-tense tables)
│   ├── verb-bank.js            → unified lookup: getConjugation(infinitive) -> full table
│   ├── accent-input.js         → accent popup component for text inputs
│   ├── quiz.js                 → question generation, session state, answer validation
│   ├── stats.js                → localStorage read/write + aggregation
│   └── app.js                  → screen controller, wires UI to modules
└── test/
    ├── conjugation-engine.test.js
    ├── verb-bank.test.js
    ├── quiz.test.js
    └── stats.test.js
```

---

### Task 1: Project scaffolding

**Files:**
- Create: `package.json`
- Create: `test/sanity.test.js`
- Create: `index.html`
- Create: `style.css`
- Create: `README.md`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "conjugare",
  "version": "1.0.0",
  "description": "App web para practicar la conjugacion de verbos en italiano",
  "private": true,
  "scripts": {
    "test": "node --test test/"
  },
  "license": "MIT"
}
```

- [ ] **Step 2: Write a sanity test**

```javascript
// test/sanity.test.js
const { test } = require('node:test');
const assert = require('node:assert/strict');

test('sanity check', () => {
  assert.equal(1 + 1, 2);
});
```

- [ ] **Step 3: Run tests, verify the sanity test passes**

Run: `npm test`
Expected: `# pass 1`, exit code 0

- [ ] **Step 4: Create index.html skeleton**

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Conjugare</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header class="site-header">
    <h1>conjugare.</h1>
    <nav>
      <button id="nav-progress" type="button">Progreso</button>
    </nav>
  </header>

  <main id="app">
    <section id="screen-setup" class="screen"></section>
    <section id="screen-practice" class="screen" hidden></section>
    <section id="screen-result" class="screen" hidden></section>
    <section id="screen-progress" class="screen" hidden></section>
  </main>

  <script src="js/conjugation-engine.js"></script>
  <script src="js/regular-verbs-list.js"></script>
  <script src="js/verbs-data.js"></script>
  <script src="js/verb-bank.js"></script>
  <script src="js/accent-input.js"></script>
  <script src="js/quiz.js"></script>
  <script src="js/stats.js"></script>
  <script src="js/app.js"></script>
</body>
</html>
```

- [ ] **Step 5: Create style.css skeleton**

```css
:root {
  --fg: #1a1a1a;
  --bg: #ffffff;
  --border: #dddddd;
  --error: #b00020;
  --success: #1a7a3c;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  font-family: 'Courier New', Courier, monospace;
  color: var(--fg);
  background: var(--bg);
  line-height: 1.5;
}

.site-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid var(--border);
}

.site-header h1 {
  font-size: 20px;
  font-weight: normal;
  margin: 0;
}

#app {
  max-width: 640px;
  margin: 0 auto;
  padding: 24px;
}

.screen[hidden] { display: none; }
```

- [ ] **Step 6: Create README.md**

```markdown
# Conjugare

Practica la conjugacion de verbos en italiano en los 15 tiempos que se conjugan por pronombre (io, tu, lui/lei, noi, voi, loro).

## Uso local

Abre `index.html` directamente en el navegador, o sirve la carpeta con cualquier servidor estatico (ej: `npx serve .`).

## Tests

\`\`\`
npm test
\`\`\`

## Nota de diseno

Los tiempos compuestos con auxiliar "essere" (ej. passato prossimo de "andare") concuerdan en numero con el pronombre pero usan por defecto la forma masculina, ya que "io/tu/noi/voi" no determinan genero. La concordancia femenina queda fuera de alcance de esta version.
```

- [ ] **Step 7: Commit**

```bash
git add package.json test/sanity.test.js index.html style.css README.md
git commit -m "Scaffold conjugare project structure"
```

---

### Task 2: Conjugation engine — auxiliary tables + indicativo presente (regular)

**Files:**
- Create: `js/conjugation-engine.js`
- Test: `test/conjugation-engine.test.js`

- [ ] **Step 1: Write failing tests for auxiliaries and indicativo presente**

```javascript
// test/conjugation-engine.test.js
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { AUXILIARIES, PRONOUNS, conjugateSimpleTense } = require('../js/conjugation-engine.js');

test('PRONOUNS has the 6 expected slots in order', () => {
  assert.deepEqual(PRONOUNS, ['io', 'tu', 'lui_lei', 'noi', 'voi', 'loro']);
});

test('AUXILIARIES.avere.presente is correct', () => {
  assert.deepEqual(AUXILIARIES.avere.presente, ['ho', 'hai', 'ha', 'abbiamo', 'avete', 'hanno']);
});

test('AUXILIARIES.essere.presente is correct', () => {
  assert.deepEqual(AUXILIARIES.essere.presente, ['sono', 'sei', 'è', 'siamo', 'siete', 'sono']);
});

test('conjugateSimpleTense produces indicativo presente for -are (parlare)', () => {
  const result = conjugateSimpleTense('parl', 'are', false, 'presente');
  assert.deepEqual(result, ['parlo', 'parli', 'parla', 'parliamo', 'parlate', 'parlano']);
});

test('conjugateSimpleTense produces indicativo presente for -ere (credere)', () => {
  const result = conjugateSimpleTense('cred', 'ere', false, 'presente');
  assert.deepEqual(result, ['credo', 'credi', 'crede', 'crediamo', 'credete', 'credono']);
});

test('conjugateSimpleTense produces indicativo presente for -ire no isc (dormire)', () => {
  const result = conjugateSimpleTense('dorm', 'ire', false, 'presente');
  assert.deepEqual(result, ['dormo', 'dormi', 'dorme', 'dormiamo', 'dormite', 'dormono']);
});

test('conjugateSimpleTense produces indicativo presente for -ire isc (capire)', () => {
  const result = conjugateSimpleTense('cap', 'ire', true, 'presente');
  assert.deepEqual(result, ['capisco', 'capisci', 'capisce', 'capiamo', 'capite', 'capiscono']);
});
```

- [ ] **Step 2: Run tests, verify they fail**

Run: `npm test`
Expected: FAIL — `Cannot find module '../js/conjugation-engine.js'`

- [ ] **Step 3: Implement AUXILIARIES, PRONOUNS, and conjugateSimpleTense for 'presente'**

```javascript
// js/conjugation-engine.js

const PRONOUNS = ['io', 'tu', 'lui_lei', 'noi', 'voi', 'loro'];

// Auxiliary verbs (avere/essere) conjugated in every SIMPLE tense.
// These are needed to build every compound tense for every verb in the app,
// so they live here rather than only in verbs-data.js.
const AUXILIARIES = {
  avere: {
    presente: ['ho', 'hai', 'ha', 'abbiamo', 'avete', 'hanno'],
    imperfetto: ['avevo', 'avevi', 'aveva', 'avevamo', 'avevate', 'avevano'],
    passato_remoto: ['ebbi', 'avesti', 'ebbe', 'avemmo', 'aveste', 'ebbero'],
    futuro_semplice: ['avrò', 'avrai', 'avrà', 'avremo', 'avrete', 'avranno'],
    congiuntivo_presente: ['abbia', 'abbia', 'abbia', 'abbiamo', 'abbiate', 'abbiano'],
    congiuntivo_imperfetto: ['avessi', 'avessi', 'avesse', 'avessimo', 'aveste', 'avessero'],
    condizionale_presente: ['avrei', 'avresti', 'avrebbe', 'avremmo', 'avreste', 'avrebbero'],
  },
  essere: {
    presente: ['sono', 'sei', 'è', 'siamo', 'siete', 'sono'],
    imperfetto: ['ero', 'eri', 'era', 'eravamo', 'eravate', 'erano'],
    passato_remoto: ['fui', 'fosti', 'fu', 'fummo', 'foste', 'furono'],
    futuro_semplice: ['sarò', 'sarai', 'sarà', 'saremo', 'sarete', 'saranno'],
    congiuntivo_presente: ['sia', 'sia', 'sia', 'siamo', 'siate', 'siano'],
    congiuntivo_imperfetto: ['fossi', 'fossi', 'fosse', 'fossimo', 'foste', 'fossero'],
    condizionale_presente: ['sarei', 'saresti', 'sarebbe', 'saremmo', 'sareste', 'sarebbero'],
  },
};

// Endings for each simple tense, by group ('are'/'ere'/'ire').
// isc only changes 'presente', 'congiuntivo_presente' and 'imperativo' for -ire verbs.
function conjugateSimpleTense(root, group, isIsc, tense) {
  if (tense === 'presente') {
    if (group === 'are') return [root + 'o', root + 'i', root + 'a', root + 'iamo', root + 'ate', root + 'ano'];
    if (group === 'ere') return [root + 'o', root + 'i', root + 'e', root + 'iamo', root + 'ete', root + 'ono'];
    // ire
    if (isIsc) return [root + 'isco', root + 'isci', root + 'isce', root + 'iamo', root + 'ite', root + 'iscono'];
    return [root + 'o', root + 'i', root + 'e', root + 'iamo', root + 'ite', root + 'ono'];
  }
  throw new Error(`Unsupported tense in conjugateSimpleTense: ${tense}`);
}

module.exports = { PRONOUNS, AUXILIARIES, conjugateSimpleTense };
```

- [ ] **Step 4: Run tests, verify they pass**

Run: `npm test`
Expected: `# pass 7`

- [ ] **Step 5: Commit**

```bash
git add js/conjugation-engine.js test/conjugation-engine.test.js
git commit -m "Add auxiliary tables and indicativo presente for regular verbs"
```

---

### Task 3: Conjugation engine — imperfetto, passato remoto, futuro semplice (regular)

**Files:**
- Modify: `js/conjugation-engine.js`
- Modify: `test/conjugation-engine.test.js`

- [ ] **Step 1: Add failing tests**

```javascript
// append to test/conjugation-engine.test.js

test('conjugateSimpleTense produces imperfetto for -are/-ere/-ire', () => {
  assert.deepEqual(conjugateSimpleTense('parl', 'are', false, 'imperfetto'),
    ['parlavo', 'parlavi', 'parlava', 'parlavamo', 'parlavate', 'parlavano']);
  assert.deepEqual(conjugateSimpleTense('cred', 'ere', false, 'imperfetto'),
    ['credevo', 'credevi', 'credeva', 'credevamo', 'credevate', 'credevano']);
  assert.deepEqual(conjugateSimpleTense('cap', 'ire', true, 'imperfetto'),
    ['capivo', 'capivi', 'capiva', 'capivamo', 'capivate', 'capivano']);
});

test('conjugateSimpleTense produces passato_remoto for -are/-ere/-ire', () => {
  assert.deepEqual(conjugateSimpleTense('parl', 'are', false, 'passato_remoto'),
    ['parlai', 'parlasti', 'parlò', 'parlammo', 'parlaste', 'parlarono']);
  assert.deepEqual(conjugateSimpleTense('cred', 'ere', false, 'passato_remoto'),
    ['credei', 'credesti', 'credé', 'credemmo', 'credeste', 'crederono']);
  assert.deepEqual(conjugateSimpleTense('dorm', 'ire', false, 'passato_remoto'),
    ['dormii', 'dormisti', 'dormì', 'dormimmo', 'dormiste', 'dormirono']);
});

test('conjugateSimpleTense produces futuro_semplice for -are/-ere/-ire', () => {
  assert.deepEqual(conjugateSimpleTense('parl', 'are', false, 'futuro_semplice'),
    ['parlerò', 'parlerai', 'parlerà', 'parleremo', 'parlerete', 'parleranno']);
  assert.deepEqual(conjugateSimpleTense('cred', 'ere', false, 'futuro_semplice'),
    ['crederò', 'crederai', 'crederà', 'crederemo', 'crederete', 'crederanno']);
  assert.deepEqual(conjugateSimpleTense('dorm', 'ire', false, 'futuro_semplice'),
    ['dormirò', 'dormirai', 'dormirà', 'dormiremo', 'dormirete', 'dormiranno']);
});
```

- [ ] **Step 2: Run tests, verify the 3 new tests fail**

Run: `npm test`
Expected: FAIL — `Unsupported tense in conjugateSimpleTense: imperfetto` (and similar for the other two)

- [ ] **Step 3: Extend conjugateSimpleTense**

```javascript
// in js/conjugation-engine.js, replace the function body's single `if (tense === 'presente')`
// branch-and-throw with the following (keep the 'presente' branch, add these before the throw):

function conjugateSimpleTense(root, group, isIsc, tense) {
  if (tense === 'presente') {
    if (group === 'are') return [root + 'o', root + 'i', root + 'a', root + 'iamo', root + 'ate', root + 'ano'];
    if (group === 'ere') return [root + 'o', root + 'i', root + 'e', root + 'iamo', root + 'ete', root + 'ono'];
    if (isIsc) return [root + 'isco', root + 'isci', root + 'isce', root + 'iamo', root + 'ite', root + 'iscono'];
    return [root + 'o', root + 'i', root + 'e', root + 'iamo', root + 'ite', root + 'ono'];
  }

  if (tense === 'imperfetto') {
    const vowel = group === 'are' ? 'a' : group === 'ere' ? 'e' : 'i';
    return [
      root + vowel + 'vo', root + vowel + 'vi', root + vowel + 'va',
      root + vowel + 'vamo', root + vowel + 'vate', root + vowel + 'vano',
    ];
  }

  if (tense === 'passato_remoto') {
    if (group === 'are') {
      return [root + 'ai', root + 'asti', root + 'ò', root + 'ammo', root + 'aste', root + 'arono'];
    }
    if (group === 'ere') {
      return [root + 'ei', root + 'esti', root + 'é', root + 'emmo', root + 'este', root + 'erono'];
    }
    // ire (isc does not affect passato remoto)
    return [root + 'ii', root + 'isti', root + 'ì', root + 'immo', root + 'iste', root + 'irono'];
  }

  if (tense === 'futuro_semplice') {
    const stem = group === 'ire' ? root + 'ir' : root + 'er';
    return [stem + 'ò', stem + 'ai', stem + 'à', stem + 'emo', stem + 'ete', stem + 'anno'];
  }

  throw new Error(`Unsupported tense in conjugateSimpleTense: ${tense}`);
}
```

- [ ] **Step 4: Run tests, verify they pass**

Run: `npm test`
Expected: `# pass 10`

- [ ] **Step 5: Commit**

```bash
git add js/conjugation-engine.js test/conjugation-engine.test.js
git commit -m "Add imperfetto, passato remoto and futuro semplice to regular engine"
```

---

### Task 4: Conjugation engine — congiuntivo presente, congiuntivo imperfetto, condizionale presente, imperativo presente (regular)

**Files:**
- Modify: `js/conjugation-engine.js`
- Modify: `test/conjugation-engine.test.js`

- [ ] **Step 1: Add failing tests**

```javascript
// append to test/conjugation-engine.test.js

test('conjugateSimpleTense produces congiuntivo_presente for -are/-ere/-ire/-ire isc', () => {
  assert.deepEqual(conjugateSimpleTense('parl', 'are', false, 'congiuntivo_presente'),
    ['parli', 'parli', 'parli', 'parliamo', 'parliate', 'parlino']);
  assert.deepEqual(conjugateSimpleTense('cred', 'ere', false, 'congiuntivo_presente'),
    ['creda', 'creda', 'creda', 'crediamo', 'crediate', 'credano']);
  assert.deepEqual(conjugateSimpleTense('dorm', 'ire', false, 'congiuntivo_presente'),
    ['dorma', 'dorma', 'dorma', 'dormiamo', 'dormiate', 'dormano']);
  assert.deepEqual(conjugateSimpleTense('cap', 'ire', true, 'congiuntivo_presente'),
    ['capisca', 'capisca', 'capisca', 'capiamo', 'capiate', 'capiscano']);
});

test('conjugateSimpleTense produces congiuntivo_imperfetto for -are/-ere/-ire', () => {
  assert.deepEqual(conjugateSimpleTense('parl', 'are', false, 'congiuntivo_imperfetto'),
    ['parlassi', 'parlassi', 'parlasse', 'parlassimo', 'parlaste', 'parlassero']);
  assert.deepEqual(conjugateSimpleTense('cred', 'ere', false, 'congiuntivo_imperfetto'),
    ['credessi', 'credessi', 'credesse', 'credessimo', 'credeste', 'credessero']);
  assert.deepEqual(conjugateSimpleTense('dorm', 'ire', false, 'congiuntivo_imperfetto'),
    ['dormissi', 'dormissi', 'dormisse', 'dormissimo', 'dormiste', 'dormissero']);
});

test('conjugateSimpleTense produces condizionale_presente for -are/-ere/-ire', () => {
  assert.deepEqual(conjugateSimpleTense('parl', 'are', false, 'condizionale_presente'),
    ['parlerei', 'parleresti', 'parlerebbe', 'parleremmo', 'parlereste', 'parlerebbero']);
  assert.deepEqual(conjugateSimpleTense('cred', 'ere', false, 'condizionale_presente'),
    ['crederei', 'crederesti', 'crederebbe', 'crederemmo', 'credereste', 'crederebbero']);
  assert.deepEqual(conjugateSimpleTense('dorm', 'ire', false, 'condizionale_presente'),
    ['dormirei', 'dormiresti', 'dormirebbe', 'dormiremmo', 'dormireste', 'dormirebbero']);
});

test('conjugateImperativo produces the 5 imperativo forms (tu, Lei, noi, voi, Loro)', () => {
  const { conjugateImperativo } = require('../js/conjugation-engine.js');
  assert.deepEqual(conjugateImperativo('parl', 'are', false),
    ['parla', 'parli', 'parliamo', 'parlate', 'parlino']);
  assert.deepEqual(conjugateImperativo('cred', 'ere', false),
    ['credi', 'creda', 'crediamo', 'credete', 'credano']);
  assert.deepEqual(conjugateImperativo('dorm', 'ire', false),
    ['dormi', 'dorma', 'dormiamo', 'dormite', 'dormano']);
  assert.deepEqual(conjugateImperativo('cap', 'ire', true),
    ['capisci', 'capisca', 'capiamo', 'capite', 'capiscano']);
});
```

- [ ] **Step 2: Run tests, verify the new ones fail**

Run: `npm test`
Expected: FAIL — unsupported tense errors, and `conjugateImperativo is not a function`

- [ ] **Step 3: Extend conjugateSimpleTense and add conjugateImperativo**

```javascript
// in js/conjugation-engine.js, add these branches to conjugateSimpleTense
// before the final `throw new Error(...)` line:

  if (tense === 'congiuntivo_presente') {
    if (group === 'are') return [root + 'i', root + 'i', root + 'i', root + 'iamo', root + 'iate', root + 'ino'];
    if (group === 'ere') return [root + 'a', root + 'a', root + 'a', root + 'iamo', root + 'iate', root + 'ano'];
    if (isIsc) return [root + 'isca', root + 'isca', root + 'isca', root + 'iamo', root + 'iate', root + 'iscano'];
    return [root + 'a', root + 'a', root + 'a', root + 'iamo', root + 'iate', root + 'ano'];
  }

  if (tense === 'congiuntivo_imperfetto') {
    const vowel = group === 'are' ? 'a' : group === 'ere' ? 'e' : 'i';
    return [
      root + vowel + 'ssi', root + vowel + 'ssi', root + vowel + 'sse',
      root + vowel + 'ssimo', root + vowel.replace(/[aei]/, group === 'ire' ? 'i' : group === 'are' ? 'a' : 'e') + 'ste',
      root + vowel + 'ssero',
    ];
  }

  if (tense === 'condizionale_presente') {
    const stem = group === 'ire' ? root + 'ir' : root + 'er';
    return [stem + 'ei', stem + 'esti', stem + 'ebbe', stem + 'emmo', stem + 'este', stem + 'ebbero'];
  }

// Imperativo presente has only 5 forms (no "io"): tu, Lei, noi, voi, Loro.
function conjugateImperativo(root, group, isIsc) {
  if (group === 'are') return [root + 'a', root + 'i', root + 'iamo', root + 'ate', root + 'ino'];
  if (group === 'ere') return [root + 'i', root + 'a', root + 'iamo', root + 'ete', root + 'ano'];
  if (isIsc) return [root + 'isci', root + 'isca', root + 'iamo', root + 'ite', root + 'iscano'];
  return [root + 'i', root + 'a', root + 'iamo', root + 'ite', root + 'ano'];
}
```

Note on `congiuntivo_imperfetto`: the "voi" form ending is always `-aste`/`-este`/`-iste` matching the group vowel, same as the rest of the row — simplify by not reusing the presente `vowel` replace trick. Replace that branch with the explicit, unambiguous version below instead:

```javascript
  if (tense === 'congiuntivo_imperfetto') {
    const vowel = group === 'are' ? 'a' : group === 'ere' ? 'e' : 'i';
    return [
      root + vowel + 'ssi', root + vowel + 'ssi', root + vowel + 'sse',
      root + vowel + 'ssimo', root + vowel + 'ste', root + vowel + 'ssero',
    ];
  }
```

Also add `conjugateImperativo` to the `module.exports` at the bottom of the file:

```javascript
module.exports = { PRONOUNS, AUXILIARIES, conjugateSimpleTense, conjugateImperativo };
```

- [ ] **Step 4: Run tests, verify they pass**

Run: `npm test`
Expected: `# pass 14`

- [ ] **Step 5: Commit**

```bash
git add js/conjugation-engine.js test/conjugation-engine.test.js
git commit -m "Add congiuntivo, condizionale and imperativo to regular engine"
```

---

### Task 5: Conjugation engine — participio passato + compound tense builder

**Files:**
- Modify: `js/conjugation-engine.js`
- Modify: `test/conjugation-engine.test.js`

- [ ] **Step 1: Add failing tests**

```javascript
// append to test/conjugation-engine.test.js

test('conjugateParticipio returns { masc_sing, masc_plur } for each group', () => {
  const { conjugateParticipio } = require('../js/conjugation-engine.js');
  assert.deepEqual(conjugateParticipio('parl', 'are'), { masc_sing: 'parlato', masc_plur: 'parlati' });
  assert.deepEqual(conjugateParticipio('cred', 'ere'), { masc_sing: 'creduto', masc_plur: 'creduti' });
  assert.deepEqual(conjugateParticipio('dorm', 'ire'), { masc_sing: 'dormito', masc_plur: 'dormiti' });
});

test('buildCompoundTenses combines auxiliary + participio with avere (invariant)', () => {
  const { buildCompoundTenses } = require('../js/conjugation-engine.js');
  const participio = { masc_sing: 'parlato', masc_plur: 'parlati' };
  const result = buildCompoundTenses('avere', participio);
  assert.deepEqual(result.passato_prossimo,
    ['ho parlato', 'hai parlato', 'ha parlato', 'abbiamo parlato', 'avete parlato', 'hanno parlato']);
  assert.deepEqual(result.trapassato_prossimo,
    ['avevo parlato', 'avevi parlato', 'aveva parlato', 'avevamo parlato', 'avevate parlato', 'avevano parlato']);
});

test('buildCompoundTenses combines auxiliary + participio with essere (number agreement, masculine default)', () => {
  const { buildCompoundTenses } = require('../js/conjugation-engine.js');
  const participio = { masc_sing: 'andato', masc_plur: 'andati' };
  const result = buildCompoundTenses('essere', participio);
  assert.deepEqual(result.passato_prossimo,
    ['sono andato', 'sei andato', 'è andato', 'siamo andati', 'siete andati', 'sono andati']);
});

test('buildCompoundTenses produces all 7 compound tense keys', () => {
  const { buildCompoundTenses } = require('../js/conjugation-engine.js');
  const result = buildCompoundTenses('avere', { masc_sing: 'parlato', masc_plur: 'parlati' });
  assert.deepEqual(Object.keys(result).sort(), [
    'condizionale_passato', 'congiuntivo_passato', 'congiuntivo_trapassato',
    'futuro_anteriore', 'passato_prossimo', 'trapassato_prossimo', 'trapassato_remoto',
  ]);
});
```

- [ ] **Step 2: Run tests, verify they fail**

Run: `npm test`
Expected: FAIL — `conjugateParticipio is not a function`, `buildCompoundTenses is not a function`

- [ ] **Step 3: Implement conjugateParticipio and buildCompoundTenses**

```javascript
// add to js/conjugation-engine.js, above module.exports

function conjugateParticipio(root, group) {
  const ending = group === 'are' ? 'ato' : group === 'ere' ? 'uto' : 'ito';
  return { masc_sing: root + ending, masc_plur: root + ending.slice(0, -1) + 'i' };
}

// Builds the 7 compound tenses from an auxiliary's simple-tense conjugations
// and a participio. Number agreement uses masc_sing for io/tu/lui_lei and
// masc_plur for noi/voi/loro (see design note: gender defaults to masculine).
function buildCompoundTenses(auxiliaryName, participio) {
  const aux = AUXILIARIES[auxiliaryName];
  const forms = [participio.masc_sing, participio.masc_sing, participio.masc_sing,
    participio.masc_plur, participio.masc_plur, participio.masc_plur];

  function combine(auxSimpleTense) {
    return aux[auxSimpleTense].map((auxForm, i) => `${auxForm} ${forms[i]}`);
  }

  return {
    passato_prossimo: combine('presente'),
    trapassato_prossimo: combine('imperfetto'),
    trapassato_remoto: combine('passato_remoto'),
    futuro_anteriore: combine('futuro_semplice'),
    congiuntivo_passato: combine('congiuntivo_presente'),
    congiuntivo_trapassato: combine('congiuntivo_imperfetto'),
    condizionale_passato: combine('condizionale_presente'),
  };
}
```

Update the `module.exports` line to:

```javascript
module.exports = {
  PRONOUNS, AUXILIARIES, conjugateSimpleTense, conjugateImperativo,
  conjugateParticipio, buildCompoundTenses,
};
```

- [ ] **Step 4: Run tests, verify they pass**

Run: `npm test`
Expected: `# pass 18`

- [ ] **Step 5: Commit**

```bash
git add js/conjugation-engine.js test/conjugation-engine.test.js
git commit -m "Add participio passato and compound tense builder to engine"
```

---

### Task 6: Conjugation engine — full assembly (conjugateRegularVerb) + regular verbs list

**Files:**
- Modify: `js/conjugation-engine.js`
- Modify: `test/conjugation-engine.test.js`
- Create: `js/regular-verbs-list.js`

- [ ] **Step 1: Add failing test for conjugateRegularVerb**

```javascript
// append to test/conjugation-engine.test.js

test('conjugateRegularVerb produces all 15 tenses for parlare (avere)', () => {
  const { conjugateRegularVerb } = require('../js/conjugation-engine.js');
  const result = conjugateRegularVerb('parlare', 'are', false, 'avere');
  assert.deepEqual(result.presente, ['parlo', 'parli', 'parla', 'parliamo', 'parlate', 'parlano']);
  assert.deepEqual(result.passato_prossimo,
    ['ho parlato', 'hai parlato', 'ha parlato', 'abbiamo parlato', 'avete parlato', 'hanno parlato']);
  assert.deepEqual(result.imperativo, ['parla', 'parli', 'parliamo', 'parlate', 'parlino']);
  assert.equal(Object.keys(result).length, 15);
});

test('conjugateRegularVerb produces all 15 tenses for andare-shaped -are verb (essere)', () => {
  const { conjugateRegularVerb } = require('../js/conjugation-engine.js');
  const result = conjugateRegularVerb('arrivare', 'are', false, 'essere');
  assert.deepEqual(result.passato_prossimo,
    ['sono arrivato', 'sei arrivato', 'è arrivato', 'siamo arrivati', 'siete arrivati', 'sono arrivati']);
});
```

- [ ] **Step 2: Run tests, verify they fail**

Run: `npm test`
Expected: FAIL — `conjugateRegularVerb is not a function`

- [ ] **Step 3: Implement conjugateRegularVerb**

```javascript
// add to js/conjugation-engine.js, above module.exports

const SIMPLE_TENSE_NAMES = [
  'presente', 'imperfetto', 'passato_remoto', 'futuro_semplice',
  'congiuntivo_presente', 'congiuntivo_imperfetto', 'condizionale_presente',
];

// Builds the full 15-tense table for a regular verb.
// infinitive: full infinitive form (e.g. 'parlare'), used only as a label/key upstream.
// group: 'are' | 'ere' | 'ire'. isIsc: true for -ire verbs that take -isc- (e.g. capire).
// auxiliaryName: 'avere' | 'essere', which auxiliary this verb takes in compound tenses.
function conjugateRegularVerb(infinitive, group, isIsc, auxiliaryName) {
  const root = infinitive.slice(0, -group.length - (group === 'are' || group === 'ere' ? 0 : 0)).slice(0, -1) === ''
    ? infinitive.slice(0, -3)
    : infinitive.slice(0, -3);
  const simple = {};
  for (const tense of SIMPLE_TENSE_NAMES) {
    simple[tense] = conjugateSimpleTense(root, group, isIsc, tense);
  }
  const imperativo = conjugateImperativo(root, group, isIsc);
  const participio = conjugateParticipio(root, group);
  const compound = buildCompoundTenses(auxiliaryName, participio);

  return { ...simple, imperativo, ...compound };
}
```

Note: the `root` computation above is intentionally simple — Italian regular infinitives always end in exactly `are`/`ere`/`ire` (3 characters), so `infinitive.slice(0, -3)` is correct and sufficient. Replace the convoluted first line with just:

```javascript
function conjugateRegularVerb(infinitive, group, isIsc, auxiliaryName) {
  const root = infinitive.slice(0, -3);
  const simple = {};
  for (const tense of SIMPLE_TENSE_NAMES) {
    simple[tense] = conjugateSimpleTense(root, group, isIsc, tense);
  }
  const imperativo = conjugateImperativo(root, group, isIsc);
  const participio = conjugateParticipio(root, group);
  const compound = buildCompoundTenses(auxiliaryName, participio);
  return { ...simple, imperativo, ...compound };
}
```

Update `module.exports`:

```javascript
module.exports = {
  PRONOUNS, AUXILIARIES, conjugateSimpleTense, conjugateImperativo,
  conjugateParticipio, buildCompoundTenses, conjugateRegularVerb,
};
```

- [ ] **Step 4: Run tests, verify they pass**

Run: `npm test`
Expected: `# pass 20`

- [ ] **Step 5: Create the regular verbs list**

```javascript
// js/regular-verbs-list.js
//
// Regular verbs only (no irregular stems, no irregular participio). Each entry:
// { infinitive, group: 'are'|'ere'|'ire', isIsc: boolean, auxiliary: 'avere'|'essere', translation }
// isIsc = true for -ire verbs conjugated with -isc- in presente/congiuntivo presente/imperativo.
// Most -ire verbs in this list are NOT -isc- (dormire-type); isIsc ones are marked explicitly.

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
  { infinitive: 'aprire', group: 'ire', isIsc: false, auxiliary: 'avere', translation: 'abrir' },
  { infinitive: 'seguire', group: 'ire', isIsc: false, auxiliary: 'avere', translation: 'seguir' },
  { infinitive: 'capire', group: 'ire', isIsc: true, auxiliary: 'avere', translation: 'entender' },
  { infinitive: 'finire', group: 'ire', isIsc: true, auxiliary: 'avere', translation: 'terminar' },
  { infinitive: 'preferire', group: 'ire', isIsc: true, auxiliary: 'avere', translation: 'preferir' },
  { infinitive: 'pulire', group: 'ire', isIsc: true, auxiliary: 'avere', translation: 'limpiar' },
  { infinitive: 'costruire', group: 'ire', isIsc: true, auxiliary: 'avere', translation: 'construir' },
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { REGULAR_VERBS };
}
```

- [ ] **Step 6: Add a test verifying the list has no duplicate infinitives and every entry has required fields**

```javascript
// test/regular-verbs-list.test.js
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { REGULAR_VERBS } = require('../js/regular-verbs-list.js');

test('REGULAR_VERBS has no duplicate infinitives', () => {
  const infinitives = REGULAR_VERBS.map(v => v.infinitive);
  assert.equal(new Set(infinitives).size, infinitives.length);
});

test('every entry has the required fields with valid values', () => {
  for (const v of REGULAR_VERBS) {
    assert.ok(['are', 'ere', 'ire'].includes(v.group), `${v.infinitive} has invalid group`);
    assert.ok(['avere', 'essere'].includes(v.auxiliary), `${v.infinitive} has invalid auxiliary`);
    assert.equal(typeof v.isIsc, 'boolean', `${v.infinitive}.isIsc must be boolean`);
    assert.ok(v.infinitive.endsWith(v.group), `${v.infinitive} does not end in -${v.group}`);
  }
});
```

- [ ] **Step 7: Run tests, verify all pass**

Run: `npm test`
Expected: all tests pass, no failures

- [ ] **Step 8: Commit**

```bash
git add js/conjugation-engine.js js/regular-verbs-list.js test/conjugation-engine.test.js test/regular-verbs-list.test.js
git commit -m "Add conjugateRegularVerb assembly and regular verbs list"
```

---

### Task 7: Irregular verbs data — schema + 5 worked examples (essere, avere, andare, fare, potere)

**Files:**
- Create: `js/verbs-data.js`
- Create: `test/verbs-data.test.js`

Each irregular verb is a full 15-tense table written by hand, in the exact same shape `conjugateRegularVerb` produces: the 7 simple tenses + `imperativo` (5 forms) + the 7 compound tenses (built via `buildCompoundTenses` so compound tenses stay consistent with the engine, not hand-typed).

- [ ] **Step 1: Write failing tests for the first 5 irregular verbs**

```javascript
// test/verbs-data.test.js
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { IRREGULAR_VERBS } = require('../js/verbs-data.js');

function verb(infinitive) {
  return IRREGULAR_VERBS.find(v => v.infinitive === infinitive);
}

test('essere is present with correct presente and passato_prossimo', () => {
  const v = verb('essere');
  assert.ok(v, 'essere should be in IRREGULAR_VERBS');
  assert.deepEqual(v.conjugation.presente, ['sono', 'sei', 'è', 'siamo', 'siete', 'sono']);
  assert.deepEqual(v.conjugation.passato_prossimo,
    ['sono stato', 'sei stato', 'è stato', 'siamo stati', 'siete stati', 'sono stati']);
});

test('avere is present with correct presente and imperativo', () => {
  const v = verb('avere');
  assert.deepEqual(v.conjugation.presente, ['ho', 'hai', 'ha', 'abbiamo', 'avete', 'hanno']);
  assert.deepEqual(v.conjugation.imperativo, ['abbi', 'abbia', 'abbiamo', 'abbiate', 'abbiano']);
});

test('andare is present with correct presente and futuro_semplice', () => {
  const v = verb('andare');
  assert.deepEqual(v.conjugation.presente, ['vado', 'vai', 'va', 'andiamo', 'andate', 'vanno']);
  assert.deepEqual(v.conjugation.futuro_semplice, ['andrò', 'andrai', 'andrà', 'andremo', 'andrete', 'andranno']);
  assert.equal(v.auxiliary, 'essere');
});

test('fare is present with correct presente and participio-based passato_prossimo', () => {
  const v = verb('fare');
  assert.deepEqual(v.conjugation.presente, ['faccio', 'fai', 'fa', 'facciamo', 'fate', 'fanno']);
  assert.deepEqual(v.conjugation.passato_prossimo,
    ['ho fatto', 'hai fatto', 'ha fatto', 'abbiamo fatto', 'avete fatto', 'hanno fatto']);
});

test('potere is present with correct presente and condizionale_presente', () => {
  const v = verb('potere');
  assert.deepEqual(v.conjugation.presente, ['posso', 'puoi', 'può', 'possiamo', 'potete', 'possono']);
  assert.deepEqual(v.conjugation.condizionale_presente,
    ['potrei', 'potresti', 'potrebbe', 'potremmo', 'potreste', 'potrebbero']);
});

test('every irregular verb has all 15 tense keys', () => {
  const expectedKeys = [
    'presente', 'imperfetto', 'passato_remoto', 'futuro_semplice',
    'congiuntivo_presente', 'congiuntivo_imperfetto', 'condizionale_presente', 'imperativo',
    'passato_prossimo', 'trapassato_prossimo', 'trapassato_remoto', 'futuro_anteriore',
    'congiuntivo_passato', 'congiuntivo_trapassato', 'condizionale_passato',
  ].sort();
  for (const v of IRREGULAR_VERBS) {
    assert.deepEqual(Object.keys(v.conjugation).sort(), expectedKeys, `${v.infinitive} is missing tense keys`);
  }
});
```

- [ ] **Step 2: Run tests, verify they fail**

Run: `npm test`
Expected: FAIL — `Cannot find module '../js/verbs-data.js'`

- [ ] **Step 3: Implement js/verbs-data.js with these 5 verbs**

```javascript
// js/verbs-data.js
//
// Hand-written irregular verbs. Each entry:
// { infinitive, auxiliary: 'avere'|'essere', translation, conjugation: {...15 tenses...} }
// Compound tenses are built with buildCompoundTenses so they stay consistent
// with the engine's auxiliary tables instead of being hand-typed and error-prone.

const { AUXILIARIES, buildCompoundTenses } = require('./conjugation-engine.js');

function makeVerb(infinitive, auxiliary, translation, simpleAndImperativo, participio) {
  const compound = buildCompoundTenses(auxiliary, participio);
  return {
    infinitive,
    auxiliary,
    translation,
    conjugation: { ...simpleAndImperativo, ...compound },
  };
}

const IRREGULAR_VERBS = [
  makeVerb('essere', 'essere', 'ser/estar', {
    presente: AUXILIARIES.essere.presente,
    imperfetto: AUXILIARIES.essere.imperfetto,
    passato_remoto: AUXILIARIES.essere.passato_remoto,
    futuro_semplice: AUXILIARIES.essere.futuro_semplice,
    congiuntivo_presente: AUXILIARIES.essere.congiuntivo_presente,
    congiuntivo_imperfetto: AUXILIARIES.essere.congiuntivo_imperfetto,
    condizionale_presente: AUXILIARIES.essere.condizionale_presente,
    imperativo: ['sii', 'sia', 'siamo', 'siate', 'siano'],
  }, { masc_sing: 'stato', masc_plur: 'stati' }),

  makeVerb('avere', 'avere', 'tener/haber', {
    presente: AUXILIARIES.avere.presente,
    imperfetto: AUXILIARIES.avere.imperfetto,
    passato_remoto: AUXILIARIES.avere.passato_remoto,
    futuro_semplice: AUXILIARIES.avere.futuro_semplice,
    congiuntivo_presente: AUXILIARIES.avere.congiuntivo_presente,
    congiuntivo_imperfetto: AUXILIARIES.avere.congiuntivo_imperfetto,
    condizionale_presente: AUXILIARIES.avere.condizionale_presente,
    imperativo: ['abbi', 'abbia', 'abbiamo', 'abbiate', 'abbiano'],
  }, { masc_sing: 'avuto', masc_plur: 'avuti' }),

  makeVerb('andare', 'essere', 'ir', {
    presente: ['vado', 'vai', 'va', 'andiamo', 'andate', 'vanno'],
    imperfetto: ['andavo', 'andavi', 'andava', 'andavamo', 'andavate', 'andavano'],
    passato_remoto: ['andai', 'andasti', 'andò', 'andammo', 'andaste', 'andarono'],
    futuro_semplice: ['andrò', 'andrai', 'andrà', 'andremo', 'andrete', 'andranno'],
    congiuntivo_presente: ['vada', 'vada', 'vada', 'andiamo', 'andiate', 'vadano'],
    congiuntivo_imperfetto: ['andassi', 'andassi', 'andasse', 'andassimo', 'andaste', 'andassero'],
    condizionale_presente: ['andrei', 'andresti', 'andrebbe', 'andremmo', 'andreste', 'andrebbero'],
    imperativo: ['va\'', 'vada', 'andiamo', 'andate', 'vadano'],
  }, { masc_sing: 'andato', masc_plur: 'andati' }),

  makeVerb('fare', 'avere', 'hacer', {
    presente: ['faccio', 'fai', 'fa', 'facciamo', 'fate', 'fanno'],
    imperfetto: ['facevo', 'facevi', 'faceva', 'facevamo', 'facevate', 'facevano'],
    passato_remoto: ['feci', 'facesti', 'fece', 'facemmo', 'faceste', 'fecero'],
    futuro_semplice: ['farò', 'farai', 'farà', 'faremo', 'farete', 'faranno'],
    congiuntivo_presente: ['faccia', 'faccia', 'faccia', 'facciamo', 'facciate', 'facciano'],
    congiuntivo_imperfetto: ['facessi', 'facessi', 'facesse', 'facessimo', 'faceste', 'facessero'],
    condizionale_presente: ['farei', 'faresti', 'farebbe', 'faremmo', 'fareste', 'farebbero'],
    imperativo: ['fa\'', 'faccia', 'facciamo', 'fate', 'facciano'],
  }, { masc_sing: 'fatto', masc_plur: 'fatti' }),

  makeVerb('potere', 'avere', 'poder', {
    presente: ['posso', 'puoi', 'può', 'possiamo', 'potete', 'possono'],
    imperfetto: ['potevo', 'potevi', 'poteva', 'potevamo', 'potevate', 'potevano'],
    passato_remoto: ['potei', 'potesti', 'poté', 'potemmo', 'poteste', 'poterono'],
    futuro_semplice: ['potrò', 'potrai', 'potrà', 'potremo', 'potrete', 'potranno'],
    congiuntivo_presente: ['possa', 'possa', 'possa', 'possiamo', 'possiate', 'possano'],
    congiuntivo_imperfetto: ['potessi', 'potessi', 'potesse', 'potessimo', 'poteste', 'potessero'],
    condizionale_presente: ['potrei', 'potresti', 'potrebbe', 'potremmo', 'potreste', 'potrebbero'],
    imperativo: ['puoi', 'possa', 'possiamo', 'potete', 'possano'],
  }, { masc_sing: 'potuto', masc_plur: 'potuti' }),
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { IRREGULAR_VERBS };
}
```

- [ ] **Step 4: Run tests, verify they pass**

Run: `npm test`
Expected: all pass

- [ ] **Step 5: Commit**

```bash
git add js/verbs-data.js test/verbs-data.test.js
git commit -m "Add irregular verbs data: essere, avere, andare, fare, potere"
```

---

### Task 8: Irregular verbs data — remaining 45 verbs

**Files:**
- Modify: `js/verbs-data.js`
- Modify: `test/verbs-data.test.js`

This is a data-entry task following the exact schema and `makeVerb(...)` helper established in Task 7. Add the following infinitives to `IRREGULAR_VERBS`, each with its standard Italian conjugation, looked up from a reliable reference (e.g. a printed or well-established online Italian conjugation table) and entered using `makeVerb`:

dire, dare, stare, venire, sapere, uscire, bere, rimanere, tenere, tradurre, salire, scegliere, volere, dovere, vedere, dovere (already listed — skip duplicate), morire, nascere, piacere, sedere, vivere, chiedere, chiudere, correre, decidere, leggere, mettere, perdere, prendere, ridere, rispondere, rompere, scendere, scrivere, spendere, vincere, apparire, aprire (already regular — skip if already in regular list, otherwise keep only one copy), condurre, produrre, porre, proporre, comporre, opporre, riporre, trarre.

Trim this list to exactly 45 new infinitives (dropping any duplicates against Task 7's 5 verbs and against `regular-verbs-list.js`) so the total `IRREGULAR_VERBS` count is 50. Prioritize the most frequent verbs first: dire, dare, stare, venire, sapere, uscire, bere, volere, dovere, vedere, tenere, rimanere, salire, scegliere, morire, nascere, piacere, vivere, chiedere, chiudere, correre, decidere, leggere, mettere, perdere, prendere, ridere, rispondere, rompere, scendere, scrivere, spendere, vincere, tradurre, condurre, produrre, porre, proporre, comporre, opporre, trarre, sedere, riuscire, apparire, valere.

- [ ] **Step 1: Add a failing test asserting the full expected verb list is present**

```javascript
// append to test/verbs-data.test.js

test('IRREGULAR_VERBS contains exactly 50 verbs with no duplicates', () => {
  assert.equal(IRREGULAR_VERBS.length, 50);
  const infinitives = IRREGULAR_VERBS.map(v => v.infinitive);
  assert.equal(new Set(infinitives).size, 50);
});

test('spot-check: dire, dare, venire, bere, volere, dovere are correct', () => {
  assert.deepEqual(verb('dire').conjugation.presente, ['dico', 'dici', 'dice', 'diciamo', 'dite', 'dicono']);
  assert.deepEqual(verb('dare').conjugation.presente, ['do', 'dai', 'dà', 'diamo', 'date', 'danno']);
  assert.deepEqual(verb('venire').conjugation.presente, ['vengo', 'vieni', 'viene', 'veniamo', 'venite', 'vengono']);
  assert.deepEqual(verb('bere').conjugation.presente, ['bevo', 'bevi', 'beve', 'beviamo', 'bevete', 'bevono']);
  assert.deepEqual(verb('volere').conjugation.presente, ['voglio', 'vuoi', 'vuole', 'vogliamo', 'volete', 'vogliono']);
  assert.deepEqual(verb('dovere').conjugation.presente, ['devo', 'devi', 'deve', 'dobbiamo', 'dovete', 'devono']);
});

test('every verb in IRREGULAR_VERBS still has all 15 tense keys (regression check)', () => {
  const expectedKeys = [
    'presente', 'imperfetto', 'passato_remoto', 'futuro_semplice',
    'congiuntivo_presente', 'congiuntivo_imperfetto', 'condizionale_presente', 'imperativo',
    'passato_prossimo', 'trapassato_prossimo', 'trapassato_remoto', 'futuro_anteriore',
    'congiuntivo_passato', 'congiuntivo_trapassato', 'condizionale_passato',
  ].sort();
  for (const v of IRREGULAR_VERBS) {
    assert.deepEqual(Object.keys(v.conjugation).sort(), expectedKeys, `${v.infinitive} is missing tense keys`);
  }
});
```

- [ ] **Step 2: Run tests, verify they fail**

Run: `npm test`
Expected: FAIL — `IRREGULAR_VERBS.length` is 5, not 50; `verb('dire')` is undefined

- [ ] **Step 3: Add the remaining 45 verbs to `IRREGULAR_VERBS` in `js/verbs-data.js`**

Follow the exact `makeVerb(infinitive, auxiliary, translation, { presente, imperfetto, passato_remoto, futuro_semplice, congiuntivo_presente, congiuntivo_imperfetto, condizionale_presente, imperativo }, { masc_sing, masc_plur })` pattern from Task 7 for each of the 45 verbs listed above. Look up each verb's standard conjugation from a trustworthy Italian grammar reference and enter every one of the 7 simple-tense arrays + imperativo + participio by hand — there is no shortcut for irregular forms. Mark movement/change-of-state verbs (andare-like: venire, uscire, salire, scendere, nascere, morire, rimanere, riuscire) and a few others (essere-like: stare) with `auxiliary: 'essere'`; the rest use `'avere'`. Double-check each verb against the assertions in Step 1 before moving on, and against any additional spot-checks you add for verbs you're less sure of.

- [ ] **Step 4: Run tests, verify all pass**

Run: `npm test`
Expected: all pass, `IRREGULAR_VERBS.length === 50`

- [ ] **Step 5: Commit**

```bash
git add js/verbs-data.js test/verbs-data.test.js
git commit -m "Add remaining 45 irregular verbs"
```

---

### Task 9: verb-bank.js — unified lookup

**Files:**
- Create: `js/verb-bank.js`
- Create: `test/verb-bank.test.js`

- [ ] **Step 1: Write failing tests**

```javascript
// test/verb-bank.test.js
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { getConjugation, listAllVerbs } = require('../js/verb-bank.js');

test('getConjugation returns irregular verb data directly for essere', () => {
  const result = getConjugation('essere');
  assert.deepEqual(result.conjugation.presente, ['sono', 'sei', 'è', 'siamo', 'siete', 'sono']);
  assert.equal(result.infinitive, 'essere');
});

test('getConjugation computes regular verb data via the engine for parlare', () => {
  const result = getConjugation('parlare');
  assert.deepEqual(result.conjugation.presente, ['parlo', 'parli', 'parla', 'parliamo', 'parlate', 'parlano']);
  assert.equal(result.auxiliary, 'avere');
});

test('getConjugation returns undefined for an unknown infinitive', () => {
  assert.equal(getConjugation('nonexistente'), undefined);
});

test('listAllVerbs returns every regular and irregular verb, no duplicates', () => {
  const all = listAllVerbs();
  const infinitives = all.map(v => v.infinitive);
  assert.equal(new Set(infinitives).size, infinitives.length);
  assert.ok(infinitives.includes('parlare'));
  assert.ok(infinitives.includes('essere'));
});
```

- [ ] **Step 2: Run tests, verify they fail**

Run: `npm test`
Expected: FAIL — `Cannot find module '../js/verb-bank.js'`

- [ ] **Step 3: Implement js/verb-bank.js**

```javascript
// js/verb-bank.js
//
// Unified verb lookup: irregular verbs are returned as-is from verbs-data.js;
// regular verbs are conjugated on the fly via the engine, from regular-verbs-list.js.

const { conjugateRegularVerb } = require('./conjugation-engine.js');
const { REGULAR_VERBS } = require('./regular-verbs-list.js');
const { IRREGULAR_VERBS } = require('./verbs-data.js');

const IRREGULAR_BY_INFINITIVE = new Map(IRREGULAR_VERBS.map(v => [v.infinitive, v]));
const REGULAR_BY_INFINITIVE = new Map(REGULAR_VERBS.map(v => [v.infinitive, v]));

function getConjugation(infinitive) {
  if (IRREGULAR_BY_INFINITIVE.has(infinitive)) {
    return IRREGULAR_BY_INFINITIVE.get(infinitive);
  }
  if (REGULAR_BY_INFINITIVE.has(infinitive)) {
    const entry = REGULAR_BY_INFINITIVE.get(infinitive);
    return {
      infinitive: entry.infinitive,
      auxiliary: entry.auxiliary,
      translation: entry.translation,
      conjugation: conjugateRegularVerb(entry.infinitive, entry.group, entry.isIsc, entry.auxiliary),
    };
  }
  return undefined;
}

function listAllVerbs() {
  return [...IRREGULAR_VERBS, ...REGULAR_VERBS.map(v => ({ infinitive: v.infinitive, translation: v.translation }))];
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getConjugation, listAllVerbs };
}
```

- [ ] **Step 4: Run tests, verify they pass**

Run: `npm test`
Expected: all pass

- [ ] **Step 5: Commit**

```bash
git add js/verb-bank.js test/verb-bank.test.js
git commit -m "Add verb-bank unified lookup module"
```

---

### Task 10: quiz.js — question generation and session state

**Files:**
- Create: `js/quiz.js`
- Create: `test/quiz.test.js`

- [ ] **Step 1: Write failing tests**

```javascript
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
```

- [ ] **Step 2: Run tests, verify they fail**

Run: `npm test`
Expected: FAIL — `Cannot find module '../js/quiz.js'`

- [ ] **Step 3: Implement js/quiz.js**

```javascript
// js/quiz.js
//
// Builds practice sessions ("tandas"): picks random verb+tense+pronoun combos
// from the tenses the user selected, and (for multiple-choice questions)
// generates plausible wrong answers from other pronoun forms of the same tense.

const { PRONOUNS } = require('./conjugation-engine.js');
const { getConjugation, listAllVerbs } = require('./verb-bank.js');

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

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createSession, getCurrentQuestion, generateDistractors };
}
```

- [ ] **Step 4: Run tests, verify they pass**

Run: `npm test`
Expected: all pass (note: these tests use real randomness over a real verb bank, so they are inherently a bit fuzzy — if `generateDistractors` intermittently returns fewer than 2 for a rare tense/verb combination, that indicates the guard loop needs a higher limit or the verb bank needs more entries for that tense; re-run to confirm before investigating further)

- [ ] **Step 5: Commit**

```bash
git add js/quiz.js test/quiz.test.js
git commit -m "Add quiz session and question generation"
```

---

### Task 11: quiz.js — answer validation and recording

**Files:**
- Modify: `js/quiz.js`
- Modify: `test/quiz.test.js`

- [ ] **Step 1: Write failing tests**

```javascript
// append to test/quiz.test.js
const { checkAnswer, recordAnswer } = require('../js/quiz.js');

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

test('recordAnswer appends to session.answers and advances currentIndex', () => {
  const session = createSession({ tenses: ['presente'], answerMode: 'typed', questionCount: 3 });
  const question = getCurrentQuestion(session);
  recordAnswer(session, question.correctAnswer);
  assert.equal(session.answers.length, 1);
  assert.equal(session.answers[0].correct, true);
  assert.equal(session.answers[0].tense, question.tense);
  assert.equal(session.currentIndex, 1);
});
```

- [ ] **Step 2: Run tests, verify they fail**

Run: `npm test`
Expected: FAIL — `checkAnswer is not a function`

- [ ] **Step 3: Implement checkAnswer and recordAnswer**

```javascript
// add to js/quiz.js, above module.exports

function normalize(str) {
  return str.trim().toLowerCase();
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
```

Update `module.exports`:

```javascript
module.exports = { createSession, getCurrentQuestion, generateDistractors, checkAnswer, recordAnswer };
```

- [ ] **Step 4: Run tests, verify they pass**

Run: `npm test`
Expected: all pass

- [ ] **Step 5: Commit**

```bash
git add js/quiz.js test/quiz.test.js
git commit -m "Add answer validation and recording to quiz"
```

---

### Task 12: stats.js — localStorage persistence and aggregation

**Files:**
- Create: `js/stats.js`
- Create: `test/stats.test.js`

Node has no `localStorage` global, so tests inject a tiny in-memory fake that implements the same `getItem`/`setItem` interface — this is what real browser `localStorage` also does, so the module works unmodified in both environments.

- [ ] **Step 1: Write failing tests**

```javascript
// test/stats.test.js
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { recordSessionAnswers, getStats, getWeakestTenses } = require('../js/stats.js');

function fakeStorage() {
  const data = new Map();
  return {
    getItem: (key) => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => data.set(key, value),
  };
}

test('recordSessionAnswers stores answers and getStats aggregates by tense', () => {
  const storage = fakeStorage();
  recordSessionAnswers(storage, [
    { infinitive: 'parlare', tense: 'presente', pronoun: 'io', correct: true, accentOnly: false },
    { infinitive: 'parlare', tense: 'presente', pronoun: 'tu', correct: false, accentOnly: false },
    { infinitive: 'credere', tense: 'imperfetto', pronoun: 'io', correct: true, accentOnly: false },
  ]);
  const stats = getStats(storage);
  assert.equal(stats.byTense.presente.total, 2);
  assert.equal(stats.byTense.presente.correct, 1);
  assert.equal(stats.byTense.imperfetto.total, 1);
  assert.equal(stats.byTense.imperfetto.correct, 1);
});

test('recordSessionAnswers accumulates across multiple calls', () => {
  const storage = fakeStorage();
  recordSessionAnswers(storage, [{ infinitive: 'parlare', tense: 'presente', pronoun: 'io', correct: true, accentOnly: false }]);
  recordSessionAnswers(storage, [{ infinitive: 'parlare', tense: 'presente', pronoun: 'tu', correct: true, accentOnly: false }]);
  const stats = getStats(storage);
  assert.equal(stats.byTense.presente.total, 2);
  assert.equal(stats.byTense.presente.correct, 2);
});

test('getStats on empty storage returns an empty-but-valid shape', () => {
  const storage = fakeStorage();
  const stats = getStats(storage);
  assert.deepEqual(stats.byTense, {});
  assert.deepEqual(stats.byVerb, {});
});

test('getWeakestTenses sorts ascending by accuracy, requires a minimum sample size', () => {
  const storage = fakeStorage();
  recordSessionAnswers(storage, [
    { infinitive: 'parlare', tense: 'presente', pronoun: 'io', correct: true, accentOnly: false },
    { infinitive: 'parlare', tense: 'presente', pronoun: 'tu', correct: true, accentOnly: false },
    { infinitive: 'parlare', tense: 'presente', pronoun: 'lui_lei', correct: true, accentOnly: false },
    { infinitive: 'credere', tense: 'imperfetto', pronoun: 'io', correct: false, accentOnly: false },
    { infinitive: 'credere', tense: 'imperfetto', pronoun: 'tu', correct: false, accentOnly: false },
    { infinitive: 'credere', tense: 'imperfetto', pronoun: 'noi', correct: true, accentOnly: false },
  ]);
  const weakest = getWeakestTenses(storage, { minSamples: 3 });
  assert.equal(weakest[0].tense, 'imperfetto');
  assert.ok(weakest[0].accuracy < weakest[1].accuracy === false); // imperfetto (1/3) < presente (3/3)
});
```

- [ ] **Step 2: Run tests, verify they fail**

Run: `npm test`
Expected: FAIL — `Cannot find module '../js/stats.js'`

- [ ] **Step 3: Implement js/stats.js**

```javascript
// js/stats.js
//
// Persists per-answer history to localStorage (or any getItem/setItem-compatible
// storage, e.g. a fake in tests) and aggregates accuracy by tense and by verb.

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

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { recordSessionAnswers, getStats, getWeakestTenses };
}
```

- [ ] **Step 4: Run tests, verify they pass**

Run: `npm test`
Expected: all pass

- [ ] **Step 5: Commit**

```bash
git add js/stats.js test/stats.test.js
git commit -m "Add stats persistence and weak-tense aggregation"
```

---

### Task 13: accent-input.js — accent popup component

**Files:**
- Create: `js/accent-input.js`
- Create: `test/accent-input.test.js`

The accent logic (which vowel maps to which numbered variants) is pure and unit-testable in Node. The DOM wiring (showing/hiding the popup, listening to keystrokes on a real `<input>`) has no DOM available under `node --test`, so it is verified manually in the browser in Task 15, where this component gets attached to the real practice-screen input.

- [ ] **Step 1: Write failing tests for the pure accent-variant logic**

```javascript
// test/accent-input.test.js
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { getAccentOptions } = require('../js/accent-input.js');

test('getAccentOptions for "e" returns è, é, then plain e', () => {
  assert.deepEqual(getAccentOptions('e'), ['è', 'é', 'e']);
});

test('getAccentOptions for "a" returns à then plain a', () => {
  assert.deepEqual(getAccentOptions('a'), ['à', 'a']);
});

test('getAccentOptions for "i" returns ì then plain i', () => {
  assert.deepEqual(getAccentOptions('i'), ['ì', 'i']);
});

test('getAccentOptions for "o" returns ò then plain o', () => {
  assert.deepEqual(getAccentOptions('o'), ['ò', 'o']);
});

test('getAccentOptions for "u" returns ù then plain u', () => {
  assert.deepEqual(getAccentOptions('u'), ['ù', 'u']);
});

test('getAccentOptions returns an empty array for a non-accentable character', () => {
  assert.deepEqual(getAccentOptions('b'), []);
  assert.deepEqual(getAccentOptions(' '), []);
});

test('getAccentOptions is case-insensitive and preserves case in the result', () => {
  assert.deepEqual(getAccentOptions('E'), ['È', 'É', 'E']);
});
```

- [ ] **Step 2: Run tests, verify they fail**

Run: `npm test`
Expected: FAIL — `Cannot find module '../js/accent-input.js'`

- [ ] **Step 3: Implement js/accent-input.js**

```javascript
// js/accent-input.js
//
// Accent helper for practice inputs. As soon as the user types an accentable
// vowel (a/e/i/o/u), a small numbered popup appears next to the cursor. While
// that vowel is still the last character typed, pressing the matching number
// key replaces it with the accented form. Typing anything else just closes
// the popup and leaves the vowel as typed — nothing is ever blocked.

const ACCENT_MAP = {
  a: ['à', 'a'],
  e: ['è', 'é', 'e'],
  i: ['ì', 'i'],
  o: ['ò', 'o'],
  u: ['ù', 'u'],
};

function getAccentOptions(char) {
  const lower = char.toLowerCase();
  const options = ACCENT_MAP[lower];
  if (!options) return [];
  if (char === lower) return options;
  return options.map(o => o.toUpperCase());
}

// Attaches the popup behavior to a real <input> element. Not unit-tested here
// (no DOM under `node --test`) — verified manually in the browser (Task 15).
function attachAccentInput(inputElement, popupElement) {
  function closePopup() {
    popupElement.hidden = true;
    popupElement.innerHTML = '';
  }

  inputElement.addEventListener('input', () => {
    const value = inputElement.value;
    const lastChar = value.slice(-1);
    const options = getAccentOptions(lastChar);
    if (options.length === 0) {
      closePopup();
      return;
    }
    popupElement.hidden = false;
    popupElement.innerHTML = options
      .map((opt, i) => `<span class="accent-option">${i + 1}: ${opt}</span>`)
      .join(' ');
    popupElement.dataset.replacing = 'true';
  });

  inputElement.addEventListener('keydown', (event) => {
    if (popupElement.hidden) return;
    const lastChar = inputElement.value.slice(-1);
    const options = getAccentOptions(lastChar);
    const pressedIndex = Number(event.key) - 1;
    if (Number.isInteger(pressedIndex) && options[pressedIndex]) {
      event.preventDefault();
      inputElement.value = inputElement.value.slice(0, -1) + options[pressedIndex];
      closePopup();
      return;
    }
    if (event.key !== 'Shift' && event.key !== 'Control' && event.key !== 'Alt' && event.key !== 'Meta') {
      closePopup();
    }
  });

  inputElement.addEventListener('blur', closePopup);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getAccentOptions, attachAccentInput };
}
```

- [ ] **Step 4: Run tests, verify they pass**

Run: `npm test`
Expected: all pass

- [ ] **Step 5: Commit**

```bash
git add js/accent-input.js test/accent-input.test.js
git commit -m "Add accent popup component (pure logic, tested; DOM wiring manual)"
```

---

### Task 14: Setup screen — HTML/CSS structure

**Files:**
- Modify: `index.html`
- Modify: `style.css`

- [ ] **Step 1: Replace the empty `#screen-setup` section in index.html**

```html
<!-- replace <section id="screen-setup" class="screen"></section> in index.html with: -->
<section id="screen-setup" class="screen">
  <h2>Configura tu tanda</h2>

  <fieldset>
    <legend>Indicativo</legend>
    <label><input type="checkbox" name="tense" value="presente"> Presente</label>
    <label><input type="checkbox" name="tense" value="imperfetto"> Imperfetto</label>
    <label><input type="checkbox" name="tense" value="passato_prossimo"> Passato prossimo</label>
    <label><input type="checkbox" name="tense" value="trapassato_prossimo"> Trapassato prossimo</label>
    <label><input type="checkbox" name="tense" value="passato_remoto"> Passato remoto</label>
    <label><input type="checkbox" name="tense" value="trapassato_remoto"> Trapassato remoto</label>
    <label><input type="checkbox" name="tense" value="futuro_semplice"> Futuro semplice</label>
    <label><input type="checkbox" name="tense" value="futuro_anteriore"> Futuro anteriore</label>
  </fieldset>

  <fieldset>
    <legend>Congiuntivo</legend>
    <label><input type="checkbox" name="tense" value="congiuntivo_presente"> Presente</label>
    <label><input type="checkbox" name="tense" value="congiuntivo_imperfetto"> Imperfetto</label>
    <label><input type="checkbox" name="tense" value="congiuntivo_passato"> Passato</label>
    <label><input type="checkbox" name="tense" value="congiuntivo_trapassato"> Trapassato</label>
  </fieldset>

  <fieldset>
    <legend>Condizionale</legend>
    <label><input type="checkbox" name="tense" value="condizionale_presente"> Presente</label>
    <label><input type="checkbox" name="tense" value="condizionale_passato"> Passato</label>
  </fieldset>

  <fieldset>
    <legend>Imperativo</legend>
    <label><input type="checkbox" name="tense" value="imperativo"> Presente</label>
  </fieldset>

  <fieldset>
    <legend>Modo de respuesta</legend>
    <label><input type="radio" name="answer-mode" value="typed" checked> Escribir</label>
    <label><input type="radio" name="answer-mode" value="multiple"> Opcion multiple</label>
    <label><input type="radio" name="answer-mode" value="mixed"> Mixto</label>
  </fieldset>

  <fieldset>
    <legend>Numero de preguntas</legend>
    <label><input type="radio" name="question-count" value="10" checked> 10</label>
    <label><input type="radio" name="question-count" value="20"> 20</label>
    <label><input type="radio" name="question-count" value="50"> 50</label>
  </fieldset>

  <p id="setup-error" class="error-text" hidden>Elige al menos un tiempo verbal.</p>

  <button id="start-session-btn" type="button" class="primary-btn">Empezar</button>
</section>
```

- [ ] **Step 2: Add setup screen and shared component styles to style.css**

```css
/* append to style.css */

fieldset {
  border: 1px solid var(--border);
  margin-bottom: 16px;
  padding: 12px 16px;
}

legend {
  padding: 0 6px;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

fieldset label {
  display: inline-block;
  margin: 4px 12px 4px 0;
  font-size: 14px;
}

.primary-btn {
  font-family: inherit;
  font-size: 15px;
  padding: 10px 20px;
  background: var(--fg);
  color: var(--bg);
  border: none;
  cursor: pointer;
}

.primary-btn:hover { opacity: 0.85; }

.error-text { color: var(--error); font-size: 14px; }
.success-text { color: var(--success); }
```

- [ ] **Step 3: Manually verify in the browser**

Open `index.html` directly in a browser (double-click, or `open index.html` on macOS). Confirm: the setup screen shows 4 fieldsets of tense checkboxes, a response-mode radio group, a question-count radio group, and an "Empezar" button (not yet wired — clicking does nothing).

- [ ] **Step 4: Commit**

```bash
git add index.html style.css
git commit -m "Add setup screen markup and styles"
```

---

### Task 15: app.js — screen controller skeleton + setup screen wiring

**Files:**
- Create: `js/app.js`

`app.js` is pure DOM wiring with no exports to test under Node (no DOM in `node --test`). It is verified manually by clicking through the running app in a browser, per the `run` skill approach for UI changes. Each step below has a precise manual check.

- [ ] **Step 1: Implement the screen controller skeleton and setup screen wiring**

```javascript
// js/app.js
//
// Wires the DOM to the pure modules (verb-bank, quiz, stats, accent-input).
// No exports, no automated tests — this file is UI glue, verified manually
// in the browser (see verification steps in this task and Tasks 16-18).

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

  // renderQuestion is defined in Task 16 and referenced here; declared with
  // `var` at module scope via the IIFE below so Task 16 can extend this file.
  var renderQuestion = function () {
    throw new Error('renderQuestion not implemented yet (see Task 16)');
  };
})();
```

Note: `Quiz` here refers to the global exposed by `js/quiz.js` when loaded as a plain `<script>`. Since `quiz.js` currently only does `module.exports` (for Node), the browser build needs it to ALSO assign a global. Fix this by editing the bottom of every module file to assign `window.<Name>` when `module` is not defined use the reverse: always assign to a global AND to `module.exports` when available. Update the export guard pattern in **all 8 js/ files** (`conjugation-engine.js`, `regular-verbs-list.js`, `verbs-data.js`, `verb-bank.js`, `accent-input.js`, `quiz.js`, `stats.js`) to the dual pattern shown in Step 2.

- [ ] **Step 2: Make every module expose a browser global too (dual export pattern)**

For each of the 7 existing `js/*.js` files (all except the new `app.js`), replace the bottom `module.exports = {...}` guard with a version that also assigns a `window` global. Example for `js/conjugation-engine.js` (apply the same shape to the others, matching each file's own export names and its own global name — `ConjugationEngine`, `RegularVerbsList`, `VerbsData`, `VerbBank`, `AccentInput`, `Quiz`, `Stats`):

```javascript
// bottom of js/conjugation-engine.js
const ConjugationEngine = {
  PRONOUNS, AUXILIARIES, conjugateSimpleTense, conjugateImperativo,
  conjugateParticipio, buildCompoundTenses, conjugateRegularVerb,
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ConjugationEngine;
} else {
  window.ConjugationEngine = ConjugationEngine;
}
```

Apply the equivalent change to:
- `js/regular-verbs-list.js` → global `RegularVerbsList = { REGULAR_VERBS }`
- `js/verbs-data.js` → global `VerbsData = { IRREGULAR_VERBS }` (and update its internal `require('./conjugation-engine.js')` call: guard it too — see Step 3)
- `js/verb-bank.js` → global `VerbBank = { getConjugation, listAllVerbs }` (and update its internal requires — see Step 3)
- `js/accent-input.js` → global `AccentInput = { getAccentOptions, attachAccentInput }`
- `js/quiz.js` → global `Quiz = { createSession, getCurrentQuestion, generateDistractors, checkAnswer, recordAnswer }`
- `js/stats.js` → global `Stats = { recordSessionAnswers, getStats, getWeakestTenses }`

- [ ] **Step 3: Guard the internal `require()` calls so the same files work as plain browser scripts**

`js/verbs-data.js` and `js/verb-bank.js` use `require(...)` at the top to pull in other modules. In the browser (plain `<script>` tags, no bundler), `require` does not exist and those modules are already loaded as globals (because `index.html` lists `conjugation-engine.js`, `regular-verbs-list.js`, `verbs-data.js` in that order). Replace the top of `js/verbs-data.js`:

```javascript
// top of js/verbs-data.js — replace the require line with:
const { AUXILIARIES, buildCompoundTenses } = typeof module !== 'undefined' && module.exports
  ? require('./conjugation-engine.js')
  : window.ConjugationEngine;
```

And the top of `js/verb-bank.js`:

```javascript
// top of js/verb-bank.js — replace the three require lines with:
const isNode = typeof module !== 'undefined' && module.exports;
const { conjugateRegularVerb } = isNode ? require('./conjugation-engine.js') : window.ConjugationEngine;
const { REGULAR_VERBS } = isNode ? require('./regular-verbs-list.js') : window.RegularVerbsList;
const { IRREGULAR_VERBS } = isNode ? require('./verbs-data.js') : window.VerbsData;
```

- [ ] **Step 4: Run the full test suite to confirm the dual-export refactor didn't break anything**

Run: `npm test`
Expected: all existing tests still pass (this step is pure refactor, no new tests)

- [ ] **Step 5: Manually verify the setup screen wiring in the browser**

Open `index.html` in a browser with the developer console visible. Confirm:
- No console errors on load.
- Clicking "Empezar" with no tenses checked shows the red "Elige al menos un tiempo verbal." error text.
- Checking "Presente" and clicking "Empezar" throws the expected placeholder error `renderQuestion not implemented yet (see Task 16)` in the console (this confirms the setup screen correctly collected config and called into the session logic — Task 16 replaces the placeholder).

- [ ] **Step 6: Commit**

```bash
git add js/app.js js/conjugation-engine.js js/regular-verbs-list.js js/verbs-data.js js/verb-bank.js js/accent-input.js js/quiz.js js/stats.js
git commit -m "Add app controller skeleton, setup screen wiring, dual module exports"
```

---

### Task 16: Practice screen — markup, styles, and wiring

**Files:**
- Modify: `index.html`
- Modify: `style.css`
- Modify: `js/app.js`

- [ ] **Step 1: Replace the empty `#screen-practice` section in index.html**

```html
<!-- replace <section id="screen-practice" class="screen" hidden></section> with: -->
<section id="screen-practice" class="screen" hidden>
  <p class="label" id="practice-progress">Pregunta 1/10</p>
  <p class="label" id="practice-tense-label">Congiuntivo presente</p>
  <h3 id="practice-verb"></h3>
  <p class="subtitle" id="practice-prompt"></p>

  <div id="practice-typed-mode">
    <div class="accent-input-wrapper">
      <input type="text" id="practice-input" autocomplete="off" autocapitalize="off">
      <div id="accent-popup" class="accent-popup" hidden></div>
    </div>
    <button id="submit-answer-btn" type="button" class="primary-btn">Comprobar</button>
  </div>

  <div id="practice-multiple-mode" class="options" hidden></div>

  <p id="practice-feedback" class="feedback-text" hidden></p>
  <button id="next-question-btn" type="button" class="primary-btn" hidden>Siguiente</button>
</section>
```

- [ ] **Step 2: Add practice screen styles to style.css**

```css
/* append to style.css */

.label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #666; margin: 4px 0; }
.subtitle { font-size: 14px; color: #444; }

.accent-input-wrapper { position: relative; display: inline-block; }

#practice-input {
  font-family: inherit;
  font-size: 16px;
  padding: 8px 10px;
  border: 1px solid var(--border);
  width: 240px;
}

.accent-popup {
  position: absolute;
  top: 100%;
  left: 0;
  background: var(--fg);
  color: var(--bg);
  padding: 4px 8px;
  font-size: 12px;
  margin-top: 4px;
  white-space: nowrap;
  z-index: 10;
}

.accent-option { margin-right: 8px; }

#practice-multiple-mode.options { display: flex; flex-direction: column; gap: 8px; margin-top: 12px; }

#practice-multiple-mode .option {
  border: 1px solid var(--border);
  padding: 10px 14px;
  cursor: pointer;
}

#practice-multiple-mode .option:hover { background: #f5f5f5; }
#practice-multiple-mode .option.selected-correct { border-color: var(--success); background: #eaf6ee; }
#practice-multiple-mode .option.selected-wrong { border-color: var(--error); background: #fbe9eb; }

.feedback-text { font-size: 15px; margin-top: 12px; }
.feedback-text.correct { color: var(--success); }
.feedback-text.incorrect { color: var(--error); }
```

- [ ] **Step 3: Implement renderQuestion, answer handling, and feedback in app.js**

Replace the placeholder `renderQuestion` assignment at the bottom of the IIFE in `js/app.js` with the full implementation, and add the supporting functions inside the same IIFE (above the `document.addEventListener('DOMContentLoaded', ...)` line):

```javascript
// in js/app.js, inside the IIFE, replace the closing block
// (from `document.addEventListener('DOMContentLoaded', ...)` to the end)
// with the following:

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
    Stats.recordSessionAnswers(window.localStorage, state.session.answers);
    showScreen('screen-result');
    renderResultImpl();
  }

  // Overwrite the Task-15 placeholder now that rendering is implemented.
  renderQuestion = renderQuestionImpl;

  // renderResultImpl is defined in Task 17.
  var renderResultImpl = function () {
    throw new Error('renderResultImpl not implemented yet (see Task 17)');
  };

  document.addEventListener('DOMContentLoaded', () => {
    initSetupScreen();
    initPracticeScreen();
    showScreen('screen-setup');
  });
```

Also change the `startBtn` click handler added in Task 15 so that after `renderQuestion()` runs it doesn't crash when it reaches the last question — the "Siguiente" button's handler above already checks `currentIndex >= questions.length` before calling `renderQuestionImpl` again, but `renderQuestionImpl` itself is only ever called for a valid index, so no further change is needed there.

- [ ] **Step 4: Run the automated test suite (regression check — no new automated tests in this task)**

Run: `npm test`
Expected: all pass (unchanged)

- [ ] **Step 5: Manually verify the practice screen in the browser**

Open `index.html`, check "Presente" and "Congiuntivo presente", choose "Escribir", 10 questions, click "Empezar". Confirm:
- The verb, tense label, pronoun prompt, and progress ("Pregunta 1/10") show correctly.
- Typing `parlo` and clicking "Comprobar" (for a matching question) shows green "Correcto!" and reveals "Siguiente".
- Typing a wrong answer shows red feedback with the correct answer.
- Typing a vowel (e.g. "e") in the input shows the accent popup below the input with numbered options; pressing "1" replaces the vowel with its accented form; typing another letter closes the popup without altering the vowel.
- Clicking "Siguiente" advances through all 10 questions, then transitions away from the practice screen (Task 17 implements where it lands).
- Repeat with "Opcion multiple" mode: clicking an option highlights it green/red and shows the correct option in green when wrong.

- [ ] **Step 6: Commit**

```bash
git add index.html style.css js/app.js
git commit -m "Add practice screen: rendering, answer handling, feedback, accent input wiring"
```

---

### Task 17: Result screen — markup, styles, and wiring

**Files:**
- Modify: `index.html`
- Modify: `style.css`
- Modify: `js/app.js`

- [ ] **Step 1: Replace the empty `#screen-result` section in index.html**

```html
<!-- replace <section id="screen-result" class="screen" hidden></section> with: -->
<section id="screen-result" class="screen" hidden>
  <h2>Resultado</h2>
  <p id="result-summary" class="subtitle"></p>
  <div id="result-breakdown"></div>
  <button id="retry-session-btn" type="button" class="primary-btn">Repetir tanda</button>
  <button id="back-to-setup-btn" type="button" class="primary-btn">Configurar otra</button>
</section>
```

- [ ] **Step 2: Add result screen styles to style.css**

```css
/* append to style.css */

#result-breakdown { margin: 16px 0; }

.breakdown-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px solid var(--border);
  font-size: 14px;
}

#retry-session-btn { margin-right: 8px; }
```

- [ ] **Step 3: Implement renderResultImpl and its button wiring in app.js**

Replace the Task-16 placeholder `renderResultImpl` (and add an `initResultScreen` call) in `js/app.js`:

```javascript
// in js/app.js: replace
//   var renderResultImpl = function () {
//     throw new Error('renderResultImpl not implemented yet (see Task 17)');
//   };
// with:

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
      showScreen('screen-practice');
      renderQuestion();
    });

    document.getElementById('back-to-setup-btn').addEventListener('click', () => {
      showScreen('screen-setup');
    });
  }
```

And update the `DOMContentLoaded` handler at the bottom of the IIFE to also call `initResultScreen()`:

```javascript
  document.addEventListener('DOMContentLoaded', () => {
    initSetupScreen();
    initPracticeScreen();
    initResultScreen();
    showScreen('screen-setup');
  });
```

- [ ] **Step 4: Run the automated test suite (regression check)**

Run: `npm test`
Expected: all pass (unchanged)

- [ ] **Step 5: Manually verify the result screen in the browser**

Complete a 10-question tanda end to end. Confirm: the result screen shows "`X`/10 correctas (`Y`%)", a breakdown row per tense practiced, and that "Repetir tanda" starts a fresh session with the same config while "Configurar otra" returns to the setup screen with everything reset.

- [ ] **Step 6: Commit**

```bash
git add index.html style.css js/app.js
git commit -m "Add result screen: summary, per-tense breakdown, retry/reconfigure"
```

---

### Task 18: Progress screen — markup, styles, and wiring

**Files:**
- Modify: `index.html`
- Modify: `style.css`
- Modify: `js/app.js`

- [ ] **Step 1: Replace the empty `#screen-progress` section in index.html**

```html
<!-- replace <section id="screen-progress" class="screen" hidden></section> with: -->
<section id="screen-progress" class="screen" hidden>
  <h2>Tu progreso</h2>
  <p id="progress-empty" class="subtitle" hidden>Aun no tienes datos. Completa una tanda de practica primero.</p>
  <div id="progress-weakest"></div>
  <h3>Por tiempo verbal</h3>
  <div id="progress-by-tense"></div>
  <button id="back-from-progress-btn" type="button" class="primary-btn">Volver</button>
</section>
```

- [ ] **Step 2: Add progress screen styles to style.css**

```css
/* append to style.css */

#progress-weakest .breakdown-row { border-color: var(--error); }
```

- [ ] **Step 3: Implement the progress screen in app.js**

Add inside the IIFE (above `document.addEventListener('DOMContentLoaded', ...)`), and wire the header's existing `#nav-progress` button:

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

  function initProgressScreen() {
    document.getElementById('nav-progress').addEventListener('click', () => {
      showScreen('screen-progress');
      renderProgressScreen();
    });
    document.getElementById('back-from-progress-btn').addEventListener('click', () => {
      showScreen('screen-setup');
    });
  }
```

Update the `DOMContentLoaded` handler:

```javascript
  document.addEventListener('DOMContentLoaded', () => {
    initSetupScreen();
    initPracticeScreen();
    initResultScreen();
    initProgressScreen();
    showScreen('screen-setup');
  });
```

- [ ] **Step 4: Run the automated test suite (regression check)**

Run: `npm test`
Expected: all pass (unchanged)

- [ ] **Step 5: Manually verify the progress screen in the browser**

With `localStorage` empty (clear it via devtools if needed), click "Progreso" in the header — confirm the empty-state message shows. Complete at least one 10-question tanda mixing 2+ tenses, click "Progreso" again — confirm per-tense correct/total rows appear, and (once any tense has 3+ answered questions) an "A reforzar" section lists the weakest tenses sorted worst-first. Click "Volver" to return to setup.

- [ ] **Step 6: Commit**

```bash
git add index.html style.css js/app.js
git commit -m "Add progress screen: per-tense stats and weakest-tenses summary"
```

---

### Task 19: Final integration pass, plan self-review, and GitHub Pages deployment

**Files:** none new — verification and deployment only.

- [ ] **Step 1: Run the full automated test suite one final time**

Run: `npm test`
Expected: all tests across all `test/*.test.js` files pass, 0 failures.

- [ ] **Step 2: Full manual smoke test in the browser (end-to-end, all 15 tenses)**

Open `index.html`. Select every tense checkbox (all 15), "Mixto" answer mode, 20 questions. Complete the full tanda. Confirm no console errors appear at any point, feedback is shown for every question (including at least one accent-only near-miss if it comes up), the result screen totals match what you observed during practice, and "Progreso" reflects the new answers across multiple tenses.

- [ ] **Step 3: Push the repo to GitHub and enable Pages**

```bash
cd "/Users/mateuribem/Claude/conjugare"
gh repo create muribemo/conjugare --public --source=. --remote=origin --push
```

Then enable GitHub Pages for the repo (Settings → Pages → Deploy from branch `main`, root), and confirm `https://muribemo.github.io/conjugare/` loads the app.

- [ ] **Step 4: Final commit if any smoke-test fixes were needed**

If Step 2 surfaced any bugs, fix them, re-run `npm test`, re-verify manually, then:

```bash
git add -A
git commit -m "Fix issues found in end-to-end smoke test"
git push
```

If no fixes were needed, this step is skipped.

---

## Plan Self-Review

**Spec coverage:** Architecture (static site, no backend, localStorage) → Task 1, 15. 15 tenses → Tasks 2-6 (regular engine), 7-8 (irregular data), covered in `TENSE_LABELS`/setup checkboxes in Task 14. Regular engine + irregular list → Tasks 2-9. Screens (setup/practice/result/progress) → Tasks 14-18. Accent popup (auto-appear on last-typed vowel, number-key select, closes on any other key, no holding required) → Task 13 + wiring in Task 16, matches the user's correction during brainstorming. Validation ignoring case/whitespace but accents counting, with accent-only feedback → Task 11. Both response modes configurable per tanda (typed/multiple/mixed) → Task 10, 14. Fixed question count (10/20/50) → Task 10, 14. Progress + weakest-tense tracking in localStorage → Task 12, 18. Minimalist visual style → Task 1, 14 (CSS). GitHub Pages hosting as "conjugare" → Task 19.

**Placeholder scan:** No "TBD"/"TODO" left in any step; Task 8's irregular-verb data entry names an explicit, bounded list of 45 infinitives and gives verifiable spot-check tests rather than vague instructions — this is a bounded data-entry task, not an unspecified one.

**Type/signature consistency:** `PRONOUNS` order (`io, tu, lui_lei, noi, voi, loro`) used consistently from Task 2 through Task 16's prompt rendering. Tense key names (`presente`, `congiuntivo_presente`, etc.) match between `conjugation-engine.js`, `verbs-data.js`, `quiz.js`, `stats.js`, and the `TENSE_LABELS` map and HTML checkbox `value`s in Task 14 — verified they're spelled identically everywhere. `getConjugation(infinitive)` return shape (`{ infinitive, auxiliary, translation, conjugation }`) is consistent between Task 7 (irregular), Task 9 (verb-bank regular branch), and how Task 10's `quiz.js` reads `verb.conjugation[tense]`.

**Scope:** Single cohesive subsystem (one static app, one repo) — not decomposed further, consistent with the brainstorming scope check.

