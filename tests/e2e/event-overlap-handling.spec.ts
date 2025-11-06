import fs from 'fs';
import path from 'path';

import { test, expect } from '@playwright/test';

test.describe('일정 겹침 처리 방식 테스트', () => {
  test.beforeEach(async ({ page }) => {
    const rootDir = process.cwd();
    const mockDir = path.join(rootDir, 'src', '__mocks__', 'response');
    const dbPath = path.join(mockDir, 'e2e.json');
    const seedPath = path.join(mockDir, 'e2e-template.json');
    fs.copyFileSync(seedPath, dbPath);
    await page.goto('/');
  });

  test('일정 생성시 시간이 겹칠 때 경고가 표시된다', async ({ page }) => {
    // Given: 기존 일정이 있음
    // When: 겹치는 시간에 새 일정 추가
    await page.getByLabel('제목').fill('겹치는 회의');
    await page.getByLabel('날짜').fill('2025-11-08');
    await page.getByLabel('시작 시간').fill('09:30');
    await page.getByLabel('종료 시간').fill('15:30');
    await page.getByLabel('설명').fill('겹치는 시간');
    await page.getByLabel('위치').fill('회의실 C');

    // 카테고리 선택
    await page.getByLabel('카테고리').click();
    await page.getByRole('option', { name: '업무' }).click();

    // 저장 시도
    await page.getByTestId('event-submit-button').click();

    // Then: 겹침 경고 다이얼로그 표시
  
    await expect(page.getByRole('heading', { name: '일정 겹침 경고' })).toBeVisible();
    await expect(page.getByText(/다음 일정과 겹칩니다/)).toBeVisible();
  });

  test('일정 수정시 시간이 겹칠 때 경고가 표시된다', async ({ page }) => {
    // Given: 기존 일정이 있음
    // When: 겹치는 시간에 일정 수정
    // Given: 일정이 이미 존재함 (서버 mock 데이터 사용)
    const editButtons = page.getByLabel('Edit event');
    await editButtons.first().waitFor({ state: 'visible' });

    // When: 일정 수정 버튼 클릭
    await editButtons.first().click();

    // 날짜 수정
    const titleInput = page.getByLabel('날짜');
    await titleInput.clear();
    await titleInput.fill('2025-11-08');

    // 시간 수정
    const startTimeInput = page.getByLabel('시작 시간');
    await startTimeInput.clear();
    await startTimeInput.fill('09:30');

    const endTimeInput = page.getByLabel('종료 시간');
    await endTimeInput.clear();
    await endTimeInput.fill('15:30');

    // 저장
    await page.getByTestId('event-submit-button').click();

    await expect(page.getByRole('heading', { name: '일정 겹침 경고' })).toBeVisible();
    await expect(page.getByText(/다음 일정과 겹칩니다/)).toBeVisible();
  });

  test('일정 추가시 시간이 겹칠 때 경고가 표시되고 \'계속진행\' 버튼을 클릭하면 일정이 추가된다', async ({ page }) => {
    // Given: 기존 일정이 있음
    // When: 겹치는 시간에 새 일정 추가
    await page.getByLabel('제목').fill('겹치는 회의');
    await page.getByLabel('날짜').fill('2025-11-08');
    await page.getByLabel('시작 시간').fill('09:30');
    await page.getByLabel('종료 시간').fill('15:30');
    await page.getByLabel('설명').fill('겹치는 시간');
    await page.getByLabel('위치').fill('회의실 C');

    // 저장 시도
    await page.getByTestId('event-submit-button').click();

    await expect(page.getByRole('heading', { name: '일정 겹침 경고' })).toBeVisible();
    await page.getByRole('button', { name: '계속 진행' }).click();

    const cellWith8 = page.getByRole('cell', { name: '반복일정 겹치는 회의' })
    const events = cellWith8.locator('.MuiBox-root'); // 이벤트 박스들
    
    await expect(events).toHaveCount(2);    
  });
});