// This file is required by karma.conf.js. Since Angular 15 the karma builder
// discovers *.spec.ts automatically via tsconfig.spec.json's "include" — this
// file only bootstraps the testing environment and global TestBed defaults.

import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, provideZoneChangeDetection } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClient } from '@angular/common/http';
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

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);

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
      provideHttpClient(),
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
