import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {NgbActiveModal, NgbModule, NgbTooltip, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';

import {AppComponent} from './app.component';
import {MenuComponent} from './menu/menu.component';
import {HomeComponent} from './home/home.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterLinkActive, RouterLinkWithHref, RouterOutlet} from "@angular/router";
import {AppRoutingModule} from "./app-routing.module";
import {HttpClientModule} from "@angular/common/http";
import {MatSelectModule} from "@angular/material/select";
import {MatOptionModule} from "@angular/material/core";
import {MatIconModule} from "@angular/material/icon";
import {FooterComponent} from './footer/footer.component';
import {LoginComponent} from './login/login.component';
import {PoliticaPrivacidadeComponent} from './politica-privacidade/politica-privacidade.component';
import {AuthService} from "./login/auth.service";
import {MusicasComponent} from './musicas/musicas.component';
import {MusicasService} from "./musicas/musicas.service";
import {GeneroComponent} from './genero/genero.component';
import {FilterComponent} from './filter/filter.component';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {HumorComponent} from './humor/humor.component';
import {AddPlaylistModalComponent} from './add-playlist-modal/add-playlist-modal.component';
import {DownloadAmostraComponent} from './download-amostra/download-amostra.component';
import {MatButtonModule} from "@angular/material/button";
import {EfeitosSonorosComponent} from "./efeitos-sonoros/efeitosSonoros.component";
import {EfeitosSonorosService} from "./efeitos-sonoros/efeitosSonoros.service";
import { LicencaValorComponent } from './licenca-valor/licenca-valor.component';
import {MatButtonToggleModule} from "@angular/material/button-toggle";

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
  ],
  imports: [
    BrowserModule,
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
  ],
  providers: [
    NgbTooltip,
    NgbActiveModal,
    AuthService,
    MusicasService,
    EfeitosSonorosService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
