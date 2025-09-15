import { TestBed } from '@angular/core/testing';
import { MusicPlayerService } from './music-player.service';

describe('MusicPlayerService behavior', () => {
  let service: MusicPlayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MusicPlayerService]
    });
    service = TestBed.inject(MusicPlayerService);
  });

  it('emits play/pause actions', (done) => {
    const received: any[] = [];
    const sub = service.playPauseAction$.subscribe(v => {
      received.push(v);
      if (received.length === 2) {
        expect(received[0]).toEqual({ action: 'play', musicId: 1 });
        expect(received[1]).toEqual({ action: 'pause', musicId: 1 });
        sub.unsubscribe();
        done();
      }
    });
    service.onPlayPause('play', 1);
    service.onPlayPause('pause', 1);
  });

  it('updates current url and id', (done) => {
    let urlOk = false;
    let idOk = false;
    const sub1 = service.currentMusicUrl$.subscribe(u => {
      if (u === 'u.mp3') urlOk = true;
      if (urlOk && idOk) { sub1.unsubscribe(); sub2.unsubscribe(); done(); }
    });
    const sub2 = service.currentMusicID$.subscribe(id => {
      if (id === 7) idOk = true;
      if (urlOk && idOk) { sub1.unsubscribe(); sub2.unsubscribe(); done(); }
    });
    service.setCurrentMusicUrl('u.mp3');
    service.setCurrentMusicID(7);
  });

  it('broadcasts current time', (done) => {
    const times: number[] = [];
    const sub = service.currentTime$.subscribe(t => {
      times.push(t);
      if (times.length === 2) {
        expect(times).toEqual([0, 12.34]);
        sub.unsubscribe();
        done();
      }
    });
    service.setCurrentTime(0);
    service.setCurrentTime(12.34);
  });

  it('emits seek requests', (done) => {
    const sub = service.seekRequest$.subscribe(({ musicId, time }) => {
      expect(musicId).toBe(9);
      expect(time).toBe(42);
      sub.unsubscribe();
      done();
    });
    service.requestSeek(9, 42);
  });
});

