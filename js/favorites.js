// js/favorites.js
//
// Persists a flat list of favorited verb infinitives to localStorage (or any
// getItem/setItem-compatible storage, e.g. a fake in tests). Favorites are
// per-verb, not per-tense/pronoun.

(function () {
const STORAGE_KEY = 'conjugare_favorite_verbs';

function getFavorites(storage) {
  const raw = storage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function isFavorite(storage, infinitive) {
  return getFavorites(storage).includes(infinitive);
}

// Returns the new favorite state (true if now favorited, false if removed).
function toggleFavorite(storage, infinitive) {
  const favorites = getFavorites(storage);
  const index = favorites.indexOf(infinitive);
  if (index === -1) {
    favorites.push(infinitive);
  } else {
    favorites.splice(index, 1);
  }
  storage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  return favorites.includes(infinitive);
}

const Favorites = { getFavorites, isFavorite, toggleFavorite };

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Favorites;
} else {
  window.Favorites = Favorites;
}
})();
