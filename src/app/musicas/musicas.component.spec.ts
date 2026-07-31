import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicasComponent } from './musicas.component';

describe('MusicasComponent', () => {
    let component: MusicasComponent;
    let fixture: ComponentFixture<MusicasComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MusicasComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(MusicasComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should open, close and toggle the filter panel with component state', () => {
        component.closeFilterPanel();
        expect(component.isFilterPanelOpen).toBe(false);

        component.openFilterPanel();
        expect(component.isFilterPanelOpen).toBe(true);

        component.toggleFilterPanel();
        expect(component.isFilterPanelOpen).toBe(false);
    });

    it('should reset filters and reload the first page', () => {
        vi.spyOn(component, 'loadMusicas').mockReturnValue(undefined);
        component.selectedGeneros = ['Pop'];
        component.selectedSubgeneros = ['Dance Pop'];
        component.selectedVozes = ['Coro/Grupo'];
        component.selectedHumores = ['Feliz'];
        component.selectedArtistas = ['Produtor'];
        component.selectedInstrumentos = ['Piano'];
        component.selectedKeys = ['A_MAJOR'];
        component.number = 120;
        component.duration = 90;
        component.durationAut = '1:30';
        component.musicas = { bpm: 120, duracao: 90 };
        component.currentFilters = { genero: ['Pop'] };
        component.currentPage = 3;

        component.resetFilters();

        expect(component.selectedGeneros).toEqual([]);
        expect(component.selectedSubgeneros).toEqual([]);
        expect(component.selectedVozes).toEqual([]);
        expect(component.selectedHumores).toEqual([]);
        expect(component.selectedArtistas).toEqual([]);
        expect(component.selectedInstrumentos).toEqual([]);
        expect(component.selectedKeys).toEqual([]);
        expect(component.number).toBeUndefined();
        expect(component.duration).toBeUndefined();
        expect(component.durationAut).toBeUndefined();
        expect(component.musicas.bpm).toBeUndefined();
        expect(component.musicas.duracao).toBeUndefined();
        expect(component.currentFilters).toBeNull();
        expect(component.currentPage).toBe(1);
        expect(component.loadMusicas).toHaveBeenCalledWith(1);
    });

    it('should preserve current filters when changing page', () => {
        vi.spyOn(component, 'loadMusicas').mockReturnValue(undefined);
        vi.spyOn((component as any).scrollService, 'scrollUp').mockReturnValue(undefined);
        component.currentFilters = { genero: ['Pop'] };

        component.onPageChange(2);

        expect(component.currentPage).toBe(2);
        expect(component.loadMusicas).toHaveBeenCalledWith(2, { genero: ['Pop'] });
        expect((component as any).scrollService.scrollUp).toHaveBeenCalled();
    });
});
