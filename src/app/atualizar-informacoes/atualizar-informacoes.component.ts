import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-atualizar-informacoes',
  templateUrl: './atualizar-informacoes.component.html',
  styleUrls: ['./atualizar-informacoes.component.scss']
})
export class AtualizarInformacoesComponent implements OnInit {

  form: FormGroup;
  submitted: boolean = false;
  errorSummary: string[] = [];
  @ViewChild('errorSummaryRef') errorSummaryRef?: ElementRef;
  constructor(
    private fb: FormBuilder,
    private host: ElementRef,
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

  onSubmit() {
    this.submitted = true;
    this.errorSummary = [];
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.buildErrorSummary();
      setTimeout(() => this.scrollToErrorSummary(), 0);
      setTimeout(() => this.focusFirstInvalidControl(), 0);
      return;
    }
    // Aqui você pode acionar o serviço para salvar as informações
  }

  private buildErrorSummary() {
    const msgs: string[] = [];
    const f = this.form;
    const req = (label: string) => `${label} é obrigatório.`;
    if (f.get('nomeContato')?.hasError('required')) msgs.push(req('Nome de Contato'));
    if (f.get('nomeEmpresa')?.hasError('required')) msgs.push(req('Nome da Empresa'));
    if (f.get('numberPhone')?.hasError('required')) msgs.push(req('Número de Telefone'));
    if (f.get('pais')?.hasError('required')) msgs.push(req('País'));
    if (f.get('estado')?.hasError('required')) msgs.push(req('Estado'));
    if (f.get('endereco')?.hasError('required')) msgs.push(req('Endereço'));
    if (f.get('cidade')?.hasError('required')) msgs.push(req('Cidade'));
    if (f.get('cep')?.hasError('required')) msgs.push(req('CEP'));
    this.errorSummary = Array.from(new Set(msgs));
  }

  private scrollToErrorSummary() {
    try {
      if (this.errorSummaryRef?.nativeElement) {
        this.errorSummaryRef.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scroll({ top: 0, behavior: 'smooth' as ScrollBehavior });
      }
    } catch (e) {
      window.scrollTo(0, 0);
    }
  }

  private focusFirstInvalidControl() {
    try {
      const root: HTMLElement = this.host?.nativeElement as HTMLElement;
      if (!root) return;
      const selector = 'form .ng-invalid[formcontrolname], form .ng-invalid input';
      const invalid = root.querySelector(selector) as HTMLElement | null;
      if (invalid) {
        const el = (invalid.matches('input') ? invalid : invalid.querySelector('input')) as HTMLElement | null;
        if (el && typeof (el as any).focus === 'function') {
          (el as any).focus();
        }
      }
    } catch (e) {}
  }

}
