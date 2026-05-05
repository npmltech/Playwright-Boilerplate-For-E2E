import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const defaultBaseUrl =
  'https://automationteststore.com/';
const baseURL = process.env.BASE_URL || defaultBaseUrl;
const videoMode = process.env.PW_VIDEO_MODE || 'retain-on-failure';
const shouldUseWebServer = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(
  baseURL
);
const projects = [
  {
    name: 'chromium',
    use: {
      ...devices['Desktop Chrome'],
      launchOptions: {
        args: ['--disable-blink-features=AutomationControlled', '--ozone-platform=x11'],
      },
    },
  },
  { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
];

console.log('BASE_URL:', baseURL);

export default defineConfig({
  projects,
  reporter: [['html', { outputFolder: '../reports' }]],
  retries: process.env.CI ? 2 : 0,
  testDir: '../tests/e2e',
  timeout: 30_000,
  use: {
    baseURL,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: videoMode as 'off' | 'on' | 'retain-on-failure' | 'on-first-retry',
  },
  ...(shouldUseWebServer
    ? {
        webServer: {
          command: `node ${path.resolve(__dirname, 'start-server-if-free.js')}`,
          reuseExistingServer: !process.env.CI,
          gracefulShutdown: { signal: 'SIGINT', timeout: 500 },
          timeout: 5000,
          url: baseURL,
        },
      }
    : {}),
});
