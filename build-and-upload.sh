#!/bin/bash

################################################################################
# Compatibilidade: build-and-upload.sh
#
# Este script existia antes do deploy atual da VPS. Ele permanece como atalho
# para nao quebrar fluxos antigos, mas delega tudo para deploy-to-vps.sh.
#
# Uso:
#   ./build-and-upload.sh [opcoes]
#
# Opcoes aceitas: as mesmas de ./deploy-to-vps.sh.
################################################################################

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_SCRIPT="${SCRIPT_DIR}/deploy-to-vps.sh"

if [ ! -x "$DEPLOY_SCRIPT" ]; then
  echo "[ERROR] Script canonico nao encontrado ou sem permissao de execucao: ${DEPLOY_SCRIPT}" >&2
  exit 1
fi

if [ "${1:-}" = "--help" ] || [ "${1:-}" = "-h" ]; then
  cat <<'EOF'
Uso: ./build-and-upload.sh [opcoes]

Este e um wrapper de compatibilidade. O deploy oficial fica em:
  ./deploy-to-vps.sh

Opcoes comuns:
  --frontend-only   Envia apenas frontend e .htaccess
  --backend-only    Envia apenas backend e reinicia PM2
  --no-build        Usa dist/browser/ existente
  --no-audio        Nao envia src/assets/audios/
  --generate-peaks  Gera peaks na VPS apos enviar backend/audios
  --dry-run         Simula sem alterar a VPS
  --help            Mostra esta ajuda
EOF
  exit 0
fi

echo "[INFO] build-and-upload.sh e legado; delegando para deploy-to-vps.sh."
exec "$DEPLOY_SCRIPT" "$@"
