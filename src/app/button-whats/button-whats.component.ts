import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-button-whats',
  templateUrl: './button-whats.component.html',
  styleUrls: ['./button-whats.component.scss']
})
export class ButtonWhatsComponent implements OnInit {

  url: string = 'https://api.whatsapp.com/send?phone=5546991161666&text=Entre+em+contato+agora';

  @ViewChild('btnW', {static: true}) btnW!:ElementRef;
  @ViewChild('sectionSubmit', {static: true}) sectionSubmit!: ElementRef;

  @HostListener('window:scroll') onWindowScroll() {
    if (this.isScrolledIntoView(this.sectionSubmit.nativeElement)) {
      this.btnW.nativeElement.style.display = 'none'
    } else {
      this.btnW.nativeElement.style.display = 'flex';
    }
  }
  constructor() { }

  ngOnInit(): void {
  }

  isScrolledIntoView(elem: any) {
    let docViewTop = window.scrollY;
    let docViewBottom = docViewTop + window.innerHeight;

    let elemTop = elem.offsetTop;
    let elemBottom = elemTop + elem.offsetHeight;
    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
  }

  closeWhats(event: any) {
    console.log(event);
    console.log(this.btnW.nativeElement.getAttribute('href'));

    if(event.target.className == 'material-icons' && (this.btnW.nativeElement.getAttribute('href') == null || this.btnW.nativeElement.getAttribute('href') == 'https://api.whatsapp.com/send?phone=5546991161666&text=Entre+em+contato+agora')) {
      document.querySelectorAll('.btn').forEach((e: any) => {
        if(e.classList.contains('btn-whats')) {
          this.btnW.nativeElement.parentNode.removeChild(e);
        }
      })
    } else if (this.btnW.nativeElement.getAttribute('href') == null) {
      this.btnW.nativeElement.setAttribute('href', this.url);
    }
  }
}
