import { test, expect } from '@playwright/test';
import { mockPoetryAPI } from './helpers';

test.describe('App', () => {
  test('should load home page', async ({ page }) => {
    await mockPoetryAPI(page);
    await page.goto('/');
    await expect(page.locator('.hero-title').or(page.locator('h1'))).toBeVisible();
  });

  test('should show app logo', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.app-logo')).toBeVisible();
  });

  test('should show navigation', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.desktop-nav')).toBeVisible();
  });

  test('should show poem of the day', async ({ page }) => {
    await mockPoetryAPI(page);
    await page.goto('/');
    await expect(page.locator('.potd').or(page.locator('app-poem-card'))).toBeVisible();
  });
});
