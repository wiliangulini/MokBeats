'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const { test, before, after } = require('node:test');

const { startTestServer } = require('./helpers/test-server');

// Lote U2b: POST /api/producers/track migrado de connect-multiparty para Multer
// 2.2.0 route-local (producerTrackUpload.fields()), preservando integralmente os
// contratos v2 e legado. Serial (--test-concurrency=1).
//
// As seções 1-3 (sucessos v2, sucessos legado, matriz 422) foram escritas e
// executadas PRIMEIRO como caracterização do comportamento sob connect-multiparty
// (ainda válidas e verdes após a migração, provando que o contrato funcional não
// mudou). As seções 4-5 (parser/limites, cleanup/robustez) testam
// especificamente o comportamento do parser Multer route-local e só existem
// após a migração.
//
// limits.parts = 15 (não 14): confirmado em
// server/node_modules/busboy/lib/types/multipart.js (~linha 548) que o contador
// de "parts" incrementa uma vez por boundary de abertura de cada parte real MAIS
// uma vez no boundary de fechamento do corpo — logo N partes lógicas geram N+1
// incrementos, e o limite dispara quando parts === partsLimit. O payload máximo
// legítimo desta rota contém 11 arquivos (track+image+loop15+loop30+loop60+
// effect1..effect6) e 3 campos textuais (schemaVersion+mode+meta) = 14 partes
// lógicas, logo parts:15. Revalidado com teste de fronteira isolado antes da
// implementação: parts:14 rejeita esse payload com LIMIT_PART_COUNT; parts:15
// aceita. Consistente com as descobertas da U1 (parts:2 para N=1) e da U2a
// (parts:21 para N=20).

// POST /api/producers/track passou a exigir produtor autenticado (R29,
// Decisão 4 — pré-requisito da persistência real). Registra um produtor uma
// única vez em before() e injeta o token em todo request desta suíte.
let ctx;
let producerToken;

before(async () => {
  ctx = await startTestServer();

  const email = `u2b-producer-${Date.now()}@example.com`;
  const registerRes = await fetch(`${ctx.baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'senha12345', tipoPessoa: 'fisica', tipoPerfil: 'produtor' }),
  });
  const registerBody = await registerRes.json();
  producerToken = registerBody.token;
});

after(async () => {
  await ctx.close();
});

function blob(content, type = 'audio/mpeg') {
  return new Blob([Buffer.from(content)], { type });
}

async function postTrack(form, extraOptions = {}) {
  return fetch(`${ctx.baseUrl}/api/producers/track`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${producerToken}` },
    body: form,
    ...extraOptions,
  });
}

function dirEntries() {
  return fs.readdirSync(ctx.producerTrackUploadDir, { recursive: true });
}

async function waitUntilEmpty({ timeoutMs = 2000, intervalMs = 25 } = {}) {
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    const entries = dirEntries();
    if (entries.length === 0) return;
    if (Date.now() >= deadline) {
      assert.fail(`diretório temporário não ficou vazio a tempo; restantes: ${JSON.stringify(entries)}`);
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
}

// ─── Helpers de meta (v2 e legado) ─────────────────────────────────────────

function v2MetaFor(mode, overrides = {}) {
  const { durations: durationsOverride, ...restOverrides } = overrides;
  const meta = {
    artistName: 'Produtor Teste',
    email: 'produtor@example.com',
    countryCode: '+55',
    phone: '11999999999',
    identification: '12345678900',
    trackName: 'Faixa Teste',
    category: 'Música',
    genre: 'Eletrônica',
    bpm: '120',
    key: 'C',
    termsAccepted: true,
    ...restOverrides,
  };
  const durations = { track_ms: 180000, loop15_ms: 15000, loop30_ms: 30000, loop60_ms: 60000 };
  if (mode === 'trackWithStems') {
    durations.stem_melody_ms = 180000;
    durations.stem_harmony_ms = 180000;
    durations.stem_drums_ms = 180000;
    durations.stem_fx_ms = 180000;
  }
  if (mode === 'effectsFx') {
    durations.effect1_ms = 180000;
    durations.effect2_ms = 180000;
    durations.effect3_ms = 180000;
    durations.effect4_ms = 180000;
    durations.effect5_ms = 180000;
    durations.effect6_ms = 180000;
  }
  meta.durations = { ...durations, ...(durationsOverride || {}) };
  return meta;
}

function legacyMetaFor(overrides = {}) {
  const { durations, ...rest } = overrides;
  const meta = { isrc: 'ABCDEFGH1234', upc: '123456789012', ...rest };
  if (durations !== undefined) meta.durations = durations;
  return meta;
}

function appendV2Form({ mode, meta, files }) {
  const form = new FormData();
  form.append('schemaVersion', 'producer_form_v2');
  form.append('mode', mode);
  form.append('meta', JSON.stringify(meta));
  for (const [field, filename] of Object.entries(files)) {
    form.append(field, blob(`${field}-conteudo`), filename || `${field}.mp3`);
  }
  return form;
}

function appendLegacyForm({ mode, meta, files }) {
  const form = new FormData();
  if (mode !== undefined) form.append('mode', mode);
  if (meta !== undefined) form.append('meta', JSON.stringify(meta));
  for (const [field, filename] of Object.entries(files)) {
    form.append(field, blob(`${field}-conteudo`), filename || `${field}.mp3`);
  }
  return form;
}

async function assertStatus(res, expected) {
  assert.strictEqual(res.status, expected, `esperado ${expected}; corpo: ${await res.clone().text()}`);
}

// ═══════════════════════════════════════════════════════════════════════
// 1. Sucessos V2
// ═══════════════════════════════════════════════════════════════════════

test('V2 sucesso: trackNoStems sem image, apenas track+loops, MIME octet-stream aceito', async () => {
  const form = new FormData();
  form.append('schemaVersion', 'producer_form_v2');
  form.append('mode', 'trackNoStems');
  form.append('meta', JSON.stringify(v2MetaFor('trackNoStems')));
  form.append('track', blob('track-conteudo', 'application/octet-stream'), 'track.bin');
  form.append('loop15', blob('loop15-conteudo'), 'loop15.mp3');
  form.append('loop30', blob('loop30-conteudo'), 'loop30.mp3');
  form.append('loop60', blob('loop60-conteudo'), 'loop60.mp3');

  // trackNoStems v2 agora persiste de verdade (R29, Decisão 4) — 201 com a
  // faixa criada, não mais 200 com o eco de validação. Ver
  // server/test/producer-track-persist.test.js para a cobertura completa da
  // persistência; aqui só confirma-se que ESTE cenário específico (MIME
  // octet-stream, sem image) permanece funcionando ponta a ponta.
  const res = await postTrack(form);
  await assertStatus(res, 201);
  const body = await res.json();
  assert.strictEqual(body.message, 'Faixa publicada com sucesso.');
  assert.strictEqual(body.musica.nome_musica, 'Faixa Teste');
  assert.strictEqual(body.musica.nome_produtor, 'Produtor Teste');
  assert.match(body.musica.url, /^\/uploads\/tracks\/.+\/track\.bin$/);
});

test('V2 sucesso: trackWithStems com 4 stems nomeados, durações dentro da tolerância', async () => {
  const form = appendV2Form({
    mode: 'trackWithStems',
    meta: v2MetaFor('trackWithStems'),
    files: { track: 'track.mp3', stem_melody: 'sm.mp3', stem_harmony: 'sh.mp3', stem_drums: 'sd.mp3', stem_fx: 'sf.mp3', loop15: 'l15.mp3', loop30: 'l30.mp3', loop60: 'l60.mp3' },
  });

  const res = await postTrack(form);
  await assertStatus(res, 200);
  const body = await res.json();
  assert.strictEqual(body.mode, 'trackWithStems');
  assert.deepStrictEqual(
    [...body.files].sort(),
    ['track', 'stem_melody', 'stem_harmony', 'stem_drums', 'stem_fx', 'loop15', 'loop30', 'loop60'].sort()
  );
});

test('V2 sucesso: effectsFx com 6 efeitos obrigatórios, sem stems nomeados', async () => {
  const form = appendV2Form({
    mode: 'effectsFx',
    meta: v2MetaFor('effectsFx'),
    files: {
      track: 'track.mp3',
      effect1: 'e1.mp3', effect2: 'e2.mp3', effect3: 'e3.mp3', effect4: 'e4.mp3', effect5: 'e5.mp3', effect6: 'e6.mp3',
      loop15: 'l15.mp3', loop30: 'l30.mp3', loop60: 'l60.mp3',
    },
  });

  const res = await postTrack(form);
  await assertStatus(res, 200);
  const body = await res.json();
  assert.strictEqual(body.mode, 'effectsFx');
  assert.deepStrictEqual(
    [...body.files].sort(),
    ['track', 'effect1', 'effect2', 'effect3', 'effect4', 'effect5', 'effect6', 'loop15', 'loop30', 'loop60'].sort()
  );
});

test('V2 sucesso: payload máximo effectsFx + image — 11 arquivos + 3 campos, hasImage true, ordem de chaves preservada', async () => {
  const fieldOrder = ['track', 'image', 'loop15', 'loop30', 'loop60', 'effect1', 'effect2', 'effect3', 'effect4', 'effect5', 'effect6'];
  const form = new FormData();
  form.append('schemaVersion', 'producer_form_v2');
  form.append('mode', 'effectsFx');
  form.append('meta', JSON.stringify(v2MetaFor('effectsFx')));
  for (const field of fieldOrder) {
    form.append(field, blob(`${field}-conteudo`), `${field}.mp3`);
  }

  const res = await postTrack(form);
  await assertStatus(res, 200);
  const body = await res.json();
  assert.strictEqual(body.hasImage, true);
  assert.deepStrictEqual(body.files, fieldOrder, 'Object.keys(files) deve preservar a ordem de encontro das partes');

  // 11 arquivos + 3 campos = 14 partes lógicas: comprova empiricamente que
  // parts:15 admite esse payload (ver justificativa no cabeçalho do arquivo).
  assert.deepStrictEqual(dirEntries(), [], 'diretório temporário exclusivo da U2b deve terminar vazio');
});

// ═══════════════════════════════════════════════════════════════════════
// 2. Sucessos legados
// ═══════════════════════════════════════════════════════════════════════

test('Legado sucesso: trackNoStems', async () => {
  const form = appendLegacyForm({
    mode: 'trackNoStems',
    meta: legacyMetaFor(),
    files: { track: 'track.mp3', loop15: 'l15.mp3', loop30: 'l30.mp3', loop60: 'l60.mp3' },
  });

  const res = await postTrack(form);
  await assertStatus(res, 200);
  const body = await res.json();
  assert.strictEqual(body.message, 'Upload validado e recebido com sucesso.');
  assert.deepStrictEqual([...body.files].sort(), ['track', 'loop15', 'loop30', 'loop60'].sort());
});

test('Legado sucesso: trackWithStems com 1 stem', async () => {
  const form = new FormData();
  form.append('mode', 'trackWithStems');
  form.append('meta', JSON.stringify(legacyMetaFor()));
  form.append('track', blob('track-conteudo'), 'track.mp3');
  form.append('stem', blob('stem-unico'), 'stem1.mp3');
  form.append('loop15', blob('l15'), 'l15.mp3');
  form.append('loop30', blob('l30'), 'l30.mp3');
  form.append('loop60', blob('l60'), 'l60.mp3');

  const res = await postTrack(form);
  await assertStatus(res, 200);
  const body = await res.json();
  assert.deepStrictEqual([...body.files].sort(), ['track', 'stem', 'loop15', 'loop30', 'loop60'].sort());
});

test('Legado sucesso: trackWithStems com 4 stems — stem permanece array após normalização', async () => {
  const form = new FormData();
  form.append('mode', 'trackWithStems');
  form.append('meta', JSON.stringify(legacyMetaFor()));
  form.append('track', blob('track-conteudo'), 'track.mp3');
  form.append('stem', blob('stem-1'), 's1.mp3');
  form.append('stem', blob('stem-2'), 's2.mp3');
  form.append('stem', blob('stem-3'), 's3.mp3');
  form.append('stem', blob('stem-4'), 's4.mp3');
  form.append('loop15', blob('l15'), 'l15.mp3');
  form.append('loop30', blob('l30'), 'l30.mp3');
  form.append('loop60', blob('l60'), 'l60.mp3');

  const res = await postTrack(form);
  await assertStatus(res, 200);
  const body = await res.json();
  assert.deepStrictEqual([...body.files].sort(), ['track', 'stem', 'loop15', 'loop30', 'loop60'].sort());
});

// ═══════════════════════════════════════════════════════════════════════
// 3. Validações funcionais 422 (matriz de caracterização)
// ═══════════════════════════════════════════════════════════════════════

test('V2 422: modo inválido', async () => {
  const form = appendV2Form({ mode: 'modoQualquer', meta: v2MetaFor('trackNoStems'), files: { track: 'track.mp3', loop15: 'l.mp3', loop30: 'l.mp3', loop60: 'l.mp3' } });
  const res = await postTrack(form);
  await assertStatus(res, 422);
  assert.deepStrictEqual(await res.json(), { message: 'Modo inválido. Use trackNoStems, trackWithStems ou effectsFx.' });
});

test('V2 422: track ausente', async () => {
  const form = appendV2Form({ mode: 'trackNoStems', meta: v2MetaFor('trackNoStems'), files: { loop15: 'l.mp3', loop30: 'l.mp3', loop60: 'l.mp3' } });
  const res = await postTrack(form);
  await assertStatus(res, 422);
  assert.deepStrictEqual(await res.json(), { message: 'É obrigatório enviar o arquivo Single Track.' });
});

test('V2 422: trackNoStems não permite stems/efeitos extras', async () => {
  const form = appendV2Form({
    mode: 'trackNoStems',
    meta: v2MetaFor('trackNoStems'),
    files: { track: 'track.mp3', loop15: 'l.mp3', loop30: 'l.mp3', loop60: 'l.mp3', effect1: 'e1.mp3' },
  });
  const res = await postTrack(form);
  await assertStatus(res, 422);
  assert.deepStrictEqual(await res.json(), { message: 'Modo Single track não permite stems ou efeitos extras.' });
});

test('V2 422: trackWithStems exige os 4 stems nomeados', async () => {
  const form = appendV2Form({
    mode: 'trackWithStems',
    meta: v2MetaFor('trackWithStems'),
    files: { track: 'track.mp3', stem_melody: 'sm.mp3', loop15: 'l.mp3', loop30: 'l.mp3', loop60: 'l.mp3' },
  });
  const res = await postTrack(form);
  await assertStatus(res, 422);
  assert.deepStrictEqual(await res.json(), { message: 'No modo Single track + Stems, envie Melodias, Harmonias, Ritmos e Efeitos.' });
});

test('V2 422: trackWithStems não permite effect1..effect6', async () => {
  const form = appendV2Form({
    mode: 'trackWithStems',
    meta: v2MetaFor('trackWithStems'),
    files: { track: 'track.mp3', stem_melody: 'sm.mp3', stem_harmony: 'sh.mp3', stem_drums: 'sd.mp3', stem_fx: 'sf.mp3', loop15: 'l.mp3', loop30: 'l.mp3', loop60: 'l.mp3', effect1: 'e1.mp3' },
  });
  const res = await postTrack(form);
  await assertStatus(res, 422);
  assert.deepStrictEqual(await res.json(), { message: 'No modo Single track + Stems, não envie os campos effect1..effect6.' });
});

test('V2 422: effectsFx não permite stem_melody/harmony/drums/fx', async () => {
  const form = appendV2Form({
    mode: 'effectsFx',
    meta: v2MetaFor('effectsFx'),
    files: {
      track: 'track.mp3', stem_melody: 'sm.mp3',
      effect1: 'e1.mp3', effect2: 'e2.mp3', effect3: 'e3.mp3', effect4: 'e4.mp3', effect5: 'e5.mp3', effect6: 'e6.mp3',
      loop15: 'l.mp3', loop30: 'l.mp3', loop60: 'l.mp3',
    },
  });
  const res = await postTrack(form);
  await assertStatus(res, 422);
  assert.deepStrictEqual(await res.json(), { message: 'No modo Efeitos (FX), não envie stem_melody/stem_harmony/stem_drums/stem_fx.' });
});

test('V2 422: effectsFx exige todos os 6 efeitos', async () => {
  const form = appendV2Form({
    mode: 'effectsFx',
    meta: v2MetaFor('effectsFx'),
    files: { track: 'track.mp3', effect1: 'e1.mp3', effect2: 'e2.mp3', loop15: 'l.mp3', loop30: 'l.mp3', loop60: 'l.mp3' },
  });
  const res = await postTrack(form);
  await assertStatus(res, 422);
  assert.deepStrictEqual(await res.json(), { message: 'No modo Efeitos (FX), envie todos os arquivos effect1..effect6.' });
});

const requiredMetaFields = ['artistName', 'email', 'countryCode', 'phone', 'identification', 'trackName', 'category', 'genre', 'bpm', 'key'];
for (const field of requiredMetaFields) {
  test(`V2 422: campo obrigatório de meta ausente — ${field}`, async () => {
    const meta = v2MetaFor('trackNoStems');
    delete meta[field];
    const form = appendV2Form({ mode: 'trackNoStems', meta, files: { track: 'track.mp3', loop15: 'l.mp3', loop30: 'l.mp3', loop60: 'l.mp3' } });
    const res = await postTrack(form);
    await assertStatus(res, 422);
    assert.deepStrictEqual(await res.json(), { message: `Campo obrigatório ausente no meta: ${field}.` });
  });
}

test('V2 422: termos não aceitos', async () => {
  const meta = v2MetaFor('trackNoStems', { termsAccepted: false });
  const form = appendV2Form({ mode: 'trackNoStems', meta, files: { track: 'track.mp3', loop15: 'l.mp3', loop30: 'l.mp3', loop60: 'l.mp3' } });
  const res = await postTrack(form);
  await assertStatus(res, 422);
  assert.deepStrictEqual(await res.json(), { message: 'É obrigatório aceitar os termos e condições.' });
});

test('V2 422: email inválido', async () => {
  const meta = v2MetaFor('trackNoStems', { email: 'nao-e-um-email' });
  const form = appendV2Form({ mode: 'trackNoStems', meta, files: { track: 'track.mp3', loop15: 'l.mp3', loop30: 'l.mp3', loop60: 'l.mp3' } });
  const res = await postTrack(form);
  await assertStatus(res, 422);
  assert.deepStrictEqual(await res.json(), { message: 'Email inválido.' });
});

test('V2 422: BPM inválido', async () => {
  const meta = v2MetaFor('trackNoStems', { bpm: '9999' });
  const form = appendV2Form({ mode: 'trackNoStems', meta, files: { track: 'track.mp3', loop15: 'l.mp3', loop30: 'l.mp3', loop60: 'l.mp3' } });
  const res = await postTrack(form);
  await assertStatus(res, 422);
  assert.deepStrictEqual(await res.json(), { message: 'BPM inválido. Deve estar entre 1 e 300.' });
});

test('V2 422: link externo inválido', async () => {
  const meta = v2MetaFor('trackNoStems', { externalLink: 'nao-e-uma-url' });
  const form = appendV2Form({ mode: 'trackNoStems', meta, files: { track: 'track.mp3', loop15: 'l.mp3', loop30: 'l.mp3', loop60: 'l.mp3' } });
  const res = await postTrack(form);
  await assertStatus(res, 422);
  assert.deepStrictEqual(await res.json(), { message: 'Link externo inválido. Use http:// ou https://.' });
});

test('V2 422: ISRC inválido', async () => {
  const meta = v2MetaFor('trackNoStems', { registryType: 'ISRC', isrc: '123' });
  const form = appendV2Form({ mode: 'trackNoStems', meta, files: { track: 'track.mp3', loop15: 'l.mp3', loop30: 'l.mp3', loop60: 'l.mp3' } });
  const res = await postTrack(form);
  await assertStatus(res, 422);
  assert.deepStrictEqual(await res.json(), { message: 'ISRC inválido. Deve conter 12 caracteres alfanuméricos.' });
});

test('V2 422: UPC inválido', async () => {
  const meta = v2MetaFor('trackNoStems', { registryType: 'UPC', upc: '123' });
  const form = appendV2Form({ mode: 'trackNoStems', meta, files: { track: 'track.mp3', loop15: 'l.mp3', loop30: 'l.mp3', loop60: 'l.mp3' } });
  const res = await postTrack(form);
  await assertStatus(res, 422);
  assert.deepStrictEqual(await res.json(), { message: 'UPC inválido. Deve conter 12 dígitos (UPC-A) ou 6 dígitos (UPC-E).' });
});

test('V2 422: HASH inválido para o tipo selecionado', async () => {
  const meta = v2MetaFor('trackNoStems', { registryType: 'HASH', hashType: 'MD5', registryValue: 'zz' });
  const form = appendV2Form({ mode: 'trackNoStems', meta, files: { track: 'track.mp3', loop15: 'l.mp3', loop30: 'l.mp3', loop60: 'l.mp3' } });
  const res = await postTrack(form);
  await assertStatus(res, 422);
  assert.deepStrictEqual(await res.json(), { message: 'HASH inválido para o tipo selecionado.' });
});

test('V2 422: registro OUTROS inválido (menos de 3 caracteres)', async () => {
  const meta = v2MetaFor('trackNoStems', { registryType: 'OUTROS', registryValue: 'ab' });
  const form = appendV2Form({ mode: 'trackNoStems', meta, files: { track: 'track.mp3', loop15: 'l.mp3', loop30: 'l.mp3', loop60: 'l.mp3' } });
  const res = await postTrack(form);
  await assertStatus(res, 422);
  assert.deepStrictEqual(await res.json(), { message: 'Registro inválido. Informe ao menos 3 caracteres para OUTROS.' });
});

test('V2 422: tipo de registro desconhecido', async () => {
  const meta = v2MetaFor('trackNoStems', { registryType: 'FOO', registryValue: 'qualquer-coisa' });
  const form = appendV2Form({ mode: 'trackNoStems', meta, files: { track: 'track.mp3', loop15: 'l.mp3', loop30: 'l.mp3', loop60: 'l.mp3' } });
  const res = await postTrack(form);
  await assertStatus(res, 422);
  assert.deepStrictEqual(await res.json(), { message: 'Tipo de registro inválido.' });
});

test('V2 422: track_ms ausente', async () => {
  const meta = v2MetaFor('trackNoStems');
  delete meta.durations.track_ms;
  const form = appendV2Form({ mode: 'trackNoStems', meta, files: { track: 'track.mp3', loop15: 'l.mp3', loop30: 'l.mp3', loop60: 'l.mp3' } });
  const res = await postTrack(form);
  await assertStatus(res, 422);
  assert.deepStrictEqual(await res.json(), { message: 'Informe duration_ms da faixa principal (meta.durations.track_ms).' });
});

test('V2 422: trackWithStems — durações de stems ausentes', async () => {
  const meta = v2MetaFor('trackWithStems');
  delete meta.durations.stem_melody_ms;
  const form = appendV2Form({
    mode: 'trackWithStems', meta,
    files: { track: 'track.mp3', stem_melody: 'sm.mp3', stem_harmony: 'sh.mp3', stem_drums: 'sd.mp3', stem_fx: 'sf.mp3', loop15: 'l.mp3', loop30: 'l.mp3', loop60: 'l.mp3' },
  });
  const res = await postTrack(form);
  await assertStatus(res, 422);
  assert.deepStrictEqual(await res.json(), { message: 'Informe as durações de todos os stems (melody/harmony/drums/fx).' });
});

test('V2 422: trackWithStems — stem fora da tolerância de duração', async () => {
  const meta = v2MetaFor('trackWithStems', { durations: { stem_melody_ms: 180000 + 500 } });
  const form = appendV2Form({
    mode: 'trackWithStems', meta,
    files: { track: 'track.mp3', stem_melody: 'sm.mp3', stem_harmony: 'sh.mp3', stem_drums: 'sd.mp3', stem_fx: 'sf.mp3', loop15: 'l.mp3', loop30: 'l.mp3', loop60: 'l.mp3' },
  });
  const res = await postTrack(form);
  await assertStatus(res, 422);
  assert.deepStrictEqual(await res.json(), { message: 'Stem #1 não possui a mesma duração do Single Track.' });
});

test('V2 422: effectsFx — durações de efeitos ausentes', async () => {
  const meta = v2MetaFor('effectsFx');
  delete meta.durations.effect1_ms;
  const form = appendV2Form({
    mode: 'effectsFx', meta,
    files: { track: 'track.mp3', effect1: 'e1.mp3', effect2: 'e2.mp3', effect3: 'e3.mp3', effect4: 'e4.mp3', effect5: 'e5.mp3', effect6: 'e6.mp3', loop15: 'l.mp3', loop30: 'l.mp3', loop60: 'l.mp3' },
  });
  const res = await postTrack(form);
  await assertStatus(res, 422);
  assert.deepStrictEqual(await res.json(), { message: 'Informe as durações de todos os efeitos (effect1_ms..effect6_ms).' });
});

test('V2 422: effectsFx — efeito fora da tolerância de duração', async () => {
  const meta = v2MetaFor('effectsFx', { durations: { effect1_ms: 180000 + 500 } });
  const form = appendV2Form({
    mode: 'effectsFx', meta,
    files: { track: 'track.mp3', effect1: 'e1.mp3', effect2: 'e2.mp3', effect3: 'e3.mp3', effect4: 'e4.mp3', effect5: 'e5.mp3', effect6: 'e6.mp3', loop15: 'l.mp3', loop30: 'l.mp3', loop60: 'l.mp3' },
  });
  const res = await postTrack(form);
  await assertStatus(res, 422);
  assert.deepStrictEqual(await res.json(), { message: 'Efeito #1 não possui a mesma duração do Single Track.' });
});

test('V2 422: loops ausentes', async () => {
  const form = appendV2Form({ mode: 'trackNoStems', meta: v2MetaFor('trackNoStems'), files: { track: 'track.mp3' } });
  const res = await postTrack(form);
  await assertStatus(res, 422);
  assert.deepStrictEqual(await res.json(), { message: 'Envie os três loops obrigatórios: loop15, loop30 e loop60.' });
});

test('V2 422: duração do loop30 ausente em meta.durations', async () => {
  const meta = v2MetaFor('trackNoStems');
  delete meta.durations.loop30_ms;
  const form = appendV2Form({ mode: 'trackNoStems', meta, files: { track: 'track.mp3', loop15: 'l.mp3', loop30: 'l.mp3', loop60: 'l.mp3' } });
  const res = await postTrack(form);
  await assertStatus(res, 422);
  assert.deepStrictEqual(await res.json(), { message: 'Informe a duração do loop30_ms em meta.durations.' });
});

test('V2 sucesso limítrofe: loop15 a +200ms do alvo é aceito', async () => {
  const meta = v2MetaFor('trackNoStems', { durations: { loop15_ms: 15000 + 200 } });
  const form = appendV2Form({ mode: 'trackNoStems', meta, files: { track: 'track.mp3', loop15: 'l.mp3', loop30: 'l.mp3', loop60: 'l.mp3' } });
  const res = await postTrack(form);
  // trackNoStems v2 agora persiste de verdade (R29, Decisão 4) — 201, não 200.
  await assertStatus(res, 201);
});

test('V2 422: loop15 a +201ms do alvo é rejeitado', async () => {
  const meta = v2MetaFor('trackNoStems', { durations: { loop15_ms: 15000 + 201 } });
  const form = appendV2Form({ mode: 'trackNoStems', meta, files: { track: 'track.mp3', loop15: 'l.mp3', loop30: 'l.mp3', loop60: 'l.mp3' } });
  const res = await postTrack(form);
  await assertStatus(res, 422);
  assert.deepStrictEqual(await res.json(), { message: 'loop15_ms fora da duração esperada (esperado: 15s ±200ms).' });
});

test('Legado 422: track ausente', async () => {
  const form = appendLegacyForm({ mode: 'trackNoStems', meta: legacyMetaFor(), files: {} });
  const res = await postTrack(form);
  await assertStatus(res, 422);
  assert.deepStrictEqual(await res.json(), { message: 'É obrigatório enviar uma música completa (track).' });
});

test('Legado 422: modo sem stems mas stems enviados', async () => {
  const form = new FormData();
  form.append('mode', 'trackNoStems');
  form.append('meta', JSON.stringify(legacyMetaFor()));
  form.append('track', blob('track'), 'track.mp3');
  form.append('stem', blob('stem'), 'stem.mp3');
  form.append('loop15', blob('l'), 'l15.mp3');
  form.append('loop30', blob('l'), 'l30.mp3');
  form.append('loop60', blob('l'), 'l60.mp3');
  const res = await postTrack(form);
  await assertStatus(res, 422);
  assert.deepStrictEqual(await res.json(), { message: 'Modo sem stems selecionado, mas arquivos de stems foram enviados.' });
});

test('Legado 422: trackWithStems sem nenhum stem', async () => {
  const form = appendLegacyForm({
    mode: 'trackWithStems', meta: legacyMetaFor(),
    files: { track: 'track.mp3', loop15: 'l15.mp3', loop30: 'l30.mp3', loop60: 'l60.mp3' },
  });
  const res = await postTrack(form);
  await assertStatus(res, 422);
  assert.deepStrictEqual(await res.json(), { message: 'Envie entre 1 e 4 stems quando o modo "com stems" estiver selecionado.' });
});

test('Legado 422: modo inválido', async () => {
  const form = appendLegacyForm({
    mode: 'modoQualquer', meta: legacyMetaFor(),
    files: { track: 'track.mp3', loop15: 'l15.mp3', loop30: 'l30.mp3', loop60: 'l60.mp3' },
  });
  const res = await postTrack(form);
  await assertStatus(res, 422);
  assert.deepStrictEqual(await res.json(), { message: 'Modo inválido. Use trackNoStems ou trackWithStems.' });
});

test('Legado 422: loops ausentes', async () => {
  const form = appendLegacyForm({ mode: 'trackNoStems', meta: legacyMetaFor(), files: { track: 'track.mp3' } });
  const res = await postTrack(form);
  await assertStatus(res, 422);
  assert.deepStrictEqual(await res.json(), { message: 'Envie os loops obrigatórios de 15s, 30s e 60s.' });
});

test('Legado 422: trackWithStems — track_ms ausente quando durations informado', async () => {
  const form = new FormData();
  form.append('mode', 'trackWithStems');
  form.append('meta', JSON.stringify(legacyMetaFor({ durations: { stems_ms: [180000], loop15_ms: 15000, loop30_ms: 30000, loop60_ms: 60000 } })));
  form.append('track', blob('track'), 'track.mp3');
  form.append('stem', blob('stem'), 'stem.mp3');
  form.append('loop15', blob('l'), 'l15.mp3');
  form.append('loop30', blob('l'), 'l30.mp3');
  form.append('loop60', blob('l'), 'l60.mp3');
  const res = await postTrack(form);
  await assertStatus(res, 422);
  assert.deepStrictEqual(await res.json(), { message: 'Informe duration_ms da música completa (meta.durations.track_ms).' });
});

test('Legado 422: trackWithStems — quantidade de durations incompatível com stems enviados', async () => {
  const form = new FormData();
  form.append('mode', 'trackWithStems');
  form.append('meta', JSON.stringify(legacyMetaFor({ durations: { track_ms: 180000, stems_ms: [180000, 180000], loop15_ms: 15000, loop30_ms: 30000, loop60_ms: 60000 } })));
  form.append('track', blob('track'), 'track.mp3');
  form.append('stem', blob('stem'), 'stem.mp3');
  form.append('loop15', blob('l'), 'l15.mp3');
  form.append('loop30', blob('l'), 'l30.mp3');
  form.append('loop60', blob('l'), 'l60.mp3');
  const res = await postTrack(form);
  await assertStatus(res, 422);
  assert.deepStrictEqual(await res.json(), { message: 'Informe durations dos stems compatível com a quantidade enviada.' });
});

test('Legado 422: trackWithStems — stem fora da tolerância de duração', async () => {
  const form = new FormData();
  form.append('mode', 'trackWithStems');
  form.append('meta', JSON.stringify(legacyMetaFor({ durations: { track_ms: 180000, stems_ms: [180000 + 500], loop15_ms: 15000, loop30_ms: 30000, loop60_ms: 60000 } })));
  form.append('track', blob('track'), 'track.mp3');
  form.append('stem', blob('stem'), 'stem.mp3');
  form.append('loop15', blob('l'), 'l15.mp3');
  form.append('loop30', blob('l'), 'l30.mp3');
  form.append('loop60', blob('l'), 'l60.mp3');
  const res = await postTrack(form);
  await assertStatus(res, 422);
  assert.deepStrictEqual(await res.json(), { message: 'Stem #1 não possui a mesma duração da música completa.' });
});

test('Legado 422: durações dos loops ausentes quando durations informado', async () => {
  const form = appendLegacyForm({
    mode: 'trackNoStems',
    meta: legacyMetaFor({ durations: {} }),
    files: { track: 'track.mp3', loop15: 'l15.mp3', loop30: 'l30.mp3', loop60: 'l60.mp3' },
  });
  const res = await postTrack(form);
  await assertStatus(res, 422);
  assert.deepStrictEqual(await res.json(), { message: 'Informe as durações dos loops (meta.durations.loop15_ms/loop30_ms/loop60_ms).' });
});

test('Legado 422: loops fora de 15/30/60s — mensagem multilinha preservada byte a byte', async () => {
  const form = appendLegacyForm({
    mode: 'trackNoStems',
    meta: legacyMetaFor({ durations: { loop15_ms: 999, loop30_ms: 30000, loop60_ms: 60000 } }),
    files: { track: 'track.mp3', loop15: 'l15.mp3', loop30: 'l30.mp3', loop60: 'l60.mp3' },
  });
  const res = await postTrack(form);
  await assertStatus(res, 422);
  assert.deepStrictEqual(await res.json(), { message: 'Loops devem ter 15s, 30s e 60s (±200ms).\nVerifique as durações informadas.' });
});

test('Legado 422: ISRC inválido', async () => {
  const form = appendLegacyForm({
    mode: 'trackNoStems', meta: legacyMetaFor({ isrc: '123' }),
    files: { track: 'track.mp3', loop15: 'l15.mp3', loop30: 'l30.mp3', loop60: 'l60.mp3' },
  });
  const res = await postTrack(form);
  await assertStatus(res, 422);
  assert.deepStrictEqual(await res.json(), { message: 'ISRC inválido. Deve conter 12 caracteres alfanuméricos.' });
});

test('Legado 422: UPC inválido', async () => {
  const form = appendLegacyForm({
    mode: 'trackNoStems', meta: legacyMetaFor({ upc: '123' }),
    files: { track: 'track.mp3', loop15: 'l15.mp3', loop30: 'l30.mp3', loop60: 'l60.mp3' },
  });
  const res = await postTrack(form);
  await assertStatus(res, 422);
  assert.deepStrictEqual(await res.json(), { message: 'UPC inválido. Deve conter 12 dígitos (UPC-A) ou 6 dígitos (UPC-E).' });
});

test('Legado 422: HASH inválido para o tipo selecionado', async () => {
  const form = appendLegacyForm({
    mode: 'trackNoStems',
    meta: legacyMetaFor({ registryType: 'HASH', hashType: 'MD5', registryValue: 'zz' }),
    files: { track: 'track.mp3', loop15: 'l15.mp3', loop30: 'l30.mp3', loop60: 'l60.mp3' },
  });
  const res = await postTrack(form);
  await assertStatus(res, 422);
  assert.deepStrictEqual(await res.json(), { message: 'HASH inválido para o tipo selecionado.' });
});

test('Requisição vazia (multipart sem partes) retorna 422 track ausente', async () => {
  const form = new FormData();
  const res = await postTrack(form);
  await assertStatus(res, 422);
  assert.deepStrictEqual(await res.json(), { message: 'É obrigatório enviar uma música completa (track).' });
});

test('Requisição não multipart (JSON) retorna 422 track ausente', async () => {
  const res = await fetch(`${ctx.baseUrl}/api/producers/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${producerToken}` },
    body: JSON.stringify({ qualquer: 'coisa' }),
  });
  await assertStatus(res, 422);
  assert.deepStrictEqual(await res.json(), { message: 'É obrigatório enviar uma música completa (track).' });
});

// ═══════════════════════════════════════════════════════════════════════
// 4. Parser e limites (específicos da migração Multer — pós-U2b)
// ═══════════════════════════════════════════════════════════════════════

// Gera um corpo multipart por streaming (sem manter o payload inteiro em
// memória), usado apenas no teste de tamanho > 100 MiB. Mesmo padrão de
// server/test/legacy-upload-multer.test.js (U2a).
function createStreamingMultipartBody({ boundary, fieldName, filename, mimetype, totalSize, chunkSize = 1024 * 1024, closeBoundary = true }) {
  const encoder = new TextEncoder();
  const header = encoder.encode(
    `--${boundary}\r\n` +
    `Content-Disposition: form-data; name="${fieldName}"; filename="${filename}"\r\n` +
    `Content-Type: ${mimetype}\r\n\r\n`
  );
  const footer = encoder.encode(`\r\n--${boundary}--\r\n`);
  const chunk = Buffer.alloc(chunkSize, 'a');

  let sentHeader = false;
  let sent = 0;
  let sentFooter = false;

  return new ReadableStream({
    pull(controller) {
      if (!sentHeader) {
        sentHeader = true;
        controller.enqueue(header);
        return;
      }
      if (sent < totalSize) {
        const remaining = totalSize - sent;
        const toSend = Math.min(chunkSize, remaining);
        controller.enqueue(toSend === chunkSize ? chunk : chunk.subarray(0, toSend));
        sent += toSend;
        return;
      }
      if (closeBoundary && !sentFooter) {
        sentFooter = true;
        controller.enqueue(footer);
        return;
      }
      controller.close();
    },
  });
}

test('Parser: arquivo em campo não declarado retorna 400 JSON, sem órfão', async () => {
  const form = new FormData();
  form.append('arquivo_desconhecido', blob('conteudo'), 'x.bin');
  const res = await postTrack(form);
  assert.strictEqual(res.status, 400);
  assert.deepStrictEqual(await res.json(), { message: 'Upload multipart inválido ou acima dos limites permitidos.' });
  await waitUntilEmpty();
});

test('Parser: segundo arquivo em campo maxCount:1 (track) retorna 400, sem órfão', async () => {
  const form = new FormData();
  form.append('track', blob('track-1'), 'track1.mp3');
  form.append('track', blob('track-2'), 'track2.mp3');
  const res = await postTrack(form);
  assert.strictEqual(res.status, 400);
  await waitUntilEmpty();
});

test('Parser: quinto arquivo stem legado (maxCount:4) retorna 400, sem órfão', async () => {
  const form = new FormData();
  form.append('track', blob('track'), 'track.mp3');
  form.append('stem', blob('s1'), 's1.mp3');
  form.append('stem', blob('s2'), 's2.mp3');
  form.append('stem', blob('s3'), 's3.mp3');
  form.append('stem', blob('s4'), 's4.mp3');
  form.append('stem', blob('s5'), 's5.mp3');
  const res = await postTrack(form);
  assert.strictEqual(res.status, 400);
  await waitUntilEmpty();
});

test('Parser: 12 arquivos excede files:11, retorna 400, sem órfão', async () => {
  const form = new FormData();
  const names = ['track', 'image', 'loop15', 'loop30', 'loop60', 'effect1', 'effect2', 'effect3', 'effect4', 'effect5', 'effect6'];
  for (const name of names) {
    form.append(name, blob(`${name}-conteudo`), `${name}.mp3`);
  }
  form.append('stem', blob('12o-arquivo'), 'extra.mp3'); // 12º arquivo, dentro do maxCount:4 do próprio campo
  const res = await postTrack(form);
  assert.strictEqual(res.status, 400);
  await waitUntilEmpty();
});

test('Parser: quarto campo textual excede fields:3, retorna 400, sem órfão', async () => {
  const form = new FormData();
  form.append('schemaVersion', 'producer_form_v2');
  form.append('mode', 'trackNoStems');
  form.append('meta', JSON.stringify(v2MetaFor('trackNoStems')));
  form.append('campoExtra', 'valor-qualquer'); // 4º campo textual
  form.append('track', blob('track'), 'track.mp3');
  const res = await postTrack(form);
  assert.strictEqual(res.status, 400);
  await waitUntilEmpty();
});

test('Parser: campo textual acima de 64 KiB retorna 400, sem órfão', async () => {
  const form = new FormData();
  form.append('schemaVersion', 'producer_form_v2');
  form.append('mode', 'trackNoStems');
  form.append('meta', 'a'.repeat(64 * 1024 + 1));
  const res = await postTrack(form);
  assert.strictEqual(res.status, 400);
  await waitUntilEmpty();
});

test('Parser: campo aninhado (meta[a]) retorna 400, sem órfão', async () => {
  const form = new FormData();
  form.append('schemaVersion', 'producer_form_v2');
  form.append('mode', 'trackNoStems');
  form.append('meta[a]', 'valor-aninhado');
  const res = await postTrack(form);
  assert.strictEqual(res.status, 400);
  await waitUntilEmpty();
});

test('Parser: multipart sem boundary retorna 400 JSON (nunca HTML/500), sem órfão', async () => {
  const res = await fetch(`${ctx.baseUrl}/api/producers/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${producerToken}` }, // sem boundary=
    body: 'conteudo-qualquer-sem-estrutura-multipart',
  });
  assert.strictEqual(res.status, 400);
  assert.match(res.headers.get('content-type') || '', /application\/json/);
  const body = await res.json();
  assert.deepStrictEqual(body, { message: 'Upload multipart inválido ou acima dos limites permitidos.' });
  await waitUntilEmpty();
});

test('Parser: multipart com encerramento incompleto retorna 400 JSON, sem órfão', async () => {
  const boundary = `----u2bBoundaryTruncated${Date.now()}`;
  const body = createStreamingMultipartBody({
    boundary,
    fieldName: 'track',
    filename: 'truncado.mp3',
    mimetype: 'audio/mpeg',
    totalSize: 4096,
    closeBoundary: false,
  });

  const res = await fetch(`${ctx.baseUrl}/api/producers/track`, {
    method: 'POST',
    headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}`, Authorization: `Bearer ${producerToken}` },
    body,
    duplex: 'half',
  });

  assert.strictEqual(res.status, 400);
  assert.match(res.headers.get('content-type') || '', /application\/json/);
  const responseBody = await res.json();
  assert.deepStrictEqual(responseBody, { message: 'Upload multipart inválido ou acima dos limites permitidos.' });
  await waitUntilEmpty();
});

test('Parser: arquivo acima de 100 MiB retorna 413 com mensagem exata, sem parcial', async () => {
  const boundary = `----u2bBoundarySize${Date.now()}`;
  const body = createStreamingMultipartBody({
    boundary,
    fieldName: 'track',
    filename: 'grande.mp3',
    mimetype: 'audio/mpeg',
    totalSize: 100 * 1024 * 1024 + 1024, // 100 MiB + 1 KiB
  });

  const res = await fetch(`${ctx.baseUrl}/api/producers/track`, {
    method: 'POST',
    headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}`, Authorization: `Bearer ${producerToken}` },
    body,
    duplex: 'half',
  });

  assert.strictEqual(res.status, 413);
  const responseBody = await res.json();
  assert.deepStrictEqual(responseBody, { message: 'Arquivo excede o limite de 100 MiB.' });
  await waitUntilEmpty();
});

// ═══════════════════════════════════════════════════════════════════════
// 5. Cleanup e robustez
// ═══════════════════════════════════════════════════════════════════════

test('Cleanup: resposta 200 não deixa resíduo no diretório temporário', async () => {
  const form = appendLegacyForm({
    mode: 'trackNoStems', meta: legacyMetaFor(),
    files: { track: 'track.mp3', loop15: 'l15.mp3', loop30: 'l30.mp3', loop60: 'l60.mp3' },
  });
  const res = await postTrack(form);
  await assertStatus(res, 200);
  assert.deepStrictEqual(dirEntries(), []);
});

test('Cleanup: resposta 422 após upload completo não deixa resíduo', async () => {
  const form = appendLegacyForm({
    mode: 'trackNoStems',
    meta: legacyMetaFor({ isrc: 'inválido' }),
    files: { track: 'track.mp3', loop15: 'l15.mp3', loop30: 'l30.mp3', loop60: 'l60.mp3' },
  });
  const res = await postTrack(form);
  await assertStatus(res, 422);
  assert.deepStrictEqual(dirEntries(), []);
});

test('Cleanup: abort do cliente durante o envio não deixa arquivo parcial', async () => {
  const controller = new AbortController();
  const bigChunk = Buffer.alloc(16 * 1024 * 1024, 'x');
  const form = new FormData();
  form.append('track', new Blob([bigChunk], { type: 'audio/mpeg' }), 'grande.mp3');

  // Aborta assim que o servidor comprovadamente começar a escrever o arquivo em
  // disco (1º evento no diretório temporário), em vez de um timer fixo — mesmo
  // padrão da U2a, que eliminou uma flakiness real sob carga do event loop.
  const writeStarted = new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      watcher.close();
      reject(new Error('nenhuma escrita observada a tempo'));
    }, 5000);
    const watcher = fs.watch(ctx.producerTrackUploadDir, () => {
      clearTimeout(timeout);
      watcher.close();
      resolve();
    });
  });

  const uploadPromise = postTrack(form, { signal: controller.signal });

  await writeStarted;
  controller.abort();

  await assert.rejects(() => uploadPromise);
  await waitUntilEmpty();
});

test('Cleanup: duas requisições concorrentes não interferem no cleanup uma da outra', async () => {
  const formA = appendLegacyForm({
    mode: 'trackNoStems', meta: legacyMetaFor(),
    files: { track: 'track-a.mp3', loop15: 'l15.mp3', loop30: 'l30.mp3', loop60: 'l60.mp3' },
  });
  const formB = appendLegacyForm({
    mode: 'trackNoStems', meta: legacyMetaFor(),
    files: { track: 'track-b.mp3', loop15: 'l15.mp3', loop30: 'l30.mp3', loop60: 'l60.mp3' },
  });

  const [resA, resB] = await Promise.all([postTrack(formA), postTrack(formB)]);
  assert.strictEqual(resA.status, 200);
  assert.strictEqual(resB.status, 200);

  const [bodyA, bodyB] = await Promise.all([resA.json(), resB.json()]);
  assert.deepStrictEqual([...bodyA.files].sort(), ['track', 'loop15', 'loop30', 'loop60'].sort());
  assert.deepStrictEqual([...bodyB.files].sort(), ['track', 'loop15', 'loop30', 'loop60'].sort());

  assert.deepStrictEqual(dirEntries(), []);
});

test('Cleanup: falha de storage (diretório sem permissão de escrita) retorna 500 sem vazar detalhes', async () => {
  fs.chmodSync(ctx.producerTrackUploadDir, 0o000);
  try {
    const form = appendLegacyForm({
      mode: 'trackNoStems', meta: legacyMetaFor(),
      files: { track: 'track.mp3', loop15: 'l15.mp3', loop30: 'l30.mp3', loop60: 'l60.mp3' },
    });
    const res = await postTrack(form);
    assert.strictEqual(res.status, 500);
    const body = await res.json();
    assert.deepStrictEqual(body, { message: 'Erro interno ao processar upload.' });
  } finally {
    fs.chmodSync(ctx.producerTrackUploadDir, 0o700);
  }
});
