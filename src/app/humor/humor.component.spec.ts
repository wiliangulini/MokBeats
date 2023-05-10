import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HumorComponent } from './humor.component';

describe('HumorComponent', () => {
  let component: HumorComponent;
  let fixture: ComponentFixture<HumorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HumorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HumorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
