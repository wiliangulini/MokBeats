import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AddPlaylistModalComponent } from '../add-playlist-modal/add-playlist-modal.component';
import { DownloadAmostraComponent } from '../download-amostra/download-amostra.component';
import { FavoritosService } from '../favoritos/favoritos.service';
import { AuthService } from '../login/auth.service';
import { CarrinhoService } from '../service/carrinho.service';
import { CrudService } from '../service/crud-service';

export type Musica = {
  id?: number;
  nome_musica?: string;
  nome_produtor?: string;
  url?: string;
  duracao?: number;
  bpm?: number;
  trechos?: number;
  loops?: number;
  key?: string;
  duracaoReal?: number; // Duração real em segundos obtida do áudio
  duracaoCarregando?: boolean; // Flag para indicar que está carregando
};

export type MusicStem = {
  id?: number;
  label?: string;
  type?: string;
  url?: string;
  duration_ms?: number;
};

@Injectable({
  providedIn: 'root',
})
export class MusicasService extends CrudService<Musica> {
  private readonly baseUrl = environment.apiBaseUrl;
  hearth: any;
  hearth1: any;
  addMusicPlaylist: any;
  downloadMusic: any[] = [];
  convertida: Array<any> = [];
  convertida2: Array<any> = [];

  public genero: any = [
    {
      Blues: [
        'Aleatória',
        'Blues eletrificado',
        'Blues acústico',
        'Blues-rock',
        'Chicago',
        'Delta blues',
        'Memphis',
        'St. Louis',
        'Zydeco',
      ],
      Cantores: [
        'Alemães',
        'Brasil',
        'China',
        'Dinamarqueses',
        'Finlândia',
        'França',
        'Grécia',
        'Itália',
        'Japão',
        'K-Pop',
        'México',
        'Rússia',
        'Espanha',
        'Suécia',
        'Índia',
      ],
      Clássica: [
        'Barroca',
        'Canto gregoriano',
        'Clássica moderna/Neoclássica',
        'Composições originais',
        'Medieval',
        'Período clássico',
        'Período romântico',
        'Renascimento',
        'Século XX',
        'Valsa',
        'Ópera',
      ],
      Corporativo: ['Incidental', 'Inspiradora', 'Motivacional'],
      'Dance/Tecno': [
        'Bhangra Trap',
        'Bounce',
        'Break',
        'Dance',
        'Dance Pop',
        'Deep House',
        'Drum and Bass (DnB)',
        'Dubstep',
        'EDM',
        'Future House',
        'Glitch House',
        'House',
        'House Progressivo',
        'Industrial',
        'Jersey Club',
        'Nu Disco',
        'Rave',
        'Tech House',
        'Tecno',
        'Trance',
        'Trap',
        'Tropical House',
      ],
      'Datas comemorativas': [
        'Dia da Independência',
        'Dia das Bruxas',
        'Ano Novo',
        'Natal',
        'Patriótica/Presidencial',
      ],
      Eletrônica: [
        'ASMR',
        'Chill out',
        'Chillwave',
        'Downtempo',
        'Drones',
        'Etéreo',
        'Experimental',
        'Future Bass',
        'Futurewave',
        'Lounge',
        'Minimalista',
        'Trip-hop',
        'Vaporwave',
      ],
      Folk: ['Acústico', 'Folk pop', 'Folk rock', 'Folktronica', 'Indie Folk'],
      'Hip Hop': [
        'Crunk',
        'Gangsta',
        'Hick Hop',
        'Hip hop old school',
        'Hyphy',
        'Rap',
        'Rap emo',
        'Trap',
        'Twerk',
      ],
      'Infantil/Crianças': [
        'Animada',
        'Divertida/Engraçada',
        'Suave/Canção de ninar',
      ],
      Jazz: [
        'Acid jazz',
        'Balada jazz',
        'Dixieland',
        'Exótica',
        'Fusion',
        'Jazz cigano',
        'Jazz latino',
        'Jazz moderno',
        'Lounge jazz',
        'Ragtime',
        'Smooth jazz',
        'Swing',
      ],
      Jogos: [
        '8bits',
        '8bits/Chiptune',
        'Aventura',
        'Batalha',
        'Corrida',
        'Crianças',
        'Fantasia',
      ],
      Latina: [
        'Bachata',
        'Bossa Nova',
        'Brasileira/Samba',
        'Conjunto',
        'Cubana/Salsa',
        'Cúmbia',
        'Espanhola/Flamenca',
        'Jarocho',
        'Mariachi',
        'Norteño',
        'Peruana',
        'Reggaeton',
        'Rock latino',
        'Rumba',
        'Tango',
        'Tex-Mex',
      ],
      Mundo: [
        'Africana',
        'Afro-cubana',
        'Asiática',
        'Balinesa',
        'Balcânica',
        'Bollywood',
        'Cajun',
        'Calipso',
        'Celta',
        'Chinesa',
        'Coreana',
        'Dinamarquesa',
        'Estilo gamelão',
        'Etíope',
        'Europeia',
        'Alemã',
        'Gnawa',
        'Grega',
        'Havaiana',
        'Indiana',
        'Indígena norte-americana',
        'Irlandesa',
        'Italiana',
        'Japonesa',
        'Klezmer',
        'Mediterrânea',
        'Mongol',
        'Norueguesa',
        'Polca',
        'Polinésia',
        'Portuguesa',
        'Escandinava',
        'Tailandesa',
        'Vietnamita',
        'Do Oriente Médio',
      ],
      'New age': [
        'Drones',
        'Elementos de música mundial',
        'Etéreo',
        'Lounge',
        'Orquestral',
      ],
      Noticiário: ['Identidade auditiva', 'Manchetes'],
      'Piano/Solo instrumental': ['Drama humano'],
      Pop: [
        'Adulto contemporâneo',
        'Afrobeat',
        'Balada',
        'Cantor/Compositor',
        'Dream Pop',
        'Electro Pop',
        'Indie Pop',
        'New Wave',
        'Pop chiclete',
        'Pop rock',
        'Suave/Easy listening',
        'Synthpop',
      ],
      Reggae: ['Dancehall', 'Polinésia', 'Soca'],
      'Rhythm and blues': [
        'Disco',
        'Doo-Wop',
        'Funk',
        'Gospel',
        'Motown R&B alternativo',
        'R&B pop',
        'Soul',
        'Soul contemporâneo',
        'Soul pop',
      ],
      Rock: [
        'Alternativo/Grunge',
        'Blues Rock',
        'Boogie-Woogie',
        'Death Metal',
        'Emo',
        'Funk Rock',
        'Hard Rock',
        'Hardcore',
        'Heartland Rock',
        'Heavy Metal',
        'Indie Rock',
        'Mersey Beat',
        'Pop Punk',
        'Pop rock',
        'Punk rock',
        'Raga rock',
        'Rock clássico',
        'Rock n roll',
        'Rock retrô',
        'Rockabilly',
        'Rocktrônica',
        'Ska',
        'Soft rock',
        'Southern rock',
        'Spaghetti Western',
        'Surf rock',
        'Swamp Rock',
      ],
      Sertanejo: [
        'Bluegrass',
        'Faroeste',
        'Honky Tonk',
        'Raízes americanas',
        'Sertaneja tradicional',
        'Sertanejo folk',
        'Sertanejo pop',
        'Sertanejo rock',
        'Swing texano',
      ],
    },
  ];

  public humor: any = [
    'Ação / Esportes',
    'Aventura / Descoberta',
    'Aeróbica / Exercícios',
    'Agressivo',
    'Comédia / Engraçado',
    'Crime / Suspense / Espionagem',
    'Sombrio / Melancólico',
    'Épico / Orquestral',
    'Moda / Estilo de Vida',
    'Bem-Estar / Sentir-se Bem',
    'Suave / Leve',
    'Feliz / Alegre',
    'Terror / Assustador',
    'Mágico / Místico',
    'Militar / Patriótico',
    'Relaxamento / Meditação',
    'Religioso / Cristão',
    'Romântico / Sentimental',
    'Triste / Nostálgico',
    'Ficção Científica / Futurista',
    'Sexy / Sensual',
    'Estranho / Bizarro',
    'Suspense / Drama',
    'Trilhas de Fundo',
    'Inspirador / Elevado',
    'Casamento',
  ];

  public arrMusica!: Musica[];

  constructor(
    private authService: AuthService,
    private modalService: NgbModal,
    private likeService: FavoritosService,
    protected override http: HttpClient,
    private cartService: CarrinhoService,
    private activeModal: NgbActiveModal
  ) {
    super(http, `${environment.apiBaseUrl}/musicas`);
    this.genero.map((obj: any) => {
      Object.keys(obj).map((chave: any) => {
        this.convertida2.push(chave);
        this.convertida.push(obj[chave]);
      });
    });
  }

  override list(): Observable<Musica[]> {
    return super.list();
  }

  // Método para listar músicas com paginação
  listPaginated(page: number = 1, limit: number = 10): Observable<any> {
    return this.http.get(`${this.baseUrl}/musicas`, {
      params: { page: page.toString(), limit: limit.toString() }
    });
  }

  // Faixas do produtor autenticado (área privada — "minhas faixas").
  // Faixas legadas sem producerId nunca aparecem aqui (R29, Decisão 2).
  getByProducer(producerId: string): Observable<Musica[]> {
    return this.http.get<Musica[]>(`${this.baseUrl}/musicas`, {
      params: { producerId }
    });
  }

  override save(record: any): Observable<Musica> {
    return super.save(record);
  }

  override remove(id: number): Observable<Musica> {
    return super.remove(id);
  }

  public curtir(i: number) {
    this.authService.verificaLogin();

    if (this.authService.userAutetic()) {
      this.hearth = document.querySelectorAll('.hearth');
      this.hearth1 = document.querySelectorAll('.hearth1');

      if (this.hearth[i].style.display == 'block') {
        this.hearth[i].style.display = 'none';
        this.hearth1[i].style.display = 'block'; // curtida
      } else {
        this.hearth[i].style.display = 'block'; // descurtida
        this.hearth1[i].style.display = 'none';
      }
    }
  }

  sendFavorite(i: number, favorite: any) {
    this.curtir(i);
    this.likeService.sendFavorite(favorite);
  }

  public addPlayList(music: Musica) {
    this.authService.verificaLogin();
    if (this.authService.userAutetic()) {
      this.list().subscribe((data: any) => {
        this.arrMusica = data;
        this.addMusicPlaylist = music;
        document
          .querySelectorAll('.addPlaylist')
          .forEach((e: any, index: any) => {
            if (this.arrMusica[index].id == this.addMusicPlaylist.id) {
              e.classList.add('amarelo');
              const activeModal = this.modalService.open(
                AddPlaylistModalComponent,
                {
                  size: 'lg',
                  modalDialogClass: 'modal-dialog-centered',
                  container: 'body',
                  backdrop: 'static',
                  keyboard: false,
                }
              );
              activeModal.componentInstance.addNewMusicPlaylist(
                this.addMusicPlaylist
              );
              activeModal.result.then();
            }
          });
      });
    }
  }

  public copiarLink(i: number) {
    console.log(i);
    // let urlMontagem: string = 'pagina-playlist?id=';
    // let url = window.location.href.slice(0, -9) + urlMontagem + i;
    // return url;
  }

  public baixarAmostra(i: number, md: any) {
    console.log(md);
    this.downloadMusic = md;
    this.modalService.open(DownloadAmostraComponent, {
      size: 'lg',
      modalDialogClass: 'modal-dialog-centered',
      container: 'body',
      backdrop: 'static',
      keyboard: false,
    });
  }

  public comprarLicensa(i: any): void {
    this.authService.verificaLogin();
    if (this.authService.userAutetic()) {
      this.cartService.openModalCart(i);
    }
  }

  // Métodos para filtros
  getArtistas(): Observable<any> {
    return this.http.get(`${this.baseUrl}/artistas`);
  }

  getInstrumentos(): Observable<any> {
    return this.http.get(`${this.baseUrl}/instrumentos`);
  }

  getGeneros(): Observable<any> {
    return this.http.get(`${this.baseUrl}/generos`);
  }

  getHumores(): Observable<any> {
    return this.http.get(`${this.baseUrl}/humores`);
  }

  // Método para filtrar músicas (com suporte a paginação)
  filterMusicas(filtros: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/musicas/filtro`, filtros);
  }

  getGenresFull(query?: string): Observable<any> {
    const opts: any = query ? { params: { q: query } } : {};
    return this.http.get(`${this.baseUrl}/genres-full`, opts);
  }

  getSubgeneros(genero: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/subgeneros`, { params: { genero } });
  }

  getStemsByMusicId(id: number): Observable<MusicStem[]> {
    // Usa o endpoint mais novo (alias de compatibilidade no backend)
    return this.http.get<MusicStem[]>(`${this.baseUrl}/tracks/${id}/stems`);
  }

  getLatestUniqueByProducer(limit: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/tracks/latest-unique-by-producer`, {
      params: { limit } as any,
    });
  }
}
