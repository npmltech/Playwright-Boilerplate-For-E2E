import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('BASE_URL:', process.env.BASE_URL)

export default defineConfig({
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  ],
  reporter: [['html', { outputFolder: '../reports' }]],
  retries: process.env.CI ? 2 : 0,
  testDir: '../tests/e2e',
  timeout: 30_000,
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
  },
  webServer: {
    command: `node ${path.resolve(__dirname, 'start-server-if-free.js')}`,
    reuseExistingServer: !process.env.CI,
    gracefulShutdown: { signal: 'SIGINT', timeout: 500 },
    timeout: 5000,
    url: process.env.BASE_URL || 'http://localhost:3000',
  },
});