import { test, expect } from '@playwright/test';
import { mockPoetryAPI } from './helpers';

test.describe('Browse', () => {
  test.beforeEach(async ({ page }) => {
    await mockPoetryAPI(page);
  });

  test('should display poets list', async ({ page }) => {
    await page.goto('/poets');
    await expect(page.locator('.poet-item').first()).toBeVisible();
  });

  test('should filter poets', async ({ page }) => {
    await page.goto('/poets');
    await page.locator('.filter-input').fill('Shakespeare');
    await expect(page.locator('.poet-item')).toHaveCount(1);
  });

  test('should show no results message', async ({ page }) => {
    await page.goto('/poets');
    await page.locator('.filter-input').fill('zzzzzzzzz');
    await expect(page.locator('.no-results')).toBeVisible();
  });

  test('should navigate to poet detail', async ({ page }) => {
    await page.goto('/poets');
    await page.locator('.poet-item').first().click();
    await expect(page.locator('.poems-list')).toBeVisible();
  });

  test('should search poems by title', async ({ page }) => {
    await page.goto('/search');
    await page.locator('.search-input').fill('Raven');
    await page.locator('.search-btn').click();
    await expect(page.locator('.results-list')).toBeVisible();
  });
});
