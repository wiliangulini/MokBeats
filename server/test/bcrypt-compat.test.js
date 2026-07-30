'use strict';

const assert = require('node:assert/strict');
const bcrypt = require('bcrypt');
const { test, before, after } = require('node:test');

const { startTestServer } = require('./helpers/test-server');

// Lote B1 do Plano P0 v2.2: substitui bcrypt 5.1.1 por bcrypt 6.0.0 (elimina a
// cadeia crítica @mapbox/node-pre-gyp -> tar e as altas de brace-expansion via
// rimraf -> glob -> minimatch), sob Node 24.18.1 (versão corrigida do lote
// R1a). API pública (hash/compare) é idêntica entre as duas majors — este
// teste comprova compatibilidade de formato de hash e o fluxo HTTP completo.

// Fixture sintética gerada ANTES do upgrade, sob bcrypt@5.1.1 (Node 22.18.0):
//   bcrypt.hashSync('senha-fixture-bcrypt5-p0v22', 10)
// Fixa aqui para provar que bcrypt@6 continua lendo hashes produzidos pela
// versão anterior (nenhuma senha existente de usuário real fica ilegível).
const BCRYPT5_PASSWORD = 'senha-fixture-bcrypt5-p0v22';
const BCRYPT5_HASH = '$2b$10$YJ4mtPtOImAJhp8BYDgJC.HKdVEcFRv52mPJWfX8jWKxBD6hdiJ4m';

test('bcrypt@6 compara corretamente um hash produzido pelo bcrypt@5.1.1 (fixture sintética)', async () => {
  assert.strictEqual(require('bcrypt/package.json').version, '6.0.0');
  assert.strictEqual(await bcrypt.compare(BCRYPT5_PASSWORD, BCRYPT5_HASH), true);
});

test('bcrypt@6 rejeita senha incorreta contra o mesmo hash do bcrypt@5.1.1', async () => {
  assert.strictEqual(await bcrypt.compare('senha-errada', BCRYPT5_HASH), false);
});

test('bcrypt@6 round-trip hash/compare gera prefixo $2b$ e cost 10', async () => {
  const hash = await bcrypt.hash('outra-senha-de-teste', 10);
  assert.match(hash, /^\$2b\$10\$/);
  assert.strictEqual(await bcrypt.compare('outra-senha-de-teste', hash), true);
  assert.strictEqual(await bcrypt.compare('senha-diferente', hash), false);
});

let ctx;

before(async () => {
  ctx = await startTestServer();
});

after(async () => {
  await ctx.close();
});

test('cadastro -> login -> troca de senha em USERS_FILE temporário, sob bcrypt@6', async () => {
  const email = `b1-bcrypt6-${Date.now()}@example.com`;
  const senhaInicial = 'senhaInicial123';
  const novaSenha = 'senhaNova456';

  const registerRes = await fetch(`${ctx.baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password: senhaInicial,
      tipoPessoa: 'fisica',
      tipoPerfil: 'comprador',
    }),
  });
  assert.strictEqual(registerRes.status, 201);
  const { token } = await registerRes.json();
  assert.strictEqual(typeof token, 'string');

  const loginRes = await fetch(`${ctx.baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: senhaInicial }),
  });
  assert.strictEqual(loginRes.status, 200);

  const trocaRes = await fetch(`${ctx.baseUrl}/api/user/password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ senhaAtual: senhaInicial, novaSenha }),
  });
  assert.strictEqual(trocaRes.status, 200);
  const trocaBody = await trocaRes.json();
  assert.strictEqual(trocaBody.message, 'Senha alterada com sucesso.');

  const loginSenhaAntiga = await fetch(`${ctx.baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: senhaInicial }),
  });
  assert.strictEqual(loginSenhaAntiga.status, 401, 'senha antiga não deve mais funcionar após a troca');

  const loginSenhaNova = await fetch(`${ctx.baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: novaSenha }),
  });
  assert.strictEqual(loginSenhaNova.status, 200, 'nova senha deve autenticar com sucesso');
});
