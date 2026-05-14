/**
 * @file tests/e2e/cypress/support/e2e.js
 * @description Comandos personalizados de Cypress para el sistema de accionistas.
 */
import './commands.js';

// Silenciar errores de consola no críticos en tests
Cypress.on('uncaught:exception', (err) => {
  // Ignorar errores de ResizeObserver (común en libs de UI)
  if (err.message.includes('ResizeObserver loop')) return false;
  return true;
});
