# Custom File Upload Component

Componente reutilizável de upload de arquivos com interface visual moderna, drag & drop, preview de arquivos e integração completa com Reactive Forms.

## Características

- ✅ **ControlValueAccessor**: Integração nativa com Reactive Forms
- ✅ **Drag & Drop**: Arraste e solte arquivos
- ✅ **Preview Visual**: Visualização dos arquivos selecionados com nome e tamanho
- ✅ **Validação de Duração**: Para arquivos de áudio (opcional)
- ✅ **Múltiplos Arquivos**: Suporte para single ou multiple file upload
- ✅ **Feedback Visual**: Indicadores de erro e sucesso
- ✅ **Botão Remover**: Remove arquivos individuais ou todos de uma vez
- ✅ **Responsivo**: Layout adaptável para mobile

## Uso Básico

### 1. Upload Simples (1 arquivo)

```html
<app-custom-file-upload
  title="Selecione um arquivo"
  subtitle="Clique ou arraste seu arquivo aqui"
  [multiple]="false"
  accept="image/*"
  formControlName="foto"
></app-custom-file-upload>
```

### 2. Upload Múltiplo (vários arquivos)

```html
<app-custom-file-upload
  title="Selecione seus arquivos"
  subtitle="Clique ou arraste até 5 arquivos"
  [multiple]="true"
  [maxFiles]="5"
  accept="*/*"
  formControlName="documentos"
  (filesSelected)="onFilesSelected($event)"
></app-custom-file-upload>
```

### 3. Upload de Áudio com Validação de Duração

```html
<app-custom-file-upload
  title="Loop 15 segundos"
  subtitle="Selecione o loop de 15s"
  [multiple]="false"
  accept="audio/*"
  [showDuration]="true"
  [expectedDuration]="15"
  formControlName="loop15"
></app-custom-file-upload>
```

## Propriedades (@Input)

| Propriedade | Tipo | Padrão | Descrição |
|------------|------|--------|-----------|
| `title` | `string` | `'Upload de arquivo'` | Título exibido acima do componente |
| `subtitle` | `string` | `'Carregue seus arquivos aqui'` | Texto exibido na área de upload |
| `accept` | `string` | `'*/*'` | Tipos de arquivo aceitos (ex: `'image/*'`, `'audio/*'`, `'.pdf'`) |
| `multiple` | `boolean` | `false` | Permite seleção de múltiplos arquivos |
| `maxFiles` | `number` | `5` | Número máximo de arquivos (quando `multiple=true`) |
| `showDuration` | `boolean` | `false` | Mostra duração de arquivos de áudio |
| `expectedDuration` | `number` | `undefined` | Duração esperada em segundos (±2s tolerância) |
| `disabled` | `boolean` | `false` | Desabilita o componente |

## Eventos (@Output)

| Evento | Tipo | Descrição |
|--------|------|-----------|
| `filesSelected` | `EventEmitter<FileList>` | Emitido quando arquivo(s) são selecionados |
| `filesValidated` | `EventEmitter<{valid: boolean, message?: string}>` | Emitido após validação dos arquivos |

## Integração com Reactive Forms

### No componente TypeScript:

```typescript
export class MeuComponente implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      // Upload simples (retorna File)
      foto: [null, Validators.required],

      // Upload múltiplo (retorna FileList)
      documentos: [null, Validators.required],

      // Upload de áudio
      loop15: [null, Validators.required],
      loop30: [null, Validators.required],
      loop60: [null, Validators.required]
    });
  }

  onFilesSelected(fileList: FileList): void {
    console.log('Arquivos selecionados:', fileList);
    // Processar arquivos conforme necessário
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formData = new FormData();

      // Upload simples
      const foto = this.form.get('foto')?.value;
      if (foto) {
        formData.append('foto', foto);
      }

      // Upload múltiplo
      const docs = this.form.get('documentos')?.value;
      if (docs) {
        for (let i = 0; i < docs.length; i++) {
          formData.append('documento', docs[i]);
        }
      }

      // Enviar para o backend
      this.http.post('/api/upload', formData).subscribe(...);
    }
  }
}
```

## Exemplos de Uso

### Exemplo 1: Upload de Imagem de Perfil

```html
<form [formGroup]="perfilForm">
  <app-custom-file-upload
    title="Foto de Perfil"
    subtitle="Clique para selecionar sua foto"
    [multiple]="false"
    accept="image/jpeg,image/png,image/webp"
    formControlName="avatar"
  ></app-custom-file-upload>

  <button type="submit" [disabled]="perfilForm.invalid">Salvar</button>
</form>
```

### Exemplo 2: Upload de Documentos (Múltiplos PDFs)

```html
<form [formGroup]="documentosForm">
  <app-custom-file-upload
    title="Documentos Necessários"
    subtitle="Selecione até 3 documentos em PDF"
    [multiple]="true"
    [maxFiles]="3"
    accept=".pdf"
    formControlName="pdfs"
    (filesValidated)="onValidated($event)"
  ></app-custom-file-upload>

  <div class="alert alert-info" *ngIf="documentosForm.get('pdfs')?.hasError('required')">
    Por favor, selecione pelo menos um documento.
  </div>
</form>
```

### Exemplo 3: Upload de Áudio com Validação de Duração (15s, 30s, 60s)

```html
<form [formGroup]="loopsForm">
  <div class="d-flex gap-3">
    <div style="flex: 1;">
      <app-custom-file-upload
        title=""
        subtitle="Loop 15s"
        [multiple]="false"
        accept="audio/*"
        [showDuration]="true"
        [expectedDuration]="15"
        formControlName="loop15"
      ></app-custom-file-upload>
    </div>

    <div style="flex: 1;">
      <app-custom-file-upload
        title=""
        subtitle="Loop 30s"
        [multiple]="false"
        accept="audio/*"
        [showDuration]="true"
        [expectedDuration]="30"
        formControlName="loop30"
      ></app-custom-file-upload>
    </div>

    <div style="flex: 1;">
      <app-custom-file-upload
        title=""
        subtitle="Loop 60s"
        [multiple]="false"
        accept="audio/*"
        [showDuration]="true"
        [expectedDuration]="60"
        formControlName="loop60"
      ></app-custom-file-upload>
    </div>
  </div>
</form>
```

## Estilos Personalizados

O componente utiliza as classes CSS do Bootstrap e Material Icons. Para personalizar cores e estilos:

```scss
// No seu component.scss
::ng-deep app-custom-file-upload {
  .upload-area {
    border-color: #seu-color;

    &:hover {
      background-color: #seu-hover-color;
    }
  }

  .file-item {
    background: #seu-background;
  }
}
```

## Validações

O componente realiza as seguintes validações automaticamente:

1. **Número de arquivos**: Verifica se não excede `maxFiles`
2. **Duração de áudio**: Valida se está dentro de ±2s da duração esperada
3. **Tipo de arquivo**: Valida através do atributo `accept`

### Mensagens de Erro

- Número máximo excedido: "Máximo de X arquivo(s) permitido(s)"
- Duração inválida: "Duração esperada: Xs (±2s). Arquivo: Y.Ys"

## Acessibilidade

O componente segue as melhores práticas de acessibilidade:

- Labels descritivos
- Feedback visual de drag & drop
- Mensagens de erro claras
- Estados disabled visualmente distintos

## Browser Support

- Chrome (últimas 2 versões)
- Firefox (últimas 2 versões)
- Safari (últimas 2 versões)
- Edge (últimas 2 versões)

## Notas Importantes

1. **FileList é read-only**: O componente usa `DataTransfer` para simular modificações no FileList quando arquivos são removidos
2. **Validação de duração**: Funciona apenas com arquivos de áudio que possuem metadados válidos
3. **Drag & drop**: Requer navegador com suporte a `DragEvent` e `DataTransfer`

## Migração do Upload Antigo

Se você estava usando o upload antigo com DOM manipulation, a migração é simples:

### Antes:
```html
<label class="upload">
  <input type="file" (change)="onChange($event)" />
</label>
```

### Depois:
```html
<app-custom-file-upload
  formControlName="upload"
  (filesSelected)="onFilesSelected($event)"
></app-custom-file-upload>
```

## Troubleshooting

### Arquivo não aparece no preview
- Verifique se o `accept` permite o tipo de arquivo
- Verifique se não excedeu o `maxFiles`

### Duração não é calculada
- Certifique-se de que `showDuration="true"`
- Verifique se o arquivo é realmente de áudio
- Alguns formatos de áudio podem não ter metadados

### FormControl não atualiza
- Verifique se adicionou `formControlName` corretamente
- Certifique-se de que o componente está dentro de um `<form [formGroup]="...">>`
