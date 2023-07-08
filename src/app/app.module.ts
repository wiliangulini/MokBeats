import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import { NgbActiveModal, NgbModule, NgbTooltip, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatOptionModule } from "@angular/material/core";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";
import { RouterLinkActive, RouterLinkWithHref, RouterOutlet } from "@angular/router";
import { AddPlaylistModalComponent } from './add-playlist-modal/add-playlist-modal.component';
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from './app.component';
import { DownloadAmostraComponent } from './download-amostra/download-amostra.component';
import { EfeitosSonorosComponent } from "./efeitos-sonoros/efeitosSonoros.component";
import { EfeitosSonorosService } from "./efeitos-sonoros/efeitosSonoros.service";
import { FilterComponent } from './filter/filter.component';
import { FooterComponent } from './footer/footer.component';
import { GeneroComponent } from './genero/genero.component';
import { HomeComponent } from './home/home.component';
import { HumorComponent } from './humor/humor.component';
import { LicencaValorComponent } from './licenca-valor/licenca-valor.component';
import { AuthService } from "./login/auth.service";
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
import { MusicasComponent } from './musicas/musicas.component';
import { MusicasService } from "./musicas/musicas.service";
import { PoliticaPrivacidadeComponent } from './politica-privacidade/politica-privacidade.component';
import {ScrollService} from "./service/scroll.service";
import { FaqComponent } from './faq/faq.component';


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
    MatTableModule,
  ],
  providers: [
    NgbTooltip,
    NgbActiveModal,
    AuthService,
    MusicasService,
    EfeitosSonorosService,
    ScrollService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
