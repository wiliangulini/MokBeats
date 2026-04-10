import { Component, forwardRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, flushMicrotasks, tick } from '@angular/core/testing';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { of } from 'rxjs';

import { ProdutoresComponent } from './produtores.component';
import { ScrollService } from '../service/scroll.service';
import { MusicasService } from '../musicas/musicas.service';
import { UploadFileService } from '../upload-file/upload-file.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-custom-file-upload',
  template: '',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomFileUploadStubComponent),
      multi: true,
    },
  ],
})
class CustomFileUploadStubComponent implements ControlValueAccessor {
  writeValue(): void {}
  registerOnChange(): void {}
  registerOnTouched(): void {}
  setDisabledState(): void {}
}

describe('ProdutoresComponent', () => {
  let component: ProdutoresComponent;
  let fixture: ComponentFixture<ProdutoresComponent>;
  let uploadService: jasmine.SpyObj<UploadFileService>;

  beforeEach(async () => {
    const scrollServiceSpy = jasmine.createSpyObj('ScrollService', ['scrollUp']);
    const musicServiceSpy = jasmine.createSpyObj('MusicasService', ['getGeneros']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    uploadService = jasmine.createSpyObj('UploadFileService', ['uploadProducerTrack']);

    musicServiceSpy.getGeneros.and.returnValue(of(['Rock', 'Pop']));
    uploadService.uploadProducerTrack.and.returnValue(of({ message: 'ok' }));

    await TestBed.configureTestingModule({
      declarations: [ProdutoresComponent, CustomFileUploadStubComponent],
      providers: [
        { provide: ScrollService, useValue: scrollServiceSpy },
        { provide: MusicasService, useValue: musicServiceSpy },
        { provide: UploadFileService, useValue: uploadService },
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ProdutoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and initialize trackNoStems mode by default', () => {
    expect(component).toBeTruthy();
    expect(component.form.get('track_stems')?.value).toBe('trackNoStems');
    expect(component.isMode('trackNoStems')).toBeTrue();
    expect(component.generos).toEqual(['Rock', 'Pop']);
  });

  it('should require stems only in trackWithStems mode', () => {
    component.form.get('track_stems')?.setValue('trackWithStems');

    component.form.get('stemMelodyFile')?.markAsTouched();
    component.form.get('stemHarmonyFile')?.markAsTouched();
    component.form.get('stemDrumsFile')?.markAsTouched();
    component.form.get('stemFxFile')?.markAsTouched();

    expect(component.hasError('stemMelodyFile')).toBeTrue();
    expect(component.hasError('stemHarmonyFile')).toBeTrue();
    expect(component.hasError('stemDrumsFile')).toBeTrue();
    expect(component.hasError('stemFxFile')).toBeTrue();
  });

  it('should require fx1..fx6 only in effectsFx mode and reset stems', () => {
    const stemFile = new File(['stem'], 'stem.wav', { type: 'audio/wav' });
    component.form.get('track_stems')?.setValue('trackWithStems');
    component.form.get('stemMelodyFile')?.setValue(stemFile);

    component.form.get('track_stems')?.setValue('effectsFx');

    expect(component.form.get('stemMelodyFile')?.value).toBeNull();

    component.form.get('fx1')?.markAsTouched();
    expect(component.hasError('fx1')).toBeTrue();
  });

  it('should build and submit v2 payload in trackNoStems mode', fakeAsync(() => {
    const track = new File(['track'], 'track.wav', { type: 'audio/wav' });

    component.form.patchValue({
      nome: 'Produtor Teste',
      email: 'producer@test.com',
      countryCode: 'BR +55',
      phone: '5541999999999',
      identification: 'AB123456',
      trackName: 'Minha Música',
      category: 'Beats',
      genrePrimary: 'Rock',
      bpm: '120',
      key: 'A_MAJOR',
      registryValue: 'QMRSZ2400001',
      saleValue: '99.90',
      singleTrackFile: track,
      politicaDePrivacidade: true,
      track_stems: 'trackNoStems',
    });

    spyOn<any>(component, 'getFileDurationMs').and.returnValue(Promise.resolve(120000));

    component.onUpload();
    flushMicrotasks();
    tick();

    expect(uploadService.uploadProducerTrack).toHaveBeenCalled();

    const fd = uploadService.uploadProducerTrack.calls.mostRecent().args[0] as FormData;
    expect(fd.get('schemaVersion')).toBe('producer_form_v2');
    expect(fd.get('mode')).toBe('trackNoStems');
    expect(fd.get('track')).toBe(track);

    const meta = JSON.parse(String(fd.get('meta')));
    expect(meta.artistName).toBe('Produtor Teste');
    expect(meta.registryType).toBe('ISRC');
    expect(meta.isrc).toBe('QMRSZ2400001');
    expect(meta.upc).toBeNull();
    expect(meta.termsAccepted).toBeTrue();
  }));

  it('should submit effects payload with effect1..effect6', fakeAsync(() => {
    const track = new File(['track'], 'track.wav', { type: 'audio/wav' });
    const effects = Array.from({ length: 6 }, (_, idx) => new File([`fx${idx + 1}`], `fx${idx + 1}.wav`, { type: 'audio/wav' }));

    component.form.patchValue({
      nome: 'Produtor FX',
      email: 'fx@test.com',
      countryCode: 'BR +55',
      phone: '5541999999999',
      identification: 'RG1234567',
      trackName: 'FX Pack',
      category: 'Sound Effects',
      genrePrimary: 'Pop',
      bpm: '90',
      key: 'C_MINOR',
      registryValue: 'ABC123HASHXYZ',
      saleValue: '10',
      singleTrackFile: track,
      fx1: effects[0],
      fx2: effects[1],
      fx3: effects[2],
      fx4: effects[3],
      fx5: effects[4],
      fx6: effects[5],
      politicaDePrivacidade: true,
      track_stems: 'effectsFx',
    });

    spyOn<any>(component, 'getFileDurationMs').and.returnValue(Promise.resolve(1000));

    component.onUpload();
    flushMicrotasks();
    tick();

    const fd = uploadService.uploadProducerTrack.calls.mostRecent().args[0] as FormData;
    expect(fd.get('mode')).toBe('effectsFx');
    expect(fd.get('effect1')).toBe(effects[0]);
    expect(fd.get('effect6')).toBe(effects[5]);

    const meta = JSON.parse(String(fd.get('meta')));
    expect(meta.registryType).toBe('OUTROS');
    expect(meta.registryRaw).toBe('ABC123HASHXYZ');
  }));
});
