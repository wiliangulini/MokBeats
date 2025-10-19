const fs = require('fs');
const path = require('path');
const { generatePeaksFromAudio } = require('./process-audio');

/**
 * Script para gerar peaks reais de todas as músicas
 * Lê o arquivo musicas.json existente e gera peaks reais usando audiowaveform
 */

// Configuração
const JSON_PATH = path.join(__dirname, '../data/musicas.json');
const AUDIO_BASE_PATH = path.join(__dirname, '../../src'); // Base para resolver URLs relativas

/**
 * Carrega músicas do arquivo JSON existente
 * @returns {Array} Array de músicas
 */
function loadMusicasFromJSON() {
  try {
    if (!fs.existsSync(JSON_PATH)) {
      throw new Error(`Arquivo não encontrado: ${JSON_PATH}`);
    }

    const data = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));

    if (!data.musicas || !Array.isArray(data.musicas)) {
      throw new Error('Estrutura inválida: esperado objeto com propriedade "musicas"');
    }

    console.log(`✅ ${data.musicas.length} músicas carregadas do JSON\n`);
    return data.musicas;
  } catch (error) {
    console.error('❌ Erro ao carregar JSON:', error.message);
    process.exit(1);
  }
}

/**
 * Resolve URL relativa para caminho absoluto
 * @param {string} relativeUrl - URL relativa (ex: "../../assets/audios/file.mp3")
 * @returns {string} Caminho absoluto
 */
function resolveAudioPath(relativeUrl) {
  if (!relativeUrl) {
    return null;
  }

  // Remove "../.." do início e adiciona base path
  const cleanedPath = relativeUrl.replace(/^\.\.\/\.\.\//, '');
  const absolutePath = path.join(AUDIO_BASE_PATH, cleanedPath);

  return absolutePath;
}

/**
 * Processa todas as músicas e gera peaks
 */
async function processAllMusic() {
  console.log('🎵 Iniciando processamento de músicas...\n');

  const musicas = loadMusicasFromJSON();
  const results = [];
  let successCount = 0;
  let errorCount = 0;

  // Cache de peaks por URL para evitar reprocessamento
  const peaksCache = new Map();
  let uniqueFilesProcessed = 0;
  let peaksReused = 0;

  for (let i = 0; i < musicas.length; i++) {
    const musica = musicas[i];
    const musicNumber = i + 1;
    const totalMusics = musicas.length;

    console.log(`[${musicNumber}/${totalMusics}] Processando: ${musica.nome_musica}`);

    // Resolve caminho do áudio
    const audioPath = resolveAudioPath(musica.url);

    if (!audioPath) {
      console.log(`  ⚠️  URL não encontrada, mantendo peaks vazios`);
      results.push({ ...musica, peaks: [] });
      errorCount++;
      continue;
    }

    console.log(`  📁 Arquivo: ${musica.url}`);

    // Verifica se arquivo existe
    if (!fs.existsSync(audioPath)) {
      console.log(`  ⚠️  Arquivo não encontrado: ${audioPath}`);
      console.log(`  ℹ️  Mantendo peaks vazios para esta música`);
      results.push({ ...musica, peaks: [] });
      errorCount++;
      continue;
    }

    // Verifica se já processamos este arquivo
    if (peaksCache.has(musica.url)) {
      console.log(`  ♻️  Reutilizando peaks (mesmo arquivo já processado)`);
      const cachedPeaks = peaksCache.get(musica.url);
      console.log(`  ✅ ${cachedPeaks.length} peaks copiados`);
      results.push({ ...musica, peaks: cachedPeaks });
      peaksReused++;
      successCount++;
      continue;
    }

    // Gera peaks
    console.log(`  ⚙️  Gerando peaks...`);
    const peaks = generatePeaksFromAudio(audioPath, { pixelsPerSecond: 20 });

    if (peaks && peaks.length > 0) {
      console.log(`  ✅ ${peaks.length} peaks gerados com sucesso`);

      // Armazena no cache
      peaksCache.set(musica.url, peaks);
      uniqueFilesProcessed++;

      results.push({ ...musica, peaks });
      successCount++;
    } else {
      console.log(`  ❌ Erro ao gerar peaks, mantendo array vazio`);
      results.push({ ...musica, peaks: [] });
      errorCount++;
    }

    console.log(''); // Linha em branco entre músicas
  }

  // Salva resultado no JSON
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📝 Salvando arquivo JSON...');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const outputData = {
    musicas: results,
    metadata: {
      generated_at: new Date().toISOString(),
      total_musics: results.length,
      success: successCount,
      errors: errorCount,
      unique_files_processed: uniqueFilesProcessed,
      peaks_reused: peaksReused,
      version: '1.0.0',
      audiowaveform_version: 'Check with: audiowaveform --version'
    }
  };

  try {
    fs.writeFileSync(JSON_PATH, JSON.stringify(outputData, null, 2), 'utf8');

    // Mostra tamanho do arquivo
    const stats = fs.statSync(JSON_PATH);
    const fileSizeKB = (stats.size / 1024).toFixed(2);

    console.log('✨ Processamento concluído!');
    console.log('');
    console.log('📊 Estatísticas:');
    console.log(`   - Total de músicas: ${musicas.length}`);
    console.log(`   - Processadas com sucesso: ${successCount}`);
    console.log(`   - Erros/avisos: ${errorCount}`);
    console.log(`   - Arquivos únicos processados: ${uniqueFilesProcessed}`);
    console.log(`   - Peaks reutilizados: ${peaksReused}`);
    console.log(`   - Arquivo salvo: ${JSON_PATH}`);
    console.log(`   - Tamanho do arquivo: ${fileSizeKB} KB`);

    if (errorCount > 0) {
      console.log('');
      console.log(`⚠️  ${errorCount} música(s) não foram processadas.`);
      console.log('   Verifique se os arquivos de áudio existem nos caminhos corretos.');
    }

    if (successCount === musicas.length) {
      console.log('');
      console.log('🎉 Todas as músicas foram processadas com sucesso!');
      console.log('   O frontend agora carregará waveforms instantaneamente.');
    }

    console.log('');

  } catch (error) {
    console.error('❌ Erro ao salvar JSON:', error.message);
    process.exit(1);
  }
}

// Verifica se está sendo executado diretamente
if (require.main === module) {
  processAllMusic().catch(error => {
    console.error('\n❌ Erro fatal:', error);
    process.exit(1);
  });
}

module.exports = {
  loadMusicasFromJSON,
  resolveAudioPath,
  processAllMusic
};
