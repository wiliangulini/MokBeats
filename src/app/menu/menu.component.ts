import {AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import { LoginComponent } from "../login/login.component";
import {AuthService} from "../login/auth.service";
import {MusicasService} from "../musicas/musicas.service";
import {MenuProdutorComponent} from "../menu-produtor/menu-produtor.component";
import {empty, Subscription} from "rxjs";
import {CarrinhoService} from "../service/carrinho.service";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy {

  @ViewChild('nav', {static: true}) nav!: ElementRef;
  @ViewChild('navbarToggler', {static: false}) navbarToggler!: ElementRef;

  // Estado do menu mobile
  isMenuOpen: boolean = false;
  isMobile: boolean = false;

  // Estado de autenticação do usuário
  isUserLoggedIn: boolean = false;
  private authSubscription!: Subscription;

  @HostListener('window:scroll') onWindowScroll() {
    let url: string = location.href;
    let newUrl = url.slice(-8);
    let ms_number: any = document.querySelector('#ms_number');
    let music = this.cartService.receivingCart2();

    // Atualizar contador do carrinho
    if (music.length > 0) {
      ms_number.innerHTML = music.length;
      ms_number.style.display = 'flex';
    } else {
      ms_number.style.display = 'none';
    }

    // Aplicar efeito de scroll no menu
    if (window.scrollY > 75) {
      this.nav.nativeElement.classList.add('bg-dark');
    } else {
      this.nav.nativeElement.classList.remove('bg-dark');
      if (window.scrollY === 0 && newUrl === 'carrinho') {
        this.nav.nativeElement.style.marginTop = '10px';
      }
    }
  }

  @HostListener('window:resize') onResize() {
    this.checkScreenSize();

    // Fechar menu se mudar para desktop
    if (!this.isMobile && this.isMenuOpen) {
      this.isMenuOpen = false;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Fechar menu ao clicar fora (apenas mobile)
    if (this.isMobile && this.isMenuOpen) {
      const navCollapse = document.getElementById('navbarNavDropdown');
      const toggler = this.navbarToggler?.nativeElement;

      if (navCollapse && !navCollapse.contains(event.target as Node) &&
          toggler && !toggler.contains(event.target as Node)) {
        this.closeNav();
      }
    }
  }

  constructor(
    public modalService: NgbModal,
    private authService: AuthService,
    private cartService: CarrinhoService,
  ) { }

  ngOnInit(): void {
    let ms_number: any = document.querySelector('#ms_number');
    if (ms_number) {
      ms_number.style.display = 'none';
    }

    this.checkScreenSize();

    // Subscrever ao estado de autenticação
    this.authSubscription = this.authService.authStatus$.subscribe(
      (isLoggedIn: boolean) => {
        this.isUserLoggedIn = isLoggedIn;
      }
    );
  }

  ngOnDestroy(): void {
    // Cancelar a subscrição para evitar memory leak
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  /**
   * Verifica o tamanho da tela para determinar se é mobile
   */
  checkScreenSize(): void {
    this.isMobile = window.innerWidth < 1024;
  }

  /**
   * Alterna o estado do menu mobile
   */
  toggleMenu(): void {
    if (this.isMobile) {
      this.isMenuOpen = !this.isMenuOpen;

      // Prevenir scroll do body quando menu está aberto
      if (this.isMenuOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  }

  /**
   * Fecha o menu mobile
   */
  closeNav(): void {
    if (this.isMobile) {
      this.isMenuOpen = false;
      document.body.style.overflow = '';
    }
  }

  /**
   * Abre modal de login ou menu do produtor
   */
  modalOpen() {
    this.closeNav();

    if (!this.authService.userAutetic()) {
      return this.modalService.open(LoginComponent, {
        size: 'lg',
        modalDialogClass: 'modal-dialog-centered',
        container: 'body',
        backdrop: 'static',
        keyboard: false
      });
    } else {
      return this.modalService.open(MenuProdutorComponent, {
        size: 'md',
        modalDialogClass: 'modal-dialog-centered',
        container: 'body',
        backdrop: undefined,
        keyboard: false
      });
    }
  }

  /**
   * Efeito hover nos links do menu
   */
  mouseOver(event: any) {
    // Apenas no desktop
    if (!this.isMobile) {
      let li: any = document.querySelector('li.nav-item.active');
      event.target.innerText == li?.innerText ? li?.classList.remove('remove') : li?.classList.add('remove');
    }
  }

  /**
   * Remove efeito hover dos links do menu
   */
  mouseOut() {
    // Apenas no desktop
    if (!this.isMobile) {
      let li: any = document.querySelector('li.nav-item.active');
      li?.classList.remove('remove');
    }
  }

}
