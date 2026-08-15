'use strict';

const assert = require('node:assert/strict');
const { test, before, after } = require('node:test');
const jwt = require('jsonwebtoken');

const { startTestServer } = require('./helpers/test-server');

// Contrato de perfil artístico público (R29, Decisão 1), desacoplado do perfil
// pessoal/KYC em /api/user/profile.

let ctx;

before(async () => {
  ctx = await startTestServer();
});

after(async () => {
  await ctx.close();
});

async function registerAndLogin(tipoPerfil) {
  const email = `t3-${tipoPerfil}-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;
  const res = await fetch(`${ctx.baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'senha12345', tipoPessoa: 'fisica', tipoPerfil }),
  });
  assert.strictEqual(res.status, 201);
  const { token } = await res.json();
  // A resposta de /api/auth/register não inclui o id (só email/tipoPessoa/tipoPerfil,
  // ver server/src/index.js) — o userId real vem do payload do JWT, mesmo padrão
  // já usado em server/test/auth.test.js.
  const { userId } = jwt.decode(token);
  return { token, userId };
}

test('GET /api/producers/:producerId retorna 404 para produtor inexistente', async () => {
  const res = await fetch(`${ctx.baseUrl}/api/producers/id-que-nao-existe`);
  assert.strictEqual(res.status, 404);
});

test('GET /api/producers/me sem token retorna 401', async () => {
  const res = await fetch(`${ctx.baseUrl}/api/producers/me`);
  assert.strictEqual(res.status, 401);
});

test('GET/PUT /api/producers/me com token de comprador retorna 403', async () => {
  const { token } = await registerAndLogin('comprador');

  const getRes = await fetch(`${ctx.baseUrl}/api/producers/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  assert.strictEqual(getRes.status, 403);

  const putRes = await fetch(`${ctx.baseUrl}/api/producers/me`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ nomeArtistico: 'Tentativa de comprador' }),
  });
  assert.strictEqual(putRes.status, 403);
});

test('produtor edita o próprio perfil artístico e o perfil fica público', async () => {
  const { token, userId } = await registerAndLogin('produtor');

  const putRes = await fetch(`${ctx.baseUrl}/api/producers/me`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ nomeArtistico: 'DJ Teste', biografia: 'Biografia de teste.' }),
  });
  assert.strictEqual(putRes.status, 200);
  const putBody = await putRes.json();
  assert.strictEqual(putBody.producer.nomeArtistico, 'DJ Teste');
  assert.strictEqual(putBody.producer.producerId, userId);

  const meRes = await fetch(`${ctx.baseUrl}/api/producers/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  assert.strictEqual(meRes.status, 200);
  const meBody = await meRes.json();
  assert.strictEqual(meBody.biografia, 'Biografia de teste.');

  const publicRes = await fetch(`${ctx.baseUrl}/api/producers/${userId}`);
  assert.strictEqual(publicRes.status, 200);
  const publicBody = await publicRes.json();
  assert.strictEqual(publicBody.nomeArtistico, 'DJ Teste');
});

test('PUT /api/producers/me ignora producerId enviado no body (identidade sempre do token)', async () => {
  const { token, userId } = await registerAndLogin('produtor');

  const res = await fetch(`${ctx.baseUrl}/api/producers/me`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ producerId: 'id-forjado', nomeArtistico: 'Nome Real' }),
  });
  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.strictEqual(body.producer.producerId, userId, 'producerId deve ser sempre o do token, nunca o do body');

  const forgedRes = await fetch(`${ctx.baseUrl}/api/producers/id-forjado`);
  assert.strictEqual(forgedRes.status, 404, 'nenhum perfil deve ter sido criado sob o id forjado');
});

test('POST /api/producers/me/avatar aceita imagem e atualiza avatarUrl', async () => {
  const { token, userId } = await registerAndLogin('produtor');

  const form = new FormData();
  form.append('file', new Blob([Buffer.from('conteudo-fake-de-imagem')], { type: 'image/png' }), 'avatar.png');

  const res = await fetch(`${ctx.baseUrl}/api/producers/me/avatar`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.match(body.url, new RegExp(`^/uploads/producers/${userId}/avatar/\\d+\\.png$`));

  const meRes = await fetch(`${ctx.baseUrl}/api/producers/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const meBody = await meRes.json();
  assert.strictEqual(meBody.avatarUrl, body.url);
});

test('POST /api/producers/me/avatar rejeita PDF (só aceita imagem, diferente do upload de KYC)', async () => {
  const { token } = await registerAndLogin('produtor');

  const form = new FormData();
  form.append('file', new Blob([Buffer.from('conteudo-fake-pdf')], { type: 'application/pdf' }), 'doc.pdf');

  const res = await fetch(`${ctx.baseUrl}/api/producers/me/avatar`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  assert.strictEqual(res.status, 400);
});
