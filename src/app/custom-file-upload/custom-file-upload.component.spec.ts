import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomFileUploadComponent } from './custom-file-upload.component';

describe('CustomFileUploadComponent', () => {
    let component: CustomFileUploadComponent;
    let fixture: ComponentFixture<CustomFileUploadComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CustomFileUploadComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CustomFileUploadComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    const toFileList = (files: File[]): FileList => {
        const dt = new DataTransfer();
        files.forEach((file) => dt.items.add(file));
        return dt.files;
    };

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should clear previews when writeValue receives null', () => {
        component.files = [{
                name: 'a.wav',
                size: '1 MB',
                file: new File(['a'], 'a.wav', { type: 'audio/wav' })
            }];

        component.writeValue(null);

        expect(component.files.length).toBe(0);
    });

    it('should validate max files and emit error message', async () => {
        component.maxFiles = 1;

        const f1 = new File(['a'], 'a.wav', { type: 'audio/wav' });
        const f2 = new File(['b'], 'b.wav', { type: 'audio/wav' });

        await (component as any).processFiles(toFileList([f1, f2]));

        expect(component.errorMessage).toContain('Máximo de 1 arquivo(s) permitido(s)');
        expect(component.files.length).toBe(0);
    });

    it('should propagate selected file for single mode', async () => {
        const onChangeSpy = vi.fn().mockName('onChange');
        component.multiple = false;
        component.registerOnChange(onChangeSpy);

        const file = new File(['x'], 'track.wav', { type: 'audio/wav' });
        await (component as any).processFiles(toFileList([file]));

        expect(onChangeSpy).toHaveBeenCalledWith(file);
        expect(component.files.length).toBe(1);
    });

    it('should propagate FileList for multiple mode', async () => {
        const onChangeSpy = vi.fn().mockName('onChange');
        component.multiple = true;
        component.registerOnChange(onChangeSpy);

        const fileA = new File(['a'], 'a.wav', { type: 'audio/wav' });
        const fileB = new File(['b'], 'b.wav', { type: 'audio/wav' });
        const list = toFileList([fileA, fileB]);

        await (component as any).processFiles(list);

        const arg = vi.mocked(onChangeSpy).mock.lastCall![0] as FileList;
        expect(arg.length).toBe(2);
        expect(component.files.length).toBe(2);
    });
});
