// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

process.env.TEST_ENV = 'e2e';

export default defineConfig({
  globalSetup: './tests/global-setup.ts',
  testDir: './tests/e2e', // 테스트 파일이 위치할 폴더
  fullyParallel: true,
  workers: 1,
  retries: 0,
  reporter: [['html', { outputFolder: 'playwright-report' }]],

  use: {
    baseURL: 'http://localhost:5173', // Vite dev 서버 기준
    headless: true,
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },

  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],

  webServer: {
    command: 'pnpm run dev:e2e',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
