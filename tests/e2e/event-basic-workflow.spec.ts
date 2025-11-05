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

  test('새로운 일정을 생성하고 캘린더에 표시된다', async ({ page }) => {
    // Given: 애플리케이션이 로드됨
    await expect(page.getByRole('heading', { name: '일정 추가' })).toBeVisible();

    // When: 새로운 일정 정보 입력
    await page.getByLabel('제목').fill('팀 회의');
    await page.getByLabel('날짜').fill('2025-11-10');
    await page.getByLabel('시작 시간').fill('10:00');
    await page.getByLabel('종료 시간').fill('11:00');
    await page.getByLabel('설명').fill('주간 팀 미팅');
    await page.getByLabel('위치').fill('회의실 A');

    // 카테고리 선택
    await page.getByLabel('카테고리').click();
    await page.getByRole('option', { name: '업무' }).click();

    // 일정 저장
    await page.getByTestId('event-submit-button').click();

    // Then: 이벤트 리스트에 일정이 표시됨
    await expect(page.getByText('팀 회의').first()).toBeVisible();
    await expect(page.getByText('2025-11-10').first()).toBeVisible();
    await expect(page.getByText('10:00 - 11:00').first()).toBeVisible();
  });

  test('기존 일정을 수정하고 변경사항이 반영된다', async ({ page }) => {
    // Given: 일정이 이미 존재함 (서버 mock 데이터 사용)
    const editButtons = page.getByLabel('Edit event');
    await editButtons.first().waitFor({ state: 'visible' });

    // When: 일정 수정 버튼 클릭
    await editButtons.first().click();

    // 제목 수정
    const titleInput = page.getByLabel('제목');
    await titleInput.clear();
    await titleInput.fill('수정된 팀 회의');

    // 위치 수정
    const locationInput = page.getByLabel('위치');
    await locationInput.clear();
    await locationInput.fill('회의실 B');

    // 저장
    await page.getByTestId('event-submit-button').click();

    // Then: 수정된 내용이 표시됨
    await expect(page.getByText('수정된 팀 회의').first()).toBeVisible();
    await expect(page.getByText('회의실 B').first()).toBeVisible();
  });

  test('일정을 삭제하면 목록에서 사라진다', async ({ page }) => {
    // Given: 일정이 존재함
    const eventTitle = page.getByText('팀 회의').first();
    await eventTitle.waitFor({ state: 'visible' });

    // When: 삭제 버튼 클릭
    const deleteButtons = page.getByLabel('Delete event');
    await deleteButtons.first().click();

    // Then: 일정이 목록에서 사라짐
    await expect(eventTitle).not.toBeVisible();
  });
});
