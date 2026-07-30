'use strict';

const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const { test, before, after } = require('node:test');
const jwt = require('jsonwebtoken');

const { startTestServer, APP_ENTRY } = require('./helpers/test-server');

// Baseline read-only: fixa o comportamento ATUAL do backend, após os lotes de
// remediação de dependências de upload (U1..U2c) e da migração de uuid para
// crypto.randomUUID() (I1). Roda serialmente (--test-concurrency=1); cada
// teste usa e-mail próprio para não colidir no users.json temporário
// compartilhado do arquivo.

const UUID_V4_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

test('importar server/src/index.js não abre porta automaticamente (ex.: 3100)', async () => {
  process.env.NODE_ENV = 'test';
  delete require.cache[require.resolve(APP_ENTRY)];
  const app = require(APP_ENTRY);

  assert.strictEqual(typeof app, 'function', 'app exportado deve ser a instância Express (function)');

  await assert.rejects(
    () => fetch('http://127.0.0.1:3100/api/config'),
    'nenhum listener deveria estar ativo na porta de produção (3100) apenas por importar o módulo'
  );
});

let ctx;

before(async () => {
  ctx = await startTestServer();
});

after(async () => {
  await ctx.close();
});

test('cadastro (register) grava no USERS_FILE temporário e retorna token', async () => {
  const email = `t0-register-${Date.now()}@example.com`;
  const res = await fetch(`${ctx.baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password: 'senha12345',
      tipoPessoa: 'fisica',
      tipoPerfil: 'comprador',
    }),
  });

  assert.strictEqual(res.status, 201);
  const body = await res.json();
  assert.strictEqual(typeof body.token, 'string');
  assert.strictEqual(body.user.email, email);
  assert.strictEqual(body.user.tipoPerfil, 'comprador');

  const persisted = JSON.parse(fs.readFileSync(ctx.usersFile, 'utf8'));
  const persistedUser = persisted.find((u) => u.email === email);
  assert.ok(persistedUser, 'usuário deve estar persistido no USERS_FILE temporário');
  assert.strictEqual(typeof persistedUser.id, 'string');
  assert.match(persistedUser.id, UUID_V4_RE, 'id persistido deve ser um UUID v4 (crypto.randomUUID(), lote I1)');
});

// Ramo legado: email sem registro prévio no login usa o 2º call site de
// crypto.randomUUID() (antes uuidv4()) apenas para compor o payload do JWT —
// não persiste o usuário. Este comportamento é preservado tal como está pela
// I1, não é uma decisão nova deste lote; caracterizado aqui apenas para
// comprovar que o call site continua gerando UUID v4 válido.
test('login com e-mail inexistente (ramo legado) preserva comportamento atual e usa UUID v4 no JWT', async () => {
  const email = `t0-login-legado-${Date.now()}@example.com`;
  const password = 'senhaComOitoOuMais';

  const res = await fetch(`${ctx.baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.strictEqual(typeof body.token, 'string');
  assert.strictEqual(body.user.email, email);
  assert.strictEqual(body.user.tipoPerfil, 'comprador');

  const payload = jwt.decode(body.token);
  assert.strictEqual(typeof payload.userId, 'string');
  assert.match(payload.userId, UUID_V4_RE, 'userId do 2º call site deve ser um UUID v4 (crypto.randomUUID(), lote I1)');

  const persisted = JSON.parse(fs.readFileSync(ctx.usersFile, 'utf8'));
  assert.ok(!persisted.some((u) => u.email === email), 'e-mail inexistente não deve ser persistido apenas por logar (comportamento legado preservado)');
});

test('login com credenciais corretas retorna 200 e token; com senha errada retorna 401', async () => {
  const email = `t0-login-${Date.now()}@example.com`;
  const password = 'senhaCorreta123';

  const registerRes = await fetch(`${ctx.baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, tipoPessoa: 'fisica', tipoPerfil: 'produtor' }),
  });
  assert.strictEqual(registerRes.status, 201);

  const loginOk = await fetch(`${ctx.baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  assert.strictEqual(loginOk.status, 200);
  const loginOkBody = await loginOk.json();
  assert.strictEqual(typeof loginOkBody.token, 'string');
  assert.strictEqual(loginOkBody.user.tipoPerfil, 'produtor');

  const loginBad = await fetch(`${ctx.baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'senhaErrada999' }),
  });
  assert.strictEqual(loginBad.status, 401);
  const loginBadBody = await loginBad.json();
  assert.strictEqual(loginBadBody.message, 'Credenciais inválidas.');
});

test('upload de documento autenticado grava em diretório temporário e nunca no real', async () => {
  const email = `t0-doc-${Date.now()}@example.com`;
  const password = 'senha12345';

  const registerRes = await fetch(`${ctx.baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, tipoPessoa: 'fisica', tipoPerfil: 'comprador' }),
  });
  assert.strictEqual(registerRes.status, 201);
  const { token, user } = await registerRes.json();
  void user;

  const form = new FormData();
  form.append('file', new Blob([Buffer.from('conteudo-fake-de-imagem')], { type: 'image/png' }), 'documento.png');

  const uploadRes = await fetch(`${ctx.baseUrl}/api/user/documents/foto-documento`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });

  assert.strictEqual(uploadRes.status, 200);
  const uploadBody = await uploadRes.json();
  assert.match(uploadBody.url, /^\/uploads\/documents\/.+\/foto-documento\/\d+\.png$/);

  const savedRelative = uploadBody.url.replace(/^\/uploads\/documents\//, '');
  const savedAbsolute = path.join(ctx.documentsUploadsDir, savedRelative);
  assert.ok(fs.existsSync(savedAbsolute), 'arquivo deve existir dentro do diretório de documentos TEMPORÁRIO');

  // Reforço da proteção de dados: caminho retornado nunca aponta para server/src/uploads real.
  assert.ok(!uploadBody.url.includes('..'), 'resposta não deve conter travessia de caminho');
});

test('tipo de documento inválido retorna 400 sem tocar storage (autenticado)', async () => {
  const email = `t0-doc-invalido-${Date.now()}@example.com`;
  const registerRes = await fetch(`${ctx.baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'senha12345', tipoPessoa: 'fisica', tipoPerfil: 'comprador' }),
  });
  assert.strictEqual(registerRes.status, 201);
  const { token } = await registerRes.json();

  const res = await fetch(`${ctx.baseUrl}/api/user/documents/tipo-invalido`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: new FormData(),
  });
  assert.strictEqual(res.status, 400);
  const body = await res.json();
  assert.strictEqual(body.message, 'Tipo de documento inválido.');
});
