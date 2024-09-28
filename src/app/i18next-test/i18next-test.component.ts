import {AfterContentInit, Component, OnInit} from '@angular/core';
import i18next from "i18next";

@Component({
  selector: 'app-i18next-test',
  templateUrl: './i18next-test.component.html',
  styleUrls: ['./i18next-test.component.scss']
})
export class I18nextTestComponent implements OnInit, AfterContentInit {
  
  translations: any = {
    en: {
      welcome: "Welcome to our website!",
      description: "This is an example of a multilingual site."
    },
    es: {
      welcome: "¡Bienvenido a nuestro sitio web!",
      description: "Este es un ejemplo de un sitio multilingüe."
    }
  };
  
  constructor() { }
  
  ngOnInit(): void {
  }
  
  ngAfterContentInit(): void {
    
    i18next.init({
      lng: 'en', // se você estiver usando um detector de idioma, não defina a opção lng
      debug: true,
      resources: {
        en: {
          translation: {
            "key": "hello world"
          }
        }
      }
    });
    
    // inicializado e pronto para usar!
    // i18next já foi inicializado, porque os recursos de tradução foram passados pela função init
    let output: any = document.getElementById('output');
    output!.innerHTML = i18next.t('key');
    output.addEventListener('click', () => {
      console.log('click');
    })
  }
  
  
  setLanguage(lang: any) {
    document.documentElement.lang = lang;
    document.getElementById('content')!.innerHTML = `
      <h1>${this.translations[lang].welcome}</h1>
      <p>${this.translations[lang].description}</p>
  `;
  }
  // Set default language
  // setLanguage('en');
  
}
