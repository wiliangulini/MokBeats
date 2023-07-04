import { TestBed } from '@angular/core/testing';

import { EfeitosSonorosService } from './efeitosSonoros.service';

describe('EfeitosSonorosService', () => {
  let service: EfeitosSonorosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EfeitosSonorosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
