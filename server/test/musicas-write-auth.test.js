'use strict';

const assert = require('node:assert/strict');
const { test, before, after } = require('node:test');
const jwt = require('jsonwebtoken');

const { startTestServer } = require('./helpers/test-server');

// PUT/DELETE /api/musicas/:id exigem produtor autenticado (Decisão 3, Fase 2) e,
// quando a faixa tem producerId, exigem que seja o dono (Decisão 2, Fase 3) —
// ver docs/ia-auditorias/R29-pagina-artista-decisoes-fase0.md. Faixa sem
// producerId (legado) preserva o comportamento da Fase 2: qualquer produtor
// autenticado. GET/POST /api/musicas continuam abertos e não são alterados por
// este lote — POST é usado aqui só como fixture.

let ctx;

before(async () => {
  ctx = await startTestServer();
});

after(async () => {
  await ctx.close();
});

async function registerAndLogin(tipoPerfil) {
  const email = `t2-${tipoPerfil}-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;
  const res = await fetch(`${ctx.baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'senha12345', tipoPessoa: 'fisica', tipoPerfil }),
  });
  assert.strictEqual(res.status, 201);
  const { token } = await res.json();
  const { userId } = jwt.decode(token);
  return { token, userId };
}

async function createMusica(producerId) {
  const body = { nome_musica: 'Faixa de teste', nome_produtor: 'Produtor de teste' };
  if (producerId !== undefined) body.producerId = producerId;

  const res = await fetch(`${ctx.baseUrl}/api/musicas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  assert.strictEqual(res.status, 201);
  const musica = await res.json();
  return musica.id;
}

test('PUT /api/musicas/:id sem token retorna 401', async () => {
  const id = await createMusica();
  const res = await fetch(`${ctx.baseUrl}/api/musicas/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, nome_musica: 'Tentativa anônima' }),
  });
  assert.strictEqual(res.status, 401);
});

test('PUT /api/musicas/:id com token de comprador retorna 403', async () => {
  const id = await createMusica();
  const { token } = await registerAndLogin('comprador');
  const res = await fetch(`${ctx.baseUrl}/api/musicas/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ id, nome_musica: 'Tentativa de comprador' }),
  });
  assert.strictEqual(res.status, 403);
});

test('PUT /api/musicas/:id com token de produtor mantém comportamento (200) para faixa sem producerId', async () => {
  const id = await createMusica();
  const { token } = await registerAndLogin('produtor');
  const res = await fetch(`${ctx.baseUrl}/api/musicas/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ id, nome_musica: 'Editado por produtor' }),
  });
  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.strictEqual(body.nome_musica, 'Editado por produtor');
});

test('PUT /api/musicas/:id retorna 404 para id inexistente', async () => {
  const { token } = await registerAndLogin('produtor');
  const res = await fetch(`${ctx.baseUrl}/api/musicas/999999`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ id: 999999, nome_musica: 'Não existe' }),
  });
  assert.strictEqual(res.status, 404);
});

test('PUT /api/musicas/:id: produtor dono edita a própria faixa (200)', async () => {
  const { token, userId } = await registerAndLogin('produtor');
  const id = await createMusica(userId);

  const res = await fetch(`${ctx.baseUrl}/api/musicas/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ id, producerId: userId, nome_musica: 'Editado pelo dono' }),
  });
  assert.strictEqual(res.status, 200);
});

test('PUT /api/musicas/:id: produtor não-dono recebe 403', async () => {
  const { userId: donoId } = await registerAndLogin('produtor');
  const id = await createMusica(donoId);
  const { token: tokenOutroProdutor } = await registerAndLogin('produtor');

  const res = await fetch(`${ctx.baseUrl}/api/musicas/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenOutroProdutor}` },
    body: JSON.stringify({ id, producerId: donoId, nome_musica: 'Tentativa de outro produtor' }),
  });
  assert.strictEqual(res.status, 403);
});

test('DELETE /api/musicas/:id sem token retorna 401', async () => {
  const id = await createMusica();
  const res = await fetch(`${ctx.baseUrl}/api/musicas/${id}`, { method: 'DELETE' });
  assert.strictEqual(res.status, 401);
});

test('DELETE /api/musicas/:id com token de comprador retorna 403', async () => {
  const id = await createMusica();
  const { token } = await registerAndLogin('comprador');
  const res = await fetch(`${ctx.baseUrl}/api/musicas/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  assert.strictEqual(res.status, 403);
});

test('DELETE /api/musicas/:id com token de produtor mantém comportamento (204) para faixa sem producerId', async () => {
  const id = await createMusica();
  const { token } = await registerAndLogin('produtor');
  const res = await fetch(`${ctx.baseUrl}/api/musicas/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  assert.strictEqual(res.status, 204);
});

test('DELETE /api/musicas/:id: produtor dono remove a própria faixa (204)', async () => {
  const { token, userId } = await registerAndLogin('produtor');
  const id = await createMusica(userId);

  const res = await fetch(`${ctx.baseUrl}/api/musicas/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  assert.strictEqual(res.status, 204);
});

test('DELETE /api/musicas/:id: produtor não-dono recebe 403', async () => {
  const { userId: donoId } = await registerAndLogin('produtor');
  const id = await createMusica(donoId);
  const { token: tokenOutroProdutor } = await registerAndLogin('produtor');

  const res = await fetch(`${ctx.baseUrl}/api/musicas/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${tokenOutroProdutor}` },
  });
  assert.strictEqual(res.status, 403);
});

test('GET /api/musicas?producerId= filtra somente as faixas do produtor informado', async () => {
  const { userId } = await registerAndLogin('produtor');
  const idPropria = await createMusica(userId);
  await createMusica(); // faixa de outro dono (sem producerId)

  const res = await fetch(`${ctx.baseUrl}/api/musicas?producerId=${userId}`);
  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.ok(Array.isArray(body));
  assert.ok(body.every((m) => m.producerId === userId));
  assert.ok(body.some((m) => m.id === idPropria));
});
