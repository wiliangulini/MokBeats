import { ComponentFixture, TestBed } from '@angular/core/testing';

import { I18nextTestComponent } from './i18next-test.component';

describe('I18nextTestComponent', () => {
  let component: I18nextTestComponent;
  let fixture: ComponentFixture<I18nextTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ I18nextTestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(I18nextTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
