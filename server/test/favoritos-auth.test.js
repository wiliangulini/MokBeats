'use strict';

const assert = require('node:assert/strict');
const { test, before, after } = require('node:test');

const { startTestServer } = require('./helpers/test-server');

// /api/favoritos* passam a exigir autenticação e escopo por usuário (R29,
// achado Alto: array global sem userId, sem auth). Testa comprador (curtidas
// são para quem navega/compra, não exclusivo de produtor) para não exigir
// perfil específico além de estar logado.

let ctx;

before(async () => {
  ctx = await startTestServer();
});

after(async () => {
  await ctx.close();
});

async function registerAndLogin() {
  const email = `t4-fav-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;
  const res = await fetch(`${ctx.baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'senha12345', tipoPessoa: 'fisica', tipoPerfil: 'comprador' }),
  });
  assert.strictEqual(res.status, 201);
  const { token } = await res.json();
  return token;
}

test('GET /api/favoritos sem token retorna 401', async () => {
  const res = await fetch(`${ctx.baseUrl}/api/favoritos`);
  assert.strictEqual(res.status, 401);
});

test('POST /api/favoritos sem token retorna 401', async () => {
  const res = await fetch(`${ctx.baseUrl}/api/favoritos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome_musica: 'X' }),
  });
  assert.strictEqual(res.status, 401);
});

test('usuário só vê as próprias curtidas em GET /api/favoritos', async () => {
  const tokenA = await registerAndLogin();
  const tokenB = await registerAndLogin();

  const postA = await fetch(`${ctx.baseUrl}/api/favoritos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenA}` },
    body: JSON.stringify({ nome_musica: 'Faixa de A' }),
  });
  assert.strictEqual(postA.status, 201);
  const favoritoA = await postA.json();
  assert.strictEqual(typeof favoritoA.userId, 'string', 'POST deve preencher userId a partir do token, não do body');

  const getA = await fetch(`${ctx.baseUrl}/api/favoritos`, { headers: { Authorization: `Bearer ${tokenA}` } });
  const listaA = await getA.json();
  assert.ok(listaA.some((f) => f.id === favoritoA.id));

  const getB = await fetch(`${ctx.baseUrl}/api/favoritos`, { headers: { Authorization: `Bearer ${tokenB}` } });
  const listaB = await getB.json();
  assert.ok(!listaB.some((f) => f.id === favoritoA.id), 'usuário B não deve ver curtida de A');
});

test('DELETE /api/favoritos/:id: usuário não pode remover curtida de outro (403)', async () => {
  const tokenA = await registerAndLogin();
  const tokenB = await registerAndLogin();

  const postA = await fetch(`${ctx.baseUrl}/api/favoritos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenA}` },
    body: JSON.stringify({ nome_musica: 'Faixa de A' }),
  });
  const favoritoA = await postA.json();

  const delB = await fetch(`${ctx.baseUrl}/api/favoritos/${favoritoA.id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${tokenB}` },
  });
  assert.strictEqual(delB.status, 403);

  const delA = await fetch(`${ctx.baseUrl}/api/favoritos/${favoritoA.id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${tokenA}` },
  });
  assert.strictEqual(delA.status, 204);
});

test('PUT /api/favoritos/:id: usuário não pode alterar curtida de outro (403); dono consegue', async () => {
  const tokenA = await registerAndLogin();
  const tokenB = await registerAndLogin();

  const postA = await fetch(`${ctx.baseUrl}/api/favoritos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenA}` },
    body: JSON.stringify({ nome_musica: 'Faixa de A' }),
  });
  const favoritoA = await postA.json();

  const putB = await fetch(`${ctx.baseUrl}/api/favoritos/${favoritoA.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenB}` },
    body: JSON.stringify({ nome_musica: 'Tentativa de B' }),
  });
  assert.strictEqual(putB.status, 403);

  const putA = await fetch(`${ctx.baseUrl}/api/favoritos/${favoritoA.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenA}` },
    body: JSON.stringify({ nome_musica: 'Editado por A' }),
  });
  assert.strictEqual(putA.status, 200);
  const body = await putA.json();
  assert.strictEqual(body.nome_musica, 'Editado por A');
  assert.strictEqual(typeof body.userId, 'string', 'PUT deve preservar/forçar userId do dono, não aceitar do body');
});
