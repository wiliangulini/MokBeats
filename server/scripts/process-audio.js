const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * Gera peaks reais de um arquivo de áudio usando audiowaveform
 * @param {string} audioPath - Caminho absoluto do arquivo de áudio
 * @param {object} options - Opções de configuração
 * @param {number} options.pixelsPerSecond - Densidade dos peaks (padrão: 20)
 * @returns {number[]|null} Array de peaks normalizados (-1 a 1) ou null em caso de erro
 */
function generatePeaksFromAudio(audioPath, options = {}) {
  const pixelsPerSecond = options.pixelsPerSecond || 20;
  const tempFile = path.join(os.tmpdir(), `peaks-${Date.now()}.json`);

  try {
    // Verifica se arquivo existe
    if (!fs.existsSync(audioPath)) {
      console.error(`❌ Arquivo não encontrado: ${audioPath}`);
      return null;
    }

    // Verifica se audiowaveform está instalado
    try {
      execSync('which audiowaveform', { stdio: 'ignore' });
    } catch (error) {
      console.error('❌ audiowaveform não está instalado. Execute: sudo apt-get install audiowaveform');
      return null;
    }

    // Executa audiowaveform
    const cmd = `audiowaveform -i "${audioPath}" --pixels-per-second ${pixelsPerSecond} -o "${tempFile}" 2>&1`;

    try {
      execSync(cmd, { stdio: 'pipe' });
    } catch (error) {
      console.error(`❌ Erro ao executar audiowaveform: ${error.message}`);
      return null;
    }

    // Lê resultado
    if (!fs.existsSync(tempFile)) {
      console.error('❌ Arquivo de peaks não foi gerado');
      return null;
    }

    const data = JSON.parse(fs.readFileSync(tempFile, 'utf8'));

    // Limpa arquivo temporário
    try {
      fs.unlinkSync(tempFile);
    } catch (e) {
      // Ignora erro ao deletar arquivo temporário
    }

    // Extrai e normaliza peaks
    const peaks = normalizePeaks(data.data);

    if (!peaks || peaks.length === 0) {
      console.error('❌ Nenhum peak foi gerado');
      return null;
    }

    return peaks;
  } catch (error) {
    console.error(`❌ Erro ao processar ${audioPath}:`, error.message);

    // Tenta limpar arquivo temporário
    try {
      if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
      }
    } catch (e) {
      // Ignora erro ao deletar arquivo temporário
    }

    return null;
  }
}

/**
 * Normaliza peaks do formato audiowaveform para formato WaveSurfer
 * @param {number[]} rawPeaks - Array de peaks do audiowaveform (pares min/max)
 * @returns {number[]} Array normalizado de -1 a 1
 */
function normalizePeaks(rawPeaks) {
  if (!rawPeaks || !Array.isArray(rawPeaks) || rawPeaks.length === 0) {
    return [];
  }

  const peaks = [];

  // audiowaveform retorna pares [min, max] com valores de -128 a 127
  // Converte para formato WaveSurfer (valores de -1 a 1)
  for (let i = 0; i < rawPeaks.length; i += 2) {
    if (i + 1 < rawPeaks.length) {
      const min = rawPeaks[i] / 128;     // Normaliza -128..127 para -1..1
      const max = rawPeaks[i + 1] / 128;

      // Usa o máximo absoluto entre min e max para representar amplitude
      const amplitude = Math.max(Math.abs(min), Math.abs(max));

      // Mantém o sinal do valor de maior amplitude
      const value = Math.abs(max) > Math.abs(min) ? max : min;

      peaks.push(value);
    }
  }

  return peaks;
}

/**
 * Gera peaks sintéticos (fallback caso audiowaveform não esteja disponível)
 * NOTA: Esta função é um fallback e não deve ser usada em produção
 * @param {number} seed - Seed para variação
 * @returns {number[]} Array de peaks sintéticos
 */
function generateSyntheticPeaks(seed = 1) {
  console.warn('⚠️  Usando peaks sintéticos (fallback). Instale audiowaveform para peaks reais.');

  const length = 200;
  const peaks = [];

  for (let i = 0; i < length; i++) {
    const position = i / length;
    const wave1 = Math.sin(position * Math.PI * 4 + seed) * 0.6;
    const wave2 = Math.sin(position * Math.PI * 8 + seed * 1.3) * 0.3;
    const wave3 = Math.sin(position * Math.PI * 16 + seed * 1.7) * 0.1;
    const noise = (Math.sin(i * seed * 0.1) * 0.2);
    const value = wave1 + wave2 + wave3 + noise;
    peaks.push(Math.max(-1, Math.min(1, value)));
  }

  return peaks;
}

module.exports = {
  generatePeaksFromAudio,
  generateSyntheticPeaks,
  normalizePeaks
};
