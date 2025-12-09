import { defineConfig } from 'cypress';
import path from 'path';
import { fileURLToPath } from 'url';

//obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    setupNodeEvents(on, config) {
      //implementar event listeners aquí si es necesario
      //manejar errores de la aplicación sin bloquear los tests
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
      });
    },
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false, // Desactiva videos para tests más rápidos (opcional)
    screenshotOnRunFailure: true,
    //configuración para manejar errores sin bloquear
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    //ignorar errores de JavaScript en la aplicación
    blockHosts: [],
    //permitir capturas incluso con errores
    chromeWebSecurity: false,
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
      viteConfig: {
        resolve: {
          alias: {
            '@': path.resolve(__dirname, './src'),
          },
        },
        optimizeDeps: {
          include: ['dayjs', 'dayjs/plugin/relativeTime'],
        },
      },
    },
    specPattern: 'cypress/component/**/*.cy.{js,jsx,ts,tsx}',
  },
});

