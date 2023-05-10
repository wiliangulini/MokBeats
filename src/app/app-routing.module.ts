import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./home/home.component";
import {LoginComponent} from "./login/login.component";
import {PoliticaPrivacidadeComponent} from "./politica-privacidade/politica-privacidade.component";
import {MusicasComponent} from "./musicas/musicas.component";
import {GeneroComponent} from "./genero/genero.component";
import {HumorComponent} from "./humor/humor.component";

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'musicas', component: MusicasComponent },
  { path: 'politica-de-privacidade', component: PoliticaPrivacidadeComponent },
  { path: 'genero', component: GeneroComponent },
  { path: 'humor', component: HumorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
