import {defineConfig, devices} from '@playwright/test';

/**
 * Accessibility smoke tests (axe + keyboard). Run against a local dev server
 * by default, or any deployed storefront via A11Y_BASE_URL:
 *
 *   npm run test:a11y
 *   A11Y_BASE_URL=https://my-preview.example.com npm run test:a11y
 */
const baseURL = process.env.A11Y_BASE_URL || 'http://localhost:8080';

export default defineConfig({
  testDir: './tests/a11y',
  timeout: 60_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: {baseURL, trace: 'retain-on-failure'},
  projects: [
    {name: 'desktop', use: {...devices['Desktop Chrome']}},
    {name: 'mobile', use: {...devices['Pixel 7']}},
  ],
  // Start the dev server only when testing locally
  webServer: process.env.A11Y_BASE_URL
    ? undefined
    : {
        command: 'npm run dev',
        url: baseURL,
        reuseExistingServer: true,
        timeout: 180_000,
      },
});
