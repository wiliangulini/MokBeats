'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test, before, after } = require('node:test');

const { startTestServer } = require('./helpers/test-server');

// Baseline do lote U1 (multer 1.4.5-lts.2 -> 2.2.0) para /api/user/documents/:tipo.
// Contrato preservado: campo 'file', MIMEs JPG/PNG/PDF, fileSize 10 MiB, resposta {url}.
//
// limits.parts = 2 (não 1): o busboy embutido no multer 2.2.0 conta uma única parte
// lógica (1 arquivo OU 1 campo) como 2 internamente — confirmado empiricamente em
// isolamento total (fora das rotas do projeto) antes de codificar este arquivo.
// parts:1 rejeitava 100% dos uploads válidos com "Too many parts". files:1 e fields:0
// continuam bloqueando múltiplos arquivos e campos extras independente do valor de parts.

let ctx;
let token;

before(async () => {
  ctx = await startTestServer();
  const email = `u1-documents-${Date.now()}@example.com`;
  const registerRes = await fetch(`${ctx.baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'senha12345', tipoPessoa: 'fisica', tipoPerfil: 'comprador' }),
  });
  assert.strictEqual(registerRes.status, 201);
  ({ token } = await registerRes.json());
});

after(async () => {
  await ctx.close();
});

function authHeaders() {
  return { Authorization: `Bearer ${token}` };
}

async function postDocuments(form) {
  return fetch(`${ctx.baseUrl}/api/user/documents/foto-documento`, {
    method: 'POST',
    headers: authHeaders(),
    body: form,
  });
}

async function uploadSingleFile(blob, filename) {
  const form = new FormData();
  form.append('file', blob, filename);
  return postDocuments(form);
}

test('JPG válido: 200 + {url} preservado, gravado no diretório temporário', async () => {
  const res = await uploadSingleFile(new Blob([Buffer.from('fake-jpg-content')], { type: 'image/jpeg' }), 'foto.jpg');
  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.match(body.url, /^\/uploads\/documents\/.+\/foto-documento\/\d+\.jpg$/);

  const absolute = path.join(ctx.documentsUploadsDir, body.url.replace(/^\/uploads\/documents\//, ''));
  assert.ok(fs.existsSync(absolute), 'arquivo deve existir no diretório de documentos TEMPORÁRIO');
});

test('PNG válido: 200 + {url} preservado', async () => {
  const res = await uploadSingleFile(new Blob([Buffer.from('fake-png-content')], { type: 'image/png' }), 'foto.png');
  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.match(body.url, /^\/uploads\/documents\/.+\/foto-documento\/\d+\.png$/);
});

test('PDF válido: 200 + {url} preservado', async () => {
  const res = await uploadSingleFile(new Blob([Buffer.from('fake-pdf-content')], { type: 'application/pdf' }), 'documento.pdf');
  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.match(body.url, /^\/uploads\/documents\/.+\/foto-documento\/\d+\.pdf$/);
});

test('MIME inválido: 400 com a mensagem atual preservada', async () => {
  const res = await uploadSingleFile(new Blob([Buffer.from('conteudo-texto')], { type: 'text/plain' }), 'arquivo.txt');
  assert.strictEqual(res.status, 400);
  const body = await res.json();
  assert.strictEqual(body.message, 'Tipo de arquivo não permitido. Use JPG, PNG ou PDF.');
});

test('arquivo acima de 10 MiB: 400, sem arquivo parcial órfão', async () => {
  const before = fs.readdirSync(ctx.documentsUploadsDir, { recursive: true }).length;

  const big = Buffer.alloc(10 * 1024 * 1024 + 1024, 'a'); // 10 MiB + 1 KiB
  const res = await uploadSingleFile(new Blob([big], { type: 'image/png' }), 'grande.png');
  assert.strictEqual(res.status, 400);
  const body = await res.json();
  assert.ok(body.message, 'deve retornar mensagem de erro do Multer para limite de tamanho');

  const after = fs.readdirSync(ctx.documentsUploadsDir, { recursive: true }).length;
  assert.strictEqual(after, before, 'nenhum arquivo parcial deve permanecer após rejeição por tamanho');
});

test('dois arquivos no campo "file": 400 (limite files:1)', async () => {
  const form = new FormData();
  form.append('file', new Blob([Buffer.from('a')], { type: 'image/png' }), 'a.png');
  form.append('file', new Blob([Buffer.from('b')], { type: 'image/png' }), 'b.png');

  const res = await postDocuments(form);
  assert.strictEqual(res.status, 400);
  const body = await res.json();
  assert.strictEqual(body.message, 'Too many files');
});

test('campo de arquivo com nome inesperado (diferente de "file"): 400', async () => {
  const form = new FormData();
  form.append('outroCampo', new Blob([Buffer.from('a')], { type: 'image/png' }), 'a.png');

  const res = await postDocuments(form);
  assert.strictEqual(res.status, 400);
  const body = await res.json();
  assert.strictEqual(body.message, 'Unexpected field');
});

test('campo textual simples inesperado junto do arquivo: 400 (limite fields:0)', async () => {
  const form = new FormData();
  form.append('file', new Blob([Buffer.from('a')], { type: 'image/png' }), 'a.png');
  form.append('campoExtra', 'valor-inesperado');

  const res = await postDocuments(form);
  assert.strictEqual(res.status, 400);
  const body = await res.json();
  assert.strictEqual(body.message, 'Too many fields');
});

test('nome de campo textual aninhado junto do arquivo: 400 (fields:0 bloqueia antes de fieldNestingDepth)', async () => {
  const form = new FormData();
  form.append('file', new Blob([Buffer.from('a')], { type: 'image/png' }), 'a.png');
  form.append('meta[nested][deep]', 'valor-aninhado');

  const res = await postDocuments(form);
  assert.strictEqual(res.status, 400);
  const body = await res.json();
  assert.strictEqual(body.message, 'Too many fields');
});

test('upload abortado pelo cliente não deixa arquivo parcial órfão', async () => {
  const before = fs.readdirSync(ctx.documentsUploadsDir, { recursive: true }).length;

  const controller = new AbortController();
  const bigChunk = Buffer.alloc(8 * 1024 * 1024, 'x'); // grande o suficiente para abortar em pleno envio
  const form = new FormData();
  form.append('file', new Blob([bigChunk], { type: 'image/png' }), 'grande.png');

  setTimeout(() => controller.abort(), 5);

  await assert.rejects(() =>
    fetch(`${ctx.baseUrl}/api/user/documents/foto-documento`, {
      method: 'POST',
      headers: authHeaders(),
      body: form,
      signal: controller.signal,
    })
  );

  await new Promise((resolve) => setTimeout(resolve, 500));
  const after = fs.readdirSync(ctx.documentsUploadsDir, { recursive: true }).length;
  assert.strictEqual(after, before, 'nenhum arquivo parcial deve permanecer após abort do cliente');
});
