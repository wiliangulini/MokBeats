import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import {NgbModal, NgbNavbar} from "@ng-bootstrap/ng-bootstrap";
import { LoginComponent } from "../login/login.component";
import {AuthService} from "../login/auth.service";
import {MusicasService} from "../musicas/musicas.service";
import {MenuProdutorComponent} from "../menu-produtor/menu-produtor.component";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  @ViewChild('nav', {static: true}) nav!:ElementRef;

  @HostListener('window:scroll') onWindowScroll() {
    if (window.scrollY > 75) {
      this.nav.nativeElement.style.backgroundImage = 'linear-gradient(90deg, #000, #343a40)';
    } else {
      this.nav.nativeElement.style.backgroundColor = 'transparent';
      this.nav.nativeElement.style.backgroundImage = 'none';
    }
  }

  constructor(
    public modalService: NgbModal,
    private authService: AuthService,
) { }

  ngOnInit(): void {}

  closeNav(): void {
    if (screen.width < 769) {
      let close = document.getElementById('closeNav');
      close!.click();
    }
  }

  modalOpen() {
    this.closeNav();

    if (!this.authService.userAutetic()) {
      return  this.modalService.open(LoginComponent, {size: 'lg', modalDialogClass: 'modal-dialog-centered', container: 'body', backdrop: 'static', keyboard: false});
    } else {
      return  this.modalService.open(MenuProdutorComponent, {size: 'md', modalDialogClass: 'modal-dialog-centered', container: 'body', backdrop: undefined, keyboard: false});
    }

  }
  
  mouseOver(event: any) {
    let li: any = document.querySelector('li.nav-item.active');
    event.target.innerText == li?.innerText ? li?.classList.remove('remove') : li?.classList.add('remove');
  }
  
  mouseOut() {
    let li: any = document.querySelector('li.nav-item.active');
    li?.classList.remove('remove');
  }
  
}
