import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import { defineConfig as defineTestConfig, mergeConfig } from 'vitest/config';

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
  }),
  defineTestConfig({
    test: {
      // ✅ Vitest 전용 설정
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/setupTests.ts'], // 존재하면 유지

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
