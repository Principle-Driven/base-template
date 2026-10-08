#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."
export PATH="$HOME/.local/bin:$PATH"

if ! command -v mise >/dev/null 2>&1; then
  curl -fsSL https://mise.run | sh
fi

mise trust mise.toml
mise install node pnpm

if ! command -v prosecheck >/dev/null 2>&1; then
  curl -fsSL https://raw.githubusercontent.com/DheerG/prosecheck/main/install.sh | sh
fi

mise exec -- pnpm install --frozen-lockfile
mise exec -- pnpm principles:check

zsh_config="${ZDOTDIR:-$HOME}/.zshrc"
if ! grep -Fq 'mise activate zsh' "$zsh_config" 2>/dev/null; then
  cat >> "$zsh_config" <<'EOF'

export PATH="$HOME/.local/bin:$PATH"
eval "$(mise activate zsh)"
EOF
fi

printf '\nSetup complete. Open a new terminal, then run: pnpm exec pdd --help\n'
