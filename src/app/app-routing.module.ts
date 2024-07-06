import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { EfeitosSonorosComponent } from "./efeitos-sonoros/efeitosSonoros.component";
import { GeneroComponent } from "./genero/genero.component";
import { HomeComponent } from "./home/home.component";
import { HumorComponent } from "./humor/humor.component";
import { LicencaValorComponent } from "./licenca-valor/licenca-valor.component";
import { LoginComponent } from "./login/login.component";
import { MusicasComponent } from "./musicas/musicas.component";
import { PoliticaPrivacidadeComponent } from "./politica-privacidade/politica-privacidade.component";
import {FaqComponent} from "./faq/faq.component";
import {ProdutoresComponent} from "./produtores/produtores.component";
import {FavoritosComponent} from "./favoritos/favoritos.component";
import {PlaylistsComponent} from "./playlists/playlists.component";
import {AssinaturaComponent} from "./assinatura/assinatura.component";
import {PedidosComponent} from "./pedidos/pedidos.component";
import {FormasDePagamentoComponent} from "./formas-de-pagamento/formas-de-pagamento.component";
import {AtualizarInformacoesComponent} from "./atualizar-informacoes/atualizar-informacoes.component";
import {FinalizarCompraComponent} from "./finalizar-compra/finalizar-compra.component";
import {ContatoComponent} from "./contato/contato.component";
import {PagPlaylistComponent} from "./pag-playlist/pag-playlist.component";
import {ArtistComponent} from "./artist/artist.component";
import {CarrinhoComponent} from "./carrinho/carrinho.component";
import {UsuarioArtistaComponent} from "./usuario-artista/usuario-artista.component";
import {PlayerComponent} from "./player/player.component";

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'musicas', component: MusicasComponent },
  { path: 'player', component: PlayerComponent },
  { path: 'efeitos-sonoros', component: EfeitosSonorosComponent },
  { path: 'precos', component: LicencaValorComponent },
  { path: 'politica-de-privacidade', component: PoliticaPrivacidadeComponent },
  { path: 'genero', component: GeneroComponent },
  { path: 'humor', component: HumorComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'produtores', component: ProdutoresComponent },
  { path: 'favoritos', component: FavoritosComponent },
  { path: 'playlists', component: PlaylistsComponent },
  { path: 'assinatura', component: AssinaturaComponent },
  { path: 'pedidos', component: PedidosComponent },
  { path: 'formas-de-pagamento', component: FormasDePagamentoComponent },
  { path: 'artista', component: ArtistComponent },
  { path: 'pagina-artista', component: UsuarioArtistaComponent },
  { path: 'atualizar-informacoes', component: AtualizarInformacoesComponent },
  { path: 'finalizar-compra', component: FinalizarCompraComponent },
  { path: 'contato', component: ContatoComponent },
  { path: 'pagina-playlist', component: PagPlaylistComponent },
  { path: 'carrinho', component: CarrinhoComponent },
  { path: 'upload', loadChildren: () => import('./upload-file/upload-file.module').then(m => m.UploadFileModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
