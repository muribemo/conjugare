# Conjugare — Estadísticas por verbo + tecla Enter

**Fecha:** 2026-09-02
**Estado:** Aprobado, listo para plan de implementación

## 1. Resumen

Dos mejoras a la app "conjugare" ya publicada:

1. **Estadísticas por verbo:** la pantalla de Progreso muestra, además del desglose por tiempo verbal (ya existente), un desglose por verbo (veces preguntado, veces acertado, % de acierto), ordenado de peor a mejor desempeño.
2. **Tecla Enter en modo escribir:** en la pantalla de práctica, cuando la pregunta es de tipo "escribir", la tecla Enter confirma la respuesta (equivalente a "Comprobar") y, una vez mostrado el feedback, Enter de nuevo avanza a la siguiente pregunta (equivalente a "Siguiente"). No aplica al modo de opción múltiple.

Un tercer reporte del usuario (algunos verbos aparecían "mal escritos" al preguntarlos) queda pendiente de un ejemplo concreto para poder diagnosticarlo — no forma parte de este spec. Se investigará como fix aparte cuando el usuario aporte el caso.

## 2. Estadísticas por verbo

**Datos:** `js/stats.js`'s `getStats(storage)` ya calcula `byVerb` (mapa `infinitivo -> {total, correct}`) vía `aggregateBy(history, 'infinitive')`, reutilizando la misma función que ya sirve `byTense`. No hace falta tocar el modelo de datos guardado en `localStorage`.

Se agrega una función nueva `getVerbBreakdown(storage)` en `js/stats.js` que:
- Toma `getStats(storage).byVerb`.
- Mapea cada entrada a `{ infinitive, total, correct, accuracy }`.
- Ordena ascendente por `accuracy` (peor desempeño primero); en caso de empate, ordena alfabéticamente por `infinitive` para que el orden sea estable y predecible.
- No aplica ningún `minSamples` (a diferencia de `getWeakestTenses`): el usuario pidió la lista completa de verbos ya practicados, sin importar cuántas veces.

**UI:** en `index.html`, la sección `#screen-progress` gana un bloque nuevo después de "Por tiempo verbal":
```html
<h3>Por verbo</h3>
<div id="progress-by-verb" class="scrollable-breakdown"></div>
```
`js/app.js`'s `renderProgressScreen()` se extiende para llamar a `Stats.getVerbBreakdown(window.localStorage)` y renderizar una `.breakdown-row` por verbo (mismo patrón visual que las filas de tiempo verbal: infinitivo a la izquierda, `correct/total (X%)` a la derecha). Si no hay verbos practicados todavía, el bloque queda vacío (ya cubierto por el estado vacío general de la pantalla, que oculta todo y muestra el mensaje "Aún no tienes datos").

**Estilo:** `.scrollable-breakdown` en `style.css` limita la altura (`max-height: 300px; overflow-y: auto;`) para que una lista larga de verbos no alargue demasiado la pantalla, con el mismo estilo de fila (`.breakdown-row`) ya existente.

## 3. Tecla Enter en modo escribir

En `js/app.js`, dentro de `initPracticeScreen()`, se agrega un listener de `keydown` (a nivel de `document`, ya que el campo de texto puede quedar deshabilitado y perder el foco tras responder). El listener:

1. Ignora la tecla si no es `Enter`.
2. Ignora si la pantalla visible no es `screen-practice`.
3. Ignora si la pregunta actual no es de modo `typed` (no afecta a opción múltiple).
4. Si `#practice-input` **no** está deshabilitado (todavía no se respondió): dispara la misma lógica que el botón "Comprobar" (equivalente a un click en `#submit-answer-btn`).
5. Si `#practice-input` **está** deshabilitado (ya se respondió, se ve el feedback): dispara la misma lógica que el botón "Siguiente" (equivalente a un click en `#next-question-btn`, que ya maneja tanto avanzar como finalizar la tanda).

No se agrega validación adicional: Enter con el campo vacío se comporta igual que hacer click en "Comprobar" con el campo vacío hoy (se evalúa como respuesta incorrecta, igual que ahora).

Si el popup de acentos está abierto cuando se presiona Enter, su propio manejador de teclado lo cierra (Enter no es un dígito ni un modificador) y, en el mismo evento, el nuevo listener también confirma la respuesta — cerrar el popup y confirmar a la vez es el comportamiento esperado cuando el usuario indica que terminó de escribir.

## 4. Fuera de alcance

- El bug de verbos "mal escritos" — pendiente de un ejemplo concreto del usuario.
- Tecla Enter en modo opción múltiple (el usuario pidió dejarlo solo con mouse/botón).
- Paginación o búsqueda en la lista de verbos (se resuelve con scroll simple por ahora).
