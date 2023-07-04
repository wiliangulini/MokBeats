import {Injectable} from '@angular/core';
import {AuthService} from "../login/auth.service";

@Injectable({
  providedIn: 'root'
})
export class EfeitosSonorosService {

  hearth: any;
  hearth1: any;
  convertida: Array<any> = [];
  convertida2: Array<any> = [];

  public categorias: any = [
    {
      "Air": [
        "Blow",
        "Burst",
        "Hiss",
        "Suction",
      ],
      "Aircraft": [
        "Helicopter",
        "Jet",
        "Mechanism",
        "Misc",
        "Prop",
        "Radio controlled",
        "Rocket",
      ],
      "Alarms": [
        "Bell",
        "Buzzer",
        "Clock",
        "Electronic",
        "Misc",
        "Siren",
      ],
      "Ambience": [
        "Birdsong",
        "Celebration",
        "Construction",
        "Designed",
        "Farm",
        "Forest",
        "Hitech",
        "Hospital",
        "Industrial",
        "Market",
        "Misc",
        "Nautical",
        "Office",
        "Public place",
        "Religious",
        "Restaurant & bar",
        "Room tone",
        "Rural",
        "School",
        "Seaside",
        "Sport",
        "Suburban",
        "Swamp",
        "Traffic",
        "Transportation",
        "Tropical",
        "Underground",
        "Underwater",
        "Urban",
      ],
      'Animals': [
        "Cat domestic",
        "Dog",
        "Farm",
        "Horse",
        "Insect",
        "Misc",
        "Reptile",
        "Rodent",
      ]
    }
  ]

  constructor(
    private authService: AuthService,
  ) {
    this.categorias.map((obj: any) => {
      Object.keys(obj).map((chave: any) => {
        this.convertida2.push(chave);
        this.convertida.push(obj[chave]);
      });
    });
  }

  public curtir(i: number) {
    this.authService.verificaLogin();

    if(this.authService.userAutetic()) {
      this.hearth = document.querySelectorAll('.hearth');
      this.hearth1 = document.querySelectorAll('.hearth1');

      if(this.hearth[i].style.display == 'block') {
        this.hearth[i].style.display = 'none';
        this.hearth1[i].style.display = 'block';
      } else {
        this.hearth[i].style.display = 'block';
        this.hearth1[i].style.display = 'none';
      }
    }
  }

  public comprarLicensa(i: number) {
    this.authService.verificaLogin();
    console.log(i);
  }
}
