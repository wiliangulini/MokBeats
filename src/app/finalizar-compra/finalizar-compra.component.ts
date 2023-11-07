import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {empty} from "rxjs";

@Component({
  selector: 'app-finalizar-compra',
  templateUrl: './finalizar-compra.component.html',
  styleUrls: ['./finalizar-compra.component.scss']
})
export class FinalizarCompraComponent implements OnInit {

  form: FormGroup;
  formaPagamento: any;
  cartao: string = '';
  formaPag: any[] = [
    { value: 'Cartão de Crédito', viewValue: 'Cartão de Crédito' },
    { value: 'Cartão de Débito', viewValue: 'Cartão de Débito' },
    { value: 'Boleto', viewValue: 'Boleto' },
    { value: 'PIX', viewValue: 'PIX' },
  ]
  total: string = '64,95';

  constructor(
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      nomeContato: ['', Validators.required],
      nomeEmpresa: [''],
      numberPhone: ['', Validators.required],
      endereco: ['', Validators.required],
      cidade: ['', Validators.required],
      cep: ['', Validators.required],
      formaDePagamento: ['', Validators.required],
      nomeCartao: ['', Validators.required],
      numeroCartao: ['', Validators.required],
      mes_ano: ['', Validators.required],
      cvc: ['', Validators.required],
      termos_licenca: ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }

  changeCard(e: any) {
    (e.value === 'Cartão de Crédito' || e.value === 'Cartão de Débito') ? this.cartao = this.formaPagamento : this.cartao = '';

  }
}
