'use strict';

const fs = require('fs');
const fsPromises = require('fs/promises');
const os = require('os');
const path = require('path');

const APP_ENTRY = path.join(__dirname, '..', '..', 'src', 'index.js');

// Sobe uma instância isolada do app (server/src/index.js) em porta efêmera,
// com USERS_FILE e raízes de upload redirecionadas para um diretório temporário.
// Nunca lê/escreve server/data/users.json nem os diretórios reais de upload.
async function startTestServer() {
  process.env.NODE_ENV = 'test';
  if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = 'synthetic-test-secret-do-not-use-in-production';
  }

  const tmpRoot = await fsPromises.mkdtemp(path.join(os.tmpdir(), 'mokbeats-server-test-'));

  const usersFile = path.join(tmpRoot, 'users.json');
  const documentsUploadsDir = path.join(tmpRoot, 'uploads', 'documents');
  const legacyUploadDir = path.join(tmpRoot, 'uploads', 'legacy');
  const legacyApiUploadDir = path.join(tmpRoot, 'uploads', 'legacy-api');

  fs.mkdirSync(documentsUploadsDir, { recursive: true });
  fs.mkdirSync(legacyUploadDir, { recursive: true });
  fs.mkdirSync(legacyApiUploadDir, { recursive: true });

  process.env.TEST_USERS_FILE = usersFile;
  process.env.TEST_DOCUMENTS_UPLOADS_DIR = documentsUploadsDir;
  process.env.TEST_LEGACY_UPLOAD_DIR = legacyUploadDir;
  process.env.TEST_LEGACY_API_UPLOAD_DIR = legacyApiUploadDir;

  delete require.cache[require.resolve(APP_ENTRY)];
  const app = require(APP_ENTRY);

  const server = app.listen(0);
  await new Promise((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });

  const { port } = server.address();

  return {
    baseUrl: `http://127.0.0.1:${port}`,
    usersFile,
    documentsUploadsDir,
    legacyUploadDir,
    legacyApiUploadDir,
    async close() {
      await new Promise((resolve, reject) => {
        server.close((err) => (err ? reject(err) : resolve()));
      });
      await fsPromises.rm(tmpRoot, { recursive: true, force: true });
    },
  };
}

module.exports = { startTestServer, APP_ENTRY };
