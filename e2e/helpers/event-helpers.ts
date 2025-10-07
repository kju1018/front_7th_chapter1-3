import { Locator, Page, expect } from '@playwright/test';

export interface EventFormData {
  title?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  description?: string;
  location?: string;
  category?: string;
  isRecurring?: boolean;
  recurringType?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  recurringEndDate?: string;
}

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getToday(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const paddedMonth = month.toString().padStart(2, '0');
  const paddedDay = day.toString().padStart(2, '0');

  return `${year}-${paddedMonth}-${paddedDay}`;
}

/**
 * Find an event item in the event list by title
 */
export async function findItemByTitleInEventList(page: Page, title: string): Promise<Locator> {
  const eventList = page.getByTestId('event-list');
  const eventItem = eventList.getByText(title).locator('xpath=../../../..');
  return eventItem;
}

/**
 * Create a new event with the given form data
 */
export async function createEvent(page: Page, form: Partial<EventFormData> = {}): Promise<void> {
  const {
    title = '',
    date = '2025-09-05',
    startTime = '00:00',
    endTime = '00:01',
    description = '',
    location = '',
    category = '업무',
    isRecurring = false,
    recurringType = 'daily',
    recurringEndDate = '',
  } = form;

  // Fill form fields
  await page.getByLabel('제목').fill(title);
  await page.getByLabel('날짜').fill(date);
  await page.getByLabel('시작 시간').fill(startTime);
  await page.getByLabel('종료 시간').fill(endTime);
  await page.getByLabel('설명').fill(description);
  await page.getByLabel('위치').fill(location);

  // Select category
  await page.getByLabel('카테고리').click();
  await page.getByRole('option', { name: `${category}-option` }).click();

  // Handle recurring options
  if (isRecurring) {
    await page.getByLabel('반복 일정').check();

    // Select recurring type
    await page.getByLabel('반복 유형').click();
    await page.getByRole('option', { name: `${recurringType}-option` }).click();

    // Set recurring end date if provided
    if (recurringEndDate) {
      await page.getByLabel('반복 종료일').fill(recurringEndDate);
    }
  }

  // Submit form
  await page.getByRole('button', { name: '일정 추가' }).click();
  await page.waitForTimeout(500);
}

/**
 * Delete an event by its title
 */
export async function deleteEventByTitle(page: Page, title: string): Promise<void> {
  const eventItem = await findItemByTitleInEventList(page, title);
  await eventItem.getByLabel('Delete event').click();
}

/**
 * Update an existing event by title
 */
export async function updateEventByTitle(
  page: Page,
  targetTitle: string,
  form: Partial<EventFormData>
): Promise<void> {
  const eventItem = await findItemByTitleInEventList(page, targetTitle);
  await eventItem.getByLabel('Edit event').click();

  const { title, date, startTime, endTime, description, location, category } = form;

  if (title) {
    await page.getByLabel('제목').clear();
    await page.getByLabel('제목').fill(title);
  }
  if (date) {
    await page.getByLabel('날짜').clear();
    await page.getByLabel('날짜').fill(date);
  }
  if (startTime) {
    await page.getByLabel('시작 시간').clear();
    await page.getByLabel('시작 시간').fill(startTime);
  }
  if (endTime) {
    await page.getByLabel('종료 시간').clear();
    await page.getByLabel('종료 시간').fill(endTime);
  }
  if (description) {
    await page.getByLabel('설명').clear();
    await page.getByLabel('설명').fill(description);
  }
  if (location) {
    await page.getByLabel('위치').clear();
    await page.getByLabel('위치').fill(location);
  }
  if (category) {
    await page.getByLabel('카테고리').click();
    await page.getByRole('option', { name: `${category}-option` }).click();
  }

  await page.getByRole('button', { name: '일정 수정' }).click();
}

/**
 * Find multiple recurring event instances by base title
 */
export async function findRecurringEventInstances(
  page: Page,
  baseTitle: string
): Promise<Locator[]> {
  const eventList = page.getByTestId('event-list');
  const eventItems = await eventList.getByText(new RegExp(baseTitle)).all();
  return eventItems.map((item) => item.locator('xpath=../../../..'));
}

/**
 * Count recurring event instances by base title
 */
export async function countRecurringEventInstances(page: Page, baseTitle: string): Promise<number> {
  const instances = await findRecurringEventInstances(page, baseTitle);
  return instances.length;
}

/**
 * Delete all recurring event instances by base title
 */
export async function deleteAllRecurringEventInstances(
  page: Page,
  baseTitle: string
): Promise<void> {
  const instances = await findRecurringEventInstances(page, baseTitle);

  await instances[0].getByLabel('Delete event').click();
  await page.getByText('아니오').click();
  await page.waitForTimeout(500);
}

/**
 * Delete a single recurring event instance with option to delete only this event or all events
 */
export async function deleteRecurringEventInstance(
  page: Page,
  title: string,
  deleteOption: 'this' | 'all' = 'this'
): Promise<void> {
  const eventItem = await findItemByTitleInEventList(page, title);
  await eventItem.first().getByLabel('Delete event').click();

  // Wait for the delete confirmation dialog
  const deleteDialog = page.getByRole('dialog').filter({ hasText: '반복 일정 삭제' });
  await expect(deleteDialog).toBeVisible();

  if (deleteOption === 'this') {
    await page.getByText('예').click();
  } else {
    await page.getByText('아니오').click();
  }
  await page.waitForTimeout(500);
}

/**
 * Update a single recurring event instance with option to update only this event or all events
 */
export async function updateRecurringEventInstance(
  page: Page,
  targetTitle: string,
  form: Partial<EventFormData>,
  updateOption: 'this' | 'all' = 'this'
): Promise<void> {
  const eventItem = await findItemByTitleInEventList(page, targetTitle);
  await eventItem.first().getByLabel('Edit event').click();

  // Wait for the edit confirmation dialog
  const editDialog = page.getByRole('dialog').filter({ hasText: '반복 일정 수정' });
  await expect(editDialog).toBeVisible();

  if (updateOption === 'this') {
    await page.getByText('예').click();
  } else {
    await page.getByText('아니오').click();
  }

  // Fill the form with updated data
  const { title, date, startTime, endTime, description, location, category } = form;

  if (title) {
    await page.getByLabel('제목').clear();
    await page.getByLabel('제목').fill(title);
  }
  if (date) {
    await page.getByLabel('날짜').clear();
    await page.getByLabel('날짜').fill(date);
  }
  if (startTime) {
    await page.getByLabel('시작 시간').clear();
    await page.getByLabel('시작 시간').fill(startTime);
  }
  if (endTime) {
    await page.getByLabel('종료 시간').clear();
    await page.getByLabel('종료 시간').fill(endTime);
  }
  if (description) {
    await page.getByLabel('설명').clear();
    await page.getByLabel('설명').fill(description);
  }
  if (location) {
    await page.getByLabel('위치').clear();
    await page.getByLabel('위치').fill(location);
  }
  if (category) {
    await page.getByLabel('카테고리').click();
    await page.getByRole('option', { name: `${category}-option` }).click();
  }

  await page.getByRole('button', { name: '일정 수정' }).click();
  await page.waitForTimeout(500);
}

/**
 * Wait for and verify toast message appears
 */
export async function waitForToast(page: Page, message: string): Promise<void> {
  const toast = page.getByText(message);
  await expect(toast).toBeVisible();
}

/**
 * Wait for and verify success toast message
 */
export async function waitForSuccessToast(page: Page): Promise<void> {
  await waitForToast(page, '일정이 추가되었습니다');
}

/**
 * Wait for and verify delete toast message
 */
export async function waitForDeleteToast(page: Page): Promise<void> {
  await waitForToast(page, '일정이 삭제되었습니다');
}

/**
 * Wait for and verify update toast message
 */
export async function waitForUpdateToast(page: Page): Promise<void> {
  await waitForToast(page, '일정이 수정되었습니다');
}

/**
 * Wait for and verify conflict warning message
 */
export async function waitForConflictWarning(page: Page): Promise<void> {
  const conflictDialog = page.getByRole('dialog').filter({ hasText: '일정 겹침 경고' });
  await expect(conflictDialog).toBeVisible();
}

/**
 * Create an overlapping event and handle conflict dialog
 */
export async function createOverlappingEvent(
  page: Page,
  form: Partial<EventFormData> = {},
  handleConflict: 'proceed' | 'cancel' = 'proceed'
): Promise<void> {
  await createEvent(page, form);

  await waitForConflictWarning(page);

  if (handleConflict === 'proceed') {
    await page.getByRole('button', { name: '계속 진행' }).click();
  } else {
    await page.getByRole('button', { name: '취소' }).click();
  }
}

/**
 * Verify error message appears in form
 */
export async function verifyFormError(page: Page, errorMessage: string): Promise<void> {
  const errorElement = page.getByText(errorMessage);
  await expect(errorElement).toBeVisible();
}

/**
 * Create event with validation errors
 */
export async function createEventWithValidationError(
  page: Page,
  form: Partial<EventFormData> = {}
): Promise<void> {
  const {
    title = '',
    date = '',
    startTime = '',
    endTime = '',
    description = '',
    location = '',
    category = '업무',
  } = form;

  // Fill form fields (some may be invalid)
  if (title !== undefined) await page.getByLabel('제목').fill(title);
  if (date !== undefined) await page.getByLabel('날짜').fill(date);
  if (startTime !== undefined) await page.getByLabel('시작 시간').fill(startTime);
  if (endTime !== undefined) await page.getByLabel('종료 시간').fill(endTime);
  if (description !== undefined) await page.getByLabel('설명').fill(description);
  if (location !== undefined) await page.getByLabel('위치').fill(location);

  // Select category if provided
  if (category) {
    await page.getByLabel('카테고리').click();
    await page.getByRole('option', { name: `${category}-option` }).click();
  }

  // Attempt to submit form
  await page.getByRole('button', { name: '일정 추가' }).click();
}

/**
 * Search for events using the search input
 */
export async function searchEvents(page: Page, searchTerm: string): Promise<void> {
  const searchInput = page.getByPlaceholder('검색어를 입력하세요');

  await searchInput.clear();
  await searchInput.fill(searchTerm);
  // Wait for search results to update
  await page.waitForTimeout(300);
}

/**
 * Clear search input
 */
export async function clearSearch(page: Page): Promise<void> {
  const searchInput = page.getByPlaceholder('검색어를 입력하세요');
  await searchInput.clear();
  await page.waitForTimeout(300);
}

/**
 * Get visible event count in the event list
 */
export async function getVisibleEventCount(page: Page): Promise<number> {
  const eventList = page.getByTestId('event-list');
  const eventBoxes = eventList.locator('> div').filter({ hasText: /카테고리:/ });
  return await eventBoxes.count();
}

/**
 * Verify event is visible in search results
 */
export async function verifyEventInSearchResults(page: Page, title: string): Promise<void> {
  const eventList = page.getByTestId('event-list');
  const eventTitle = eventList.getByText(title);
  await expect(eventTitle).toBeVisible();
}

/**
 * Verify event is not visible in search results
 */
export async function verifyEventNotInSearchResults(page: Page, title: string): Promise<void> {
  const eventList = page.getByTestId('event-list');
  const eventTitle = eventList.getByText(title);
  await expect(eventTitle).not.toBeVisible();
}

/**
 * Verify no search results message
 */
export async function verifyNoSearchResults(page: Page): Promise<void> {
  const noResultsMessage = page.getByText('검색 결과가 없습니다.');
  await expect(noResultsMessage).toBeVisible();
}

/**
 * Get search input value
 */
export async function getSearchValue(page: Page): Promise<string> {
  const searchInput = page.getByPlaceholder('검색어를 입력하세요');
  return await searchInput.inputValue();
}
