import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerComponent } from './player.component';
import { MusicPlayerService } from '../service/music-player.service';
import { PlayerService } from './player.service';
import { MusicasService } from '../musicas/musicas.service';

class StubPlayerService {
  showPlayer = jasmine.createSpy('showPlayer');
  hidePlayer = jasmine.createSpy('hidePlayer');
  tooglePlayPause() {}
}

class StubMusicasService {}

// Fake minimal para WaveSurfer
class FakeWaveSurfer {
  time = 0;
  on() {}
  destroy() {}
  load() {}
  play() {}
  pause() {}
  setTime(t: number) { this.time = t; }
  skip() {}
  getDuration() { return 100; }
  setVolume() {}
  setMuted() {}
  getCurrentTime() { return this.time; }
}

describe('PlayerComponent behavior', () => {
  let component: PlayerComponent;
  let fixture: ComponentFixture<PlayerComponent>;
  let mps: MusicPlayerService;
  let ps: StubPlayerService;

  beforeAll(() => {
    // @ts-ignore
    const ws = require('wavesurfer.js');
    (ws as any).default = ws.default || ws;
    (ws as any).create = () => new FakeWaveSurfer() as any;
    // @ts-ignore
    const mm = require('wavesurfer.js/dist/plugins/minimap');
    (mm as any).default = mm.default || mm;
    (mm as any).create = () => ({ plugin: 'minimap' });
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerComponent ],
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
});

