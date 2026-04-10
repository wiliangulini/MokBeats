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
import { TermosPrivacidadeComponent } from "./termos-privacidade/termos-privacidade.component";
import { AuthGuard } from "./guards/auth.guard";
import { ProfileCompleteGuard } from "./guards/profile-complete.guard";
import { ProdutorGuard } from "./guards/produtor.guard";
import { DashboardProdutorComponent } from "./dashboard-produtor/dashboard-produtor.component";

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'musicas', component: MusicasComponent },
  { path: 'player', component: PlayerComponent },
  { path: 'efeitos-sonoros', component: EfeitosSonorosComponent },
  { path: 'precos', component: LicencaValorComponent },
  { path: 'politica-de-privacidade', component: PoliticaPrivacidadeComponent },
  { path: 'termos-do-site', component: TermosPrivacidadeComponent },
  { path: 'genero', component: GeneroComponent },
  { path: 'humor', component: HumorComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'produtores', component: ProdutoresComponent },
  { path: 'favoritos', component: FavoritosComponent, canActivate: [AuthGuard] },
  { path: 'playlists', component: PlaylistsComponent, canActivate: [AuthGuard] },
  { path: 'assinatura', component: AssinaturaComponent, canActivate: [AuthGuard] },
  { path: 'pedidos', component: PedidosComponent, canActivate: [AuthGuard] },
  { path: 'formas-de-pagamento', component: FormasDePagamentoComponent, canActivate: [AuthGuard] },
  { path: 'artista', component: ArtistComponent },
  { path: 'pagina-artista', component: UsuarioArtistaComponent },
  { path: 'atualizar-informacoes', component: AtualizarInformacoesComponent, canActivate: [AuthGuard] },
  { path: 'finalizar-compra', component: FinalizarCompraComponent, canActivate: [AuthGuard, ProfileCompleteGuard] },
  { path: 'contato', component: ContatoComponent },
  { path: 'pagina-playlist', component: PagPlaylistComponent },
  { path: 'carrinho', component: CarrinhoComponent },
  { path: 'upload', loadChildren: () => import('./upload-file/upload-file.module').then(m => m.UploadFileModule), canActivate: [AuthGuard, ProfileCompleteGuard] },
  { path: 'dados-pessoais', redirectTo: 'atualizar-informacoes', pathMatch: 'full' },
  { path: 'dashboard-produtor', component: DashboardProdutorComponent, canActivate: [AuthGuard, ProdutorGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
