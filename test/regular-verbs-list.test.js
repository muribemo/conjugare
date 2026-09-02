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
