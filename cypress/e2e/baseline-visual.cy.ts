// Baseline visual da Etapa 1 (migração Angular 14→22). Gabarito para
// comparação nas Etapas 3 (Bootstrap 4→5) e D1 (Material 15/MDC). Screenshots
// em cypress/screenshots/baseline-visual.cy.ts/ — comparar manualmente após
// cada etapa que toque template/estilo global.
describe('Baseline visual', () => {
  it('rotas públicas', () => {
    cy.visit('/#/home');
    cy.wait(800);
    cy.screenshot('home', { capture: 'fullPage' });

    cy.visit('/#/musicas');
    cy.wait(1000);
    cy.screenshot('musicas', { capture: 'fullPage' });

    cy.visit('/#/login');
    cy.wait(500);
    cy.screenshot('login', { capture: 'fullPage' });
  });

  it('carrinho com item (logado como comprador)', () => {
    const email = `e2e_baseline_comprador_${Date.now()}@test.com`;
    cy.visit('/#/home');
    cy.get('a.person-link').click({ force: true });
    cy.get('#aLog').click();
    cy.get('#login input[formcontrolname="emailLog"]').type(email);
    cy.get('#login input[formcontrolname="senhaLog"]').type('senha12345');
    cy.get('#login').contains('button', 'Fazer Login').click();
    cy.get('#login', { timeout: 10000 }).should('not.exist');

    cy.visit('/#/musicas');
    cy.wait(1000);
    cy.contains('button', 'LICENÇA').first().click();
    cy.get('#license-padrao').click({ force: true });
    cy.get('#plan-mensal').click({ force: true });
    cy.get('.license-modal .confirm-button').should('be.enabled').click();
    cy.get('#ms_number').should('have.text', '1');

    cy.get('a.cart-link').click({ force: true });
    cy.wait(500);
    cy.screenshot('carrinho', { capture: 'fullPage' });
  });

  it('finalizar-compra e upload (logado como produtor com perfil completo)', () => {
    const email = `e2e_baseline_produtor_${Date.now()}@test.com`;
    const password = 'senha12345';

    cy.request('POST', 'http://127.0.0.1:3100/api/auth/register', {
      email,
      password,
      tipoPessoa: 'fisica',
      tipoPerfil: 'produtor',
    }).then((res) => {
      const token = res.body.token;
      const profile = {
        nomeCompleto: 'Produtor Baseline',
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
      cy.intercept('GET', '**/api/user/profile', profile).as('getProfile');

      cy.visit('/#/finalizar-compra', {
        onBeforeLoad(win) {
          win.localStorage.setItem('authToken', token);
          win.localStorage.setItem('userPerfil', 'produtor');
          win.localStorage.setItem('userProfileCache', JSON.stringify(profile));
        },
      });
      cy.wait(800);
      cy.screenshot('finalizar-compra', { capture: 'fullPage' });

      cy.visit('/#/upload');
      cy.wait(1000);
      cy.screenshot('upload-mat-form-field', { capture: 'fullPage' });
    });
  });
});
