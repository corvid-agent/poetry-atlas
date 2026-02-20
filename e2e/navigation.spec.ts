import { test, expect } from '@playwright/test';
import { mockPoetryAPI } from './helpers';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await mockPoetryAPI(page);
  });

  test('should navigate to poets', async ({ page }) => {
    await page.goto('/poets');
    await expect(page.locator('.page-title')).toBeVisible();
  });

  test('should navigate to search', async ({ page }) => {
    await page.goto('/search');
    await expect(page.locator('.search-input')).toBeVisible();
  });

  test('should navigate to discover', async ({ page }) => {
    await page.goto('/discover');
    await expect(page.locator('.discover-header')).toBeVisible();
  });

  test('should navigate to favorites', async ({ page }) => {
    await page.goto('/favorites');
    await expect(page.locator('.empty-state').or(page.locator('.poems-list'))).toBeVisible();
  });
});
