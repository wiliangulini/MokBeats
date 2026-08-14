import {Component, OnDestroy, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {CarrinhoService} from "../service/carrinho.service";
import {UserProfileService} from "../service/user-profile.service";
import {CartItem} from "../carrinho/cartModal/cart-modal.models";
import {UserProfile} from "../models/user-profile.model";
import {FormaPagamento, PedidoSimulado} from "../models/pedido.model";

@Component({
    selector: 'app-finalizar-compra',
    templateUrl: './finalizar-compra.component.html',
    styleUrls: ['./finalizar-compra.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class FinalizarCompraComponent implements OnInit, OnDestroy {

  form: FormGroup;
  formaPag: { value: FormaPagamento; viewValue: string }[] = [
    { value: 'Cartão de Crédito', viewValue: 'Cartão de Crédito' },
    { value: 'Cartão de Débito', viewValue: 'Cartão de Débito' },
    { value: 'Boleto', viewValue: 'Boleto' },
    { value: 'PIX', viewValue: 'PIX' },
  ];

  musics: CartItem[] = [];
  total: number = 0;
  perfil: Partial<UserProfile> | null = null;

  submitted = false;
  errorSummary: string[] = [];
  pedidoSimulado: PedidoSimulado | null = null;

  private readonly currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
  private cartItemsSubscription!: Subscription;
  private cartTotalSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private cartService: CarrinhoService,
    private profileService: UserProfileService,
  ) {
    this.form = this.fb.group({
      nomeProjeto: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
      observacoes: ['', Validators.maxLength(500)],
      formaDePagamento: ['', Validators.required],
      aceiteTermos: [false, Validators.requiredTrue],
    });
  }

  get checkoutState(): 'vazio' | 'confirmado' | 'formulario' {
    if (this.pedidoSimulado) return 'confirmado';
    if (this.musics.length === 0) return 'vazio';
    return 'formulario';
  }

  ngOnInit(): void {
    this.cartItemsSubscription = this.cartService.cartItems$.subscribe((items) => {
      this.musics = items;
    });
    this.cartTotalSubscription = this.cartService.cartTotal$.subscribe((total) => {
      this.total = total;
    });
    this.perfil = this.profileService.getSnapshot();
    this.profileService.getProfile().subscribe((profile) => {
      this.perfil = profile;
    });
  }

  ngOnDestroy(): void {
    if (this.cartItemsSubscription) {
      this.cartItemsSubscription.unsubscribe();
    }
    if (this.cartTotalSubscription) {
      this.cartTotalSubscription.unsubscribe();
    }
  }

  formatPrice(price: number): string {
    return this.currencyFormatter.format(price);
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorSummary = [];
    this.pedidoSimulado = null;
    this.form.markAllAsTouched();

    const f = this.form;
    if (f.get('nomeProjeto')?.hasError('required')) this.errorSummary.push('Nome do projeto é obrigatório.');
    if (f.get('nomeProjeto')?.hasError('minlength')) this.errorSummary.push('Nome do projeto deve ter pelo menos 3 caracteres.');
    if (f.get('nomeProjeto')?.hasError('maxlength')) this.errorSummary.push('Nome do projeto deve ter no máximo 120 caracteres.');
    if (f.get('observacoes')?.hasError('maxlength')) this.errorSummary.push('Observações devem ter no máximo 500 caracteres.');
    if (f.get('formaDePagamento')?.hasError('required')) this.errorSummary.push('Selecione uma forma de pagamento.');
    if (f.get('aceiteTermos')?.hasError('required')) this.errorSummary.push('É necessário aceitar os termos do Contrato de Licença.');

    if (this.errorSummary.length) {
      return;
    }

    const { nomeProjeto, observacoes, formaDePagamento } = this.form.value;

    this.pedidoSimulado = {
      status: 'simulado',
      criadoEm: new Date().toISOString(),
      nomeProjeto,
      observacoes: observacoes || null,
      formaDePagamento,
      itens: this.musics,
      total: this.total,
    };
  }
}
