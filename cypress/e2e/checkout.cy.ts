// NOTA (divergências registradas, Etapa 1):
// 1) O plano original previa cobrir "carrinho → /finalizar-compra" com as
//    máscaras de #numerocartao1/#cpfBol. Na base real, FinalizarCompraComponent
//    não injeta CarrinhoService (total é hardcoded) e não contém esses campos —
//    eles vivem em /formas-de-pagamento (guard só AuthGuard). Este spec cobre o
//    que existe de fato: persistência do item no carrinho + os campos de A5.
// 2) A5 presumia que a máscara jQuery aplica hoje. Não aplica: os `scripts` de
//    `angular.json` (src/input_mask.js) rodam uma única vez no carregamento do
//    documento, antes de o Angular montar qualquer componente — o seletor
//    `$("#numerocartao1")` sempre roda contra DOM vazio. É bug pré-existente,
//    fora do escopo desta etapa corrigir (só specs Cypress). Este teste
//    documenta o comportamento REAL (sem máscara); se um dia a máscara for
//    corrigida, esta asserção passa a falhar e sinaliza a mudança.
describe('Carrinho → formas de pagamento', () => {
  it('mantém o item no carrinho e documenta o estado real dos campos de cartão/CPF (sem máscara)', () => {
    const email = `e2e_checkout_${Date.now()}@test.com`;

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
    cy.get('.license-modal').should('be.visible');
    cy.get('#license-premium').click({ force: true });
    cy.get('#plan-12-meses').click({ force: true });
    cy.get('.license-modal .confirm-button').should('be.enabled').click();
    cy.get('#ms_number').should('have.text', '1');

    // Itens e licença persistem na página do carrinho
    cy.get('a.cart-link').click({ force: true });
    cy.location('hash').should('include', '/carrinho');
    cy.contains('.cart-item-license', 'Licença Premium').should('be.visible');
    cy.contains('.cart-item-plan', '12 meses').should('be.visible');

    // Campos de A5 — a máscara jQuery NÃO aplica hoje (ver nota acima).
    // Este teste documenta o comportamento real: o valor chega sem formatação.
    cy.visit('/#/formas-de-pagamento');

    cy.get('#credito').click();
    cy.get('#numerocartao1').type('1234567890123456');
    cy.get('#numerocartao1').should('have.value', '1234567890123456');

    cy.get('#boleto').click();
    cy.get('#cpfBol').type('12345678901');
    cy.get('#cpfBol').should('have.value', '12345678901');
  });
});
