import fs from 'fs';
import path from 'path';

import { test, expect } from '@playwright/test';

test.describe('빈 셀 클릭 시 날짜 바인딩 기능', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      let fixedTime = new Date('2025-11-10T09:21:00').getTime();

      // 완전한 Date 모킹 (함수 기반)
      const OriginalDate = window.Date;

      const MockedDate = function (this: Date, ...args: ConstructorParameters<typeof Date>) {
        if (args.length === 0) {
          return new OriginalDate(fixedTime);
        }
        return new OriginalDate(...args);
      } as unknown as typeof Date;

      // 정적 메서드 및 프로퍼티 복사
      Object.setPrototypeOf(MockedDate, OriginalDate);
      Object.defineProperty(MockedDate, 'prototype', {
        value: OriginalDate.prototype,
        writable: false,
        enumerable: false,
        configurable: false,
      });

      // Date.now(), Date.parse(), Date.UTC() 보존/오버라이드
      MockedDate.now = (): number => fixedTime;
      MockedDate.parse = OriginalDate.parse;
      MockedDate.UTC = OriginalDate.UTC;

      // globalThis에 Date 교체
      (globalThis as unknown as { Date: typeof Date }).Date = MockedDate;

      // 시간 변경 함수 (선택적: 동적 업데이트 지원)
      (globalThis as unknown as { __setNow: (iso: string) => void }).__setNow = (iso: string) => {
        fixedTime = new OriginalDate(iso).getTime();
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

  test('월간 뷰에서 빈 날짜 셀을 클릭하면 해당 날짜가 날짜 입력 필드에 자동으로 설정된다', async ({
    page,
  }) => {
    // Given: 월간 뷰가 기본으로 표시됨
    await expect(page.getByTestId('month-view')).toBeVisible();

    // When: 특정 날짜 셀(예: 25일)의 빈 공간을 클릭
    const monthView = page.getByTestId('month-view');
    const targetCell = monthView.locator('td').filter({ hasText: /^25/ }).first();

    // 셀의 빈 공간을 클릭 (이벤트가 아닌 셀 자체를 클릭)
    await targetCell.click();

    // Then: 날짜 입력 필드에 해당 날짜가 자동으로 설정됨
    const dateInput = page.getByLabel('날짜');
    await expect(dateInput).toHaveValue('2025-11-25');
  });

  test('주간 뷰에서 빈 날짜 셀을 클릭하면 해당 날짜가 날짜 입력 필드에 자동으로 설정되고 일정을 추가할 수 있다', async ({
    page,
  }) => {
    // Given: 주간 뷰로 전환
    await page.getByLabel('뷰 타입 선택').click();
    await page.getByRole('option', { name: 'Week' }).click();
    await expect(page.getByTestId('week-view')).toBeVisible();

    // When: 특정 날짜 셀의 빈 공간을 클릭
    const weekView = page.getByTestId('week-view');
    const targetCell = weekView.locator('td').filter({ hasText: /^13/ }).first();

    // 셀의 빈 공간을 클릭
    await targetCell.click();

    // Then: 날짜 입력 필드에 해당 날짜가 자동으로 설정됨
    const dateInput = page.getByLabel('날짜');
    await expect(dateInput).toHaveValue('2025-11-13');

    // And: 해당 날짜로 일정을 추가할 수 있음
    await page.getByLabel('제목').fill('빈 셀 클릭 테스트 일정');
    await page.getByLabel('시작 시간').fill('14:00');
    await page.getByLabel('종료 시간').fill('15:00');
    await page.getByLabel('설명').fill('빈 셀 클릭으로 생성된 일정');
    await page.getByLabel('위치').fill('회의실 E');

    // 카테고리 선택
    await page.getByLabel('카테고리').click();
    await page.getByRole('option', { name: '업무' }).click();

    // 일정 저장
    await page.getByTestId('event-submit-button').click();

    // 일정이 추가되었는지 확인 (이벤트 리스트에서 확인)
    await expect(page.getByTestId('event-list').getByText('빈 셀 클릭 테스트 일정')).toBeVisible();

    // 캘린더에서도 해당 날짜에 일정이 표시되는지 확인
    const eventInCalendar = weekView.getByText('빈 셀 클릭 테스트 일정');
    await expect(eventInCalendar).toBeVisible();
  });
});
