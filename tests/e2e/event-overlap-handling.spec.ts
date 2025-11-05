import { test, expect } from '@playwright/test';

test('일정 시간이 겹칠 때 경고가 표시된다', async ({ page }) => {
  // Given: 기존 일정이 있음
  await page.waitForLoadState('networkidle');

  // When: 겹치는 시간에 새 일정 추가
  await page.getByLabel('제목').fill('중복 회의');
  await page.getByLabel('날짜').fill('2025-10-15');
  await page.getByLabel('시작 시간').fill('09:30');
  await page.getByLabel('종료 시간').fill('10:30');
  await page.getByLabel('설명').fill('겹치는 시간');
  await page.getByLabel('위치').fill('회의실 C');

  // 카테고리 선택
  await page.getByLabel('카테고리').click();
  await page.getByRole('option', { name: '업무' }).click();

  // 저장 시도
  await page.getByTestId('event-submit-button').click();

  // Then: 겹침 경고 다이얼로그 표시
  await expect(page.getByText('일정 겹침 경고')).toBeVisible();
  await expect(page.getByText(/다음 일정과 겹칩니다/)).toBeVisible();
});
