import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { LoginComponent } from "../login/login.component";

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

  constructor(public modalService: NgbModal) { }

  ngOnInit(): void {}

  closeNav(): void {
    if (screen.width < 769) {
      let close = document.getElementById('closeNav');
      close!.click();
    }
  }

  modalOpen() {
    this.closeNav();
    return  this.modalService.open(LoginComponent, {size: 'lg', modalDialogClass: 'modal-dialog-centered', container: 'body', backdrop: 'static', keyboard: false});
  }

}
