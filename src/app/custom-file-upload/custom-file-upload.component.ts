import { Component, Input, forwardRef, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface FilePreview {
  name: string;
  size: string;
  file: File;
  duration?: string;
  isAudio?: boolean;
}

@Component({
    selector: 'app-custom-file-upload',
    templateUrl: './custom-file-upload.component.html',
    styleUrls: ['./custom-file-upload.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CustomFileUploadComponent),
            multi: true
        }
    ],
    standalone: false
})
export class CustomFileUploadComponent implements ControlValueAccessor {
  @Input() title: string = 'Upload de arquivo';
  @Input() subtitle: string = 'Carregue seus arquivos aqui';
  @Input() accept: string = '*/*';
  @Input() multiple: boolean = false;
  @Input() maxFiles: number = 5;
  @Input() showDuration: boolean = false;
  @Input() expectedDuration?: number; // Para validação de duração (em segundos)
  @Input() variant: 'default' | 'compact' | 'image' = 'default';
  @Input() disabled: boolean = false;

  @Output() filesSelected = new EventEmitter<FileList>();
  @Output() filesValidated = new EventEmitter<{ valid: boolean; message?: string }>();

  files: FilePreview[] = [];
  isDragging: boolean = false;
  errorMessage: string = '';

  private onChange: (value: any) => void = () => { };
  private onTouched: () => void = () => { };

  writeValue(value: any): void {
    if (!value) {
      this.files = [];
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processFiles(input.files);
    }
    this.onTouched();
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.disabled) {
      this.isDragging = true;
    }
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    if (this.disabled) return;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.processFiles(files);
    }
    this.onTouched();
  }

  private async processFiles(fileList: FileList): Promise<void> {
    this.errorMessage = '';

    // Validar número de arquivos
    if (fileList.length > this.maxFiles) {
      this.errorMessage = `Máximo de ${this.maxFiles} arquivo(s) permitido(s)`;
      this.filesValidated.emit({ valid: false, message: this.errorMessage });
      return;
    }

    const files: FilePreview[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const sizeInMB = (file.size / 1000000).toFixed(1);
      const isAudio = file.type.startsWith('audio/');

      const preview: FilePreview = {
        name: file.name,
        size: `${sizeInMB} MB`,
        file: file,
        isAudio: isAudio
      };

      // Se for áudio e showDuration estiver ativo, calcular duração
      if (this.showDuration && isAudio) {
        try {
          const duration = await this.getAudioDuration(file);
          preview.duration = this.formatDuration(duration);

          // Validar duração esperada (±2s de tolerância)
          if (this.expectedDuration) {
            const diff = Math.abs(duration - this.expectedDuration);
            if (diff > 2) {
              this.errorMessage = `Duração esperada: ${this.expectedDuration}s (±2s). Arquivo: ${duration.toFixed(1)}s`;
              this.filesValidated.emit({ valid: false, message: this.errorMessage });
              return;
            }
          }
        } catch (error) {
          console.error('Erro ao obter duração do áudio:', error);
        }
      }

      files.push(preview);
    }

    this.files = files;
    this.filesSelected.emit(fileList);

    // Atualizar valor do form control
    if (this.multiple) {
      this.onChange(fileList);
    } else {
      this.onChange(fileList[0]);
    }

    this.filesValidated.emit({ valid: true });
  }

  private getAudioDuration(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
      try {
        const audio = document.createElement('audio');
        audio.preload = 'metadata';

        audio.onloadedmetadata = () => {
          const duration = audio.duration || 0;
          URL.revokeObjectURL(audio.src);
          resolve(duration);
        };

        audio.onerror = () => {
          URL.revokeObjectURL(audio.src);
          reject(new Error('Falha ao carregar metadados do áudio'));
        };

        audio.src = URL.createObjectURL(file);
      } catch (err) {
        reject(err);
      }
    });
  }

  private formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  }

  removeFile(index: number): void {
    this.files.splice(index, 1);
    this.errorMessage = '';

    if (this.files.length === 0) {
      this.onChange(null);
    } else {
      // Reconstruir FileList (simulação, pois FileList é read-only)
      const dt = new DataTransfer();
      this.files.forEach(f => dt.items.add(f.file));
      this.onChange(this.multiple ? dt.files : dt.files[0]);
    }
  }

  clearAll(): void {
    this.files = [];
    this.errorMessage = '';
    this.onChange(null);
  }
}
