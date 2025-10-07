import { readFileSync, writeFileSync } from 'fs';

import { test } from '@playwright/test';

import {
  searchEvents,
  clearSearch,
  verifyEventInSearchResults,
  verifyEventNotInSearchResults,
  verifyNoSearchResults,
} from './helpers/event-helpers';

test.beforeAll(() => {
  const e2eData = readFileSync('src/__mocks__/response/defaultE2E.json', 'utf8');
  writeFileSync('src/__mocks__/response/e2e.json', e2eData);
});

test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(new Date('2025-09-01T10:00:00'));
  await page.goto('/');

  return page;
});

test.describe('일정 검색 기능', () => {
  test.beforeEach(async ({ page }) => {
    await clearSearch(page);
  });

  test.afterEach(async ({ page }) => {
    await clearSearch(page);
  });

  test('제목으로 일정을 검색할 수 있다', async ({ page }) => {
    await searchEvents(page, '회의');

    // 검색 결과 확인
    await verifyEventInSearchResults(page, '회의 - 프로젝트 기획');
    await verifyEventNotInSearchResults(page, '팀 회식');
    await verifyEventNotInSearchResults(page, '점심 약속');
    await verifyEventNotInSearchResults(page, '운동');
  });

  test('설명으로 일정을 검색할 수 있다', async ({ page }) => {
    await searchEvents(page, '발표');

    await verifyEventInSearchResults(page, '프레젠테이션 준비');
    await verifyEventNotInSearchResults(page, '회의 - 프로젝트 기획');
    await verifyEventNotInSearchResults(page, '점심 약속');
  });

  test('위치로 일정을 검색할 수 있다', async ({ page }) => {
    await searchEvents(page, '헬스장');

    await verifyEventInSearchResults(page, '운동');
    await verifyEventNotInSearchResults(page, '회의 - 프로젝트 기획');
    await verifyEventNotInSearchResults(page, '점심 약속');
  });

  test('검색 결과가 없을 때 적절한 메시지가 표시된다', async ({ page }) => {
    // 존재하지 않는 검색어로 검색
    await searchEvents(page, '존재하지않는검색어12345');

    await verifyNoSearchResults(page);
  });
});
