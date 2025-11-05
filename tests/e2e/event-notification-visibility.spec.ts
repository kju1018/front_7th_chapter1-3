import { test, expect } from '@playwright/test';

test('알림 시간을 설정하면 해당 시간에 알림이 표시된다', async ({ page }) => {
  // Given: 새 일정 생성
  await page.getByLabel('제목').fill('중요 회의');

  // 가까운 미래 시간 설정 (테스트를 위해)
  const now = new Date();
  const futureDate = new Date(now.getTime() + 15 * 60000); // 15분 후
  const dateStr = futureDate.toISOString().split('T')[0];
  const timeStr = futureDate.toTimeString().slice(0, 5);

  await page.getByLabel('날짜').fill(dateStr);
  await page.getByLabel('시작 시간').fill(timeStr);

  const endTime = new Date(futureDate.getTime() + 60 * 60000); // 1시간 후
  await page.getByLabel('종료 시간').fill(endTime.toTimeString().slice(0, 5));

  await page.getByLabel('설명').fill('중요 미팅');
  await page.getByLabel('위치').fill('본사');

  // 카테고리 선택
  await page.getByLabel('카테고리').click();
  await page.getByRole('option', { name: '업무' }).click();

  // 알림 시간 설정 (10분 전)
  const notificationInput = page.getByLabel('알림');
  await notificationInput.clear();
  await notificationInput.fill('10');

  // 저장
  await page.getByTestId('event-submit-button').click();

  // Then: 일정이 생성됨
  await expect(page.getByText('중요 회의')).toBeVisible();
});
