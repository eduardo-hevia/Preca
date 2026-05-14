import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals:     true,
    environment: 'jsdom',
    setupFiles:  './tests/setup.js',
    coverage: {
      provider:  'v8',
      reporter:  ['text', 'json', 'html'],
      exclude:   ['**/node_modules/**', '**/tests/**', '**/*.config.*'],
    },
  },
  server: {
    proxy: {
      '/api': {
        target:    'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
