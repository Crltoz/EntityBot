# Fuentes

## BRUTTALL.ttf

La tipografía del juego, usada sólo para títulos. Es decorativa y cuesta leerla a los tamaños
que necesita un número, por eso el cuerpo de las tarjetas va en Inter.

Ojo con dos cosas al tocarla:

- **No tiene tabla `name`.** Ningún motor que resuelva fuentes por nombre de familia puede
  encontrarla, así que hay que incrustarla (satori la traza como contornos) en lugar de
  registrarla por nombre en resvg.
- Cubre poco más que ASCII, así que cualquier texto que venga del usuario debe ir en Inter.

## Inter-Regular.ttf, Inter-SemiBold.ttf

Cuerpo de texto y números de las tarjetas de `/stats`.

- Autor: Rasmus Andersson — https://rsms.me/inter/
- Licencia: SIL Open Font License 1.1 — https://openfontlicense.org
- Descargadas de la API de Google Fonts (`fonts.gstatic.com`), familia `Inter`, pesos 400 y 600.

Cubren Latín, Latín extendido, Griego y Cirílico. No cubren CJK ni emoji: `src/templates/stats.js`
descarta lo que queda fuera de ese rango antes de dibujar un nombre de Steam, porque si no
aparecen cajitas vacías.
