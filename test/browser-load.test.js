// test/browser-load.test.js
//
// Regression test for a real bug class (see commit "Fix cross-file global
// scope collisions by wrapping each module in an IIFE"): plain <script> tags
// in a browser all share ONE global scope, so top-level `const`/`function`
// declarations in different js/*.js files can collide and throw a
// SyntaxError, silently breaking the app on page load.
//
// `node --test` alone can't catch this: each *.test.js file loads modules
// via `require()`, which gives every file its own isolated module scope -
// never the concatenated, shared global scope that real <script> tags use.
//
// This test reproduces the real loading order and scope-sharing by reading
// the <script src="js/...."> tags out of index.html (in order), concatenating
// the referenced files' source, and running the combined source once through
// Node's `vm` module in a single shared context - the same way a browser
// would parse/execute them into one global scope.

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT_DIR = path.join(__dirname, '..');

function readScriptSources() {
  const html = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
  const scriptRelPaths = [...html.matchAll(/<script src="(js\/[^"]+)">/g)].map((m) => m[1]);

  assert.ok(
    scriptRelPaths.length > 0,
    'expected to find at least one <script src="js/...."> tag in index.html'
  );

  return scriptRelPaths.map((relPath) => fs.readFileSync(path.join(ROOT_DIR, relPath), 'utf8'));
}

// A deliberately minimal fake DOM - just enough for the scripts to execute
// at load time without throwing. None of the app's top-level code (outside
// of function/event-handler bodies) touches the DOM beyond registering a
// `DOMContentLoaded` listener, so this stays intentionally small.
function makeFakeDocument() {
  const fakeElement = () => ({
    addEventListener() {},
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    querySelector() { return null; },
    querySelectorAll() { return []; },
    hidden: false,
    value: '',
  });

  return {
    addEventListener() {},
    getElementById() { return fakeElement(); },
    querySelector() { return fakeElement(); },
    querySelectorAll() { return []; },
    createElement() { return fakeElement(); },
  };
}

test('all js/*.js scripts referenced in index.html load together in one shared global scope without throwing', () => {
  const sources = readScriptSources();
  const combinedSource = sources.join('\n;\n');

  const sandbox = {};
  // Alias `window` to the vm context's own global object (the sandbox
  // itself), just like in a real browser where `window` IS the global
  // object. This makes bare-identifier lookups and `window.X` lookups
  // resolve to the same slot, matching real browser semantics.
  sandbox.window = sandbox;
  sandbox.document = makeFakeDocument();
  sandbox.console = console;

  const context = vm.createContext(sandbox);

  // This is the core check: the original bug manifested as a SyntaxError
  // ("Identifier 'X' has already been declared") thrown while loading the
  // concatenated scripts, because two files declared the same top-level
  // `const`/`function` name. Loading must not throw anything.
  assert.doesNotThrow(() => {
    vm.runInContext(combinedSource, context, { filename: 'combined-scripts.js' });
  });

  // Bonus check: catch a module that loads without error but silently fails
  // to export its global (e.g. a typo in `window.Foo = ...`).
  const expectedGlobals = [
    'ConjugationEngine',
    'RegularVerbsList',
    'VerbsData',
    'VerbBank',
    'AccentInput',
    'Quiz',
    'Stats',
    'Favorites',
  ];

  for (const globalName of expectedGlobals) {
    assert.equal(
      typeof sandbox.window[globalName],
      'object',
      `expected window.${globalName} to be defined as an object after loading`
    );
  }
});
