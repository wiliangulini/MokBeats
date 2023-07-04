import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./home/home.component";
import {LoginComponent} from "./login/login.component";
import {PoliticaPrivacidadeComponent} from "./politica-privacidade/politica-privacidade.component";
import {MusicasComponent} from "./musicas/musicas.component";
import {GeneroComponent} from "./genero/genero.component";
import {HumorComponent} from "./humor/humor.component";
import {EfeitosSonorosComponent} from "./efeitos-sonoros/efeitosSonoros.component";

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'musicas', component: MusicasComponent },
  { path: 'efeitos-sonoros', component: EfeitosSonorosComponent },
  { path: 'politica-de-privacidade', component: PoliticaPrivacidadeComponent },
  { path: 'genero', component: GeneroComponent },
  { path: 'humor', component: HumorComponent },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
