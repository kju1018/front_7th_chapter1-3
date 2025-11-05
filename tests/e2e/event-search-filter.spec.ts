import { test, expect } from '@playwright/test';

test('검색 기능을 통해 특정 일정을 찾을 수 있다', async ({ page }) => {
  // Given: 여러 일정이 존재함
  await expect(page.getByTestId('event-list')).toBeVisible();

  // When: 검색어 입력
  const searchInput = page.getByPlaceholder('검색어를 입력하세요');
  await searchInput.fill('회의');

  // Then: 검색 결과가 표시됨
  await expect(page.getByText('기존 회의')).toBeVisible();
});
