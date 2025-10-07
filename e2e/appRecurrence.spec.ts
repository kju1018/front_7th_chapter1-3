import { readFileSync, writeFileSync } from 'fs';

import { test, expect } from '@playwright/test';

import {
  createEvent,
  countRecurringEventInstances,
  deleteRecurringEventInstance,
  updateRecurringEventInstance,
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

test.describe('반복 일정', () => {
  test('반복 일정을 추가한 경우 "일정이 추가되었습니다" 토스트가 노출되며, 설정한 횟수만큼 반복 일정이 생성된다', async ({
    page,
  }) => {
    await createEvent(page, {
      title: '반복 테스트 일정',
      date: '2025-09-01',
      startTime: '10:00',
      endTime: '11:00',
      description: '반복 일정 설명',
      location: '반복 장소',
      category: '개인',
      isRecurring: true,
      recurringType: 'daily',
      recurringEndDate: '2025-09-07', // 7일간 일일 반복 = 7개 일정
    });

    await expect(page.getByText('일정이 추가되었습니다')).toBeVisible();

    // 7개의 반복 일정이 생성되었는지 확인
    const instanceCount = await countRecurringEventInstances(page, '반복 테스트 일정');
    expect(instanceCount).toBe(7);
  });

  test('주간 반복 일정을 추가한 경우 설정한 주 수만큼 반복 일정이 생성된다', async ({ page }) => {
    await createEvent(page, {
      title: '주간 반복 일정',
      date: '2025-09-01',
      startTime: '14:00',
      endTime: '15:00',
      description: '주간 반복 설명',
      location: '주간 장소',
      category: '업무',
      isRecurring: true,
      recurringType: 'weekly',
      recurringEndDate: '2025-09-29',
    });

    await expect(page.getByText('일정이 추가되었습니다')).toBeVisible();

    const instanceCount = await countRecurringEventInstances(page, '주간 반복 일정');
    expect(instanceCount).toBe(5);
  });

  test('반복 일정의 단일 인스턴스를 수정하는 경우 해당 일정만 변경되고 다른 반복 일정은 영향받지 않는다', async ({
    page,
  }) => {
    await createEvent(page, {
      title: '수정 테스트 반복 일정',
      date: '2025-09-01',
      startTime: '18:00',
      endTime: '19:00',
      description: '원본 설명',
      location: '원본 장소',
      category: '개인',
      isRecurring: true,
      recurringType: 'daily',
      recurringEndDate: '2025-09-05', // 5일간 = 5개 일정
    });

    // 단일 인스턴스만 수정
    await updateRecurringEventInstance(
      page,
      '수정 테스트 반복 일정',
      {
        title: '수정된 단일 일정',
        description: '수정된 설명',
      },
      'this'
    );

    const modifiedEventItem = await findItemByTitleInEventList(page, '수정된 단일 일정');
    await expect(modifiedEventItem.getByText('수정된 단일 일정')).toBeVisible();
    await expect(modifiedEventItem.getByText('수정된 설명')).toBeVisible();

    const remainingCount = await countRecurringEventInstances(page, '수정 테스트 반복 일정');
    expect(remainingCount).toBe(4);
  });

  test('반복 일정의 전체 시리즈를 수정하는 경우 모든 반복 일정이 변경된다', async ({ page }) => {
    // 반복 일정 생성
    await createEvent(page, {
      title: '전체 수정 테스트 일정',
      date: '2025-09-01',
      startTime: '11:00',
      endTime: '12:00',
      description: '원본 전체 설명',
      location: '원본 전체 장소',
      category: '업무',
      isRecurring: true,
      recurringType: 'daily',
      recurringEndDate: '2025-09-03', // 3일간 = 3개 일정
    });

    await updateRecurringEventInstance(
      page,
      '전체 수정 테스트 일정',
      {
        title: '전체 수정된 일정',
        description: '전체 수정된 설명',
      },
      'all'
    );

    // 모든 일정이 새로운 제목으로 변경되었는지 확인
    const modifiedCount = await countRecurringEventInstances(page, '전체 수정된 일정');
    expect(modifiedCount).toBe(3);

    // 원본 제목으로는 일정이 없어야 함
    const originalCount = await countRecurringEventInstances(page, '전체 수정 테스트 일정');
    expect(originalCount).toBe(0);
  });

  test('반복 일정의 단일 인스턴스를 삭제하는 경우 해당 일정만 삭제되고 다른 반복 일정은 유지된다', async ({
    page,
  }) => {
    // 반복 일정 생성
    await createEvent(page, {
      title: '단일 삭제 테스트 일정',
      date: '2025-09-01',
      startTime: '13:00',
      endTime: '14:00',
      description: '삭제 테스트 설명',
      location: '삭제 테스트 장소',
      category: '개인',
      isRecurring: true,
      recurringType: 'daily',
      recurringEndDate: '2025-09-04', // 4일간 = 4개 일정
    });

    // 초기 개수 확인
    const initialCount = await countRecurringEventInstances(page, '단일 삭제 테스트 일정');
    expect(initialCount).toBe(4);

    // 단일 인스턴스 삭제
    await deleteRecurringEventInstance(page, '단일 삭제 테스트 일정', 'this');

    await expect(page.getByText('일정이 삭제되었습니다')).toBeVisible();

    // 나머지 3개 일정이 여전히 존재하는지 확인
    const remainingCount = await countRecurringEventInstances(page, '단일 삭제 테스트 일정');
    expect(remainingCount).toBe(3);
  });

  test('반복 일정의 전체 시리즈를 삭제하는 경우 모든 반복 일정이 삭제된다', async ({ page }) => {
    // 반복 일정 생성
    await createEvent(page, {
      title: '전체 삭제 테스트 일정',
      date: '2025-09-01',
      startTime: '15:00',
      endTime: '16:00',
      description: '전체 삭제 설명',
      location: '전체 삭제 장소',
      category: '업무',
      isRecurring: true,
      recurringType: 'daily',
      recurringEndDate: '2025-09-03', // 3일간 = 3개 일정
    });

    // 초기 개수 확인
    const initialCount = await countRecurringEventInstances(page, '전체 삭제 테스트 일정');
    expect(initialCount).toBe(3);

    // 전체 시리즈 삭제
    await deleteRecurringEventInstance(page, '전체 삭제 테스트 일정', 'all');

    await expect(page.getByText('일정이 삭제되었습니다')).toBeVisible();

    // 모든 일정이 삭제되었는지 확인
    const remainingCount = await countRecurringEventInstances(page, '전체 삭제 테스트 일정');
    expect(remainingCount).toBe(0);
  });
});
