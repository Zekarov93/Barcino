# Crónicas de Barcino

RPG / simulador de vida en un único HTML: reglas D&D 2024, sprites pixel-art en escena 3D (WebGL propio), economía y ecosistema vivos, Barcelona → Montserrat alternativa.

- `src/*.js` — código del juego (se concatenan por orden alfabético)
- `web/` — plantilla, CSS y `build.py` que genera `web/index.html`
- `.github/workflows/pages.yml` — construye y publica en GitHub Pages en cada push a `main`

Construir en local: `python3 web/build.py` y abrir `web/index.html`.

