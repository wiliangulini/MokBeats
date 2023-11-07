import {AfterContentInit, AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-formas-de-pagamento',
  templateUrl: './formas-de-pagamento.component.html',
  styleUrls: ['./formas-de-pagamento.component.scss']
})
export class FormasDePagamentoComponent implements OnInit, AfterViewChecked, AfterContentInit {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
  ) {
    this.form = this.fb.group({
      cred: [null, Validators.required],
      nomecartao: [null, Validators.required],
      numero_cartao: [null, Validators.required],
      cpf: [null, Validators.required],
      expiracao: [null, Validators.required],
      codseguranca: [null, Validators.required],
      chavepix: [null, Validators.required],
      boleto: [null, Validators.required],
    });
  }

  ngOnInit(): void {
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }
  ngAfterContentInit() {

    //inserir e remover background verde e mudar imagens e cor de texto para branco, variaveis e funçoes abaixo
    let credito: any = document.getElementById('credito');
    let imgCred: any = document.getElementById('imgCred');
    let colCred: any = document.querySelector('.colCred');
    let optionOne: any = document.querySelector(".option.one");

    let debito: any = document.getElementById('debito');
    let imgDeb: any = document.getElementById('imgDeb');
    let colDeb: any = document.querySelector('.colDeb');

    let pix: any = document.getElementById('pix');
    let imgPix: any = document.getElementById('imgPix');
    let colPix: any = document.querySelector('.colPix');
    let cardPix: any = document.getElementById('cardPix');

    let boleto: any = document.getElementById('boleto');
    let imgBol: any = document.getElementById('imgBol');
    let colBol: any = document.querySelector('.colBol');
    let divBoleto: any = document.getElementById('divBoleto');
    let bolDados: any = document.getElementById('bolDados');
    let bolGer: any = document.getElementById('bolGer');

    //button div
    let btnProx: any = document.getElementById('btnProx');

    let btn: any = document.getElementById('btn');

    let credInsert = () => {
      credito.classList.add("background");
      imgCred.setAttribute("src","assets/images/financeiro/credit-card-w.webp");
      colCred.style.color = "#FFF";
    }
    let credRemove = () => {
      credito.classList.remove("background");
      imgCred.setAttribute("src","assets/images/financeiro/credit-card.webp");
      colCred.style.color = "#727272";
    }
    let debInsert = () => {
      debito.classList.add("background");
      imgDeb.setAttribute("src","assets/images/financeiro/debito-w.svg");
      colDeb.style.color = "#FFF";
    }
    let debRemove = () => {
      debito.classList.remove("background");
      imgDeb.setAttribute("src","assets/images/financeiro/debito.webp");
      colDeb.style.color = "#727272";
    }

    let pixInsert = () => {
      pix.classList.add("background");
      imgPix.setAttribute("src","assets/images/financeiro/pix-w.webp");
      colPix.style.color = "#FFF";
    }
    let pixRemove = () => {
      pix.classList.remove("background");
      imgPix.setAttribute('src','assets/images/financeiro/pix.webp');
      colPix.style.color = "#727272";
    }

    let bolInsert = () => {
      boleto.classList.add("background");
      imgBol.setAttribute("src","assets/images/financeiro/boleto-w.webp");
      colBol.style.color = "#FFF";
    }
    let bolRemove = () => {
      boleto.classList.remove("background");
      imgBol.setAttribute("src","assets/images/financeiro/boleto.webp");
      colBol.style.color = "#727272";
    }

    let titleColor = () => {
      document.getElementById('preencher_dados')!.style.color = "#4B4B4B";
      document.getElementById('arrowUp')!.setAttribute('src','assets/images/checkout/arrowMob.webp');
    }

    credito.addEventListener("click", () => {
      credInsert();
      debRemove();
      pixRemove();
      bolRemove();
      titleColor();
      divBoleto.style.display = "none";
      cardPix.style.display = "none";
      optionOne.style.display = "flex";
      btnProx.style.marginTop = "0";
      btn.classList.add("btn-gradient");
      btn.classList.remove("btn-grey");
    });

    debito.addEventListener("click", () => {
      debInsert();
      credRemove();
      pixRemove();
      bolRemove();
      titleColor();
      divBoleto.style.display = "none";
      cardPix.style.display = "none";
      optionOne.style.display = "flex";
      btnProx.style.marginTop = "0";
      document.getElementById('cred')!.style.display = "none";
      document.getElementById('cardDeb')!.style.display = "flex";
      btn.classList.add("btn-gradient");
      btn.classList.remove("btn-grey");
    });

    pix.addEventListener("click", () => {
      pixInsert();
      debRemove();
      credRemove();
      bolRemove();
      titleColor();
      optionOne.style.display = "none";
      btnProx.style.marginTop = "0";
      divBoleto.style.display = "none";
      cardPix.style.display = "flex";
      btn.classList.add("btn-gradient");
      btn.classList.remove("btn-grey");
    });

    boleto.addEventListener("click", () => {
      bolInsert();
      debRemove();
      pixRemove();
      credRemove();
      titleColor();
      optionOne.style.display = "none";
      btnProx.style.marginTop = "0";
      cardPix.style.display = "none";
      divBoleto.style.display = "flex";
      btn.classList.add("btn-gradient");
      btn.classList.remove("btn-grey");
      btn.setAttribute("onclick","gerarBoleto()");
    });

    let gerarBoleto = () => {
      bolDados.style.display = 'none';
      bolGer.style.display = 'flex';
    }


//mascara para num cartao

    function medidor(v: any){
      v = v.replace(/\D/g,"");
      v=v.replace(/^(\d{4})(\d)/g,"$1 $2");
      v=v.replace(/^(\d{4})\s(\d{4})(\d)/g,"$1 $2 $3");
      v=v.replace(/^(\d{4})\s(\d{4})\s(\d{4})(\d)/g,"$1 $2 $3 $4");
      return v;
    }


//mascara para data de validade

    function mccDate(v: any){
      v = v.replace(/\D/g,""); // Permite apenas dígitos
      v = v.replace(/(\d{2})/g, "$1/"); // Coloca um ponto a cada 4 caracteres
      v = v.replace(/\/$/, ""); // Remove o ponto se estiver sobrando
      v = v.substring(0, 5)// Limita o tamanho

      return v;
    }

// pegar cartao utilizado
    let tgdeveloper = {

      getCardFlag: function(cn: any) {
        let cardnumber = cn.replace(/[^0-9]+/g, '');

        let cards: any = {
          visa      : /^4[0-9]{12}(?:[0-9]{3})/,
          mastercard : /^5[1-5][0-9]{14}/,
          diners    : /^3(?:0[0-5]|[68][0-9])[0-9]{11}/,
          amex      : /^3[47][0-9]{13}/,
          discover  : /^6(?:011|5[0-9]{2})[0-9]{12}/,
          hipercard  : /^(606282\d{10}(\d{3})?)|(3841\d{15})/,
          elo        : /^((((636368)|(438935)|(504175)|(451416)|(636297))\d{0,10})|((5067)|(4576)|(4011))\d{0,12})/,
          jcb        : /^(?:2131|1800|35\d{3})\d{11}/,
          aura      : /^(5078\d{2})(\d{2})(\d{11})$/
        };

        for (let flag in cards) {
          if(cards[flag].test(cardnumber)) {
            return flag;
          }
        }

        return false;
      }

    }

// inserir dados do cartao de credito

    let numCredit: any = document.getElementById("numerocartao1");
    numCredit.onblur = function() {
      let numCardCredit = numCredit.value;
      let n_one = numCardCredit.slice(0, 4);
      let n_two = numCardCredit.slice(4, 8);
      let n_three = numCardCredit.slice(8, 12);
      let n_four = numCardCredit.slice(12, 16);

      let bandeira = tgdeveloper.getCardFlag(numCardCredit);

      document.getElementById("numeroCartao")!.style.display = "flex";
      document.getElementById("n_one")!.innerHTML = medidor(n_one);
      document.getElementById("n_two")!.innerHTML = medidor(n_two);
      document.getElementById("n_three")!.innerHTML = medidor(n_three);
      document.getElementById("n_four")!.innerHTML = medidor(n_four);
      let imgCard: any = document.querySelector("#imgCard img");

      switch(bandeira) {
        case "visa":
          imgCard!.setAttribute("src","assets/images/financeiro/visa.webp");
          break;
        case "mastercard":
          imgCard!.setAttribute("src","assets/images/financeiro/mastercard.webp");
          break;
        case "diners":
          imgCard!.setAttribute("src","assets/images/financeiro/diners.webp");
          break;
        case "amex":
          imgCard!.setAttribute("src","assets/images/financeiro/amex.webp");
          break;
        case "discover":
          imgCard!.setAttribute("src","assets/images/financeiro/discover.webp");
          break;
        case "hipercard":
          imgCard!.setAttribute("src","assets/images/financeiro/hipercard.webp");
          break;
        case "elo":
          imgCard!.setAttribute("src","assets/images/financeiro/elo.webp");
          break;
        case "jcb":
          imgCard!.setAttribute("src","assets/images/financeiro/jcbb.webp");
          break;
        case "aura":
          imgCard!.setAttribute("src","assets/images/financeiro/aura.webp");
          break;
      }

    }
    let nome: any = document.getElementById("nometitularCred");
    nome.onblur = () => {
      let nomePrint = nome.value;
      document.querySelector("#nameCard p.nome strong")!.innerHTML = nomePrint;
    }

    document.getElementById("expiracaoCred")!.onblur = () => {
      let expiracao: any = document.getElementById("expiracaoCred");
      let date: any = document.getElementById("date");
      let datePrintD: any = expiracao!.value;
      date.innerHTML = mccDate(datePrintD);
    }

// inserir dados do cartao de debito

    let numDebit: any = document.getElementById("numerocartao2");
    numDebit.onblur = function() {
      let numCardDebit = numDebit!.value;
      let n_one = numCardDebit.slice(0, 4);
      let n_two = numCardDebit.slice(4, 8);
      let n_three = numCardDebit.slice(8, 12);
      let n_four = numCardDebit.slice(12, 16);

      let bandeira = tgdeveloper.getCardFlag(numCardDebit);

      document.getElementById("numeroCartao")!.style.display = "flex";
      document.getElementById("n_one")!.innerHTML = medidor(n_one);
      document.getElementById("n_two")!.innerHTML = medidor(n_two);
      document.getElementById("n_three")!.innerHTML = medidor(n_three);
      document.getElementById("n_four")!.innerHTML = medidor(n_four);

      let imgCard: any = document.querySelector("#imgCard img");
      switch(bandeira) {
        case "visa":
          imgCard!.setAttribute("src","assets/images/financeiro/visa.webp");
          break;
        case "mastercard":
          imgCard!.setAttribute("src","assets/images/financeiro/mastercard.webp");
          break;
        case "diners":
          imgCard!.setAttribute("src","assets/images/financeiro/diners.webp");
          break;
        case "amex":
          imgCard!.setAttribute("src","assets/images/financeiro/amex.webp");
          break;
        case "discover":
          imgCard!.setAttribute("src","assets/images/financeiro/discover.webp");
          break;
        case "hipercard":
          imgCard!.setAttribute("src","assets/images/financeiro/hipercard.webp");
          break;
        case "elo":
          imgCard!.setAttribute("src","assets/images/financeiro/elo.webp");
          break;
        case "jcb":
          imgCard!.setAttribute("src","assets/images/financeiro/jcbb.webp");
          break;
        case "aura":
          imgCard!.setAttribute("src","assets/images/financeiro/aura.webp");
          break;
      }

    }
    let nomeD: any = document.getElementById("nometitular1");
    nomeD.onblur = function() {
      let nomePrintD = nomeD.value;
      document.querySelector("#nameCard p.nome strong")!.innerHTML = nomePrintD;
    }
    let dateD: any = document.getElementById("expiracao");
    document.getElementById("expiracaoDeb")!.onblur = function() {
      let expiracaoDeb: any = document.getElementById("expiracaoDeb");
      let datePrintD: any = expiracaoDeb!.value;
      document.getElementById("date")!.innerHTML = mccDate(datePrintD);
    }


//copiar e colar
    document.getElementById("copyPix")!.addEventListener("click", function() {
      let chavepix: any = document.getElementById("chavepix");
      chavepix.select();
      document.execCommand('copy');
    });

    document.getElementById("boletoCopy")!.addEventListener("click", function() {
      let numBol: any = document.getElementById("numBol");
      numBol.select();
      document.execCommand('copy');
    });

    if(screen.width < 768) {
      btn.setAttribute('value','Concluir');
    }

    window.addEventListener('scroll', () => {
      let cardFix: any = document.getElementById('cardFix');
      if(window.scrollY >= 151) {

        cardFix.classList.add('break');

      } else if(window.scrollY < 151) {

        cardFix.classList.remove('break');

      }

    });

  }


}
