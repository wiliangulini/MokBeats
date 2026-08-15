import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { MockedObject } from 'vitest';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';

import { ArtistComponent } from './artist.component';
import { Musica, MusicasService } from '../musicas/musicas.service';
import { AuthService } from '../login/auth.service';
import { ScrollService } from '../service/scroll.service';
import { ProducerProfileService } from '../service/producer-profile.service';
import { DashboardService } from '../dashboard-produtor/dashboard.service';
import { ProducerProfile } from '../models/producer-profile.model';
import { MusicPlayerService } from '../service/music-player.service';
import { Subject } from 'rxjs';

function buildArtist(overrides: {
  musicService?: Partial<MockedObject<MusicasService>>;
  producerProfileService?: Partial<MockedObject<ProducerProfileService>>;
  dashboardService?: Partial<MockedObject<DashboardService>>;
} = {}) {
  const musicService = {
    convertida2: [], convertida: [], humor: [],
    getByProducer: vi.fn().mockReturnValue(of([])),
    remove: vi.fn().mockReturnValue(of({})),
    comprarLicensa: vi.fn(),
    ...overrides.musicService,
  } as unknown as MockedObject<MusicasService>;
  const producerProfileService = {
    getMyProfile: vi.fn().mockReturnValue(of({ producerId: 'p1', nomeArtistico: '', biografia: '', avatarUrl: '' } as ProducerProfile)),
    saveMyProfile: vi.fn().mockReturnValue(of({ message: '', producer: {} as ProducerProfile })),
    uploadAvatar: vi.fn(),
    ...overrides.producerProfileService,
  } as unknown as MockedObject<ProducerProfileService>;
  const dashboardService = {
    getSummary: vi.fn().mockReturnValue(of({ vendasTotais: 0, valorTotalVendas: 0, totalCurtidas: 0, ticketMedio: 0 })),
    ...overrides.dashboardService,
  } as unknown as MockedObject<DashboardService>;
  const musicPlayerService = {
    playPauseAction$: new Subject(),
    setCurrentMusicID: vi.fn(),
    setCurrentMusicUrl: vi.fn(),
    setCurrentMusic: vi.fn(),
    onPlayPause: vi.fn(),
  } as unknown as MockedObject<MusicPlayerService>;

  const artist = new ArtistComponent(
    musicService,
    { verificaLogin: vi.fn(), userAutetic: vi.fn() } as unknown as AuthService,
    { scrollUp: vi.fn() } as unknown as ScrollService,
    new FormBuilder(),
    producerProfileService,
    dashboardService,
    musicPlayerService,
    { open: vi.fn() } as unknown as MatSnackBar,
  );

  return { artist, musicService, producerProfileService, dashboardService, musicPlayerService };
}

describe('ArtistComponent', () => {
  let component: ArtistComponent;
  let fixture: ComponentFixture<ArtistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArtistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArtistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve enviar o objeto da música (não o índice) ao comprar licença', () => {
    const { artist, musicService } = buildArtist();
    const musica: Musica = { id: 7, nome_musica: 'Faixa X', nome_produtor: 'Artista Y' };

    artist.comprarLicensa(musica);

    expect(musicService.comprarLicensa).toHaveBeenCalledWith(musica);
  });

  it('carregarPerfil() usa a identidade do produtor autenticado, nunca hard-coded', () => {
    const perfil: ProducerProfile = { producerId: 'meu-id', nomeArtistico: 'DJ Real', biografia: 'Bio real', avatarUrl: '/avatar.png' };
    const { artist, musicService } = buildArtist({
      producerProfileService: { getMyProfile: vi.fn().mockReturnValue(of(perfil)) },
    });

    artist.carregarPerfil();

    expect(artist.producerId).toBe('meu-id');
    expect(artist.nomeArtistico).toBe('DJ Real');
    expect(artist.biografia).toBe('Bio real');
    expect(artist.avatarUrl).toBe('/avatar.png');
    expect(artist.perfilCarregando).toBe(false);
    expect(musicService.getByProducer).toHaveBeenCalledWith('meu-id');
  });

  it('carregarPerfil() marca erro quando o backend falha, sem travar em loading', () => {
    const { artist } = buildArtist({
      producerProfileService: { getMyProfile: vi.fn().mockReturnValue(throwError(() => new Error('falha'))) },
    });

    artist.carregarPerfil();

    expect(artist.perfilErro).toBe(true);
    expect(artist.perfilCarregando).toBe(false);
  });

  it('salvarPerfil() envia só nomeArtistico/biografia do formulário e sai do modo de edição', () => {
    const { artist, producerProfileService } = buildArtist();
    artist.formG.patchValue({ nameArtist: 'Novo Nome', textAreaDescription: 'Nova bio' });
    artist.perfilEditavel = true;

    artist.salvarPerfil();

    expect(producerProfileService.saveMyProfile).toHaveBeenCalledWith({ nomeArtistico: 'Novo Nome', biografia: 'Nova bio' });
    expect(artist.perfilEditavel).toBe(false);
    expect(artist.savingProfile).toBe(false);
  });

  it('removerFaixa() remove só a faixa confirmada e atualiza a lista local', () => {
    const musica: Musica = { id: 3, nome_musica: 'Faixa a remover' };
    const { artist, musicService } = buildArtist();
    artist.arrMusica = [musica, { id: 4, nome_musica: 'Outra faixa' }];
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    artist.removerFaixa(musica);

    expect(musicService.remove).toHaveBeenCalledWith(3);
    expect(artist.arrMusica.map((m) => m.id)).toEqual([4]);
  });

  it('removerFaixa() não remove nada se o usuário cancelar a confirmação', () => {
    const musica: Musica = { id: 3, nome_musica: 'Faixa a remover' };
    const { artist, musicService } = buildArtist();
    artist.arrMusica = [musica];
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    artist.removerFaixa(musica);

    expect(musicService.remove).not.toHaveBeenCalled();
    expect(artist.arrMusica).toEqual([musica]);
  });

  it('tocarFaixa() despacha play pelo player global (sem criar WaveSurfer próprio)', () => {
    const musica: Musica = { id: 9, nome_musica: 'Faixa Y', url: '/audio/y.mp3' };
    const { artist, musicPlayerService } = buildArtist();

    artist.tocarFaixa(musica);

    expect(musicPlayerService.setCurrentMusicID).toHaveBeenCalledWith(9);
    expect(musicPlayerService.setCurrentMusicUrl).toHaveBeenCalledWith('/audio/y.mp3');
    expect(musicPlayerService.setCurrentMusic).toHaveBeenCalledWith(musica);
    expect(musicPlayerService.onPlayPause).toHaveBeenCalledWith('play', 9);
    expect(artist.playingId).toBe(9);
  });

  it('tocarFaixa() na mesma faixa tocando despacha pause (toggle)', () => {
    const musica: Musica = { id: 9, nome_musica: 'Faixa Y', url: '/audio/y.mp3' };
    const { artist, musicPlayerService } = buildArtist();
    artist.playingId = 9;

    artist.tocarFaixa(musica);

    expect(musicPlayerService.onPlayPause).toHaveBeenCalledWith('pause', 9);
    expect(artist.playingId).toBeNull();
  });

  it('reproduzirPrimeiraFaixa() toca a primeira faixa de arrMusica, se houver', () => {
    const musica: Musica = { id: 1, nome_musica: 'Primeira', url: '/audio/1.mp3' };
    const { artist, musicPlayerService } = buildArtist();
    artist.arrMusica = [musica];

    artist.reproduzirPrimeiraFaixa();

    expect(musicPlayerService.onPlayPause).toHaveBeenCalledWith('play', 1);
  });
});
