import {AfterContentInit, Component, OnInit} from '@angular/core';
import {Musica, MusicasService} from '../musicas/musicas.service';
import WaveSurfer from 'wavesurfer.js';


@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit, AfterContentInit {
  
  arrMusica: Musica[] = [];
  volumeInitial: any;
  
  constructor(
    private musicService: MusicasService,
  ) {
  
  }
  
  ngOnInit(): void {
    this.musicService.listMusic().subscribe((data: any): void => {
      console.log(data);
    });
  }
  
  ngAfterContentInit(): void {
    
    const ws: any = WaveSurfer.create({
      container: "#waveform",
      waveColor: '#2f1ef1',
      progressColor: '#007BFF',
      // url: '../../assets/videos/Tipo_Minato.mp3',
      minPxPerSec: 10,
      hideScrollbar: true,
      fillParent: true,
      height: 100,
      dragToSeek: true,
      backend: 'MediaElement',
      // plugins: [
      //   // Registrar o plugin
      //   Minimap.create({
      //     height: 20,
      //     waveColor: '#ddd',
      //     progressColor: '#fff',
      //     // o Minimapa tem todas as mesmas opções do próprio WaveSurfer
      //   }),
      // ],
    });
    ws.load('../../assets/videos/Tipo_Minato.mp3');
    
    const formatTime = (seconds: any) => {
      const minutes = Math.floor(seconds / 60)
      const secondsRemainder = Math.round(seconds) % 60
      const paddedSeconds = `0${secondsRemainder}`.slice(-2)
      return `${minutes}:${paddedSeconds}`
    }
    
    const playButton: any = document.querySelector('#play');
    const backButton: any = document.querySelector('#backward');
    const forwardButton: any = document.querySelector('#forward');
    const timeEl: any = document.querySelector('#time');
    const durationEl: any = document.querySelector('#duration');
    const volumeSlider: any = document.querySelector("#volumeSlider");
    const volumeOn: any = document.querySelector(".muteOn");
    const volumeOn2: any = document.querySelector(".muteOff");
    
    ws.on('decode', (duration: any) => (durationEl.textContent = formatTime(duration)));
    ws.on('timeupdate', (currentTime: any) => (timeEl.textContent = formatTime(currentTime)));
    console.log(volumeSlider.value);
    ws.on('ready', () => {
      
      // quando clicar no mute trocar icone e colocar slider de volume no 0;
      if(volumeSlider) {
        volumeSlider.addEventListener('input', (e: any) => {
          console.log(e);
          let vol: any = e.target.value;
          ws.setVolume(vol / 100);
          
          if(vol == '0') {
            volumeOn2.classList.add('d-flex');
            volumeOn2.classList.remove('d-none');
            volumeOn.classList.remove('d-flex');
            volumeOn.classList.add('d-none');
          } else {
            volumeOn.classList.add('d-flex');
            volumeOn.classList.remove('d-none');
            volumeOn2.classList.remove('d-flex');
            volumeOn2.classList.add('d-none');
          }
          
        });
      }
      // provavelmente nao esta funcionando pois nao esta dentro do wavesurfer o muted e sim ligado ao botao, por isso o slider esta correndo ao clicar e trocando icones porem nao esta alterando a musica.
    });
    
    this.volumeInitial = document.querySelector('#volumeSlider')!.getAttribute('value');
    
    playButton.onclick = (): void => {
      ws.playPause();
    }
    
    forwardButton.onclick = (): void => {
      ws.skip(5);
    }
    
    backButton.onclick = (): void => {
      ws.skip(-5);
    }
    
  }
  
  
  muteOnOff() {
    let volumeSlider: any = document.querySelector("#volumeSlider");
    let muteOn: any = document.querySelector(".muteOn");
    let muteOff: any = document.querySelector(".muteOff");
    console.log(this.volumeInitial);
    
    volumeSlider.setAttribute('value', '0');
    // amanha verificar funçoes, eu posso juntar ambas, com dupla verificacaçao dessa forma verfico o valor do volumeSlider e o icone presente no btn mute, dentro setar as informaçoes pra que a barra de rolagem corra, ou entao checar apenas pelos icones dos botoes mas tenho q pegar o valor em que o slider esta pela ultima vez antes de mutalo pra poder voltar ao valor inicial, pois inicialmente é 75 porem o usuario pode mudar esse valor, e qndo se faz isso nao esta funcionando. slider esta funcionando, porem ao clicar em muted temos a rolagem apenas no inicio porem nao muta a musica tocando.
    if(muteOff.classList.contains('d-flex')) {
      volumeSlider.setAttribute('value', this.volumeInitial);
      console.log(volumeSlider)
      muteOff.classList.remove('d-flex');
      muteOff.classList.add('d-none');
      muteOn.classList.add('d-flex');
      muteOn.classList.remove('d-none');
    }
    
    if(volumeSlider.value !== '0') {
      console.log(volumeSlider.value);
      muteOn.classList.add('d-flex');
      muteOn.classList.remove('d-none');
      muteOff.classList.remove('d-flex');
      muteOff.classList.add('d-none');
    } else {
      console.log(volumeSlider.value);
      console.log(this.volumeInitial);
      muteOff.classList.add('d-flex');
      muteOff.classList.remove('d-none');
      muteOn.classList.remove('d-flex');
      muteOn.classList.add('d-none');
    }
  }
  
  hidePlayer() {
    document.getElementById('controlPlayer')!.classList.remove('showPlayer');
    document.getElementById('controlPlayer')!.classList.add('hidePlayer');
  }
  
  curtir(e: any) {
    console.log(e);
  }
  addMusicPlayList(el: any): void {
    console.log(el);
  }
  copiarLink(elm: any) {
    console.log(elm);
  }
  
  baixarAmostra(i: any) {
    console.log(i);
  }
  
}
