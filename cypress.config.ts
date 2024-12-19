import { defineConfig } from 'cypress';

export default defineConfig({
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'results/mochawesome',
    overwrite: false,
    html: false,
    json: true
  },
  video: false,
  e2e: {
    experimentalRunAllSpecs: true,
    baseUrl: 'http://localhost:4201',
    supportFile: false
  }
});
