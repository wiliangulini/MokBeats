describe('Player e sincronização básica', () => {
  it('player inicia oculto, aparece ao tocar e persiste entre páginas', () => {
    // Página inicial
    cy.visit('/');
    cy.get('#controlPlayer').should('exist').and('have.class', 'hidePlayer');

    // Vai para a página de músicas
    cy.visit('/musicas');
    // Garante que os itens carregaram
    cy.get('button.svg.play').first().should('be.visible').click();

    // Player deve aparecer
    cy.get('#controlPlayer').should('have.class', 'showPlayer');

    // Navega para outra página e valida persistência
    cy.visit('/faq');
    cy.get('#controlPlayer').should('have.class', 'showPlayer');

    // Minimiza e reabre
    cy.get('#hide').click();
    cy.get('#controlPlayer').should('have.class', 'hidePlayer');
    cy.get('#showPlayerBtn').should('be.visible').click();
    cy.get('#controlPlayer').should('have.class', 'showPlayer');
  });
});

