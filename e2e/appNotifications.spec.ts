import { readFileSync, writeFileSync } from 'fs';

import { test, expect } from '@playwright/test';

import {
  createEvent,
  createOverlappingEvent,
  createEventWithValidationError,
  deleteEventByTitle,
  updateEventByTitle,
  findItemByTitleInEventList,
  waitForSuccessToast,
  waitForDeleteToast,
  waitForUpdateToast,
  waitForConflictWarning,
  verifyFormError,
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

test.describe('일정 겹침 알림', () => {
  test('동일한 시간에 일정을 추가할 경우 겹침 경고 다이얼로그가 나타난다', async ({ page }) => {
    await createEvent(page, {
      title: '첫 번째 일정',
      date: '2025-09-01',
      startTime: '14:00',
      endTime: '15:00',
      description: '첫 번째 설명',
      category: '업무',
    });
    await waitForSuccessToast(page);

    await createOverlappingEvent(
      page,
      {
        title: '겹치는 일정',
        date: '2025-09-01',
        startTime: '14:30', // 겹치는 시간
        endTime: '15:30',
        description: '겹치는 설명',
        category: '개인',
      },
      'proceed'
    );

    await waitForSuccessToast(page);

    await waitForConflictWarning(page);

    // 두 일정 모두 존재하는지 확인
    const firstEvent = await findItemByTitleInEventList(page, '첫 번째 일정');
    const overlappingEvent = await findItemByTitleInEventList(page, '겹치는 일정');

    await expect(firstEvent).toBeVisible();
    await expect(overlappingEvent).toBeVisible();
  });

  test('겹침 경고에서 취소를 선택하면 일정이 추가되지 않는다', async ({ page }) => {
    await createEvent(page, {
      title: '기존 일정',
      date: '2025-09-04',
      startTime: '10:00',
      endTime: '11:00',
      description: '기존 설명',
      category: '업무',
    });
    await waitForSuccessToast(page);

    await createOverlappingEvent(
      page,
      {
        title: '취소될 일정',
        date: '2025-09-04',
        startTime: '10:30',
        endTime: '11:30',
        description: '취소될 설명',
        category: '개인',
      },
      'cancel'
    );

    // 취소된 일정은 존재하지 않아야 함
    const existingEvent = await findItemByTitleInEventList(page, '기존 일정');
    await expect(existingEvent).toBeVisible();

    // 취소된 일정은 목록에 없어야 함
    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('취소될 일정')).not.toBeVisible();

    // 정리
    await deleteEventByTitle(page, '기존 일정');
  });
});

test.describe('Toast 메시지', () => {
  test('일정 추가 시 성공 토스트가 나타난다', async ({ page }) => {
    await createEvent(page, {
      title: '토스트 테스트 일정',
      startTime: '16:00',
      endTime: '17:00',
      description: '토스트 테스트',
      category: '개인',
    });

    await waitForSuccessToast(page);

    // 정리
    await deleteEventByTitle(page, '토스트 테스트 일정');
  });

  test('일정 삭제 시 삭제 토스트가 나타난다', async ({ page }) => {
    // 일정 추가
    await createEvent(page, {
      title: '삭제용 일정',
      startTime: '18:00',
      endTime: '19:00',
      description: '삭제용 설명',
      category: '업무',
    });
    await waitForSuccessToast(page);

    // 일정 삭제
    await deleteEventByTitle(page, '삭제용 일정');
    await waitForDeleteToast(page);
  });

  test('일정 수정 시 수정 토스트가 나타난다', async ({ page }) => {
    // 일정 추가
    await createEvent(page, {
      title: '수정용 일정',
      startTime: '20:00',
      endTime: '21:00',
      description: '수정용 설명',
      category: '업무',
    });
    await waitForSuccessToast(page);

    // 일정 수정
    await updateEventByTitle(page, '수정용 일정', {
      title: '수정된 일정',
      description: '수정된 설명',
    });

    await waitForUpdateToast(page);

    // 정리
    await deleteEventByTitle(page, '수정된 일정');
  });

  test('토스트 메시지가 자동으로 사라진다', async ({ page }) => {
    await createEvent(page, {
      title: '자동 사라짐 테스트',
      startTime: '22:00',
      endTime: '23:00',
      description: '자동 사라짐',
      category: '개인',
    });

    // 토스트 나타남 확인
    const toast = page.getByText('일정이 추가되었습니다');
    await expect(toast).toBeVisible();

    // 일정 시간 후 토스트가 사라지는지 확인
    await page.waitForTimeout(5000); // 5초 대기
    await expect(toast).not.toBeVisible();

    // 정리
    await deleteEventByTitle(page, '자동 사라짐 테스트');
  });
});

test.describe('폼 검증 및 에러 메시지', () => {
  test('제목이 비어있을 때 에러 메시지가 나타난다', async ({ page }) => {
    await createEventWithValidationError(page, {
      title: '', // 빈 제목
      date: '2025-09-01',
      startTime: '12:00',
      endTime: '13:00',
      category: '업무',
    });

    await verifyFormError(page, '필수 정보를 모두 입력해주세요.');
  });

  test('시작 시간이 종료 시간보다 늦을 때 에러 메시지가 나타난다', async ({ page }) => {
    await createEventWithValidationError(page, {
      title: '시간 검증 테스트',
      date: '2025-09-01',
      startTime: '15:00',
      endTime: '14:00', // 종료 시간이 시작 시간보다 빠름
      category: '업무',
    });

    await verifyFormError(page, '종료 시간은 시작 시간보다 늦어야 합니다');
  });
});
