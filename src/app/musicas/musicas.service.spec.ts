import { TestBed } from '@angular/core/testing';

import { MusicasService } from './musicas.service';

describe('MusicasService', () => {
  let service: MusicasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MusicasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
