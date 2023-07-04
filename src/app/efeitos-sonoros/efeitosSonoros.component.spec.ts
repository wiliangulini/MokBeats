import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EfeitosSonorosComponent } from './efeitosSonoros.component';

describe('EfeitosSonorosComponent', () => {
  let component: EfeitosSonorosComponent;
  let fixture: ComponentFixture<EfeitosSonorosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EfeitosSonorosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EfeitosSonorosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
