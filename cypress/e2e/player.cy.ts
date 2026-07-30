function countMediaElements(win: Window): number {
  const root = win.document.getElementById('waveform');
  if (!root) return 0;
  const recurse = (node: ParentNode): number => {
    let count = node.querySelectorAll('audio,video').length;
    node.querySelectorAll('*').forEach((el) => {
      const shadow = (el as HTMLElement).shadowRoot;
      if (shadow) count += recurse(shadow);
    });
    return count;
  };
  return recurse(root);
}

describe('Player e sincronização básica', () => {
  it('player inicia oculto, aparece ao tocar e persiste entre páginas', () => {
    // Página inicial
    cy.visit('/#/home');
    cy.get('#controlPlayer').should('exist').and('have.class', 'hidePlayer');

    // Vai para a página de músicas
    cy.visit('/#/musicas');
    // Garante que os itens carregaram
    cy.get('button.svg.play').first().should('be.visible').click();

    // Player deve aparecer
    cy.get('#controlPlayer').should('have.class', 'showPlayer');

    // Navega para outra página e valida persistência
    cy.visit('/#/faq');
    cy.get('#controlPlayer').should('have.class', 'showPlayer');

    // Minimiza e reabre
    cy.get('#hide').click({ force: true });
    cy.get('#controlPlayer').should('have.class', 'hidePlayer');
    cy.get('#showPlayerBtn').should('exist').click({ force: true });
    cy.get('#controlPlayer').should('have.class', 'showPlayer');
  });

  it('troca de faixa 3x sem duplicar elementos de áudio', () => {
    cy.visit('/#/musicas');
    cy.get('button.svg.play').first().should('be.visible').click();
    cy.wait(2000);

    cy.window()
      .then((win) => countMediaElements(win))
      .as('mediaCountBefore');

    cy.get('#forward').click({ force: true });
    cy.wait(700);
    cy.get('#forward').click({ force: true });
    cy.wait(700);
    cy.get('#forward').click({ force: true });
    cy.wait(1500);

    cy.get('@mediaCountBefore').then((before) => {
      cy.window().then((win) => {
        expect(countMediaElements(win), 'quantidade de elementos de áudio/vídeo').to.equal(before);
      });
    });
  });
});
