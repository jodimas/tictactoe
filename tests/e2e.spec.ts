import { test, expect } from '@playwright/test';

async function selectTeams(page: any) {
  await page.selectOption('#player-x-team', 'tas');
  await page.click('#confirm-x');
  await page.selectOption('#player-o-team', 'tebe');
  await page.click('#confirm-o');
}

test.describe('TicTacToe E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Team selection and full game: X wins', async ({ page }) => {
    const cells = page.locator('.cell');

    await selectTeams(page);

    await cells.nth(0).click();
    await expect(cells.nth(0).locator('.team-logo-img')).toBeVisible();

    await cells.nth(3).click();
    await expect(cells.nth(3).locator('.team-logo-img')).toBeVisible();

    await cells.nth(1).click();
    await cells.nth(4).click();
    await cells.nth(2).click();

    await expect(page.locator('.status')).toContainText('Tasmania Berlin gewinnt');
  });

  test('Full game: Draw', async ({ page }) => {
    const cells = page.locator('.cell');

    await selectTeams(page);

    await cells.nth(0).click();
    await cells.nth(1).click();
    await cells.nth(2).click();
    await cells.nth(4).click();
    await cells.nth(3).click();
    await cells.nth(5).click();
    await cells.nth(7).click();
    await cells.nth(6).click();
    await cells.nth(8).click();

    await expect(page.locator('.status')).toContainText('Unentschieden');
  });

  test('Restart after game over', async ({ page }) => {
    const cells = page.locator('.cell');

    await selectTeams(page);
    await cells.nth(0).click();
    await cells.nth(1).click();
    await page.locator('.restart').click();

    await expect(page.locator('#team-selection')).toBeVisible();
    await expect(page.locator('#selection-x')).not.toBeHidden();
  });

  test('O cannot select same team as X', async ({ page }) => {
    await page.selectOption('#player-x-team', 'tas');
    await page.click('#confirm-x');

    const oSelect = page.locator('#player-o-team');
    const options = await oSelect.locator('option').allTextContents();
    expect(options).not.toContain('Tasmania Berlin');
  });
});
