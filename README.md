# Conjugare

Practica la conjugacion de verbos en italiano en los 15 tiempos que se conjugan por pronombre (io, tu, lui/lei, noi, voi, loro).

## Uso local

Abre `index.html` directamente en el navegador, o sirve la carpeta con cualquier servidor estatico (ej: `npx serve .`).

## Tests

```
npm test
```

## Nota de diseno

Los tiempos compuestos con auxiliar "essere" (ej. passato prossimo de "andare") concuerdan en numero con el pronombre pero usan por defecto la forma masculina, ya que "io/tu/noi/voi" no determinan genero. La concordancia femenina queda fuera de alcance de esta version.
