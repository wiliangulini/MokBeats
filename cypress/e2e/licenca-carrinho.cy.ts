describe('Licença → carrinho', () => {
  it('bloqueia a adição sem escolha e incrementa o contador ao confirmar', () => {
    const email = `e2e_comprador_${Date.now()}@test.com`;

    // Login (backend aceita qualquer e-mail válido + senha >= 8 chars; cria perfil comprador)
    cy.visit('/#/home');
    cy.get('a.person-link').click({ force: true });
    cy.get('#aLog').click();
    cy.get('#login input[formcontrolname="emailLog"]').type(email);
    cy.get('#login input[formcontrolname="senhaLog"]').type('senha12345');
    cy.get('#login').contains('button', 'Fazer Login').click();
    cy.get('#login', { timeout: 10000 }).should('not.exist');

    // Item → modal de licença
    cy.visit('/#/musicas');
    cy.wait(1000);
    cy.contains('button', 'LICENÇA').first().click();
    cy.get('.license-modal').should('be.visible');

    // Bloqueia a adição sem escolha de licença e plano
    cy.get('.license-modal .confirm-button').should('be.disabled');
    cy.get('#license-padrao').click({ force: true });
    cy.get('.license-modal .confirm-button').should('be.disabled');

    // Escolha completa habilita a confirmação
    cy.get('#plan-mensal').click({ force: true });
    cy.get('.license-modal .confirm-button').should('be.enabled').click();

    // Contador do menu incrementa
    cy.get('#ms_number').should('have.text', '1');
  });
});
