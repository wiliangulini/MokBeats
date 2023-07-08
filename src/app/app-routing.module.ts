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

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'musicas', component: MusicasComponent },
  { path: 'efeitos-sonoros', component: EfeitosSonorosComponent },
  { path: 'precos', component: LicencaValorComponent },
  { path: 'politica-de-privacidade', component: PoliticaPrivacidadeComponent },
  { path: 'genero', component: GeneroComponent },
  { path: 'humor', component: HumorComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'produtores', component: ProdutoresComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
