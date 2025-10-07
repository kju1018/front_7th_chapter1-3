import { readFileSync, writeFileSync } from 'fs';

import { test, expect } from '@playwright/test';

import {
  createEvent,
  deleteEventByTitle,
  updateEventByTitle,
  findItemByTitleInEventList,
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

test.describe('일반 일정', () => {
  test('일정을 추가한 경우 "일정이 추가되었습니다" 토스트가 노출되며, 일정 목록에 "테스트 일정-2"및 관련 일정이 모두 올바르게 표현된다', async ({
    page,
  }) => {
    await createEvent(page, {
      title: '테스트 일정-1',
      startTime: '12:00',
      endTime: '13:00',
      description: '테스트 설명-1',
      location: '테스트 위치-1',
      category: '개인',
    });
    await expect(page.getByText('일정이 추가되었습니다')).toBeVisible();

    const eventItem = await findItemByTitleInEventList(page, '테스트 일정-1');

    await expect(eventItem.getByText('테스트 일정-1')).toBeVisible();
    await expect(eventItem.getByText('12:00 - 13:00')).toBeVisible();
    await expect(eventItem.getByText('테스트 설명-1')).toBeVisible();
    await expect(eventItem.getByText('테스트 위치-1')).toBeVisible();
    await expect(eventItem.getByText('카테고리: 개인')).toBeVisible();

    await deleteEventByTitle(page, '테스트 일정-1');
  });

  test('일정을 수정하는 경우 변경된 제목 "수정된 테스트 일정-2"이 일정 목록에 올바르게 표현된다', async ({
    page,
  }) => {
    await createEvent(page, {
      title: '테스트 일정-2',
      startTime: '14:00',
      endTime: '16:00',
      description: '테스트 설명-2',
      location: '테스트 위치-2',
      category: '개인',
    });
    await updateEventByTitle(page, '테스트 일정-2', { title: '수정된 테스트 일정-2' });

    const updatedEventItem = await findItemByTitleInEventList(page, '수정된 테스트 일정-2');
    await expect(updatedEventItem.getByText('수정된 테스트 일정-2')).toBeVisible();

    await deleteEventByTitle(page, '테스트 일정-2');
  });

  test('삭제 버튼을 누른 경우 일정이 삭제되며, "일정이 삭제되었습니다"라는 토스트가 노출된다', async ({
    page,
  }) => {
    await expect(await findItemByTitleInEventList(page, '삭제용 데이터 1')).toBeVisible();

    await deleteEventByTitle(page, '삭제용 데이터 1');

    await expect(await findItemByTitleInEventList(page, '삭제용 데이터 1')).not.toBeVisible();
    await expect(page.getByText('일정이 삭제되었습니다')).toBeVisible();
  });
});
