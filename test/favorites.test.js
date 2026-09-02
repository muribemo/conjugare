// test/favorites.test.js
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { getFavorites, isFavorite, toggleFavorite } = require('../js/favorites.js');

function fakeStorage() {
  const data = new Map();
  return {
    getItem: (key) => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => data.set(key, value),
  };
}

test('getFavorites returns an empty array when nothing is stored', () => {
  const storage = fakeStorage();
  assert.deepEqual(getFavorites(storage), []);
});

test('toggleFavorite adds an infinitive that is not yet a favorite, and returns true', () => {
  const storage = fakeStorage();
  const result = toggleFavorite(storage, 'parlare');
  assert.equal(result, true);
  assert.deepEqual(getFavorites(storage), ['parlare']);
});

test('toggleFavorite removes an infinitive that is already a favorite, and returns false', () => {
  const storage = fakeStorage();
  toggleFavorite(storage, 'parlare');
  const result = toggleFavorite(storage, 'parlare');
  assert.equal(result, false);
  assert.deepEqual(getFavorites(storage), []);
});

test('toggleFavorite only removes the toggled infinitive, leaving others intact', () => {
  const storage = fakeStorage();
  toggleFavorite(storage, 'parlare');
  toggleFavorite(storage, 'essere');
  toggleFavorite(storage, 'parlare');
  assert.deepEqual(getFavorites(storage), ['essere']);
});

test('isFavorite reflects the current stored state', () => {
  const storage = fakeStorage();
  assert.equal(isFavorite(storage, 'parlare'), false);
  toggleFavorite(storage, 'parlare');
  assert.equal(isFavorite(storage, 'parlare'), true);
  toggleFavorite(storage, 'parlare');
  assert.equal(isFavorite(storage, 'parlare'), false);
});
