import { Injectable } from '@angular/core';

/**
 * Serviço de pré-carregamento e cache de arquivos de áudio
 *
 * Funcionalidades:
 * - Pré-carrega áudios em background para reprodução instantânea
 * - Cache em memória com expiração de 10 minutos
 * - Priorização de downloads (primeiros 3 áudios primeiro)
 * - Prevenção de downloads duplicados
 */
@Injectable({
  providedIn: 'root'
})
export class AudioPreloaderService {
  // Cache: Map<url, { blob: Blob, blobUrl: string, timestamp: number }>
  private audioCache = new Map<string, { blob: Blob; blobUrl: string; timestamp: number }>();

  // Controle de downloads em andamento para evitar duplicação
  private downloadingUrls = new Set<string>();

  // Tempo de cache em milissegundos (10 minutos)
  private readonly CACHE_TTL = 10 * 60 * 1000;

  // Limite de conexões simultâneas
  private readonly MAX_CONCURRENT_DOWNLOADS = 3;

  // Fila de downloads pendentes
  private downloadQueue: string[] = [];

  // Downloads ativos no momento
  private activeDownloads = 0;

  constructor() {
    // Limpeza periódica do cache (a cada 2 minutos)
    setInterval(() => this.cleanExpiredCache(), 2 * 60 * 1000);
  }

  /**
   * Pré-carrega uma lista de URLs de áudio
   * Os primeiros 3 são priorizados, resto entra na fila
   *
   * @param urls Lista de URLs para pré-carregar
   */
  preloadAudios(urls: string[]): void {
    if (!urls || urls.length === 0) return;

    // Filtra URLs que já estão em cache válido ou sendo baixados
    const urlsToLoad = urls.filter(url => !this.isCached(url) && !this.downloadingUrls.has(url));

    if (urlsToLoad.length === 0) {
      console.log('🎵 Todos os áudios já estão em cache');
      return;
    }

    console.log(`🎵 Iniciando preload de ${urlsToLoad.length} áudios...`);

    // Prioriza os primeiros 3 áudios (visíveis)
    const priorityUrls = urlsToLoad.slice(0, this.MAX_CONCURRENT_DOWNLOADS);
    const queuedUrls = urlsToLoad.slice(this.MAX_CONCURRENT_DOWNLOADS);

    // Adiciona URLs não-prioritárias à fila
    this.downloadQueue.push(...queuedUrls);

    // Inicia downloads prioritários
    priorityUrls.forEach(url => this.downloadAudio(url));
  }

  /**
   * Baixa um arquivo de áudio e armazena em cache
   * Ao terminar, processa próximo item da fila
   *
   * @param url URL do áudio
   */
  private downloadAudio(url: string): void {
    // Verifica se já está baixando ou em cache
    if (this.downloadingUrls.has(url) || this.isCached(url)) {
      this.processQueue();
      return;
    }

    this.downloadingUrls.add(url);
    this.activeDownloads++;

    const startTime = performance.now();
    console.log(`⬇️ Baixando: ${this.getFileName(url)}`);

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.blob();
      })
      .then(blob => {
        const blobUrl = URL.createObjectURL(blob);
        const endTime = performance.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);
        const sizeMB = (blob.size / 1024 / 1024).toFixed(2);

        this.audioCache.set(url, {
          blob,
          blobUrl,
          timestamp: Date.now()
        });

        console.log(`✅ Cached: ${this.getFileName(url)} (${sizeMB}MB em ${duration}s)`);
      })
      .catch(error => {
        console.error(`❌ Erro ao baixar ${this.getFileName(url)}:`, error);
      })
      .finally(() => {
        this.downloadingUrls.delete(url);
        this.activeDownloads--;
        this.processQueue();
      });
  }

  /**
   * Processa próximo item da fila se houver capacidade
   */
  private processQueue(): void {
    while (this.downloadQueue.length > 0 && this.activeDownloads < this.MAX_CONCURRENT_DOWNLOADS) {
      const url = this.downloadQueue.shift();
      if (url && !this.isCached(url)) {
        this.downloadAudio(url);
      }
    }
  }

  /**
   * Verifica se URL está em cache válido (não expirado)
   *
   * @param url URL a verificar
   * @returns true se está em cache e não expirou
   */
  isCached(url: string): boolean {
    const cached = this.audioCache.get(url);
    if (!cached) return false;

    const age = Date.now() - cached.timestamp;
    if (age > this.CACHE_TTL) {
      // Cache expirado, remove
      this.removeFromCache(url);
      return false;
    }

    return true;
  }

  /**
   * Obtém Blob URL do áudio em cache
   *
   * @param url URL original do áudio
   * @returns Blob URL para usar com WaveSurfer, ou null se não está em cache
   */
  getCachedBlobUrl(url: string): string | null {
    if (!this.isCached(url)) return null;

    const cached = this.audioCache.get(url);
    return cached?.blobUrl || null;
  }

  /**
   * Obtém Blob do áudio em cache
   *
   * @param url URL original do áudio
   * @returns Blob do áudio, ou null se não está em cache
   */
  getCachedBlob(url: string): Blob | null {
    if (!this.isCached(url)) return null;

    const cached = this.audioCache.get(url);
    return cached?.blob || null;
  }

  /**
   * Remove item específico do cache
   *
   * @param url URL a remover
   */
  private removeFromCache(url: string): void {
    const cached = this.audioCache.get(url);
    if (cached) {
      // Libera Blob URL para evitar memory leak
      URL.revokeObjectURL(cached.blobUrl);
      this.audioCache.delete(url);
    }
  }

  /**
   * Limpa entradas expiradas do cache
   */
  private cleanExpiredCache(): void {
    const now = Date.now();
    const beforeSize = this.audioCache.size;

    for (const [url, cached] of this.audioCache.entries()) {
      const age = now - cached.timestamp;
      if (age > this.CACHE_TTL) {
        this.removeFromCache(url);
      }
    }

    const removed = beforeSize - this.audioCache.size;
    if (removed > 0) {
      console.log(`🧹 Limpeza de cache: ${removed} áudio(s) expirado(s) removido(s)`);
    }
  }

  /**
   * Limpa todo o cache manualmente
   */
  clearCache(): void {
    console.log(`🧹 Limpando ${this.audioCache.size} áudio(s) do cache...`);

    for (const [url] of this.audioCache.entries()) {
      this.removeFromCache(url);
    }

    this.audioCache.clear();
  }

  /**
   * Retorna estatísticas do cache para debug
   */
  getCacheStats(): { total: number; sizeBytes: number; urls: string[] } {
    let totalBytes = 0;
    const urls: string[] = [];

    for (const [url, cached] of this.audioCache.entries()) {
      totalBytes += cached.blob.size;
      urls.push(url);
    }

    return {
      total: this.audioCache.size,
      sizeBytes: totalBytes,
      urls
    };
  }

  /**
   * Extrai nome do arquivo da URL
   *
   * @param url URL completa
   * @returns Nome do arquivo
   */
  private getFileName(url: string): string {
    return url.split('/').pop() || url;
  }
}
