// js/accent-input.js
//
// Accent helper for practice inputs. As soon as the user types an accentable
// vowel (a/e/i/o/u), a small numbered popup appears next to the cursor. While
// that vowel is still the last character typed, pressing the matching number
// key replaces it with the accented form. Typing anything else just closes
// the popup and leaves the vowel as typed — nothing is ever blocked.

(function () {
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
// (no DOM under `node --test`) — verified manually in the browser (Task 16).
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

const AccentInput = { getAccentOptions, attachAccentInput };

if (typeof module !== 'undefined' && module.exports) {
  module.exports = AccentInput;
} else {
  window.AccentInput = AccentInput;
}
})();
