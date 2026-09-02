// test/sanity.test.js
const { test } = require('node:test');
const assert = require('node:assert/strict');

test('sanity check', () => {
  assert.equal(1 + 1, 2);
});
