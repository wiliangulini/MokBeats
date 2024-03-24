import {NgModule} from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {BrowserModule} from '@angular/platform-browser';
import {NgbActiveModal, NgbModule, NgbTooltip, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';

import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MAT_CHECKBOX_DEFAULT_OPTIONS, MatCheckboxDefaultOptions, MatCheckboxModule} from "@angular/material/checkbox";
import {MatOptionModule} from "@angular/material/core";
import {MatIconModule} from "@angular/material/icon";
import {MatSelectModule} from "@angular/material/select";
import {RouterLinkActive, RouterLinkWithHref, RouterOutlet} from "@angular/router";
import {AddPlaylistModalComponent} from './add-playlist-modal/add-playlist-modal.component';
import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from './app.component';
import {DownloadAmostraComponent} from './download-amostra/download-amostra.component';
import {EfeitosSonorosComponent} from "./efeitos-sonoros/efeitosSonoros.component";
import {EfeitosSonorosService} from "./efeitos-sonoros/efeitosSonoros.service";
import {FilterComponent} from './filter/filter.component';
import {FooterComponent} from './footer/footer.component';
import {GeneroComponent} from './genero/genero.component';
import {HomeComponent} from './home/home.component';
import {HumorComponent} from './humor/humor.component';
import {LicencaValorComponent} from './licenca-valor/licenca-valor.component';
import {AuthService} from "./login/auth.service";
import {LoginComponent} from './login/login.component';
import {MenuComponent} from './menu/menu.component';
import {MusicasComponent} from './musicas/musicas.component';
import {MusicasService} from "./musicas/musicas.service";
import {PoliticaPrivacidadeComponent} from './politica-privacidade/politica-privacidade.component';
import {ScrollService} from "./service/scroll.service";
import {FaqComponent} from './faq/faq.component';
import {ProdutoresComponent} from './produtores/produtores.component';
import {MAT_RADIO_DEFAULT_OPTIONS, MatRadioModule} from "@angular/material/radio";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatInputModule} from "@angular/material/input";
import {MenuProdutorComponent} from './menu-produtor/menu-produtor.component';
import {ButtonWhatsComponent} from './button-whats/button-whats.component';
import {FavoritosComponent} from './favoritos/favoritos.component';
import {PlaylistsComponent} from './playlists/playlists.component';
import {AssinaturaComponent} from './assinatura/assinatura.component';
import {PedidosComponent} from './pedidos/pedidos.component';
import {FormasDePagamentoComponent} from './formas-de-pagamento/formas-de-pagamento.component';
import {AtualizarInformacoesComponent} from './atualizar-informacoes/atualizar-informacoes.component';
import {FavoritosService} from "./favoritos/favoritos.service";
import {SubMenuComponent} from './sub-menu/sub-menu.component';
import {FinalizarCompraComponent} from './finalizar-compra/finalizar-compra.component';
import {ContatoComponent} from './contato/contato.component';
import {CreatePlaylistModalComponent} from './create-playlist-modal/create-playlist-modal.component';
import {PagPlaylistComponent} from './pag-playlist/pag-playlist.component';
import {EditPlaylistModalComponent} from './create-playlist-modal/edit-playlist-modal/edit-playlist-modal.component';
import {ArtistComponent} from './artist/artist.component';
import {CarrinhoComponent} from './carrinho/carrinho.component';
import {PlayerComponent} from './player/player.component';
import {UsuarioArtistaComponent} from './usuario-artista/usuario-artista.component';
import {MatFormFieldModule} from "@angular/material/form-field";


@NgModule({
  declarations: [
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
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    RouterOutlet,
    RouterLinkWithHref,
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
    MatFormFieldModule,
  ],
  providers: [
    NgbTooltip,
    NgbActiveModal,
    AuthService,
    MusicasService,
    EfeitosSonorosService,
    ScrollService,
    FavoritosService,
    {
      provide: MAT_RADIO_DEFAULT_OPTIONS,
      useValue: { color: 'accent' },
    },
    {
      provide: MAT_CHECKBOX_DEFAULT_OPTIONS,
      useValue: { clickAction: 'check-indeterminate' } as MatCheckboxDefaultOptions
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
