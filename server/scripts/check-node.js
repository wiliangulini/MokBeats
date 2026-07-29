'use strict';

/**
 * Fail-fast de runtime do backend (lote R1a do Plano P0 v2.2).
 *
 * Roda em `preinstall` e `prestart` — antes de existir node_modules — por isso
 * não pode depender de nenhum pacote de terceiros. Garante que o backend só
 * instale/rode sob a major 24 do Node, na versão corrigida (>= 24.18.1),
 * nunca sob o Node 16.20.2 usado como bridge EOL do build/test do frontend
 * Angular 14 (.nvmrc da raiz).
 *
 * Bypass explícito (uso interno de deploy-to-vps.sh --allow-runtime-mismatch,
 * nunca para uso local rotineiro): MOKBEATS_SKIP_NODE_CHECK=1.
 */

const fs = require('fs');
const path = require('path');

const REQUIRED_MAJOR = 24;
const REQUIRED_MIN = [24, 18, 1];
const NVMRC_PATH = path.join(__dirname, '..', '.nvmrc');

function parseVersion(raw) {
  const match = String(raw).trim().match(/^v?(\d+)\.(\d+)\.(\d+)/);
  if (!match) return null;
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function readRequiredVersion() {
  try {
    const fromNvmrc = parseVersion(fs.readFileSync(NVMRC_PATH, 'utf8'));
    if (fromNvmrc) return fromNvmrc;
  } catch (err) {
    // .nvmrc ausente: cai no fallback abaixo.
  }

  try {
    // eslint-disable-next-line global-require
    const pkg = require('../package.json');
    const engines = pkg.engines && pkg.engines.node;
    const match = engines && String(engines).match(/(\d+)\.(\d+)\.(\d+)/);
    if (match) return [Number(match[1]), Number(match[2]), Number(match[3])];
  } catch (err) {
    // sem package.json legível: usa o default hardcoded.
  }

  return REQUIRED_MIN;
}

function isAtLeast(actual, required) {
  for (let i = 0; i < 3; i += 1) {
    if (actual[i] > required[i]) return true;
    if (actual[i] < required[i]) return false;
  }
  return true;
}

function main() {
  if (process.env.MOKBEATS_SKIP_NODE_CHECK === '1') {
    console.log('[check-node] MOKBEATS_SKIP_NODE_CHECK=1 — verificação de runtime ignorada.');
    return;
  }

  const required = readRequiredVersion();
  const actual = parseVersion(process.version);

  if (!actual) {
    console.error(`[check-node] Não foi possível interpretar process.version: ${process.version}`);
    process.exit(1);
  }

  const requiredLabel = required.join('.');
  const okMajor = actual[0] === REQUIRED_MAJOR;
  const okMin = isAtLeast(actual, required);

  if (!okMajor || !okMin) {
    console.error('[check-node] Runtime incompatível para server/.');
    console.error(`  Encontrado: v${actual.join('.')}`);
    console.error(`  Exigido:    v${requiredLabel} (major ${REQUIRED_MAJOR}, patch mínimo corrigido)`);
    console.error('');
    console.error('  Instale/ative com nvm:');
    console.error(`    nvm install ${requiredLabel}`);
    console.error(`    nvm use ${requiredLabel}`);
    console.error('');
    console.error('  Bypass explícito (apenas cenários de deploy conscientes):');
    console.error('    MOKBEATS_SKIP_NODE_CHECK=1 npm install');
    process.exit(1);
  }

  console.log(`[check-node] Node v${actual.join('.')} OK (>= v${requiredLabel}).`);
}

main();
