import fs from 'fs';
import path from 'path';

import { test, expect } from '@playwright/test';

test.describe('검색 및 필터링 기능 테스트', () => {
  test.beforeEach(async ({ page }) => {
    const rootDir = process.cwd();
    const mockDir = path.join(rootDir, 'src', '__mocks__', 'response');
    const dbPath = path.join(mockDir, 'e2e.json');
    const seedPath = path.join(mockDir, 'e2e-template.json');
    fs.copyFileSync(seedPath, dbPath);
    await page.goto('/');
  });

  test('검색 기능을 통해 특정 일정을 찾을 수 있다', async ({ page }) => {
    // Given: 여러 일정이 존재함
    await expect(page.getByTestId('event-list')).toBeVisible();
  
    // When: 검색어 입력
    const searchInput = page.getByPlaceholder('검색어를 입력하세요');
    await searchInput.fill('팀 회의');
  
    // Then: 검색 결과가 표시됨
    const eventList = page.getByTestId('event-list');
    const events = eventList.locator('button[aria-label="Edit event"]');
    await expect(events).toHaveCount(6);
  });

  test('검색 결과가 없으면 \'검색 결과가 없습니다.\' 메시지가 표시된다', async ({ page }) => {
    // Given: 여러 일정이 존재함
    await expect(page.getByTestId('event-list')).toBeVisible();
  
    // When: 검색어 입력
    const searchInput = page.getByPlaceholder('검색어를 입력하세요');
    await searchInput.fill('검색어 없음');
  
    // Then: 검색 결과가 없으면 '검색 결과가 없습니다.' 메시지가 표시됨
    await expect(page.getByText('검색 결과가 없습니다.')).toBeVisible();
  });

  test('검색어를 지우면 모든 일정이 다시 표시된다', async ({ page }) => {
    // Given: 여러 일정이 존재함
    await expect(page.getByTestId('event-list')).toBeVisible();

    // When: 검색어 입력
    const searchInput = page.getByPlaceholder('검색어를 입력하세요');
    await searchInput.fill('팀 회의');

    // Then: 검색 결과가 표시됨
    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('팀 회의')).toBeVisible();

    // When: 검색어 지우기
    await searchInput.clear();

    // Then: 모든 일정이 다시 표시됨
    const eventCards = page.getByTestId('event-list').locator('> div:not(.MuiFormControl-root)');
    await expect(eventCards).toHaveCount(6);
  });
});