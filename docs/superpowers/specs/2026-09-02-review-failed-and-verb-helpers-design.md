# Conjugare — Repasar fallados + ayudas de verbo (traducción / conjugación completa)

**Fecha:** 2026-09-02
**Estado:** Aprobado, listo para plan de implementación

## 1. Resumen

Dos mejoras nuevas a la app "conjugare":

1. **Repasar fallados:** desde la pantalla de Resultado, un botón que arma una tanda nueva usando exactamente las preguntas que el usuario respondió mal en la tanda que acaba de terminar.
2. **Ayudas de verbo:** en la pantalla de Práctica, dos botones junto al verbo — uno para ver la traducción al español (disponible siempre) y otro para ver la conjugación completa del verbo en los 15 tiempos (disponible solo después de responder la pregunta actual, para no arruinar el intento).

Ambas reutilizan datos y módulos ya existentes (`verb-bank.js`, `Quiz`, `session.answers`) — no requieren cambios al modelo de datos guardado.

## 2. Repasar fallados

**Disparador:** en `#screen-result`, un botón nuevo `#retry-failed-btn` ("Repasar fallados"), visible solo si `state.session.answers` tiene al menos una respuesta incorrecta (`correct === false`). Si no hubo errores, el botón no se muestra.

**Datos:** cada entrada de `session.answers` ya tiene la forma `{infinitive, tense, pronoun, userAnswer, correctAnswer, correct, accentOnly}` (definida en `quiz.js`'s `recordAnswer`). Esto ya trae todo lo necesario para reconstruir la pregunta exacta — no hace falta volver a consultar `verb-bank.js` para el `correctAnswer`.

**Nueva función en `js/quiz.js`:** `createReviewSession(failedAnswers, answerMode)`, que construye un objeto de sesión con la misma forma que `createSession` (`{tenses, answerMode, questionCount, questions, currentIndex: 0, answers: []}`), pero en vez de generar preguntas al azar, arma una pregunta por cada entrada de `failedAnswers`:
- `infinitive`, `tense`, `pronoun`, `correctAnswer` se copian directamente del answer fallado.
- `answerMode` se resuelve igual que en `buildQuestion` de la sesión normal (si el modo pedido es `'mixed'`, cada pregunta elige `typed`/`multiple` al azar; si no, todas usan el modo pedido).
- Si el modo de una pregunta es `multiple`, se generan los distractores igual que hoy, reutilizando `generateDistractors(correctAnswer, infinitive, tense, 2)` (ya existente, no cambia).
- `tenses` en el objeto de sesión resultante es la lista de tiempos únicos presentes en `failedAnswers` (solo informativo, no se usa para generar preguntas en este camino).
- `questionCount` es la cantidad de respuestas falladas.

**Modo de respuesta de la sesión de repaso:** se reutiliza `state.session.answerMode` de la tanda original (el mismo valor que el usuario eligió al configurar esa tanda, incluyendo `'mixed'` si así la configuró).

**Flujo:** al hacer clic en "Repasar fallados", `app.js` ejecuta estos cuatro pasos en su propio manejador de click (no reutiliza `startSession`, ya que esa función construye la sesión a partir de un `config` de setup vía `Quiz.createSession`, mientras que acá la sesión ya viene armada):
```javascript
document.getElementById('retry-failed-btn').addEventListener('click', () => {
  const failed = state.session.answers.filter((a) => !a.correct);
  state.session = Quiz.createReviewSession(failed, state.session.answerMode);
  state.sessionFinished = false;
  showScreen('screen-practice');
  renderQuestionImpl();
});
```
Este bloque repite las mismas 4 líneas centrales que ya tiene `startSession` (asignar `state.session`, resetear `state.sessionFinished`, `showScreen`, `renderQuestionImpl`) pero partiendo de una sesión ya construida en vez de un `config`. No se refactoriza `startSession` para aceptar ambos casos — mantener los dos caminos separados y explícitos es más simple que agregarle una rama condicional a una función ya usada en dos lugares.

## 3. Ayudas de verbo (traducción y conjugación completa)

**Ubicación:** en `#screen-practice`, justo debajo de `#practice-verb` (el nombre del infinitivo), se agrega una fila con dos botones:
```html
<div id="practice-verb-tools">
  <button id="show-translation-btn" type="button">Traducción</button>
  <button id="show-conjugation-btn" type="button" disabled>Ver conjugación completa</button>
</div>
<span id="verb-translation" class="subtitle" hidden></span>
```

**Botón "Traducción":** siempre habilitado. Al hacer clic, busca `VerbBank.getConjugation(question.infinitive).translation` (el campo `translation` ya existe en todos los verbos, regulares e irregulares) y lo muestra/oculta en `#verb-translation` (toggle). No revela ninguna forma conjugada, así que no compromete el ejercicio — puede estar disponible en cualquier momento, antes o después de responder.

**Botón "Ver conjugación completa":** deshabilitado (`disabled`) mientras la pregunta actual no fue respondida; se habilita en el mismo momento en que se muestra el feedback (junto con el botón "Siguiente", en `showFeedback`). Al hacer clic, abre un `<dialog id="conjugation-modal">` nativo del navegador (sin librerías) con las 15 tiempos del verbo actual, cada uno con sus pronombres y formas, más un botón para cerrar.

Estructura del modal:
```html
<dialog id="conjugation-modal">
  <button id="close-conjugation-modal-btn" type="button">Cerrar</button>
  <h3 id="conjugation-modal-verb"></h3>
  <div id="conjugation-modal-body"></div>
</dialog>
```

Al abrir, `app.js` llama a `VerbBank.getConjugation(question.infinitive)` y renderiza, para cada uno de los 15 tiempos (en el mismo orden que `TENSE_LABELS`), una línea por pronombre: `"pronombre: forma"`. Los 14 tiempos con 6 pronombres usan el array `PRONOUNS` (`io, tu, lui/lei, noi, voi, loro`) ya expuesto por `ConjugationEngine`; `imperativo` usa las 5 etiquetas ya usadas en `quiz.js` (`tu, Lei, noi, voi, Loro`). El modal se cierra con el botón "Cerrar", con el click fuera del contenido (comportamiento nativo de `<dialog>` al hacer clic en el backdrop, si se implementa) o con Escape (comportamiento nativo de `<dialog>`, gratis).

**Por qué deshabilitado antes de responder:** ver la tabla completa antes de responder incluye la respuesta exacta que se está preguntando, lo que anula el ejercicio. La traducción no tiene ese problema porque no incluye ninguna forma conjugada.

**Reseteo entre preguntas:** `renderQuestionImpl` debe: ocultar `#verb-translation` y volver a deshabilitar `#show-conjugation-btn` al renderizar cada pregunta nueva (igual que ya hace con `#practice-feedback` y `#next-question-btn`).

## 4. Fuera de alcance

- Repasar fallados agregados de *todas* las tandas históricas (solo se repasan los fallos de la tanda que se acaba de terminar).
- Marcar/guardar verbos favoritos o notas personales.
- Traducción a otros idiomas además del español.
- El bug de verbos "mal escritos" reportado por el usuario — sigue pendiente de un ejemplo concreto, no forma parte de este spec.
