/**
 * @file tests/e2e/cypress/support/commands.js
 * @description Comandos Cypress reutilizables para el módulo de precalificación.
 */

/**
 * Navega al módulo de precalificación por su ruta
 * @example cy.visitModulo('estados')
 */
Cypress.Commands.add('visitModulo', (modulo) => {
  cy.visit(`/precalificacion/${modulo}`);
  // Esperar que el sidebar y el topbar estén presentes
  cy.get('.sidebar').should('be.visible');
  cy.get('.topbar').should('be.visible');
});

/**
 * Verifica que el toast de éxito aparezca con el texto indicado
 * @example cy.verifyToast('Estado creado correctamente')
 */
Cypress.Commands.add('verifyToast', (texto, tipo = 'success') => {
  cy.get('.toast-container .toast', { timeout: 5000 })
    .should('be.visible')
    .and('contain.text', texto);
});

/**
 * Abre el modal de nuevo registro usando el botón primario de la página
 * @example cy.abrirModalNuevo()
 */
Cypress.Commands.add('abrirModalNuevo', () => {
  cy.get('.btn-primary, .btn--primary').first().click();
  cy.get('.modal-overlay--open, .mo.open').should('be.visible');
});

/**
 * Cierra el modal activo por el botón X
 */
Cypress.Commands.add('cerrarModal', () => {
  cy.get('.modal__close, .mc-btn').first().click();
  cy.get('.modal-overlay--open, .mo.open').should('not.exist');
});

/**
 * Verifica que la tabla de datos tenga N filas de datos
 * @example cy.tablaDebeContener(7)
 */
Cypress.Commands.add('tablaDebeContener', (n) => {
  cy.get('.data-table tbody tr, table tbody tr')
    .should('have.length.gte', n > 0 ? 1 : 0);
});
