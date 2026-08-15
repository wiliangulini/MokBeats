import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { MockedObject } from 'vitest';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';

import { UsuarioArtistaComponent } from './usuario-artista.component';
import { Musica, MusicasService } from '../musicas/musicas.service';
import { AuthService } from '../login/auth.service';
import { ScrollService } from '../service/scroll.service';
import { ProducerProfileService } from '../service/producer-profile.service';
import { ProducerProfile } from '../models/producer-profile.model';
import { MusicPlayerService } from '../service/music-player.service';
import { Subject } from 'rxjs';

function buildComponent(overrides: {
  musicService?: Partial<MockedObject<MusicasService>>;
  producerProfileService?: Partial<MockedObject<ProducerProfileService>>;
} = {}) {
  const musicService = {
    convertida2: [], convertida: [], humor: [],
    filterMusicas: vi.fn().mockReturnValue(of([])),
    getByProducer: vi.fn().mockReturnValue(of([])),
    comprarLicensa: vi.fn(),
    ...overrides.musicService,
  } as unknown as MockedObject<MusicasService>;
  const producerProfileService = {
    getPublicProfile: vi.fn().mockReturnValue(of(null)),
    ...overrides.producerProfileService,
  } as unknown as MockedObject<ProducerProfileService>;
  const musicPlayerService = {
    playPauseAction$: new Subject(),
    setCurrentMusicID: vi.fn(),
    setCurrentMusicUrl: vi.fn(),
    setCurrentMusic: vi.fn(),
    onPlayPause: vi.fn(),
  } as unknown as MockedObject<MusicPlayerService>;

  const usuarioArtista = new UsuarioArtistaComponent(
    musicService,
    { verificaLogin: vi.fn(), userAutetic: vi.fn() } as unknown as AuthService,
    { scrollUp: vi.fn() } as unknown as ScrollService,
    new FormBuilder(),
    {} as ActivatedRoute,
    producerProfileService,
    musicPlayerService,
    { open: vi.fn() } as unknown as MatSnackBar,
  );

  return { usuarioArtista, musicService, producerProfileService, musicPlayerService };
}

describe('UsuarioArtistaComponent', () => {
  let component: UsuarioArtistaComponent;
  let fixture: ComponentFixture<UsuarioArtistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsuarioArtistaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuarioArtistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve enviar o objeto da música (não o índice) ao comprar licença', () => {
    const { usuarioArtista, musicService } = buildComponent();
    const musica: Musica = { id: 7, nome_musica: 'Faixa X', nome_produtor: 'Artista Y' };

    usuarioArtista.comprarLicensa(musica);

    expect(musicService.comprarLicensa).toHaveBeenCalledWith(musica);
  });

  it('carrega perfil real por producerId (contrato novo), não por nome hard-coded', () => {
    const perfil: ProducerProfile = { producerId: 'p1', nomeArtistico: 'DJ Real', biografia: 'Bio real', avatarUrl: '/avatar.png' };
    const { usuarioArtista, musicService } = buildComponent({
      producerProfileService: { getPublicProfile: vi.fn().mockReturnValue(of(perfil)) },
    });

    (usuarioArtista as any).carregarPorProducerId('p1');

    expect(usuarioArtista.nameArtist).toBe('DJ Real');
    expect(usuarioArtista.biografia).toBe('Bio real');
    expect(usuarioArtista.avatarUrl).toBe('/avatar.png');
    expect(usuarioArtista.carregando).toBe(false);
    expect(usuarioArtista.artistaNaoEncontrado).toBe(false);
    expect(musicService.getByProducer).toHaveBeenCalledWith('p1');
  });

  it('marca artistaNaoEncontrado quando o producerId não existe', () => {
    const { usuarioArtista } = buildComponent({
      producerProfileService: { getPublicProfile: vi.fn().mockReturnValue(of(null)) },
    });

    (usuarioArtista as any).carregarPorProducerId('id-que-nao-existe');

    expect(usuarioArtista.artistaNaoEncontrado).toBe(true);
    expect(usuarioArtista.carregando).toBe(false);
  });

  it('mantém compatibilidade com links antigos (?nome_produtor=), filtrando por nome', () => {
    const { usuarioArtista, musicService } = buildComponent({
      musicService: { filterMusicas: vi.fn().mockReturnValue(of({ data: [{ id: 1, nome_musica: 'X' }] })) },
    });

    (usuarioArtista as any).carregarPorNome('Xalaika');

    expect(musicService.filterMusicas).toHaveBeenCalledWith({ artistas: ['Xalaika'] });
    expect(usuarioArtista.arrMusica.length).toBe(1);
    expect(usuarioArtista.carregando).toBe(false);
  });

  it('marca erro quando a busca por nome falha, sem travar em loading', () => {
    const { usuarioArtista } = buildComponent({
      musicService: { filterMusicas: vi.fn().mockReturnValue(throwError(() => new Error('falha'))) },
    });

    (usuarioArtista as any).carregarPorNome('Xalaika');

    expect(usuarioArtista.erro).toBe(true);
    expect(usuarioArtista.carregando).toBe(false);
  });

  it('tocarFaixa() despacha play pelo player global (sem criar WaveSurfer próprio)', () => {
    const musica: Musica = { id: 9, nome_musica: 'Faixa Y', url: '/audio/y.mp3' };
    const { usuarioArtista, musicPlayerService } = buildComponent();

    usuarioArtista.tocarFaixa(musica);

    expect(musicPlayerService.setCurrentMusicID).toHaveBeenCalledWith(9);
    expect(musicPlayerService.setCurrentMusicUrl).toHaveBeenCalledWith('/audio/y.mp3');
    expect(musicPlayerService.setCurrentMusic).toHaveBeenCalledWith(musica);
    expect(musicPlayerService.onPlayPause).toHaveBeenCalledWith('play', 9);
    expect(usuarioArtista.playingId).toBe(9);
  });

  it('tocarFaixa() na mesma faixa tocando despacha pause (toggle)', () => {
    const musica: Musica = { id: 9, nome_musica: 'Faixa Y', url: '/audio/y.mp3' };
    const { usuarioArtista, musicPlayerService } = buildComponent();
    usuarioArtista.playingId = 9;

    usuarioArtista.tocarFaixa(musica);

    expect(musicPlayerService.onPlayPause).toHaveBeenCalledWith('pause', 9);
    expect(usuarioArtista.playingId).toBeNull();
  });
});
