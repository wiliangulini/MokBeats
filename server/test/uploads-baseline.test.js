'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const { test, before, after } = require('node:test');

const { startTestServer } = require('./helpers/test-server');

// Baseline read-only do comportamento ATUAL de /api/uploads/ e /api/producers/track,
// ainda usando connect-multiparty (antes de U2a/U2b/U2c). Serial (--test-concurrency=1).

let ctx;

before(async () => {
  ctx = await startTestServer();
});

after(async () => {
  await ctx.close();
});

test('POST /api/uploads/ (legado, sem auth) aceita multipart, sanitiza e não persiste em disco (U2a)', async () => {
  const conteudo = 'conteudo-fake-de-upload-legado';
  const form = new FormData();
  form.append('file', new Blob([Buffer.from(conteudo)], { type: 'application/octet-stream' }), 'arquivo.bin');

  const res = await fetch(`${ctx.baseUrl}/api/uploads/`, {
    method: 'POST',
    body: form,
  });

  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.deepStrictEqual(Object.keys(body), ['message']);
  assert.deepStrictEqual(Object.keys(body.message), ['file']);
  assert.deepStrictEqual(body.message.file, {
    fieldName: 'file',
    originalFilename: 'arquivo.bin',
    mimetype: 'application/octet-stream',
    size: Buffer.byteLength(conteudo),
  });

  // U2a: rota deixou de persistir em disco — nunca grava na raiz legada do
  // connect-multiparty (usada só por /api/producers/track) nem acumula
  // conteúdo em sua própria raiz temporária dedicada (limpa a cada requisição).
  assert.deepStrictEqual(fs.readdirSync(ctx.legacyUploadDir), []);
  assert.deepStrictEqual(fs.readdirSync(ctx.legacyApiUploadDir), []);
});

test('POST /api/producers/track — contrato producer_form_v2, modo trackNoStems', async () => {
  const metaV2 = {
    artistName: 'Produtor Teste T0',
    email: 'produtor.t0@example.com',
    countryCode: '+55',
    phone: '11999999999',
    identification: '12345678900',
    trackName: 'Faixa de Teste T0',
    category: 'Música',
    genre: 'Eletrônica',
    bpm: '120',
    key: 'C',
    termsAccepted: true,
    durations: {
      track_ms: 180000,
      loop15_ms: 15000,
      loop30_ms: 30000,
      loop60_ms: 60000,
    },
  };

  const form = new FormData();
  form.append('schemaVersion', 'producer_form_v2');
  form.append('mode', 'trackNoStems');
  form.append('meta', JSON.stringify(metaV2));
  form.append('track', new Blob([Buffer.from('fake-track-audio')], { type: 'audio/mpeg' }), 'track.mp3');
  form.append('loop15', new Blob([Buffer.from('fake-loop15')], { type: 'audio/mpeg' }), 'loop15.mp3');
  form.append('loop30', new Blob([Buffer.from('fake-loop30')], { type: 'audio/mpeg' }), 'loop30.mp3');
  form.append('loop60', new Blob([Buffer.from('fake-loop60')], { type: 'audio/mpeg' }), 'loop60.mp3');

  const res = await fetch(`${ctx.baseUrl}/api/producers/track`, {
    method: 'POST',
    body: form,
  });

  assert.strictEqual(res.status, 200, `esperado 200; corpo: ${await res.clone().text()}`);
  const body = await res.json();
  assert.strictEqual(body.schemaVersion, 'producer_form_v2');
  assert.strictEqual(body.mode, 'trackNoStems');
  assert.strictEqual(body.hasImage, false);
  assert.deepStrictEqual(
    [...body.files].sort(),
    ['loop15', 'loop30', 'loop60', 'track'].sort()
  );
});

test('POST /api/producers/track — ramo legado (sem schemaVersion), modo trackNoStems', async () => {
  const metaLegacy = {
    isrc: 'ABCDEFGH1234',
    upc: '123456789012',
  };

  const form = new FormData();
  form.append('mode', 'trackNoStems');
  form.append('meta', JSON.stringify(metaLegacy));
  form.append('track', new Blob([Buffer.from('fake-track-audio-legacy')], { type: 'audio/mpeg' }), 'track.mp3');
  form.append('loop15', new Blob([Buffer.from('fake-loop15-legacy')], { type: 'audio/mpeg' }), 'loop15.mp3');
  form.append('loop30', new Blob([Buffer.from('fake-loop30-legacy')], { type: 'audio/mpeg' }), 'loop30.mp3');
  form.append('loop60', new Blob([Buffer.from('fake-loop60-legacy')], { type: 'audio/mpeg' }), 'loop60.mp3');

  const res = await fetch(`${ctx.baseUrl}/api/producers/track`, {
    method: 'POST',
    body: form,
  });

  assert.strictEqual(res.status, 200, `esperado 200; corpo: ${await res.clone().text()}`);
  const body = await res.json();
  assert.strictEqual(body.message, 'Upload validado e recebido com sucesso.');
  assert.deepStrictEqual(
    [...body.files].sort(),
    ['loop15', 'loop30', 'loop60', 'track'].sort()
  );
});

test('POST /api/producers/track — legado sem track retorna 422 (contrato preservado)', async () => {
  const form = new FormData();
  form.append('mode', 'trackNoStems');
  form.append('meta', JSON.stringify({ isrc: 'ABCDEFGH1234', upc: '123456789012' }));

  const res = await fetch(`${ctx.baseUrl}/api/producers/track`, {
    method: 'POST',
    body: form,
  });

  assert.strictEqual(res.status, 422);
  const body = await res.json();
  assert.strictEqual(body.message, 'É obrigatório enviar uma música completa (track).');
});
