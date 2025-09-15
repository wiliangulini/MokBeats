import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';

/**
 * Validadores compartilhados para o projeto MokBeats
 */
export class SharedValidators {

  /**
   * Regex patterns para diferentes tipos de registro
   */
  static readonly PATTERNS = {
    ISRC: /^[A-Za-z0-9]{12}$/, // 12 caracteres alfanuméricos
    UPC_12: /^\d{12}$/, // UPC-A: 12 dígitos
    UPC_6: /^\d{6}$/, // UPC-E: 6 dígitos
    UPC: /^(?:\d{12}|\d{6})$/, // UPC-A ou UPC-E
    MD5: /^[A-Fa-f0-9]{32}$/, // MD5: 32 hex chars
    SHA1: /^[A-Fa-f0-9]{40}$/, // SHA-1: 40 hex chars
    SHA256: /^[A-Fa-f0-9]{64}$/, // SHA-256: 64 hex chars
    SHA512: /^[A-Fa-f0-9]{128}$/, // SHA-512: 128 hex chars
  };

  /**
   * Validador para ISRC
   */
  static isrc(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // deixa a validação required handle empty values
      }
      
      const valid = SharedValidators.PATTERNS.ISRC.test(control.value);
      return valid ? null : { 
        isrc: { 
          message: 'ISRC deve conter 12 caracteres alfanuméricos.',
          actualValue: control.value
        } 
      };
    };
  }

  /**
   * Validador para UPC (aceita formato 12 ou 6 dígitos)
   */
  static upc(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // deixa a validação required handle empty values
      }
      
      const valid = SharedValidators.PATTERNS.UPC.test(control.value);
      return valid ? null : { 
        upc: { 
          message: 'UPC deve conter 12 dígitos (UPC-A) ou 6 dígitos (UPC-E).',
          actualValue: control.value
        } 
      };
    };
  }

  /**
   * Validador para HASH baseado no tipo especificado
   */
  static hash(hashType: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      let pattern: RegExp;
      let expectedLength: number;
      
      switch (hashType?.toUpperCase()) {
        case 'MD5':
          pattern = SharedValidators.PATTERNS.MD5;
          expectedLength = 32;
          break;
        case 'SHA-1':
          pattern = SharedValidators.PATTERNS.SHA1;
          expectedLength = 40;
          break;
        case 'SHA-256':
          pattern = SharedValidators.PATTERNS.SHA256;
          expectedLength = 64;
          break;
        case 'SHA-512':
          pattern = SharedValidators.PATTERNS.SHA512;
          expectedLength = 128;
          break;
        default:
          return { hash: { message: 'Tipo de hash não reconhecido.', actualValue: control.value } };
      }

      const valid = pattern.test(control.value);
      return valid ? null : { 
        hash: { 
          message: `Hash ${hashType} deve conter ${expectedLength} caracteres hexadecimais.`,
          actualValue: control.value
        } 
      };
    };
  }

  /**
   * Validador que confirma se dois campos de email são iguais
   * Para ser usado em um FormGroup
   */
  static emailsMatch(emailField: string = 'email', confirmField: string = 'confirmEmail'): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      if (!(group instanceof FormGroup)) {
        return null;
      }

      const email = group.get(emailField);
      const confirm = group.get(confirmField);

      if (!email || !confirm) {
        return null;
      }

      const emailValue = email.value;
      const confirmValue = confirm.value;

      // Só valida se ambos campos têm valor
      if (!emailValue || !confirmValue) {
        return null;
      }

      return emailValue === confirmValue ? null : { 
        emailsMismatch: { 
          message: 'Os e-mails não coincidem.',
          email: emailValue,
          confirm: confirmValue
        } 
      };
    };
  }

  /**
   * Helper para obter padrão regex baseado no tipo de registro
   */
  static getRegistryPattern(type: string, hashType?: string): RegExp | null {
    switch (type?.toUpperCase()) {
      case 'ISRC':
        return SharedValidators.PATTERNS.ISRC;
      case 'UPC':
        return SharedValidators.PATTERNS.UPC;
      case 'HASH':
        if (!hashType) return null;
        return SharedValidators.getHashPattern(hashType);
      default:
        return null;
    }
  }

  /**
   * Helper para obter padrão de hash específico
   */
  static getHashPattern(hashType: string): RegExp | null {
    switch (hashType?.toUpperCase()) {
      case 'MD5':
        return SharedValidators.PATTERNS.MD5;
      case 'SHA-1':
        return SharedValidators.PATTERNS.SHA1;
      case 'SHA-256':
        return SharedValidators.PATTERNS.SHA256;
      case 'SHA-512':
        return SharedValidators.PATTERNS.SHA512;
      default:
        return null;
    }
  }

  /**
   * Helper para obter placeholder text baseado no tipo de registro
   */
  static getRegistryPlaceholder(type: string, hashType?: string): string {
    switch (type?.toUpperCase()) {
      case 'ISRC':
        return 'Ex.: QMRSZ2400001 (12 alfanuméricos)';
      case 'UPC':
        return 'Ex.: 012345678901 (12 dígitos) ou 123456 (6 dígitos)';
      case 'HASH':
        if (!hashType) return 'Informe o hash no formato hexadecimal';
        const lengths: { [key: string]: number } = {
          'MD5': 32,
          'SHA-1': 40,
          'SHA-256': 64,
          'SHA-512': 128
        };
        const length = lengths[hashType.toUpperCase()] || 0;
        return `Hash ${hashType} (${length} caracteres hexadecimais)`;
      case 'OUTROS':
      default:
        return 'Digite o valor...';
    }
  }

  /**
   * Helper para gerar mensagem de erro padrão para campos obrigatórios
   */
  static getRequiredMessage(fieldLabel: string): string {
    return `${fieldLabel} é obrigatório.`;
  }

  /**
   * Helper para gerar mensagem de erro padrão para email inválido
   */
  static getInvalidEmailMessage(fieldLabel: string): string {
    return `${fieldLabel} inválido.`;
  }

  /**
   * Helper para validar se um controle tem erro específico
   */
  static hasError(control: AbstractControl | null, errorType: string): boolean {
    return !!(control?.hasError(errorType));
  }

  /**
   * Helper para obter mensagem de erro de um controle
   */
  static getErrorMessage(control: AbstractControl | null, errorType: string): string | null {
    const error = control?.getError(errorType);
    return error?.message || null;
  }
}
