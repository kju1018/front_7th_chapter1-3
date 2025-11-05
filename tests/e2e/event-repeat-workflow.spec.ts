import fs from 'fs';
import path from 'path';

import { test, expect } from '@playwright/test';

test.describe('기본 일정 관리 워크플로우', () => {
  test.beforeEach(async ({ page }) => {
    const rootDir = process.cwd();
    const mockDir = path.join(rootDir, 'src', '__mocks__', 'response');
    const dbPath = path.join(mockDir, 'e2e.json');
    const seedPath = path.join(mockDir, 'e2e-template.json');
    fs.copyFileSync(seedPath, dbPath);
    await page.goto('/');
  });

  test('반복 일정을 생성하고 여러 날짜에 표시된다', async ({ page }) => {
    // Given: 일정 입력 폼이 표시됨
    await expect(page.getByText('일정 추가').first()).toBeVisible();

    // When: 반복 일정 정보 입력
    await page.getByLabel('제목').fill('매일 스크럼');
    await page.getByLabel('날짜').fill('2025-11-10');
    await page.getByLabel('시작 시간').fill('09:00');
    await page.getByLabel('종료 시간').fill('09:30');
    await page.getByLabel('설명').fill('데일리 스크럼 미팅');
    await page.getByLabel('위치').fill('온라인');

    // 카테고리 선택
    await page.getByLabel('카테고리').click();
    await page.getByRole('option', { name: '업무' }).click();

    // 반복 일정 설정
    await page.getByLabel('반복 일정').check();

    // 반복 유형 선택 (매일)
    await page.getByLabel('반복 유형').click();
    await page.getByRole('option', { name: 'daily-option' }).click();

    // 반복 간격 설정
    const intervalInput = page.getByLabel('반복 간격');
    await intervalInput.clear();
    await intervalInput.fill('1');

    // 반복 종료일 설정
    await page.getByLabel('반복 종료일').fill('2025-11-14');

    // 저장
    await page.getByTestId('event-submit-button').click();

    // Then: 이벤트 리스트에 여러 일정이 표시됨
    const scrumEvents = page.getByText('매일 스크럼');
    await expect(scrumEvents.first()).toBeVisible();

    // 반복 정보가 표시됨
    const items = page.locator('text=반복: 1일마다');
    await expect(items).toHaveCount(5);
  });

  test('반복 일정을 수정할 때 단일 일정만 수정할 수 있다', async ({ page }) => {
    // Given: 반복 일정이 존재함
    // 서버에서 반복 일정을 반환한다고 가정

    // When: 반복 일정의 편집 버튼 클릭
    const editButtons = page.getByLabel('Edit event');
    await editButtons.first().click();

    // 반복 일정 다이얼로그 표시 확인
    await expect(page.getByText('반복 일정 수정')).toBeVisible();

    // '해당 일정만' 선택
    await page.getByRole('button', { name: '예' }).click();

    // 위치 수정
    const locationInput = page.getByLabel('위치');
    await locationInput.clear();
    await locationInput.fill('수정된 위치');

    // 저장
    await page.getByTestId('event-submit-button').click();

    // Then: 수정된 위치가 표시됨
    await expect(page.getByText('수정된 위치')).toBeVisible();
  });
});
