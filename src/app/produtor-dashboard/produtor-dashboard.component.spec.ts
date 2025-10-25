import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdutorDashboardComponent } from './produtor-dashboard.component';

describe('ProdutorDashboardComponent', () => {
  let component: ProdutorDashboardComponent;
  let fixture: ComponentFixture<ProdutorDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProdutorDashboardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ProdutorDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
