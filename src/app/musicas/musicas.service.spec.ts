import type { MockedObject } from "vitest";
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
    let authService: MockedObject<AuthService>;
    let cartService: MockedObject<CarrinhoService>;
    let httpClient: MockedObject<HttpClient>;

    beforeEach(() => {
        authService = {
            verificaLogin: vi.fn().mockName("AuthService.verificaLogin"),
            userAutetic: vi.fn().mockName("AuthService.userAutetic")
        } as unknown as MockedObject<AuthService>;
        cartService = {
            openModalCart: vi.fn().mockName("CarrinhoService.openModalCart")
        } as unknown as MockedObject<CarrinhoService>;
        httpClient = {
            get: vi.fn().mockName("HttpClient.get")
        } as unknown as MockedObject<HttpClient>;
        httpClient.get.mockReturnValue(of([]));

        service = new MusicasService(authService, {} as NgbModal, {} as FavoritosService, httpClient, cartService, {} as NgbActiveModal);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should open license selection for an authenticated user', () => {
        const music: Musica = {
            id: 1,
            nome_musica: 'Faixa de teste',
        };
        authService.userAutetic.mockReturnValue(true);

        service.comprarLicensa(music);

        expect(authService.verificaLogin).toHaveBeenCalled();
        expect(cartService.openModalCart).toHaveBeenCalledTimes(1);
        expect(cartService.openModalCart).toHaveBeenCalledWith(music);
    });

    it('should not open license selection for an unauthenticated user', () => {
        authService.userAutetic.mockReturnValue(false);

        service.comprarLicensa({ id: 1 });

        expect(authService.verificaLogin).toHaveBeenCalled();
        expect(cartService.openModalCart).not.toHaveBeenCalled();
    });

    it('should request stems from /tracks/:id/stems endpoint', () => {
        service.getStemsByMusicId(7).subscribe();

        expect(httpClient.get).toHaveBeenCalledTimes(1);

        expect(httpClient.get).toHaveBeenCalledWith(`${environment.apiBaseUrl}/tracks/7/stems`);
    });
});
