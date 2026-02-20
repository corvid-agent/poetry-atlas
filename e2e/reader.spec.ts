import { test, expect } from '@playwright/test';
import { mockPoetryAPI } from './helpers';

test.describe('Reader', () => {
  test('should show discover page with random poems', async ({ page }) => {
    await mockPoetryAPI(page);
    await page.goto('/discover');
    await expect(page.locator('.poems-list')).toBeVisible();
  });

  test('should have refresh button on discover', async ({ page }) => {
    await mockPoetryAPI(page);
    await page.goto('/discover');
    await expect(page.locator('.refresh-btn')).toBeVisible();
  });

  test('should show empty favorites initially', async ({ page }) => {
    await page.goto('/favorites');
    await expect(page.locator('.empty-state')).toBeVisible();
  });

  test('should show quick links on home', async ({ page }) => {
    await mockPoetryAPI(page);
    await page.goto('/');
    await expect(page.locator('.quick-link').first()).toBeVisible();
  });
});
