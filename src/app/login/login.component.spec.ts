import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from './auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let activeModal: jasmine.SpyObj<NgbActiveModal>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['registrar', 'fazerLogin', 'loginComGoogle']);
    authServiceSpy.registrar.and.returnValue(of({}));
    authServiceSpy.fazerLogin.and.returnValue(of({}));
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    activeModal = jasmine.createSpyObj<NgbActiveModal>('NgbActiveModal', ['close']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: router },
        { provide: NgbActiveModal, useValue: activeModal },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve renderizar o select custom de tipoPerfil sem radio visível com formControlName', () => {
    const perfilSelect = fixture.nativeElement.querySelector('[data-select-key="tipoPerfil"]');
    const perfilRadio = fixture.nativeElement.querySelector('input[formControlName="tipoPerfil"]');
    const perfilOptions = fixture.nativeElement.querySelectorAll('[data-select-key="tipoPerfil"] [data-profile-option="true"]');

    expect(perfilSelect).toBeTruthy();
    expect(perfilRadio).toBeNull();
    expect(perfilOptions.length).toBe(2);
    expect(perfilOptions[0].getAttribute('triggers')).toBe('hover focus');
    expect(perfilOptions[1].getAttribute('triggers')).toBe('hover focus');
  });

  it('deve mapear Mok Starters e Mok Makers para comprador/produtor', () => {
    const starters = component.customSelectOptions.tipoPerfil.find((option) => option.label === 'Mok Starters');
    const makers = component.customSelectOptions.tipoPerfil.find((option) => option.label === 'Mok Makers');

    expect(starters?.tooltip).toBe('Conta para usuários que desejam navegar, comprar e assinar planos na plataforma.');
    expect(makers?.tooltip).toBe('Conta para produtores e compositores que desejam publicar, vender e gerenciar suas criações.');

    component.customSelectState.tipoPerfil = true;
    component.selectCustomOption(new MouseEvent('click'), 'tipoPerfil', starters!);
    expect(component.form.get('tipoPerfil')?.value).toBe('comprador');
    expect(component.getSelectedLabel('tipoPerfil')).toBe('Mok Starters');
    expect(component.isCustomSelectOpen('tipoPerfil')).toBeFalse();

    component.selectCustomOption(new MouseEvent('click'), 'tipoPerfil', makers!);
    expect(component.form.get('tipoPerfil')?.value).toBe('produtor');
    expect(component.getSelectedLabel('tipoPerfil')).toBe('Mok Makers');
  });

  it('deve exibir erro de obrigatório para tipoPerfil quando touched e vazio', () => {
    component.form.get('tipoPerfil')?.setValue('');
    component.form.get('tipoPerfil')?.markAsTouched();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Selecione um tipo de perfil.');
  });

  it('deve enviar tipoPerfil no payload sem alterar contrato no onSubmit', () => {
    component.form.patchValue({
      email: 'usuario@mokbeats.com',
      senha: '12345678',
      confirmarSenha: '12345678',
      typePerson: 'Pessoa Física',
      tipoPerfil: 'produtor',
    });

    component.onSubmit();

    expect(authService.registrar).toHaveBeenCalled();
    const payload = (authService.registrar as jasmine.Spy).calls.mostRecent().args[0];
    expect(payload.tipoPessoa).toBe('Pessoa Física');
    expect(payload.tipoPerfil).toBe('produtor');
  });

  it('deve manter apenas um select custom aberto por vez', () => {
    component.toggleCustomSelect('typePerson');
    expect(component.isCustomSelectOpen('typePerson')).toBeTrue();
    expect(component.isCustomSelectOpen('tipoPerfil')).toBeFalse();

    component.toggleCustomSelect('tipoPerfil');
    expect(component.isCustomSelectOpen('typePerson')).toBeFalse();
    expect(component.isCustomSelectOpen('tipoPerfil')).toBeTrue();

    component.toggleCustomSelect('tipoPerfil');
    expect(component.isCustomSelectOpen('typePerson')).toBeFalse();
    expect(component.isCustomSelectOpen('tipoPerfil')).toBeFalse();
  });

  it('deve aplicar classe open somente no select ativo para controlar empilhamento', () => {
    component.toggleCustomSelect('typePerson');
    fixture.detectChanges();

    const pessoaSelect = fixture.nativeElement.querySelector('[data-select-key="typePerson"]');
    const perfilSelect = fixture.nativeElement.querySelector('[data-select-key="tipoPerfil"]');
    expect(pessoaSelect.classList.contains('open')).toBeTrue();
    expect(perfilSelect.classList.contains('open')).toBeFalse();

    component.toggleCustomSelect('tipoPerfil');
    fixture.detectChanges();

    expect(pessoaSelect.classList.contains('open')).toBeFalse();
    expect(perfilSelect.classList.contains('open')).toBeTrue();
  });
});
