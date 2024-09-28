import { TestBed } from '@angular/core/testing';

import { WaveSurferService } from './wave-surfer.service';

describe('WaveSurferService', () => {
  let service: WaveSurferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WaveSurferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
