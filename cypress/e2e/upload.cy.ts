// Congela os nomes de campo do FormData de upload (Single Track sem stems).
// Setup via API real (registro + perfil completo no localStorage) para não
// depender do fluxo de completar-informações/documentos, fora do escopo deste
// spec. cy.intercept responde com stub — a chamada real nunca sai do browser.
// Os nomes de campo são capturados via monkey-patch de FormData.append no
// onBeforeLoad: para requests multipart/form-data, o Cypress 13 não expõe o
// corpo bruto em interception.request.body (sempre {} — limitação conhecida),
// então inspecionar a rede não é viável; capturar na origem (o próprio
// FormData que o componente monta) é mais robusto.
describe('Upload do produtor — Single Track sem stems', () => {
  it('preserva os nomes de campo do FormData', () => {
    const email = `e2e_produtor_${Date.now()}@test.com`;
    const password = 'senha12345';

    cy.request('POST', 'http://127.0.0.1:3100/api/auth/register', {
      email,
      password,
      tipoPessoa: 'fisica',
      tipoPerfil: 'produtor',
    }).then((res) => {
      const token = res.body.token;
      const profile = {
        nomeCompleto: 'Produtor E2E',
        tipoDocumento: 'cpf',
        cpf: '11122233344',
        dataNascimento: '1990-01-01',
        paisOrigem: 'BR',
        telefone: '11999999999',
        email,
        endereco: 'Rua Teste, 123',
        cidade: 'São Paulo',
        fotoDocumentoUrl: '/uploads/fake-doc.png',
        comprovanteResidenciaUrl: '/uploads/fake-address.png',
        tipoConta: 'none',
      };

      // ProfileCompleteGuard reconstrói o serviço no bootstrap da rota e o
      // banner global (app.component.html) chama GET /api/user/profile no
      // ngOnInit — sem o intercept, a resposta real (perfil vazio) sobrescreve
      // o cache local antes do guard decidir. cy.visit para uma mudança de
      // hash na mesma origem não recarrega o documento, então o localStorage
      // precisa ser populado em onBeforeLoad (antes do bootstrap), não depois.
      cy.intercept('GET', '**/api/user/profile', profile).as('getProfile');
      cy.intercept('POST', '**/api/producers/track', {
        statusCode: 201,
        body: { ok: true },
      }).as('uploadTrack');

      cy.visit('/#/upload', {
        onBeforeLoad(win) {
          win.localStorage.setItem('authToken', token);
          win.localStorage.setItem('userPerfil', 'produtor');
          win.localStorage.setItem('userProfileCache', JSON.stringify(profile));

          const capturedFields: string[] = [];
          (win as any).__capturedFormDataFields = capturedFields;
          const originalAppend = win.FormData.prototype.append;
          win.FormData.prototype.append = function (name: string, ...rest: any[]) {
            capturedFields.push(name);
            return originalAppend.apply(this, [name, ...rest] as any);
          };
        },
      });

      cy.get('input[formcontrolname="nome"]').type('Produtor E2E');
      cy.get('input[formcontrolname="email"]').type(email);
      cy.get('input[formcontrolname="phone"]').type('11999999999');
      cy.get('input[formcontrolname="identification"]').type('11122233344');
      cy.get('input[formcontrolname="trackName"]').type('Faixa E2E');

      cy.get('mat-select[formcontrolname="category"]').click();
      cy.contains('mat-option', 'Beats').click();

      cy.get('mat-select[formcontrolname="genrePrimary"]').click();
      cy.get('mat-option').first().click();

      cy.get('input[formcontrolname="bpm"]').type('120');

      cy.get('mat-select[formcontrolname="key"]').click();
      cy.contains('mat-option', 'C (Dó Maior)').click();

      cy.get('app-custom-file-upload')
        .eq(0)
        .find('input[type=file]')
        .selectFile('cypress/fixtures/audio/single-track.wav', { force: true });
      cy.get('app-custom-file-upload')
        .eq(1)
        .find('input[type=file]')
        .selectFile('cypress/fixtures/audio/loop15.wav', { force: true });
      cy.get('app-custom-file-upload')
        .eq(2)
        .find('input[type=file]')
        .selectFile('cypress/fixtures/audio/loop30.wav', { force: true });
      cy.get('app-custom-file-upload')
        .eq(3)
        .find('input[type=file]')
        .selectFile('cypress/fixtures/audio/loop60.wav', { force: true });

      cy.get('mat-checkbox[formcontrolname="politicaDePrivacidade"]').click();

      cy.get('button.btnSubmit').should('not.be.disabled').click();

      cy.wait('@uploadTrack', { timeout: 15000 });
      cy.window().its('__capturedFormDataFields').then((fieldNames: string[]) => {
        expect(fieldNames, 'campos presentes').to.include.members([
          'schemaVersion',
          'mode',
          'track',
          'loop15',
          'loop30',
          'loop60',
          'meta',
        ]);
        expect(fieldNames, 'campos de stems/fx ausentes em Single Track').to.not.include.members([
          'stem_melody',
          'stem_harmony',
          'stem_drums',
          'stem_fx',
          'effect1',
          'effect2',
          'effect3',
          'effect4',
          'effect5',
          'effect6',
        ]);
      });
    });
  });
});
