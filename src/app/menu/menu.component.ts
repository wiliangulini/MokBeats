import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {NgbModal, NgbNavbar} from "@ng-bootstrap/ng-bootstrap";
import { LoginComponent } from "../login/login.component";
import {AuthService} from "../login/auth.service";
import {MusicasService} from "../musicas/musicas.service";
import {MenuProdutorComponent} from "../menu-produtor/menu-produtor.component";
import {empty} from "rxjs";
import {CarrinhoService} from "../service/carrinho.service";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  @ViewChild('nav', {static: true}) nav!:ElementRef;

  @HostListener('window:scroll') onWindowScroll() {
    let url: string = location.href;
    let newUrl = url.slice(-8);
    
    if (window.scrollY > 75) {
      this.nav.nativeElement.removeAttribute('style');
      this.nav.nativeElement.setAttribute('style', 'background-image: linear-gradient(90deg, #000, #343a40);');
      
    } else {
      this.nav.nativeElement.removeAttribute('style');
      this.nav.nativeElement.setAttribute('style', 'background-image: none; background-color: transparent;');
      if (window.scrollY === 0 && newUrl === 'carrinho') {
        this.nav.nativeElement.style.marginTop = '10px';
      }
    }
  }
  
  musicNumber: any;
  
  constructor(
    public modalService: NgbModal,
    private authService: AuthService,
    private cartService: CarrinhoService,
) { }

  ngOnInit(): void {}
  
  closeNav(): void {
    if (screen.width < 769) {
      let close = document.getElementById('closeNav');
      close!.click();
    } else if (screen.width >= 769){
      this.nav.nativeElement.removeAttribute('style');
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
    console.log(event)
    let li: any = document.querySelector('li.nav-item.active');
    event.target.innerText == li?.innerText ? li?.classList.remove('remove') : li?.classList.add('remove');
  }
  
  mouseOut() {
    let li: any = document.querySelector('li.nav-item.active');
    li?.classList.remove('remove');
  }
  
}
