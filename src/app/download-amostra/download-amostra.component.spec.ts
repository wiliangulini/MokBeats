import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadAmostraComponent } from './download-amostra.component';

describe('DownloadAmostraComponent', () => {
  let component: DownloadAmostraComponent;
  let fixture: ComponentFixture<DownloadAmostraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadAmostraComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadAmostraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
