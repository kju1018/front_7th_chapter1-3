import { test, expect } from '@playwright/test';

test('위치를 수정한 후 저장한다 ', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('회의실 A')).toBeVisible();

    // When
    await page.getByRole('button', { name: 'Edit event' }).first().click();
    await page.getByRole('textbox', { name: '위치' }).fill('집33');
    await page.getByTestId('event-submit-button').click();

    // Then
    await expect(page.getByText('집33')).toBeVisible();
});
