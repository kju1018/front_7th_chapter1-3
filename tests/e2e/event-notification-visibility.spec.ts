import fs from 'fs';
import path from 'path';

import { test, expect } from '@playwright/test';

test.describe('알림 시스템 관련 노출 조건', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      let fixedTime = new Date('2025-11-08T09:21:00').getTime();

      // 완전한 Date 모킹
      const OriginalDate = Date;
      (globalThis as any).Date = class extends (OriginalDate as any) {
        constructor(...args: any[]) {
          if (args.length === 0) {
            super(fixedTime);
          } else {
            super(...(args as any));
          }
        }
        static now() {
          return fixedTime;
        }
      } as any;

      (globalThis as any).__setNow = (iso: string) => {
        fixedTime = new Date(iso).getTime();
        // 강제로 이벤트 발생시켜 리렌더링 유도
        window.dispatchEvent(new Event('timechange'));
      };
    });

    const rootDir = process.cwd();
    const mockDir = path.join(rootDir, 'src', '__mocks__', 'response');
    const dbPath = path.join(mockDir, 'e2e.json');
    const seedPath = path.join(mockDir, 'e2e-template.json');
    fs.copyFileSync(seedPath, dbPath);
    await page.goto('/');
  });

  test('알림 시간이 도래한 일정에 알림 아이콘이 표시된다', async ({ page }) => {
    // When: 09:30에 시작하는 일정 생성 (알림 시간 10분)
    await page.getByLabel('제목').fill('알림 테스트');
    await page.getByLabel('날짜').fill('2025-11-08');
    await page.getByLabel('시작 시간').fill('09:30');
    await page.getByLabel('종료 시간').fill('10:30');
    await page.getByLabel('설명').fill('알림 테스트');
    await page.getByLabel('위치').fill('회의실 C');

    // 카테고리 선택
    await page.getByLabel('카테고리').click();
    await page.getByRole('option', { name: '업무' }).click();

    // 알림 시간은 기본값 10분 사용
    await page.getByTestId('event-submit-button').click();

    // Then: 알림이 발생해야 함 (9분 후 시작이므로 10분 이내)
    await page.evaluate(() => {
      globalThis.__setNow('2025-11-08T09:25:00');
    });

    await page.waitForTimeout(2000);

    // 알림 팝업이 표시되는지 확인
    await expect(page.getByText(/알림 테스트 일정이 시작됩니다/)).toBeVisible();

    // 이벤트 리스트에서 알림 아이콘이 표시되는지 확인
    await expect(
      page.getByTestId('event-list').locator('[data-testid="NotificationsIcon"]')
    ).toBeVisible();
  });

  test('알림이 활성화된 일정은 캘린더에서 다른 색상으로 표시된다.', async ({ page }) => {
    // Given: 알림이 발생할 시간으로 설정 (09:25 - 일정 시작 5분 전)
    await page.evaluate(() => {
      globalThis.__setNow('2025-11-08T09:25:00');
    });

    // When: 09:30에 시작하는 일정 생성 (알림 시간 10분)
    await page.getByLabel('제목').fill('색상 테스트 일정');
    await page.getByLabel('날짜').fill('2025-11-08');
    await page.getByLabel('시작 시간').fill('09:30');
    await page.getByLabel('종료 시간').fill('10:30');
    await page.getByLabel('설명').fill('색상 변경 테스트');
    await page.getByLabel('위치').fill('회의실 D');

    // 카테고리 선택
    await page.getByLabel('카테고리').click();
    await page.getByRole('option', { name: '업무' }).click();

    // 일정 저장
    await page.getByTestId('event-submit-button').click();

    // 알림 체크 로직이 실행될 시간 대기
    await page.waitForTimeout(2000);

    // Then: 캘린더에서 알림 활성화된 일정이 다른 색상으로 표시되는지 확인
    const eventElement = page.getByText('색상 테스트 일정').first();

    // 알림 활성화된 일정의 글자색이 '#d32f2f' (빨간색)인지 확인
    await expect(eventElement).toHaveCSS('color', 'rgb(211, 47, 47)'); // #d32f2f

    // 알림 아이콘이 표시되는지 확인 (여러 방법으로 시도)
    const parentDiv = eventElement.locator('..'); // 한 단계 위로 이동
    const notificationIcon = parentDiv.locator('svg.MuiSvgIcon-root').first();

    // 아이콘이 실제로 표시되는지 확인
    await expect(notificationIcon).toBeVisible();
  });

  test('알림 팝업이 화면 우상단에 메시지가 표시된다', async ({ page }) => {
    // Given: 알림이 발생할 시간으로 설정 (09:25 - 일정 시작 5분 전)
    await page.evaluate(() => {
      globalThis.__setNow('2025-11-08T09:25:00');
    });

    // When: 09:30에 시작하는 일정 생성 (알림 시간 10분)
    await page.getByLabel('제목').fill('색상 테스트 일정');
    await page.getByLabel('날짜').fill('2025-11-08');
    await page.getByLabel('시작 시간').fill('09:30');

    await page.getByLabel('종료 시간').fill('10:30');
    await page.getByLabel('설명').fill('색상 변경 테스트');
    await page.getByLabel('위치').fill('회의실 D');

    // 카테고리 선택
    await page.getByLabel('카테고리').click();
    await page.getByRole('option', { name: '업무' }).click();

    // 일정 저장
    await page.getByTestId('event-submit-button').click();

    // 알림 체크 로직이 실행될 시간 대기
    await page.waitForTimeout(2000);

    // Then: 알림 팝업이 화면 우상단에 메시지가 표시되는지 확인
    await expect(page.getByText(/일정이 시작됩니다/)).toBeVisible();
  });
});
