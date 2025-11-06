/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import { defineConfig as defineTestConfig, mergeConfig } from 'vitest/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default mergeConfig(
  defineConfig({
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },
    test: {
      projects: [
        {
          extends: true,
          plugins: [
            // The plugin will run tests for the stories defined in your Storybook config
            // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
            storybookTest({
              configDir: path.join(dirname, '.storybook'),
            }),
          ],
          test: {
            name: 'storybook',
            browser: {
              enabled: true,
              headless: true,
              provider: 'playwright',
              instances: [
                {
                  browser: 'chromium',
                },
              ],
            },
            setupFiles: ['.storybook/vitest.setup.ts'],
          },
        },
      ],
    },
  }),
  defineTestConfig({
    test: {
      // ✅ Vitest 전용 설정
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/setupTests.ts'],
      // 존재하면 유지

      // ✅ Vitest가 테스트 파일로 인식할 대상
      include: [
        'src/**/*.{test,spec}.{ts,tsx}',
        'tests/unit/**/*.{test,spec}.{ts,tsx}',
        'tests/integration/**/*.{test,spec}.{ts,tsx}',
      ],
      // ✅ Playwright(E2E) 관련 경로 및 설정 완전 무시
      exclude: [
        'node_modules',
        'dist',
        'coverage',
        'build',
        'tests/e2e/**',
        'e2e/**',
        '**/*.e2e.{ts,tsx}',
        'playwright.config.{ts,js}',
      ],
      // ✅ 선택: 커버리지 리포트
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'],
      },
    },
  })
);
