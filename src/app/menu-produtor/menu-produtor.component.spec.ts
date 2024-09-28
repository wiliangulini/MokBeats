import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuProdutorComponent } from './menu-produtor.component';

describe('MenuProdutorComponent', () => {
  let component: MenuProdutorComponent;
  let fixture: ComponentFixture<MenuProdutorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuProdutorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuProdutorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
