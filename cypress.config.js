import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl:    'http://localhost:5173',
    specPattern:'tests/e2e/cypress/e2e/**/*.cy.js',
    supportFile:'tests/e2e/cypress/support/e2e.js',
    fixturesFolder:'tests/e2e/cypress/fixtures',
    screenshotsFolder: 'tests/e2e/screenshots',
    videosFolder:      'tests/e2e/videos',
    viewportWidth:  1440,
    viewportHeight: 900,
    video: false,
    defaultCommandTimeout: 8000,
    env: {
      // VITE_USE_MOCK=true → sin backend real en E2E
      apiUrl: 'http://localhost:3001/api/v1',
    },
  },
});
