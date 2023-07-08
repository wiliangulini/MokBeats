import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdutoresComponent } from './produtores.component';

describe('ProdutoresComponent', () => {
  let component: ProdutoresComponent;
  let fixture: ComponentFixture<ProdutoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProdutoresComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProdutoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
