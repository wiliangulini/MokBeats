# 0018 — `wave-surfer-test.component.spec.ts` não definia `@Input() music` antes de `detectChanges()`

**Etapa de origem:** 10 (D7 — Angular/Material 21, checkpoint)
**Severidade:** Baixa (bug de teste pré-existente, sem risco em produção)
**Status:** Resolvido (`mig/d7`)

## Descrição

`src/app/wave-surfer-test/wave-surfer-test.component.spec.ts` (o spec padrão "should create",
gerado originalmente pelo Angular CLI e nunca atualizado) cria `WaveSurferTestComponent` e chama
`fixture.detectChanges()` sem nunca definir `component.music` (`@Input() music!: any;`). Dentro de
`ngOnInit()`, o componente assina `musicPlayerService.currentMusicID$` (um `BehaviorSubject`, que
emite sincronamente ao assinar) e o callback acessa `this.music.id` imediatamente — lançando
`TypeError: Cannot read properties of undefined (reading 'id')` quando `music` está indefinido.

Esse bug sempre existiu latente no spec, mas era mascarado: versões anteriores do `TestBed`
reportavam o erro só ao `ErrorHandler` (log de console) sem falhar o teste. A partir do Angular 21,
o `TestBed` relança esses erros por padrão (ver achado
[0017](0017-testbed-relanca-ng0100-sem-providezonechangedetection.md), mesma causa raiz), expondo o
bug como falha real de teste — inclusive causando desconexão do Chrome Headless por timeout em
alguns casos.

O spec irmão `wave-surfer-test.component.behavior.spec.ts` já define `component.music = {...}`
corretamente antes de `fixture.detectChanges()` — só o spec padrão "should create" tinha a lacuna.

**Sem risco em produção:** o componente real sempre recebe `music` via property binding do template
pai (`musicas.component.html`), e o Angular garante que `@Input()`s são atribuídos antes do
`ngOnInit()` disparar — a condição que causa o erro (`music` indefinido) só ocorre no ambiente de
teste, onde o input nunca foi setado.

## Evidência

```
TypeError: Cannot read properties of undefined (reading 'id')
    at Object.next (.../wave-surfer-test.component.ts:56:42)
    at ConsumerObserver.next (.../rxjs/dist/esm/internal/Subscriber.js:91:33)
    at BehaviorSubject._subscribe (.../rxjs/dist/esm/internal/BehaviorSubject.js:12:44)
```

## Ação recomendada

Aplicado em `wave-surfer-test.component.spec.ts`: adicionada a linha
`component.music = { id: 1, url: 'a.mp3', nome_musica: 'A' };` antes de `fixture.detectChanges()`,
espelhando o padrão já correto do `behavior.spec.ts`. Nenhuma alteração no componente em si.

## Referências

`docs/ia-auditorias/2026-07-31__migracao-angular-etapa-10__claude.md`.
