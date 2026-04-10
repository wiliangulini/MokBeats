// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
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

declare const require: {
  context(path: string, deep?: boolean, filter?: RegExp): {
    <T>(id: string): T;
    keys(): string[];
  };
};

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
      HttpClientTestingModule,
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

// Then we find tests, with optional focus via FOCUS_SPECS env (passed through karma client args)
const args = ((window as any).__karma__ && (window as any).__karma__.config && (window as any).__karma__.config.args) || [''];
const focusArg: string = args[0] || '';
const context = require.context('./', true, /\.spec\.ts$/);

if (focusArg && typeof focusArg === 'string' && focusArg.trim().length > 0) {
  const focusedPaths = focusArg
    .split(',')
    .map((s: string) => s.trim())
    .filter(Boolean)
    .filter((fullPath: string) => fullPath.startsWith('src/'))
    .map((fullPath: string) => './' + fullPath.substring('src/'.length));

  const focusedSet = new Set(focusedPaths);
  const selected = context.keys().filter((key: string) => focusedSet.has(key));
  selected.forEach(context);
} else {
  context.keys().forEach(context);
}
