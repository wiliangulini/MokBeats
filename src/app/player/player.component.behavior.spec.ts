import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerComponent } from './player.component';
import { MusicPlayerService } from '../service/music-player.service';
import { PlayerService } from './player.service';
import { MusicasService } from '../musicas/musicas.service';
import { of, throwError } from 'rxjs';

class StubPlayerService {
    showPlayer = vi.fn().mockName('showPlayer');
    hidePlayer = vi.fn().mockName('hidePlayer');
    tooglePlayPause() { }
}

class StubMusicasService {
    stemsResponse: any[] = [];
    getStemsByMusicId = vi.fn().mockName('getStemsByMusicId').mockImplementation(() => {
        return of(this.stemsResponse);
    });
}

// Fake minimal para WaveSurfer — suporta emit() para simular eventos
class FakeWaveSurfer {
    time = 0;
    playing = false;
    destroyed = false;
    muted = false;
    volume = 0.75;
    private handlers: Record<string, Function[]> = {};

    on(event: string, handler: Function) {
        if (!this.handlers[event])
            this.handlers[event] = [];
        this.handlers[event].push(handler);
    }
    emit(event: string, ...args: any[]) {
        (this.handlers[event] || []).forEach(fn => fn(...args));
    }
    destroy() { this.destroyed = true; }
    load() { }
    play() { this.playing = true; this.emit('play'); }
    pause() { this.playing = false; this.emit('pause'); }
    setTime(t: number) { this.time = t; }
    skip() { }
    getDuration() { return 100; }
    setVolume(volume: number) { this.volume = volume; }
    setMuted(muted: boolean) { this.muted = muted; }
    getCurrentTime() { return this.time; }
}

describe('PlayerComponent behavior', () => {
    let component: PlayerComponent;
    let fixture: ComponentFixture<PlayerComponent>;
    let mps: MusicPlayerService;
    let ps: StubPlayerService;
    let musicService: StubMusicasService;
    let createdWaveSurfers: FakeWaveSurfer[] = [];

    beforeAll(() => {
        const dynamicRequire = (id: string): any => {
            try {
                // Evita resolução estática de path do plugin no build de testes.
                return Function('moduleId', 'return require(moduleId);')(id);
            }
            catch (_e) {
                return null;
            }
        };

        const ws = dynamicRequire('wavesurfer.js') || {};
        (ws as any).default = ws.default || ws;
        (ws as any).create = () => {
            const fake = new FakeWaveSurfer();
            createdWaveSurfers.push(fake);
            return fake as any;
        };

        const mm = dynamicRequire('wavesurfer.js/dist/plugins/minimap') || dynamicRequire('wavesurfer.js/dist/plugins/minimap.cjs') || {};
        (mm as any).default = mm.default || mm;
        (mm as any).create = () => ({ plugin: 'minimap' });
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PlayerComponent],
            providers: [
                MusicPlayerService,
                { provide: PlayerService, useClass: StubPlayerService },
                { provide: MusicasService, useClass: StubMusicasService },
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(PlayerComponent);
        component = fixture.componentInstance;
        mps = TestBed.inject(MusicPlayerService);
        ps = TestBed.inject(PlayerService) as any;
        musicService = TestBed.inject(MusicasService) as any;
        createdWaveSurfers = [];
        // Não chamar detectChanges para evitar ngAfterViewInit pesado
        component.wavesurfer = new FakeWaveSurfer() as any; // injeta fake
        (component as any).idMusicCurrent = 7;
    });

    it('shows player when a music url is set', () => {
        mps.setCurrentMusicUrl('x.mp3');
        component.ngOnInit();
        expect(ps.showPlayer).toHaveBeenCalled();
    });

    it('applies seek requests for current music', () => {
        const fake = component.wavesurfer as any as FakeWaveSurfer;
        component.ngOnInit();
        mps.requestSeek(7, 55);
        expect(fake.time).toBe(55);
    });

    // ─── Helper: injeta stems fake no componente ───────────────────────────────
    function injectFakeStems(comp: PlayerComponent, count = 4): FakeWaveSurfer[] {
        const fakes = Array.from({ length: count }, () => new FakeWaveSurfer());
        (comp as any).stems = fakes;
        (comp as any).stemsReady = true;
        (comp as any).stemsReadyCount = count;
        (comp as any).stemsExpectedCount = count;
        (comp as any).stemTrackAvailable = [true, true, true, true].slice(0, count);
        return fakes;
    }

    describe('Playback mode', () => {

        // T1: causa raiz — on('play') em modo 'full' não deve tocar stems
        it('T1: on("play") em modo "full" NÃO cascateia para stems', () => {
            component.ngOnInit();
            const stemFakes = injectFakeStems(component);
            const mainFake = component.wavesurfer as any as FakeWaveSurfer;
            // Registra handlers para testar o guard ativamente
            component.initWavesurferHandlers();
            // Simula play da full track enquanto em modo 'full' (padrão)
            mainFake.emit('play');
            stemFakes.forEach(s => expect(s.playing).toBe(false));
        });

        // T2: playStemsMode() deve pausar wavesurfer e iniciar todos os stems no tempo atual
        it('T2: playStemsMode() pausa wavesurfer e inicia todos os stems sincronizados', () => {
            component.ngOnInit();
            const mainFake = component.wavesurfer as any as FakeWaveSurfer;
            mainFake.time = 42;
            const stemFakes = injectFakeStems(component);
            (component as any).playStemsMode();
            expect(mainFake.playing).toBe(false);
            stemFakes.forEach(s => {
                expect(s.time).toBe(42);
                expect(s.playing).toBe(true);
            });
            expect(component.isStemsPlaying).toBe(true);
            expect((component as any).playbackMode).toBe('stems');
        });

        // T3: pauseStemsMode() deve pausar stems e sincronizar tempo no wavesurfer
        it('T3: pauseStemsMode() pausa stems e faz handoff de tempo para wavesurfer', () => {
            component.ngOnInit();
            const mainFake = component.wavesurfer as any as FakeWaveSurfer;
            const stemFakes = injectFakeStems(component);
            stemFakes.forEach(s => { s.playing = true; s.time = 77; });
            (component as any).playbackMode = 'stems';
            component.isStemsPlaying = true;
            (component as any).pauseStemsMode();
            stemFakes.forEach(s => expect(s.playing).toBe(false));
            expect(mainFake.time).toBe(77);
            expect(component.isStemsPlaying).toBe(false);
            expect((component as any).playbackMode).toBe('full');
        });

        // T4: toggleStemsPlayback() deve ativar stems mode quando isStemsPlaying=false
        it('T4: toggleStemsPlayback() ativa modo stems', () => {
            component.ngOnInit();
            const mainFake = component.wavesurfer as any as FakeWaveSurfer;
            mainFake.time = 30;
            injectFakeStems(component);
            component.isStemsPlaying = false;
            (component as any).toggleStemsPlayback();
            expect((component as any).playbackMode).toBe('stems');
            expect(component.isStemsPlaying).toBe(true);
        });

        // T5: toggleStemsPlayback() deve desativar stems mode quando isStemsPlaying=true
        it('T5: toggleStemsPlayback() desativa modo stems e pausa stems', () => {
            component.ngOnInit();
            const stemFakes = injectFakeStems(component);
            stemFakes.forEach(s => { s.playing = true; s.time = 55; });
            (component as any).playbackMode = 'stems';
            component.isStemsPlaying = true;
            (component as any).toggleStemsPlayback();
            expect((component as any).playbackMode).toBe('full');
            expect(component.isStemsPlaying).toBe(false);
            stemFakes.forEach(s => expect(s.playing).toBe(false));
        });

        // T6: playStemsMode() deve ser bloqueado quando stemsReady=false
        it('T6: playStemsMode() é bloqueado quando stemsReady=false', () => {
            component.ngOnInit();
            const stemFakes = injectFakeStems(component);
            (component as any).stemsReady = false;
            (component as any).playStemsMode();
            stemFakes.forEach(s => expect(s.playing).toBe(false));
            expect((component as any).playbackMode).toBe('full');
        });

        // T7: loadStems() deve resetar para modo 'full' na troca de música
        it('T7: loadStems() reseta para modo "full" na troca de música', () => {
            (component as any).playbackMode = 'stems';
            component.isStemsPlaying = true;
            (component as any).stemsReady = true;
            (component as any).loadStems(99);
            expect((component as any).playbackMode).toBe('full');
            expect(component.isStemsPlaying).toBe(false);
            expect((component as any).stemsReady).toBe(false);
            expect((component as any).stemsReadyCount).toBe(0);
        });

        it('T7.1: loadStems() trata resposta vazia sem criar WaveSurfer', () => {
            (component as any).idMusicCurrent = 99;
            musicService.stemsResponse = [];

            (component as any).loadStems(99);

            expect(component.stemsEmpty).toBe(true);
            expect(component.stemsLoadError).toBe(false);
            expect(component.stems.length).toBe(0);
            expect(createdWaveSurfers.length).toBe(0);
        });

        it('T7.2: loadStems() trata erro de API sem quebrar player principal', () => {
            const mainFake = component.wavesurfer as any as FakeWaveSurfer;
            (component as any).idMusicCurrent = 99;
            musicService.getStemsByMusicId.mockReturnValue(throwError(() => ({ status: 500 })));

            (component as any).loadStems(99);

            expect(component.stemsLoadError).toBe(true);
            expect(component.stemsReady).toBe(false);
            expect(component.stems.length).toBe(0);
            expect(mainFake.destroyed).toBe(false);
        });

        it('T7.3: loadStems() trata 404 como sem stems disponíveis', () => {
            (component as any).idMusicCurrent = 99;
            musicService.getStemsByMusicId.mockReturnValue(throwError(() => ({ status: 404 })));

            (component as any).loadStems(99);

            expect(component.stemsEmpty).toBe(true);
            expect(component.stemsLoadError).toBe(false);
            expect(component.stemsReady).toBe(false);
        });

        it('T7.4: loadStems() destrói stems anteriores ao trocar de faixa', () => {
            const previousStems = injectFakeStems(component);
            previousStems.forEach(s => { s.playing = true; });
            (component as any).idMusicCurrent = 99;
            musicService.stemsResponse = [];

            (component as any).loadStems(99);

            previousStems.forEach(s => expect(s.destroyed).toBe(true));
            expect(component.stems.length).toBe(0);
            expect((component as any).playbackMode).toBe('full');
        });

        // T8: seek no wavesurfer sincroniza tempo nos stems sem recursão
        it('T8: seek no wavesurfer sincroniza tempo em todos os stems', () => {
            component.ngOnInit();
            const stemFakes = injectFakeStems(component);
            const mainFake = component.wavesurfer as any as FakeWaveSurfer;
            // Registra handlers (normalmente feito em ngAfterViewInit)
            component.initWavesurferHandlers();
            // Emite seek a 50% de uma faixa de 100s = 50s
            mainFake.emit('seek', 0.5);
            stemFakes.forEach(s => expect(s.time).toBe(50));
        });

        // T9: fechar painel #trackCustom pausa stems automaticamente
        it('T9: fechar trackCustom pausa stems automaticamente', () => {
            component.ngOnInit();
            const stemFakes = injectFakeStems(component);
            stemFakes.forEach(s => { s.playing = true; s.time = 20; });
            (component as any).playbackMode = 'stems';
            component.isStemsPlaying = true;
            // Usa o elemento #trackCustom já presente no template do componente
            const tc = document.getElementById('trackCustom')!;
            tc.setAttribute('style', 'display: flex;');
            component.trackCustomOpen();
            stemFakes.forEach(s => expect(s.playing).toBe(false));
            expect(component.isStemsPlaying).toBe(false);
            // Restaura estilo original
            tc.setAttribute('style', 'display: none;');
        });

        // T10: on('play') em modo 'stems' deve cascatear para stems corretamente
        it('T10: on("play") em modo "stems" cascateia play para todos os stems', () => {
            component.ngOnInit();
            const mainFake = component.wavesurfer as any as FakeWaveSurfer;
            mainFake.time = 10;
            const stemFakes = injectFakeStems(component);
            // Registra handlers (normalmente feito em ngAfterViewInit)
            component.initWavesurferHandlers();
            (component as any).playbackMode = 'stems';
            mainFake.emit('play');
            stemFakes.forEach(s => {
                expect(s.time).toBe(10);
                expect(s.playing).toBe(true);
            });
        });

        it('T12: playPause() em modo stems pausa stems sem tocar faixa inteira', () => {
            const mainFake = component.wavesurfer as any as FakeWaveSurfer;
            const stemFakes = injectFakeStems(component);
            stemFakes.forEach(s => {
                s.playing = true;
                s.time = 33;
            });
            (component as any).playbackMode = 'stems';
            component.isStemsPlaying = true;
            component.isPlaying2 = false;

            component.playPause();

            expect(mainFake.playing).toBe(false);
            expect(mainFake.time).toBe(33);
            expect(component.isStemsPlaying).toBe(false);
            stemFakes.forEach(s => expect(s.playing).toBe(false));
        });

    });

    // T11: estrutura DOM — botão deve estar dentro do painel
    it('T11: #stemsPlayPause está dentro de #trackCustom no DOM', () => {
        const trackCustom = document.getElementById('trackCustom');
        const stemsBtn = document.getElementById('stemsPlayPause');
        expect(trackCustom).not.toBeNull();
        expect(stemsBtn).not.toBeNull();
        expect(trackCustom!.contains(stemsBtn!)).toBe(true);
    });
});
