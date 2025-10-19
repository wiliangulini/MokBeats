/**
 * Script auxiliar para extrair músicas do index.js
 * Salva array de músicas em um arquivo JSON temporário
 */

const fs = require('fs');
const path = require('path');

// Intercepta process.exit para evitar que o servidor inicie
const originalExit = process.exit;
process.exit = () => {};

// Mock do app.listen para não iniciar servidor
const express = require('express');
const originalListen = express.application.listen;
express.application.listen = function(...args) {
  console.log('✅ Mock: Servidor não será iniciado');
  return { close: () => {} };
};

//  Carrega o index.js (isso executará o código)
try {
  // Limpa require cache
  const indexPath = path.join(__dirname, '../src/index.js');
  delete require.cache[indexPath];

  // Carrega módulo
  require(indexPath);

  // MUSICAS está agora definido globalmente ou podemos acessá-lo via require
  // Precisamos exportar MUSICAS do index.js ou acessá-lo de outra forma
  console.log('✅ index.js carregado com sucesso');

} catch (error) {
  console.error('❌ Erro ao carregar index.js:', error.message);
  originalExit(1);
}
