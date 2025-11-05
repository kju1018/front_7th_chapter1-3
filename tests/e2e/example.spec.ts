import { test, expect } from '@playwright/test';

test('반복 일정의 위치를 수정한 후 저장한다', async ({ page }) => {
  await page.goto('/');

  // Given: 반복 일정 확인
  await expect(page.getByText('항해 열심히 공부하기').first()).toBeVisible();

  // When: 반복 표시 아이콘이 있는 이벤트의 Edit 버튼 ₩₩1₩₩1₩클릭
  // Repeat 아이콘이 있는 첫 번째 이벤트를 찾아서 수정
  await page.getByRole('button', { name: 'Edit event' }).first().click();

  // 반복 일정 다이얼로그가 나타나면 '예' 선택 (해당 일정만 수정)
  await page.getByRole('button', { name: '예' }).click();

  // 위치 수정
  await page.getByRole('textbox', { name: '위치' }).fill('집555');
  await page.getByTestId('event-submit-button').click();

  // Then: 수정된 위치가 보이는지 확인
  await expect(page.getByText('집555')).toBeVisible();
});
