# Conjugare — Matriz por verbo + Borrar progreso

**Fecha:** 2026-09-02
**Estado:** Aprobado, listo para implementar

## 1. Resumen

Dos mejoras a la pantalla de Progreso:

1. **Matriz por verbo:** al hacer clic en una fila de "Por verbo", se abre una ventana que muestra, para ese verbo, qué combinaciones tiempo × pronombre ya se practicaron y con qué resultado — para saber exactamente qué formas se dominan y cuáles no.
2. **Borrar progreso:** un botón que borra el historial de respuestas guardado (estadísticas), sin tocar los verbos favoritos.

## 2. Matriz por verbo

**Datos — `js/stats.js`:** nueva función `getVerbCombinations(storage, infinitive)`, que filtra el historial completo a las respuestas de ese verbo y las agrupa por tiempo y luego por pronombre:
```javascript
function getVerbCombinations(storage, infinitive) {
  const history = loadHistory(storage).filter((a) => a.infinitive === infinitive);
  const result = {};
  for (const a of history) {
    if (!result[a.tense]) result[a.tense] = {};
    if (!result[a.tense][a.pronoun]) result[a.tense][a.pronoun] = { total: 0, correct: 0 };
    result[a.tense][a.pronoun].total += 1;
    if (a.correct) result[a.tense][a.pronoun].correct += 1;
  }
  return result;
}
```
Reutiliza el `loadHistory` interno que ya existe en el archivo (usado por `getStats`), no se duplica lógica de lectura de `localStorage`.

**UI — `index.html`/`js/app.js`:** cada fila de `#progress-by-verb` se vuelve clickeable (se agrega `data-infinitive` a la fila y un listener delegado, mismo patrón que ya se usa para el botón "Quitar" de favoritos). Al hacer clic, se abre un `<dialog id="verb-matrix-modal">` (mismo patrón que `#conjugation-modal`) con:
- Una tabla principal: encabezado con los 6 pronombres normales (io, tu, lui/lei, noi, voi, loro), una fila por cada uno de los 14 tiempos que no son imperativo. Cada celda muestra `correct/total` si esa combinación fue preguntada al menos una vez, o `—` si nunca se preguntó.
- Debajo, una tabla chica aparte solo para Imperativo, con su propio encabezado de 5 pronombres (tu, Lei, noi, voi, Loro) — igual que el resto de la app ya trata el imperativo como un caso aparte (no comparte el array de 6 pronombres).

**Color de celda:** gris (`background: #f5f5f5`) si nunca se practicó; verde (`background: #eaf6ee`) si `correct === total` (siempre acertado); rojo/rosado (`background: #fbe9eb`) si `correct < total` (falló al menos una vez). Reutiliza los mismos colores/variables que ya usa `.selected-correct`/`.selected-wrong` en la pantalla de práctica.

## 3. Borrar progreso

**Datos — `js/stats.js`:** nueva función `clearHistory(storage)`:
```javascript
function clearHistory(storage) {
  storage.setItem(STORAGE_KEY, JSON.stringify([]));
}
```
Solo toca la clave de historial de respuestas (`conjugare_answer_history`); no toca `conjugare_favorite_verbs` (clave separada, manejada por `js/favorites.js`), así que los favoritos quedan intactos.

**UI:** en `#screen-progress`, un botón nuevo antes de "Volver":
```html
<button id="clear-progress-btn" type="button" class="danger-btn">Borrar progreso</button>
```
Al hacer clic, se pide confirmación con `window.confirm(...)` (mismo patrón ya usado para la advertencia de abandonar una tanda activa). Si se confirma, se llama a `Stats.clearHistory(window.localStorage)` y se vuelve a renderizar la pantalla de Progreso (que debería mostrar el estado vacío, ya que no queda historial).

**Estilo:** nueva clase `.danger-btn` en `style.css`, con borde/texto en el color de error ya definido (`var(--error)`), para diferenciarlo visualmente de los botones normales de la app.

## 4. Fuera de alcance

- Deshacer un "Borrar progreso" (es una acción permanente, con confirmación previa como única salvaguarda).
- Exportar el historial antes de borrarlo.
- Editar o borrar combinaciones individuales dentro de la matriz.
