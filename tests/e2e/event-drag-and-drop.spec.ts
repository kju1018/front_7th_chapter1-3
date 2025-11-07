import fs from 'fs';
import path from 'path';

import { test, expect } from '@playwright/test';

test.describe('D&D 기능 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      let fixedTime = new Date('2025-11-21T09:21:00').getTime();

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

  test('유저는 월간뷰에서 캘린더의 셀을 드래그해서 일정을 수정하고 완료 스낵바가 뜬다', async ({
    page,
  }) => {
    // Given: 애플리케이션이 로드됨
    await expect(page.getByRole('heading', { name: '일정 추가' })).toBeVisible();

    // When: 유저는 이벤트를 드래그해서 다른 날짜로 이동시킨다
    await page
      .getByRole('button', { name: '팀 회의' })
      .dragTo(page.getByRole('cell', { name: '18' }));

    // Then: 이벤트가 다른 날짜로 이동된다
    await expect(page.getByRole('cell', { name: '18' }).locator('div').nth(1)).toHaveText(
      '팀 회의'
    );

    // Then: 완료 스낵바가 뜬다
    await expect(page.getByText('일정이 수정되었습니다')).toBeVisible();
  });

  test("월간뷰에서 일정이 겹치면 다이얼로그 출력 '예' 버튼을 클릭하면 일정이 수정된다", async ({
    page,
  }) => {
    // Given: 애플리케이션이 로드됨
    await expect(page.getByRole('heading', { name: '일정 추가' })).toBeVisible();

    // When: 유저는 이벤트를 드래그해서 다른 날짜로 이동시킨다
    const targetCell = await page.getByRole('cell', { name: '8 반복일정' });
    await page.getByRole('row', { name: '1 반복일정' }).getByRole('button').dragTo(targetCell);
    // Then: 완료 스낵바가 뜬다
    await expect(page.getByText('일정 겹침 경고')).toBeVisible();

    // When: 유저는 '예' 버튼을 클릭한다
    await page.getByRole('button', { name: '계속 진행' }).click();

    const cellWith8 = page.getByRole('cell', { name: '반복일정 반복일정' });
    const events = cellWith8.locator('.MuiBox-root'); // 이벤트 박스들

    await expect(events).toHaveCount(2);
  });

  test('유저는 주간뷰에서 일정을 드래그해서 다른 날짜로 이동시키면 일정이 수정되고 완료 스낵바가 뜬다', async ({
    page,
  }) => {
    // Given: 애플리케이션이 로드됨
    await expect(page.getByRole('heading', { name: '일정 추가' })).toBeVisible();

    // When: 유저는 주간 뷰로 변경하고 일정을 드래그해서 다른 날짜로 이동시킨다
    await page.getByText('Month').click();
    await page.getByRole('option', { name: 'week-option' }).click();
    await page
      .getByRole('button', { name: '팀 회의' })
      .dragTo(page.getByRole('cell', { name: '18' }));

    // Then: 이벤트가 다른 날짜로 이동된다
    await expect(page.getByRole('cell', { name: '18' }).locator('div').nth(1)).toHaveText(
      '팀 회의'
    );

    // Then: 완료 스낵바가 뜬다
    await expect(page.getByText('일정이 수정되었습니다')).toBeVisible();
  });

  test("주간뷰에서 일정이 겹치면 다이얼로그 출력 '예' 버튼을 클릭하면 일정이 수정된다", async ({
    page,
  }) => {
    // Given: 애플리케이션이 로드됨
    await expect(page.getByRole('heading', { name: '일정 추가' })).toBeVisible();

    // When: 유저는 이벤트를 드래그해서 다른 날짜로 이동시킨다
    await page.getByText('Month').click();
    await page.getByRole('option', { name: 'week-option' }).click();

    const targetCell = await page.getByRole('cell', { name: '22 반복일정' });
    await page.getByRole('button', { name: '겹치는 회의' }).dragTo(targetCell);
    // Then: 겹침 경고 다이얼로그가 뜬다
    await expect(page.getByText('일정 겹침 경고')).toBeVisible();

    // When: 유저는 '예' 버튼을 클릭한다
    await page.getByRole('button', { name: '계속 진행' }).click();

    const cellWith8 = page.getByRole('cell', { name: '겹치는 회의 반복일정' });
    const events = cellWith8.locator('.MuiBox-root'); // 이벤트 박스들

    await expect(events).toHaveCount(2);
  });

  test('반복 일정을 다른 셀로 드래그시 단독 일정으로 수정', async ({ page }) => {
    // Given: 애플리케이션이 로드됨
    await expect(page.getByRole('heading', { name: '일정 추가' })).toBeVisible();

    // When: 유저는 반복 일정을 다른 셀로 드래그해서 다른 날짜로 이동시킨다
    await page
      .getByRole('cell', { name: '22 반복일정' })
      .dragTo(page.getByRole('cell', { name: '18' }));

    // Then: 옮긴 반복일정의 반복 아이콘이 사라진다
    const cellWith18 = page.getByRole('cell', { name: '18 반복일정' });
    const eventBox = cellWith18.locator('.MuiBox-root').first(); // 첫 번째 이벤트 박스

    // 반복 아이콘(Repeat SVG)이 존재하지 않는지 확인

    await expect(eventBox.locator('svg')).toHaveCount(0);
  });
});
