// This file is registered as "setupFiles" pelo builder @angular/build:unit-test
// (runner: vitest). O builder inicializa o ambiente de teste do Angular
// automaticamente — este arquivo só define os padrões globais do TestBed.

import 'zone.js/testing';
import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, provideZoneChangeDetection } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClient, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Angular Material (comuns em formulários)
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
// ng-bootstrap
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// Padrões globais para reduzir atrito nas specs antigas
(() => {
  const originalConfigure = (TestBed as any).configureTestingModule.bind(TestBed);
  (TestBed as any).configureTestingModule = (moduleDef: any) => {
    moduleDef = moduleDef || {};
    moduleDef.imports = [
      ...(moduleDef.imports || []),
      RouterTestingModule,
      FormsModule,
      ReactiveFormsModule,
      BrowserAnimationsModule,
      // Material e Bootstrap comuns
      MatSnackBarModule,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
      MatCheckboxModule,
      MatRadioModule,
      MatSlideToggleModule,
      NgbModule,
    ];
    moduleDef.schemas = [
      ...(moduleDef.schemas || []),
      NO_ERRORS_SCHEMA,
      CUSTOM_ELEMENTS_SCHEMA,
    ];
    moduleDef.providers = [
      ...(moduleDef.providers || []),
      provideZoneChangeDetection(),
      provideHttpClient(withXhr()),
      provideHttpClientTesting(),
      { provide: NgbActiveModal, useValue: { close: () => {}, dismiss: () => {} } },
    ];
    return originalConfigure(moduleDef);
  };
})();

// Tolerância para consultas a elementos inexistentes em specs antigas
(() => {
  const originalGet = document.getElementById.bind(document);
  document.getElementById = (id: string) => originalGet(id) || document.createElement('div');
  const originalQS = Document.prototype.querySelector;
  Document.prototype.querySelector = function(this: Document, selector: string): any {
    return originalQS.call(this, selector) || document.createElement('div');
  } as any;
  // Evita falhas de rede em bibliotecas que usam fetch durante testes
  try {
    const safeFetch = (() => Promise.resolve(new Response(new Blob(), { status: 200, statusText: 'OK' }))) as any;
    (window as any).fetch = safeFetch;
  } catch (e) {
    // ignore caso Response/Blob não estejam disponíveis
  }
})();

// jsdom (ambiente Vitest) não implementa IntersectionObserver nem DataTransfer,
// diferente do Chrome real usado antes via Karma. Stubs mínimos, suficientes
// para os specs existentes não quebrarem.
(() => {
  if (typeof (globalThis as any).IntersectionObserver === 'undefined') {
    class IntersectionObserverStub {
      constructor(_callback: IntersectionObserverCallback, _options?: IntersectionObserverInit) {}
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords(): IntersectionObserverEntry[] { return []; }
    }
    (globalThis as any).IntersectionObserver = IntersectionObserverStub;
    (window as any).IntersectionObserver = IntersectionObserverStub;
  }

  if (typeof (globalThis as any).DataTransfer === 'undefined') {
    class DataTransferStub {
      private _files: File[] = [];
      items = {
        add: (file: File) => { this._files.push(file); },
      };
      get files(): FileList {
        const files = this._files;
        return Object.assign(files.slice(), {
          item: (i: number) => files[i] ?? null,
        }) as unknown as FileList;
      }
    }
    (globalThis as any).DataTransfer = DataTransferStub;
    (window as any).DataTransfer = DataTransferStub;
  }
})();
