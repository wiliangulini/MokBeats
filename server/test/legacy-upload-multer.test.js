'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const { test, before, after } = require('node:test');

const { startTestServer } = require('./helpers/test-server');

// Lote U2a: POST /api/uploads/ migrado de connect-multiparty para Multer 2.2.0
// route-local (legacyUpload.any()), com diretório temporário próprio
// (ctx.legacyApiUploadDir), sem persistência entre requisições.
//
// limits.parts = 21 (não 20): confirmado em
// server/node_modules/busboy/lib/types/multipart.js (~linha 548) que o
// contador de "parts" incrementa uma vez por boundary de abertura de cada
// parte real MAIS uma vez no boundary de fechamento do corpo — logo N partes
// lógicas geram N+1 incrementos, e o limite dispara quando parts === partsLimit.
// Para admitir exatamente 20 partes lógicas (10 arquivos + 10 campos) é
// necessário parts >= 21. Consistente com a descoberta da U1 (1 parte lógica
// exigia parts:2 = 1+1).

let ctx;

before(async () => {
  ctx = await startTestServer();
});

after(async () => {
  await ctx.close();
});

function dirEntries() {
  return fs.readdirSync(ctx.legacyApiUploadDir, { recursive: true });
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

async function postUploads(form, extraOptions = {}) {
  return fetch(`${ctx.baseUrl}/api/uploads/`, {
    method: 'POST',
    body: form,
    ...extraOptions,
  });
}

function blob(content, type) {
  return new Blob([Buffer.from(content)], { type });
}

// Gera um corpo multipart por streaming (sem manter o payload inteiro em
// memória), usado apenas no teste de tamanho > 100 MiB.
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

test('um arquivo: 200, envelope e metadados exatos, objeto (não array), MIME octet-stream, sem resíduo', async () => {
  const conteudo = 'conteudo-de-teste-arquivo-unico';
  const form = new FormData();
  form.append('file', blob(conteudo, 'application/octet-stream'), 'unico.bin');

  const res = await postUploads(form);
  assert.strictEqual(res.status, 200);
  const body = await res.json();

  assert.deepStrictEqual(Object.keys(body), ['message']);
  assert.deepStrictEqual(Object.keys(body.message), ['file']);
  assert.ok(!Array.isArray(body.message.file), 'um único arquivo no campo deve ser objeto, não array');
  assert.deepStrictEqual(body.message.file, {
    fieldName: 'file',
    originalFilename: 'unico.bin',
    mimetype: 'application/octet-stream',
    size: Buffer.byteLength(conteudo),
  });

  assert.deepStrictEqual(dirEntries(), [], 'arquivo temporário deve estar removido antes da resposta ser observável');
});

test('dois arquivos no mesmo fieldname: array na ordem recebida, ambos removidos', async () => {
  const form = new FormData();
  form.append('file', blob('primeiro-arquivo', 'application/octet-stream'), 'a.bin');
  form.append('file', blob('segundo-arquivo-mais-longo', 'application/octet-stream'), 'b.bin');

  const res = await postUploads(form);
  assert.strictEqual(res.status, 200);
  const body = await res.json();

  assert.ok(Array.isArray(body.message.file), 'dois arquivos no mesmo campo devem ser retornados como array');
  assert.strictEqual(body.message.file.length, 2);
  assert.deepStrictEqual(body.message.file[0], {
    fieldName: 'file',
    originalFilename: 'a.bin',
    mimetype: 'application/octet-stream',
    size: Buffer.byteLength('primeiro-arquivo'),
  });
  assert.deepStrictEqual(body.message.file[1], {
    fieldName: 'file',
    originalFilename: 'b.bin',
    mimetype: 'application/octet-stream',
    size: Buffer.byteLength('segundo-arquivo-mais-longo'),
  });

  assert.deepStrictEqual(dirEntries(), []);
});

test('arquivos em campos diferentes: agrupamento correto, um objeto por campo', async () => {
  const form = new FormData();
  form.append('capa', blob('conteudo-capa', 'image/png'), 'capa.png');
  form.append('faixa', blob('conteudo-faixa', 'audio/mpeg'), 'faixa.mp3');
  form.append('documento', blob('conteudo-doc', 'application/pdf'), 'doc.pdf');

  const res = await postUploads(form);
  assert.strictEqual(res.status, 200);
  const body = await res.json();

  assert.deepStrictEqual(Object.keys(body.message).sort(), ['capa', 'documento', 'faixa']);
  assert.ok(!Array.isArray(body.message.capa));
  assert.ok(!Array.isArray(body.message.faixa));
  assert.ok(!Array.isArray(body.message.documento));
  assert.strictEqual(body.message.capa.originalFilename, 'capa.png');
  assert.strictEqual(body.message.faixa.originalFilename, 'faixa.mp3');
  assert.strictEqual(body.message.documento.originalFilename, 'doc.pdf');

  assert.deepStrictEqual(dirEntries(), []);
});

test('campos textuais: aceitos até o limite, nunca retornados em message', async () => {
  const form = new FormData();
  form.append('file', blob('conteudo', 'application/octet-stream'), 'x.bin');
  form.append('titulo', 'Minha Faixa');
  form.append('genero', 'Eletrônica');
  form.append('bpm', '128');

  const res = await postUploads(form);
  assert.strictEqual(res.status, 200);
  const body = await res.json();

  assert.deepStrictEqual(Object.keys(body.message), ['file']);
  assert.strictEqual(body.message.titulo, undefined);
  assert.strictEqual(body.message.genero, undefined);
  assert.strictEqual(body.message.bpm, undefined);
});

test('fronteira: 10 arquivos + 10 campos passam (comprova parts:21)', async () => {
  const form = new FormData();
  for (let i = 0; i < 10; i += 1) {
    form.append(`file${i}`, blob(`conteudo-${i}`, 'application/octet-stream'), `f${i}.bin`);
  }
  for (let i = 0; i < 10; i += 1) {
    form.append(`campo${i}`, `valor-${i}`);
  }

  const res = await postUploads(form);
  assert.strictEqual(res.status, 200, `esperado 200; corpo: ${await res.clone().text()}`);
  const body = await res.json();
  assert.strictEqual(Object.keys(body.message).length, 10);
  for (let i = 0; i < 10; i += 1) {
    assert.strictEqual(body.message[`file${i}`].originalFilename, `f${i}.bin`);
  }

  assert.deepStrictEqual(dirEntries(), []);
});

test('fronteira: 11 arquivos retornam 400, sem órfão', async () => {
  const form = new FormData();
  for (let i = 0; i < 11; i += 1) {
    form.append(`file${i}`, blob(`conteudo-${i}`, 'application/octet-stream'), `f${i}.bin`);
  }

  const res = await postUploads(form);
  assert.strictEqual(res.status, 400);
  await waitUntilEmpty();
});

test('fronteira: 11 campos retornam 400, sem órfão', async () => {
  const form = new FormData();
  form.append('file', blob('conteudo', 'application/octet-stream'), 'x.bin');
  for (let i = 0; i < 11; i += 1) {
    form.append(`campo${i}`, `valor-${i}`);
  }

  const res = await postUploads(form);
  assert.strictEqual(res.status, 400);
  await waitUntilEmpty();
});

test('fronteira: campo acima de 64 KiB retorna 400, sem órfão', async () => {
  const form = new FormData();
  form.append('file', blob('conteudo', 'application/octet-stream'), 'x.bin');
  form.append('campoGrande', 'a'.repeat(64 * 1024 + 1));

  const res = await postUploads(form);
  assert.strictEqual(res.status, 400);
  await waitUntilEmpty();
});

test('fronteira: campo aninhado (meta[a]) retorna 400, sem órfão', async () => {
  const form = new FormData();
  form.append('file', blob('conteudo', 'application/octet-stream'), 'x.bin');
  form.append('meta[a]', 'valor-aninhado');

  const res = await postUploads(form);
  assert.strictEqual(res.status, 400);
  await waitUntilEmpty();
});

test('tamanho: arquivo acima de 100 MiB retorna 413 com mensagem exata, sem parcial', async () => {
  const boundary = `----u2aBoundarySize${Date.now()}`;
  const body = createStreamingMultipartBody({
    boundary,
    fieldName: 'file',
    filename: 'grande.bin',
    mimetype: 'application/octet-stream',
    totalSize: 100 * 1024 * 1024 + 1024, // 100 MiB + 1 KiB
  });

  const res = await fetch(`${ctx.baseUrl}/api/uploads/`, {
    method: 'POST',
    headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}` },
    body,
    duplex: 'half',
  });

  assert.strictEqual(res.status, 413);
  const responseBody = await res.json();
  assert.deepStrictEqual(responseBody, { message: 'Arquivo excede o limite de 100 MiB.' });

  await waitUntilEmpty();
});

test('multipart malformado: boundary ausente retorna 400 JSON (nunca HTML/500), sem órfão', async () => {
  const res = await fetch(`${ctx.baseUrl}/api/uploads/`, {
    method: 'POST',
    headers: { 'Content-Type': 'multipart/form-data' }, // sem boundary=
    body: 'conteudo-qualquer-sem-estrutura-multipart',
  });

  assert.strictEqual(res.status, 400);
  assert.match(res.headers.get('content-type') || '', /application\/json/);
  const body = await res.json();
  assert.deepStrictEqual(body, { message: 'Upload multipart inválido ou acima dos limites permitidos.' });

  await waitUntilEmpty();
});

test('multipart malformado: encerramento incompleto do form retorna 400 JSON, sem órfão', async () => {
  const boundary = `----u2aBoundaryTruncated${Date.now()}`;
  const body = createStreamingMultipartBody({
    boundary,
    fieldName: 'file',
    filename: 'truncado.bin',
    mimetype: 'application/octet-stream',
    totalSize: 4096,
    closeBoundary: false, // termina o stream sem o boundary de fechamento
  });

  const res = await fetch(`${ctx.baseUrl}/api/uploads/`, {
    method: 'POST',
    headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}` },
    body,
    duplex: 'half',
  });

  assert.strictEqual(res.status, 400);
  assert.match(res.headers.get('content-type') || '', /application\/json/);
  const responseBody = await res.json();
  assert.deepStrictEqual(responseBody, { message: 'Upload multipart inválido ou acima dos limites permitidos.' });

  await waitUntilEmpty();
});

test('abort: interrupção do cliente durante o envio não deixa arquivo parcial', async () => {
  const controller = new AbortController();
  const bigChunk = Buffer.alloc(16 * 1024 * 1024, 'x'); // grande o suficiente para dar tempo de abortar em pleno envio
  const form = new FormData();
  form.append('file', new Blob([bigChunk], { type: 'application/octet-stream' }), 'grande.bin');

  // Aborta assim que o servidor comprovadamente começar a escrever o arquivo
  // em disco (1º evento no diretório temporário), em vez de um timer fixo:
  // sob carga do event loop um timer curto pode disparar antes da conexão
  // sequer ser estabelecida no servidor, deixando a requisição "pairando" e
  // só criando o arquivo bem depois — contaminando um teste seguinte.
  const writeStarted = new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      watcher.close();
      reject(new Error('nenhuma escrita observada a tempo'));
    }, 5000);
    const watcher = fs.watch(ctx.legacyApiUploadDir, () => {
      clearTimeout(timeout);
      watcher.close();
      resolve();
    });
  });

  const uploadPromise = postUploads(form, { signal: controller.signal });

  await writeStarted;
  controller.abort();

  await assert.rejects(() => uploadPromise);
  await waitUntilEmpty();
});

test('concorrência: duas requisições simultâneas não interferem no cleanup uma da outra', async () => {
  const formA = new FormData();
  formA.append('file', blob('conteudo-requisicao-a', 'application/octet-stream'), 'a.bin');

  const formB = new FormData();
  formB.append('file', blob('conteudo-requisicao-b-mais-longo', 'application/octet-stream'), 'b.bin');

  const [resA, resB] = await Promise.all([postUploads(formA), postUploads(formB)]);

  assert.strictEqual(resA.status, 200);
  assert.strictEqual(resB.status, 200);

  const [bodyA, bodyB] = await Promise.all([resA.json(), resB.json()]);
  assert.strictEqual(bodyA.message.file.originalFilename, 'a.bin');
  assert.strictEqual(bodyA.message.file.size, Buffer.byteLength('conteudo-requisicao-a'));
  assert.strictEqual(bodyB.message.file.originalFilename, 'b.bin');
  assert.strictEqual(bodyB.message.file.size, Buffer.byteLength('conteudo-requisicao-b-mais-longo'));

  assert.deepStrictEqual(dirEntries(), []);
});

test('segurança: fieldname "__proto__" não polui Object.prototype e resposta só expõe os 4 atributos autorizados', async () => {
  const form = new FormData();
  form.append('__proto__', blob('conteudo-proto', 'application/octet-stream'), 'proto.bin');

  const res = await postUploads(form);
  assert.strictEqual(res.status, 200);
  const body = await res.json();

  assert.deepStrictEqual(Object.keys(body.message), ['__proto__']);
  const meta = body.message['__proto__'];
  assert.deepStrictEqual(Object.keys(meta).sort(), ['fieldName', 'mimetype', 'originalFilename', 'size']);
  assert.deepStrictEqual(meta, {
    fieldName: '__proto__',
    originalFilename: 'proto.bin',
    mimetype: 'application/octet-stream',
    size: Buffer.byteLength('conteudo-proto'),
  });

  // Confirma que Object.prototype não foi afetado por nenhuma etapa do processamento.
  assert.strictEqual(Object.prototype.polluted, undefined);
  assert.deepStrictEqual({}, {});
  assert.strictEqual(Object.getPrototypeOf({}), Object.prototype);
});

test('regressão: multipart vazio retorna 200 com {message:{}}', async () => {
  const form = new FormData();
  const res = await postUploads(form);
  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.deepStrictEqual(body, { message: {} });
});

test('regressão: requisição não multipart retorna 200 com {message:{}}', async () => {
  const res = await fetch(`${ctx.baseUrl}/api/uploads/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ qualquer: 'coisa' }),
  });

  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.deepStrictEqual(body, { message: {} });
});
