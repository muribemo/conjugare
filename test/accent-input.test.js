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
