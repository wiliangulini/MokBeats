'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test, before, after } = require('node:test');

const { startTestServer } = require('./helpers/test-server');

// Persistência real do upload de produtor (R29, Decisão 4), restrita ao modo
// trackNoStems do contrato v2. trackWithStems/effectsFx continuam apenas
// validando e descartando (getStemsForId é hard-coded, fora de escopo).

let ctx;

before(async () => {
  ctx = await startTestServer();
});

after(async () => {
  await ctx.close();
});

function blob(content, type = 'audio/mpeg') {
  return new Blob([Buffer.from(content)], { type });
}

async function registerAndLogin(tipoPerfil) {
  const email = `t5-${tipoPerfil}-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;
  const res = await fetch(`${ctx.baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'senha12345', tipoPessoa: 'fisica', tipoPerfil }),
  });
  assert.strictEqual(res.status, 201);
  const { token } = await res.json();
  const jwt = require('jsonwebtoken');
  const { userId } = jwt.decode(token);
  return { token, userId };
}

function v2Meta(overrides = {}) {
  return {
    artistName: 'Produtor Teste',
    email: 'produtor@example.com',
    countryCode: '+55',
    phone: '11999999999',
    identification: '12345678900',
    trackName: 'Minha Faixa Publicada',
    category: 'Música',
    genre: 'Eletrônica',
    bpm: '128',
    key: 'C',
    termsAccepted: true,
    durations: { track_ms: 180000, loop15_ms: 15000, loop30_ms: 30000, loop60_ms: 60000 },
    ...overrides,
  };
}

function trackNoStemsForm(meta) {
  const form = new FormData();
  form.append('schemaVersion', 'producer_form_v2');
  form.append('mode', 'trackNoStems');
  form.append('meta', JSON.stringify(meta));
  form.append('track', blob('conteudo-fake-de-audio'), 'minha-faixa.mp3');
  form.append('loop15', blob('l15'), 'l15.mp3');
  form.append('loop30', blob('l30'), 'l30.mp3');
  form.append('loop60', blob('l60'), 'l60.mp3');
  return form;
}

test('POST /api/producers/track sem token retorna 401', async () => {
  const res = await fetch(`${ctx.baseUrl}/api/producers/track`, {
    method: 'POST',
    body: trackNoStemsForm(v2Meta()),
  });
  assert.strictEqual(res.status, 401);
});

test('POST /api/producers/track com token de comprador retorna 403', async () => {
  const { token } = await registerAndLogin('comprador');
  const res = await fetch(`${ctx.baseUrl}/api/producers/track`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: trackNoStemsForm(v2Meta()),
  });
  assert.strictEqual(res.status, 403);
});

test('trackNoStems com produtor autenticado: 201, persiste em MUSICAS com producerId, arquivo existe em disco', async () => {
  const { token, userId } = await registerAndLogin('produtor');

  const res = await fetch(`${ctx.baseUrl}/api/producers/track`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: trackNoStemsForm(v2Meta()),
  });
  assert.strictEqual(res.status, 201);
  const body = await res.json();
  assert.strictEqual(body.message, 'Faixa publicada com sucesso.');
  assert.strictEqual(body.musica.producerId, userId);
  assert.strictEqual(body.musica.nome_musica, 'Minha Faixa Publicada');
  assert.strictEqual(body.musica.nome_produtor, 'Produtor Teste');
  assert.strictEqual(body.musica.bpm, 128);
  assert.strictEqual(body.musica.duracao, 180000);
  assert.strictEqual(body.musica.duracaoReal, 180);

  // Aparece no catálogo filtrado por producerId (usado por "minhas faixas").
  const listRes = await fetch(`${ctx.baseUrl}/api/musicas?producerId=${userId}`);
  const lista = await listRes.json();
  assert.ok(lista.some((m) => m.id === body.musica.id), 'faixa publicada deve aparecer em GET /api/musicas?producerId=');

  // Arquivo persistido de verdade (fora do diretório temporário de upload).
  const relativePath = body.musica.url.replace(/^\/uploads\/tracks\//, '');
  const absolutePath = path.join(ctx.producerTrackPersistDir, relativePath);
  assert.ok(fs.existsSync(absolutePath), 'arquivo da faixa deve existir no diretório de persistência');

  // Servido publicamente pela rota estática.
  const fileRes = await fetch(`${ctx.baseUrl}${body.musica.url}`);
  assert.strictEqual(fileRes.status, 200);
});

test('trackWithStems continua sem persistir (200, sem criar entrada em MUSICAS)', async () => {
  const { token, userId } = await registerAndLogin('produtor');

  const meta = v2Meta({
    durations: {
      track_ms: 180000, loop15_ms: 15000, loop30_ms: 30000, loop60_ms: 60000,
      stem_melody_ms: 180000, stem_harmony_ms: 180000, stem_drums_ms: 180000, stem_fx_ms: 180000,
    },
  });
  const form = new FormData();
  form.append('schemaVersion', 'producer_form_v2');
  form.append('mode', 'trackWithStems');
  form.append('meta', JSON.stringify(meta));
  form.append('track', blob('track'), 'track.mp3');
  form.append('stem_melody', blob('sm'), 'sm.mp3');
  form.append('stem_harmony', blob('sh'), 'sh.mp3');
  form.append('stem_drums', blob('sd'), 'sd.mp3');
  form.append('stem_fx', blob('sf'), 'sf.mp3');
  form.append('loop15', blob('l15'), 'l15.mp3');
  form.append('loop30', blob('l30'), 'l30.mp3');
  form.append('loop60', blob('l60'), 'l60.mp3');

  const res = await fetch(`${ctx.baseUrl}/api/producers/track`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  assert.strictEqual(res.status, 200, 'trackWithStems preserva o comportamento atual (não persiste)');

  const listRes = await fetch(`${ctx.baseUrl}/api/musicas?producerId=${userId}`);
  const lista = await listRes.json();
  assert.strictEqual(lista.length, 0, 'nenhuma entrada deve ter sido criada para trackWithStems');
});

test('effectsFx continua sem persistir (200, sem criar entrada em MUSICAS)', async () => {
  const { token, userId } = await registerAndLogin('produtor');

  const meta = v2Meta({
    durations: {
      track_ms: 180000, loop15_ms: 15000, loop30_ms: 30000, loop60_ms: 60000,
      effect1_ms: 180000, effect2_ms: 180000, effect3_ms: 180000, effect4_ms: 180000, effect5_ms: 180000, effect6_ms: 180000,
    },
  });
  const form = new FormData();
  form.append('schemaVersion', 'producer_form_v2');
  form.append('mode', 'effectsFx');
  form.append('meta', JSON.stringify(meta));
  form.append('track', blob('track'), 'track.mp3');
  for (const n of [1, 2, 3, 4, 5, 6]) form.append(`effect${n}`, blob(`e${n}`), `e${n}.mp3`);
  form.append('loop15', blob('l15'), 'l15.mp3');
  form.append('loop30', blob('l30'), 'l30.mp3');
  form.append('loop60', blob('l60'), 'l60.mp3');

  const res = await fetch(`${ctx.baseUrl}/api/producers/track`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  assert.strictEqual(res.status, 200, 'effectsFx preserva o comportamento atual (não persiste)');

  const listRes = await fetch(`${ctx.baseUrl}/api/musicas?producerId=${userId}`);
  const lista = await listRes.json();
  assert.strictEqual(lista.length, 0, 'nenhuma entrada deve ter sido criada para effectsFx');
});

test('ramo legado (sem schemaVersion) continua sem persistir, mesmo autenticado', async () => {
  const { token, userId } = await registerAndLogin('produtor');

  const form = new FormData();
  form.append('mode', 'trackNoStems');
  form.append('meta', JSON.stringify({ isrc: 'ABCDEFGH1234', upc: '123456789012' }));
  form.append('track', blob('track'), 'track.mp3');
  form.append('loop15', blob('l15'), 'l15.mp3');
  form.append('loop30', blob('l30'), 'l30.mp3');
  form.append('loop60', blob('l60'), 'l60.mp3');

  const res = await fetch(`${ctx.baseUrl}/api/producers/track`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  assert.strictEqual(res.status, 200, 'ramo legado preserva o comportamento atual (não persiste)');

  const listRes = await fetch(`${ctx.baseUrl}/api/musicas?producerId=${userId}`);
  const lista = await listRes.json();
  assert.strictEqual(lista.length, 0, 'ramo legado não deve criar entrada em MUSICAS');
});
