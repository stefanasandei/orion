import { test, expect } from '@playwright/test';
import { addScreenshot } from './common';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('Landing Page', () => {
  test('should have text', async ({ page }, testInfo) => {
    await addScreenshot(page, 'landing-page', testInfo);
    expect(true).toBeTruthy();
  });
});
