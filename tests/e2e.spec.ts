import { test, expect } from '@playwright/test';

test.describe('TicTacToe E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Full game: X wins', async ({ page }) => {
    const cells = page.locator('.cell');

    await cells.nth(0).click();
    await expect(cells.nth(0)).toHaveText('X');

    await cells.nth(3).click();
    await expect(cells.nth(3)).toHaveText('O');

    await cells.nth(1).click();
    await cells.nth(4).click();
    await cells.nth(2).click();

    await expect(page.locator('.status')).toContainText('X gewinnt');
  });

  test('Full game: Draw', async ({ page }) => {
    const cells = page.locator('.cell');

    // X O X
    // X X O
    // O X O
    await cells.nth(0).click(); // X
    await cells.nth(1).click(); // O
    await cells.nth(2).click(); // X
    await cells.nth(4).click(); // O
    await cells.nth(3).click(); // X
    await cells.nth(5).click(); // O
    await cells.nth(7).click(); // X
    await cells.nth(6).click(); // O
    await cells.nth(8).click(); // X

    await expect(page.locator('.status')).toContainText('Unentschieden');
  });

  test('Restart after game over', async ({ page }) => {
    const cells = page.locator('.cell');

    await cells.nth(0).click();
    await cells.nth(1).click();
    await page.locator('.restart').click();

    await expect(cells.nth(0)).toHaveText('');
    await expect(page.locator('.status')).toContainText('X ist dran');
  });
});
