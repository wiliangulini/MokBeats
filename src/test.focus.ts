import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);

// Import only focused behavior specs
import './app/service/music-player.service.behavior.spec';
import './app/wave-surfer-test/wave-surfer-test.component.behavior.spec';
import './app/player/player.component.behavior.spec';

