import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  timeout: 45_000,
  use: { baseURL: 'http://localhost:4321' },
  webServer: { command: 'node scripts/serve-out.mjs', port: 4321, reuseExistingServer: true },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
