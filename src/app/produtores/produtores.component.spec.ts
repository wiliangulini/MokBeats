import type { MockedObject } from "vitest";
import { Component, forwardRef, NO_ERRORS_SCHEMA, ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
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
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
class CustomFileUploadStubComponent implements ControlValueAccessor {
    writeValue(): void { }
    registerOnChange(): void { }
    registerOnTouched(): void { }
    setDisabledState(): void { }
}

describe('ProdutoresComponent', () => {
    beforeEach(() => {
        vi.useFakeTimers({ advanceTimeDelta: 1, shouldAdvanceTime: true });
    });
    afterEach(() => {
        vi.useRealTimers();
    });
    let component: ProdutoresComponent;
    let fixture: ComponentFixture<ProdutoresComponent>;
    let uploadService: MockedObject<UploadFileService>;

    beforeEach(async () => {
        const scrollServiceSpy = {
            scrollUp: vi.fn().mockName("ScrollService.scrollUp")
        };
        const musicServiceSpy = {
            getGeneros: vi.fn().mockName("MusicasService.getGeneros")
        };
        const snackBarSpy = {
            open: vi.fn().mockName("MatSnackBar.open")
        };
        uploadService = {
            uploadProducerTrack: vi.fn().mockName("UploadFileService.uploadProducerTrack")
        } as unknown as MockedObject<UploadFileService>;

        musicServiceSpy.getGeneros.mockReturnValue(of(['Rock', 'Pop']));
        uploadService.uploadProducerTrack.mockReturnValue(of({ message: 'ok' }));

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
        expect(component.isMode('trackNoStems')).toBe(true);
        expect(component.generos).toEqual(['Rock', 'Pop']);
    });

    it('should require stems only in trackWithStems mode', () => {
        component.form.get('track_stems')?.setValue('trackWithStems');

        component.form.get('stemMelodyFile')?.markAsTouched();
        component.form.get('stemHarmonyFile')?.markAsTouched();
        component.form.get('stemDrumsFile')?.markAsTouched();
        component.form.get('stemFxFile')?.markAsTouched();

        expect(component.hasError('stemMelodyFile')).toBe(true);
        expect(component.hasError('stemHarmonyFile')).toBe(true);
        expect(component.hasError('stemDrumsFile')).toBe(true);
        expect(component.hasError('stemFxFile')).toBe(true);
    });

    it('should require fx1..fx6 only in effectsFx mode and reset stems', () => {
        const stemFile = new File(['stem'], 'stem.wav', { type: 'audio/wav' });
        component.form.get('track_stems')?.setValue('trackWithStems');
        component.form.get('stemMelodyFile')?.setValue(stemFile);

        component.form.get('track_stems')?.setValue('effectsFx');

        expect(component.form.get('stemMelodyFile')?.value).toBeNull();

        component.form.get('fx1')?.markAsTouched();
        expect(component.hasError('fx1')).toBe(true);
    });

    it('should build and submit v2 payload in trackNoStems mode', async () => {
        const track = new File(['track'], 'track.wav', { type: 'audio/wav' });
        const loop15 = new File(['loop15'], 'loop15.wav', { type: 'audio/wav' });
        const loop30 = new File(['loop30'], 'loop30.wav', { type: 'audio/wav' });
        const loop60 = new File(['loop60'], 'loop60.wav', { type: 'audio/wav' });

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
            loop15File: loop15,
            loop30File: loop30,
            loop60File: loop60,
            politicaDePrivacidade: true,
            track_stems: 'trackNoStems',
        });

        const durationsByFile: Record<string, number> = {
            'track.wav': 120000,
            'loop15.wav': 15000,
            'loop30.wav': 30000,
            'loop60.wav': 60000,
        };
        vi.spyOn(component as any, 'getFileDurationMs').mockImplementation((file: any) => Promise.resolve(durationsByFile[file.name] ?? 0));

        component.onUpload();
        await vi.advanceTimersByTimeAsync(0);
        await vi.advanceTimersByTimeAsync(0);

        expect(uploadService.uploadProducerTrack).toHaveBeenCalled();

        const fd = vi.mocked(uploadService.uploadProducerTrack).mock.lastCall![0] as FormData;
        expect(fd.get('schemaVersion')).toBe('producer_form_v2');
        expect(fd.get('mode')).toBe('trackNoStems');
        expect(fd.get('track')).toBe(track);

        const meta = JSON.parse(String(fd.get('meta')));
        expect(meta.artistName).toBe('Produtor Teste');
        expect(meta.registryType).toBe('ISRC');
        expect(meta.isrc).toBe('QMRSZ2400001');
        expect(meta.upc).toBeNull();
        expect(meta.termsAccepted).toBe(true);
    });

    it('should submit effects payload with effect1..effect6', async () => {
        const track = new File(['track'], 'track.wav', { type: 'audio/wav' });
        const loop15 = new File(['loop15'], 'loop15.wav', { type: 'audio/wav' });
        const loop30 = new File(['loop30'], 'loop30.wav', { type: 'audio/wav' });
        const loop60 = new File(['loop60'], 'loop60.wav', { type: 'audio/wav' });
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
            loop15File: loop15,
            loop30File: loop30,
            loop60File: loop60,
            fx1: effects[0],
            fx2: effects[1],
            fx3: effects[2],
            fx4: effects[3],
            fx5: effects[4],
            fx6: effects[5],
            politicaDePrivacidade: true,
            track_stems: 'effectsFx',
        });

        const durationsByFile: Record<string, number> = {
            'track.wav': 5000,
            'loop15.wav': 15000,
            'loop30.wav': 30000,
            'loop60.wav': 60000,
            'fx1.wav': 5000,
            'fx2.wav': 5000,
            'fx3.wav': 5000,
            'fx4.wav': 5000,
            'fx5.wav': 5000,
            'fx6.wav': 5000,
        };
        vi.spyOn(component as any, 'getFileDurationMs').mockImplementation((file: any) => Promise.resolve(durationsByFile[file.name] ?? 0));

        component.onUpload();
        await vi.advanceTimersByTimeAsync(0);
        await vi.advanceTimersByTimeAsync(0);

        expect(uploadService.uploadProducerTrack).toHaveBeenCalled();

        const fd = vi.mocked(uploadService.uploadProducerTrack).mock.lastCall![0] as FormData;
        expect(fd.get('mode')).toBe('effectsFx');
        expect(fd.get('effect1')).toBe(effects[0]);
        expect(fd.get('effect6')).toBe(effects[5]);

        const meta = JSON.parse(String(fd.get('meta')));
        expect(meta.registryType).toBe('OUTROS');
        expect(meta.registryRaw).toBe('ABC123HASHXYZ');
    });
});
