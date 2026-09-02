# Conjugare — Verbos favoritos

**Fecha:** 2026-09-02
**Estado:** Aprobado, listo para implementar

## 1. Resumen

Permite marcar verbos como favoritos durante la práctica, verlos/gestionarlos en la pantalla de Progreso, y practicar una tanda restringida solo a esos verbos.

## 2. Marcar favoritos

En `#practice-verb-tools` (pantalla de práctica), se agrega un tercer botón junto a "Traducción" y "Ver conjugación completa":
```html
<button id="toggle-favorite-btn" type="button">☆ Favorito</button>
```
Siempre habilitado (marcar un verbo como favorito no revela ninguna forma conjugada). Al hacer clic, alterna el estado de favorito del verbo actualmente mostrado (`state.displayedQuestion.infinitive`) y actualiza el texto del botón: `★ Favorito` si está marcado, `☆ Favorito` si no. El estado se recalcula (y el botón se actualiza) cada vez que se renderiza una pregunta nueva, igual que ya pasa con el botón de traducción y el de conjugación.

Es un favorito **por verbo** (infinitivo), no por combinación de tiempo/pronombre — no importa en qué tiempo se marcó, aplica al verbo en general.

## 3. Módulo de datos: `js/favorites.js`

Mismo patrón que `js/stats.js` (IIFE, exportación dual Node/navegador, recibe `storage` como parámetro en vez de acceder a `localStorage` directamente, para poder testear con un storage falso):

```javascript
const STORAGE_KEY = 'conjugare_favorite_verbs';

function getFavorites(storage) {
  const raw = storage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function isFavorite(storage, infinitive) {
  return getFavorites(storage).includes(infinitive);
}

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
```

`toggleFavorite` devuelve el nuevo estado (`true` si quedó marcado, `false` si se desmarcó), para que `app.js` pueda actualizar el texto del botón sin tener que volver a llamar a `isFavorite`.

## 4. Ver y gestionar favoritos (pantalla de Progreso)

Nueva sección en `#screen-progress`, después de "Por verbo":
```html
<h3>Favoritos</h3>
<div id="progress-favorites" class="scrollable-breakdown"></div>
```
Cada fila muestra el infinitivo y un botón para quitarlo:
```html
<div class="breakdown-row"><span>parlare</span><button type="button" data-infinitive="parlare">Quitar</button></div>
```
Si no hay favoritos, el bloque queda vacío (sin mensaje aparte — ya existe el mensaje general de "Aún no tienes datos" para cuando no hay historial en absoluto; si hay historial de práctica pero cero favoritos, el bloque de favoritos simplemente no muestra filas, sin necesidad de un mensaje extra). Los clics en "Quitar" usan delegación de eventos (un solo listener en el contenedor `#progress-favorites`, revisando `event.target.dataset.infinitive`) ya que las filas se regeneran en cada render, igual que las demás listas de Progreso.

## 5. Practicar solo favoritos

En `#screen-setup`, un nuevo fieldset (o casilla suelta) junto a los controles existentes:
```html
<label><input type="checkbox" id="favorites-only-checkbox"> Solo verbos favoritos</label>
```
Al hacer clic en "Empezar": si la casilla está marcada, se valida que `Favorites.getFavorites(window.localStorage)` no esté vacío — si está vacío, se muestra un mensaje de error (mismo estilo que el de "elige al menos un tiempo verbal") y no se inicia la tanda. Si hay favoritos, se arma el `config` con un campo adicional `verbPool` (lista de infinitivos favoritos) antes de llamar a `startSession(config)`.

**Cambio en `js/quiz.js`:** `createSession({tenses, answerMode, questionCount, verbPool})` acepta un `verbPool` opcional (array de infinitivos). Si se da, `buildQuestion` elige el verbo solo entre esos infinitivos (resolviendo cada uno vía `getConjugation`) en vez de `listAllVerbs()`. Si no se da (caso actual, sin cambios de comportamiento), sigue usando todos los verbos como hasta ahora. Esto es un cambio aditivo y compatible con todo lo que ya llama a `createSession` sin ese campo.

## 6. Fuera de alcance

- Favoritos por tiempo/pronombre específico (siempre es por verbo completo).
- Categorías o etiquetas de favoritos (solo una lista plana).
- Sincronizar favoritos entre dispositivos (vive en `localStorage`, como el resto de los datos de la app).
