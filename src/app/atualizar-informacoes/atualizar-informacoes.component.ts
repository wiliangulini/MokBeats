import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-atualizar-informacoes',
  templateUrl: './atualizar-informacoes.component.html',
  styleUrls: ['./atualizar-informacoes.component.scss']
})
export class AtualizarInformacoesComponent implements OnInit {

  form: FormGroup;
  constructor(
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      nomeContato: ['', Validators.required],
      nomeEmpresa: ['', Validators.required],
      numberPhone: ['', Validators.required],
      pais: ['', Validators.required],
      estado: ['', Validators.required],
      endereco: ['', Validators.required],
      cidade: ['', Validators.required],
      cep: ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }

}
