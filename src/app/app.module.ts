import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {NgbActiveModal, NgbModule, NgbTooltip, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';

import {AppComponent} from './app.component';
import {LogoComponent} from "../assets/images/logo.component";
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
import { MusicasComponent } from './musicas/musicas.component';
import {MusicasService} from "./musicas/musicas.service";
import { GeneroComponent } from './genero/genero.component';

@NgModule({
  declarations: [
    AppComponent,
    LogoComponent,
    MenuComponent,
    HomeComponent,
    FooterComponent,
    LoginComponent,
    PoliticaPrivacidadeComponent,
    MusicasComponent,
    GeneroComponent,
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
  ],
  providers: [
    NgbTooltip,
    NgbActiveModal,
    AuthService,
    MusicasService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
