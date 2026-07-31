import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import {
  NgbActiveModal,
  NgbModule,
  NgbTooltip,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';

import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {
  MAT_CHECKBOX_DEFAULT_OPTIONS,
  MatCheckboxDefaultOptions,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  MAT_RADIO_DEFAULT_OPTIONS,
  MatRadioModule,
} from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  RouterLinkActive,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { AddPlaylistModalComponent } from './add-playlist-modal/add-playlist-modal.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ArtistComponent } from './artist/artist.component';
import { AssinaturaComponent } from './assinatura/assinatura.component';
import { AtualizarInformacoesComponent } from './atualizar-informacoes/atualizar-informacoes.component';
import { ButtonWhatsComponent } from './button-whats/button-whats.component';
import { CarrinhoComponent } from './carrinho/carrinho.component';
import { CartModalComponent } from './carrinho/cartModal/cart-modal.component';
import { ContatoComponent } from './contato/contato.component';
import { CreatePlaylistModalComponent } from './create-playlist-modal/create-playlist-modal.component';
import { EditPlaylistModalComponent } from './create-playlist-modal/edit-playlist-modal/edit-playlist-modal.component';
import { CustomFileUploadComponent } from './custom-file-upload/custom-file-upload.component';
import { PlaceholderEllipsisDirective } from './directives/placeholder-ellipsis.directive';
import { DownloadAmostraComponent } from './download-amostra/download-amostra.component';
import { PaginationComponent } from './shared/pagination/pagination.component';
import { ProfileNotificationBannerComponent } from './shared/profile-notification-banner/profile-notification-banner.component';
import { EfeitosSonorosComponent } from './efeitos-sonoros/efeitosSonoros.component';
import { EfeitosSonorosService } from './efeitos-sonoros/efeitosSonoros.service';
import { FaqComponent } from './faq/faq.component';
import { FavoritosComponent } from './favoritos/favoritos.component';
import { FavoritosService } from './favoritos/favoritos.service';
import { FilterComponent } from './filter/filter.component';
import { FinalizarCompraComponent } from './finalizar-compra/finalizar-compra.component';
import { FooterComponent } from './footer/footer.component';
import { FormasDePagamentoComponent } from './formas-de-pagamento/formas-de-pagamento.component';
import { GeneroComponent } from './genero/genero.component';
import { HomeComponent } from './home/home.component';
import { HumorComponent } from './humor/humor.component';
import { I18nextTestComponent } from './i18next-test/i18next-test.component';
import { LicencaValorComponent } from './licenca-valor/licenca-valor.component';
import { AuthService } from './login/auth.service';
import { LoginComponent } from './login/login.component';
import { MenuProdutorComponent } from './menu-produtor/menu-produtor.component';
import { MenuComponent } from './menu/menu.component';
import { MusicasComponent } from './musicas/musicas.component';
import { MusicasService } from './musicas/musicas.service';
import { PagPlaylistComponent } from './pag-playlist/pag-playlist.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { PlayerComponent } from './player/player.component';
import { PlaylistsComponent } from './playlists/playlists.component';
import { PoliticaPrivacidadeComponent } from './politica-privacidade/politica-privacidade.component';
import { ProdutoresComponent } from './produtores/produtores.component';
import { ConfigService } from './service/config.service';
import { ScrollService } from './service/scroll.service';
import { SubMenuComponent } from './sub-menu/sub-menu.component';
import { TermosPrivacidadeComponent } from './termos-privacidade/termos-privacidade.component';
import { UsuarioArtistaComponent } from './usuario-artista/usuario-artista.component';
import { WaveSurferTestComponent } from './wave-surfer-test/wave-surfer-test.component';
import { DashboardProdutorComponent } from './dashboard-produtor/dashboard-produtor.component';

@NgModule({ declarations: [
        AppComponent,
        MenuComponent,
        HomeComponent,
        FooterComponent,
        LoginComponent,
        PoliticaPrivacidadeComponent,
        MusicasComponent,
        GeneroComponent,
        FilterComponent,
        HumorComponent,
        AddPlaylistModalComponent,
        DownloadAmostraComponent,
        EfeitosSonorosComponent,
        LicencaValorComponent,
        FaqComponent,
        ProdutoresComponent,
        MenuProdutorComponent,
        ButtonWhatsComponent,
        FavoritosComponent,
        PlaylistsComponent,
        AssinaturaComponent,
        PedidosComponent,
        FormasDePagamentoComponent,
        AtualizarInformacoesComponent,
        SubMenuComponent,
        FinalizarCompraComponent,
        ContatoComponent,
        CreatePlaylistModalComponent,
        PagPlaylistComponent,
        EditPlaylistModalComponent,
        ArtistComponent,
        CarrinhoComponent,
        PlayerComponent,
        UsuarioArtistaComponent,
        CartModalComponent,
        I18nextTestComponent,
        WaveSurferTestComponent,
        PlaceholderEllipsisDirective,
        TermosPrivacidadeComponent,
        CustomFileUploadComponent,
        PaginationComponent,
        ProfileNotificationBannerComponent,
        DashboardProdutorComponent,
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        RouterOutlet,
        RouterLink,
        RouterLinkActive,
        MatSelectModule,
        MatOptionModule,
        MatIconModule,
        NgbModule,
        NgbTooltipModule,
        MatCheckboxModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatTableModule,
        MatRadioModule,
        MatSnackBarModule,
        MatInputModule,
        MatFormFieldModule], providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        NgbTooltip,
        NgbActiveModal,
        AuthService,
        MusicasService,
        EfeitosSonorosService,
        ScrollService,
        FavoritosService,
        ConfigService,
        {
            provide: MAT_RADIO_DEFAULT_OPTIONS,
            useValue: { color: 'accent' },
        },
        {
            provide: MAT_CHECKBOX_DEFAULT_OPTIONS,
            useValue: {
                clickAction: 'check-indeterminate',
            } as MatCheckboxDefaultOptions,
        },
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
    ] })
export class AppModule {}
