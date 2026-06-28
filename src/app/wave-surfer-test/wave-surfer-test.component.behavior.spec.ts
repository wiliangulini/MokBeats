import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WaveSurferTestComponent } from './wave-surfer-test.component';
import { MusicPlayerService } from '../service/music-player.service';

class FakeWaveSurfer {
  time = 0;
  duration = 100;
  setTime(t: number) { this.time = t; }
  getDuration() { return this.duration; }
  destroy() {}
}

describe('WaveSurferTestComponent behavior', () => {
  let component: WaveSurferTestComponent;
  let fixture: ComponentFixture<WaveSurferTestComponent>;
  let service: MusicPlayerService;
  let fake: FakeWaveSurfer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WaveSurferTestComponent ],
      providers: [ MusicPlayerService ]
    }).compileComponents();

    fixture = TestBed.createComponent(WaveSurferTestComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(MusicPlayerService);
    component.music = { id: 1, url: 'a.mp3', nome_musica: 'A' };
    component.idContainer = 'waveform-x';
    fake = new FakeWaveSurfer();
    // Evita criar WaveSurfer real
    spyOn<any>(component, 'initWaveSurfer').and.callFake(() => {
      (component as any).wavesurfer = fake as any;
    });
  });

  it('syncs time with currentTime$ when current track', (done) => {
    // injeta fake imediatamente e evita dependência de DOM
    (component as any).wavesurfer = fake as any;
    fixture.detectChanges();
    // define música atual
    service.setCurrentMusicID(1);
    // emite tempo
    service.setCurrentTime(12);
    setTimeout(() => {
      expect(fake.time).toBe(12);
      done();
    }, 20);
  });

  it('does not move time when not current track', (done) => {
    fixture.detectChanges();
    service.setCurrentMusicID(2); // diferente
    service.setCurrentTime(33);
    setTimeout(() => {
      expect(fake.time).toBe(0);
      done();
    }, 20);
  });

  it('requests seek from minimap click when current track', () => {
    (component as any).wavesurfer = fake as any;
    component.ngOnInit();
    service.setCurrentMusicID(1);
    spyOn(service, 'requestSeek');

    (component as any).requestSeekFromMinimap(0.5);

    expect(service.requestSeek).toHaveBeenCalledWith(1, 50);
  });

  it('does not request seek from minimap click when not current track', () => {
    (component as any).wavesurfer = fake as any;
    component.ngOnInit();
    service.setCurrentMusicID(2);
    spyOn(service, 'requestSeek');

    (component as any).requestSeekFromMinimap(0.5);

    expect(service.requestSeek).not.toHaveBeenCalled();
  });

  it('does not request seek from minimap click with invalid duration', () => {
    fake.duration = 0;
    (component as any).wavesurfer = fake as any;
    component.ngOnInit();
    service.setCurrentMusicID(1);
    spyOn(service, 'requestSeek');

    (component as any).requestSeekFromMinimap(0.5);

    expect(service.requestSeek).not.toHaveBeenCalled();
  });
});
