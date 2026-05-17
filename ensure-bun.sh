#!/bin/bash
# Bootstrap bun if it's not on PATH. Mirrors agiterra/crew-themes/ensure-bun.sh.
set -euo pipefail
if command -v bun >/dev/null 2>&1; then exit 0; fi
echo "[seance] bun not found — installing via https://bun.sh"
curl -fsSL https://bun.sh/install | bash
echo "[seance] bun installed. Restart your shell so PATH picks it up."
