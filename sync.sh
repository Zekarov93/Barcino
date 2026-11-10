#!/bin/bash
# Reconstruye el juego, hace commit de los cambios y los sube a GitHub (Pages se actualiza solo).
cd "$(dirname "$0")" || exit 1
python3 web/build.py >/dev/null
git add -A
git diff --cached --quiet && { echo "Sin cambios."; exit 0; }
git commit -q -m "${1:-Actualización del juego}" && git push -q origin main && echo "Subido."
