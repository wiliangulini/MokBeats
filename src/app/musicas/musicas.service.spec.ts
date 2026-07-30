import { HttpClient } from '@angular/common/http';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { environment } from '../../environments/environment';
import { FavoritosService } from '../favoritos/favoritos.service';
import { AuthService } from '../login/auth.service';
import { CarrinhoService } from '../service/carrinho.service';
import { Musica, MusicasService } from './musicas.service';

describe('MusicasService', () => {
  let service: MusicasService;
  let authService: jasmine.SpyObj<AuthService>;
  let cartService: jasmine.SpyObj<CarrinhoService>;
  let httpClient: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    authService = jasmine.createSpyObj<AuthService>(
      'AuthService',
      ['verificaLogin', 'userAutetic']
    );
    cartService = jasmine.createSpyObj<CarrinhoService>(
      'CarrinhoService',
      ['openModalCart']
    );
    httpClient = jasmine.createSpyObj<HttpClient>('HttpClient', ['get']);
    httpClient.get.and.returnValue(of([]));

    service = new MusicasService(
      authService,
      {} as NgbModal,
      {} as FavoritosService,
      httpClient,
      cartService,
      {} as NgbActiveModal
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open license selection for an authenticated user', () => {
    const music: Musica = {
      id: 1,
      nome_musica: 'Faixa de teste',
    };
    authService.userAutetic.and.returnValue(true);

    service.comprarLicensa(music);

    expect(authService.verificaLogin).toHaveBeenCalled();
    expect(cartService.openModalCart).toHaveBeenCalledOnceWith(music);
  });

  it('should not open license selection for an unauthenticated user', () => {
    authService.userAutetic.and.returnValue(false);

    service.comprarLicensa({ id: 1 });

    expect(authService.verificaLogin).toHaveBeenCalled();
    expect(cartService.openModalCart).not.toHaveBeenCalled();
  });

  it('should request stems from /tracks/:id/stems endpoint', () => {
    service.getStemsByMusicId(7).subscribe();

    expect(httpClient.get).toHaveBeenCalledOnceWith(
      `${environment.apiBaseUrl}/tracks/7/stems`
    );
  });
});
