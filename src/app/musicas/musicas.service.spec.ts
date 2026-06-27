import { HttpClient } from '@angular/common/http';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FavoritosService } from '../favoritos/favoritos.service';
import { AuthService } from '../login/auth.service';
import { CarrinhoService } from '../service/carrinho.service';
import { Musica, MusicasService } from './musicas.service';

describe('MusicasService', () => {
  let service: MusicasService;
  let authService: jasmine.SpyObj<AuthService>;
  let cartService: jasmine.SpyObj<CarrinhoService>;

  beforeEach(() => {
    authService = jasmine.createSpyObj<AuthService>(
      'AuthService',
      ['verificaLogin', 'userAutetic']
    );
    cartService = jasmine.createSpyObj<CarrinhoService>(
      'CarrinhoService',
      ['openModalCart']
    );

    service = new MusicasService(
      authService,
      {} as NgbModal,
      {} as FavoritosService,
      {} as HttpClient,
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
});
