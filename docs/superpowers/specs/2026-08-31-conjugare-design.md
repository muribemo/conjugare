# Conjugare — Diseño

**Fecha:** 2026-08-31
**Estado:** Aprobado, listo para plan de implementación

## 1. Resumen

"Conjugare" es una app web para practicar la conjugación de verbos en italiano en los 6 pronombres (io, tu, lui/lei, noi, voi, loro) y en los tiempos verbales que se conjugan por pronombre. El usuario configura tandas de práctica eligiendo tiempos verbales, modo de respuesta y número de preguntas, y la app hace preguntas aleatorias sobre una base de verbos regulares (generados por reglas) e irregulares (escritos a mano).

## 2. Arquitectura

App web estática de una sola página (HTML + CSS + JS puro, sin backend, sin build tools ni frameworks), siguiendo el mismo patrón que el proyecto existente del usuario "Formula V2". Todo el diccionario de verbos vive embebido en archivos JS servidos como parte del sitio estático. El progreso del usuario se guarda en `localStorage` del navegador (no hay cuentas ni servidor). Se publica gratis en GitHub Pages.

**Estructura de archivos:**
```
conjugare/
├── index.html                  → estructura de la página (todas las pantallas, mostradas/ocultadas por JS)
├── style.css                   → estilo minimalista (blanco/negro, tipografía mono)
├── js/
│   ├── verbs-data.js           → lista de verbos irregulares, cada uno con sus 15 tiempos completos
│   ├── regular-verbs-list.js   → lista de ~150-200 verbos regulares (infinitivo + grupo -are/-ere/-ire)
│   ├── conjugation-engine.js   → reglas de conjugación regular, genera los 15 tiempos a partir del infinitivo
│   ├── accent-input.js         → componente de popup de acentos en inputs de texto
│   ├── quiz.js                 → lógica de generación de preguntas, tandas, puntuación
│   ├── stats.js                → guardar/leer progreso y estadísticas en localStorage
│   └── app.js                  → controlador principal: conecta módulos, maneja navegación entre pantallas
├── README.md
└── docs/superpowers/specs/     → specs de diseño (este documento)
```

Repositorio: `github.com/muribemo/conjugare`, publicado en `muribemo.github.io/conjugare/`.

## 3. Base de datos de verbos

**Tiempos cubiertos (15, los que se conjugan por pronombre):**
- Indicativo: presente, imperfetto, passato prossimo, trapassato prossimo, passato remoto, trapassato remoto, futuro semplice, futuro anteriore
- Congiuntivo: presente, imperfetto, passato, trapassato
- Condizionale: presente, passato
- Imperativo: presente (5 formas: tu, Lei, noi, voi, Loro — sin "io")

**Motor de conjugación regular** (`conjugation-engine.js`): implementa las reglas de terminación para las 3 conjugaciones (-are, -ere, -ire, incluyendo el subgrupo -isc- como "capire") y genera automáticamente los 15 tiempos × pronombres para cualquier verbo de `regular-verbs-list.js`. Los tiempos compuestos (passato prossimo, trapassato, futuro anteriore, condizionale passato, congiuntivo passato/trapassato) se generan combinando el auxiliar correspondiente (avere/essere) con el participio pasado.

**Verbos irregulares** (`verbs-data.js`): ~50 verbos de alta frecuencia (essere, avere, andare, fare, potere, volere, dovere, dire, dare, stare, venire, sapere, uscire, bere, rimanere, tenere, tradurre, salire, scegliere, etc.) con los 15 tiempos escritos explícitamente a mano.

**Auxiliar:** cada verbo (regular o irregular) indica si usa "avere" o "essere" en los tiempos compuestos, lo cual afecta también la concordancia de género/número del participio cuando el auxiliar es "essere".

## 4. Pantallas y flujo de usuario

1. **Inicio / Configuración:** checkboxes agrupados por modo (Indicativo/Congiuntivo/Condizionale/Imperativo) para elegir tiempos; selector de modo de respuesta (escribir / opción múltiple / mixto — se decide al azar por pregunta); selector de número de preguntas (10/20/50). Botón "Empezar".
2. **Práctica:** muestra verbo + tiempo + pronombre pedido. Según el modo: input de texto con componente de acentos, o 3 opciones para elegir. Feedback inmediato (correcto/incorrecto + respuesta correcta) antes de avanzar. Barra de progreso (ej. "pregunta 4/20").
3. **Resultado:** aciertos totales, % de acierto, desglose por tiempo verbal de esa tanda. Botones para repetir la misma configuración o volver a configurar.
4. **Progreso (accesible desde menú):** estadísticas acumuladas guardadas en `localStorage` — % de acierto histórico por tiempo verbal y por verbo, resaltando los tiempos/verbos más débiles para que el usuario sepa en qué reforzar.

## 5. Validación de respuestas (modo "escribir")

Se ignoran mayúsculas/minúsculas y espacios extra al inicio/fin. **Los acentos sí cuentan como parte de la respuesta correcta.** Si la única diferencia con la respuesta correcta es el acento, el feedback lo señala específicamente (ej. "Casi — falta el acento: parlò").

## 6. Componente de acentos (`accent-input.js`)

Cada vez que el usuario escribe una vocal acentuable (a, e, i, o, u) en un input de práctica, aparece automáticamente un popup pequeño junto al cursor con las variantes numeradas para esa vocal (ej. para "e": 1=è, 2=é, 3=e normal; para "a", "i", "o", "u": 1=variante acentuada, 2=normal).

- Mientras esa vocal siga siendo el último carácter escrito, presionar el número correspondiente del teclado reemplaza la vocal por su versión acentuada y cierra el popup.
- En cuanto el usuario escribe cualquier otra tecla (otra letra, espacio, backspace), el popup se cierra sin modificar nada — la vocal se queda como fue escrita, sin bloquear el flujo normal de escritura.
- No requiere mantener ninguna tecla presionada.

Este componente es reutilizable: se engancha a cualquier `<input>` de práctica sin lógica adicional por parte de las demás pantallas.

## 7. Progreso y estadísticas (`stats.js`)

En cada tanda, por cada pregunta respondida se registra: verbo, tiempo verbal, pronombre, correcto/incorrecto. Se acumula en `localStorage` (sin backend). La pantalla de Progreso agrega estos datos para mostrar % de acierto por tiempo verbal y por verbo, ordenando de menor a mayor acierto para resaltar los puntos débiles.

## 8. Estilo visual

Minimalista neutro: fondo blanco, texto negro, tipografía monoespaciada, sin colores llamativos ni branding de mateouribe (proyecto independiente, identidad propia simple).

## 9. Fuera de alcance (por ahora)

- Formas no personales (infinito, participio, gerundio) — no se incluyen en esta primera versión.
- Cuentas de usuario / sincronización entre dispositivos — el progreso vive solo en el navegador local.
- Sonido / pronunciación.
- Modo offline / PWA instalable.
