# TicTacToe Test Plan

## 1. Test-Framework Setup

### Empfohlene Konfiguration

```bash
# Vitest für Unit/Integration Tests
npm install -D vitest @vitest/coverage-v8 jsdom

# Playwright für E2E Tests
npm install -D @playwright/test
npx playwright install
```

### package.json Scripts

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed"
  }
}
```

---

## 2. Unit Tests für Spiel-Logik

### Datei: `src/logic/gameLogic.test.ts`

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { checkWinner, isDraw, isValidMove, switchPlayer, createInitialState } from './gameLogic';

describe('Gewinn-Erkennung', () => {
  const winCombinations = [
    [0, 1, 2], // Reihen
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // Spalten
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // Diagonalen
    [2, 4, 6]
  ];

  winCombinations.forEach((combo, index) => {
    it(`soll Gewinner für Kombination ${index + 1} erkennen: ${combo.join(',')}`, () => {
      const board: (string | null)[] = Array(9).fill(null);
      board[combo[0]] = 'X';
      board[combo[1]] = 'X';
      board[combo[2]] = 'X';
      
      const winner = checkWinner(board);
      expect(winner).toBe('X');
    });
  });

  it('soll O als Gewinner erkennen', () => {
    const board: (string | null)[] = Array(9).fill(null);
    board[0] = 'O';
    board[4] = 'O';
    board[8] = 'O';
    
    expect(checkWinner(board)).toBe('O');
  });

  it('soll null zurückgeben wenn kein Gewinner', () => {
    const board: (string | null)[] = ['X', 'O', 'X', null, 'O', null, null, null, null];
    expect(checkWinner(board)).toBe(null);
  });
});

describe('Unentschieden-Erkennung', () => {
  it('soll Unentschieden erkennen wenn alle Felder belegt und kein Gewinner', () => {
    const board: (string | null)[] = [
      'X', 'O', 'X',
      'X', 'O', 'O',
      'O', 'X', 'X'
    ];
    expect(isDraw(board)).toBe(true);
  });

  it('soll kein Unentschieden bei unvollständigem Board', () => {
    const board: (string | null)[] = [
      'X', 'O', 'X',
      'X', 'O', null,
      'O', 'X', 'X'
    ];
    expect(isDraw(board)).toBe(false);
  });

  it('soll kein Unentschieden wenn Gewinner existiert', () => {
    const board: (string | null)[] = [
      'X', 'X', 'X',
      'O', 'O', null,
      null, null, null
    ];
    expect(isDraw(board)).toBe(false);
  });
});

describe('Zug-Validierung', () => {
  it('soll gültige Züge erlauben', () => {
    const board: (string | null)[] = Array(9).fill(null);
    expect(isValidMove(board, 4)).toBe(true);
  });

  it('soll Züge auf belegte Felder ablehnen', () => {
    const board: (string | null)[] = Array(9).fill(null);
    board[4] = 'X';
    expect(isValidMove(board, 4)).toBe(false);
  });

  it('soll Züge auf ungültige Indizes ablehnen', () => {
    const board: (string | null)[] = Array(9).fill(null);
    expect(isValidMove(board, -1)).toBe(false);
    expect(isValidMove(board, 9)).toBe(false);
  });
});

describe('Spieler-Wechsel', () => {
  it('soll von X zu O wechseln', () => {
    expect(switchPlayer('X')).toBe('O');
  });

  it('soll von O zu X wechseln', () => {
    expect(switchPlayer('O')).toBe('X');
  });
});
```

---

## 3. Integration Tests

### Datei: `src/components/GameBoard.test.ts`

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GameBoard } from './GameBoard';

describe('GameBoard Integration', () => {
  let gameBoard: GameBoard;
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    gameBoard = new GameBoard(container);
  });

  it('soll X anzeigen nach Klick auf freies Feld', () => {
    gameBoard.handleCellClick(0);
    expect(container.querySelector('[data-cell="0"]')?.textContent).toBe('X');
  });

  it('soll O anzeigen nach zweitem Klick', () => {
    gameBoard.handleCellClick(0);
    gameBoard.handleCellClick(1);
    expect(container.querySelector('[data-cell="1"]')?.textContent).toBe('O');
  });

  it('soll Spieler-Wechsel im Display aktualisieren', () => {
    gameBoard.handleCellClick(0);
    const status = container.querySelector('[data-status]');
    expect(status?.textContent).toContain('O');
  });

  it('soll Gewinner-Meldung nach Gewinn anzeigen', () => {
    const winningMoves = [0, 1, 2]; // Erste Reihe
    winningMoves.forEach(pos => {
      gameBoard.handleCellClick(pos);
    });
    
    const message = container.querySelector('[data-message]');
    expect(message?.textContent).toContain('Gewinner');
  });

  it('soll Unentschieden-Meldung anzeigen', () => {
    const moves = [0, 1, 2, 4, 3, 6, 5, 8, 7];
    moves.forEach(pos => gameBoard.handleCellClick(pos));
    
    const message = container.querySelector('[data-message]');
    expect(message?.textContent).toContain('Unentschieden');
  });

  it('soll Züge nach Spielende verhindern', () => {
    const winningMoves = [0, 3, 1, 4, 2]; // X gewinnt
    winningMoves.forEach(pos => gameBoard.handleCellClick(pos));
    
    // Versuch einen weiteren Zug
    gameBoard.handleCellClick(8);
    expect(container.querySelector('[data-cell="8"]')?.textContent).toBe('');
  });
});

describe('Spielstand-Update', () => {
  it('soll Spielstand nach jedem Zug aktualisieren', () => {
    const container = document.createElement('div');
    const gameBoard = new GameBoard(container);
    
    gameBoard.handleCellClick(0);
    gameBoard.handleCellClick(1);
    
    const score = container.querySelector('[data-score]');
    expect(score?.textContent).toContain('1');
  });
});
```

---

## 4. E2E Tests mit Playwright

### Datei: `tests/e2e/tictactoe.spec.ts`

```typescript
import { test, expect } from '@playwright/test';
import path from 'path';

const getFilePath = (filename: string) => 
  `file://${path.resolve(__dirname, '../../dist', filename)}`;

test.describe('TicTacToe E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(getFilePath('index.html'));
  });

  test('vollständiger Spielablauf - X gewinnt', async ({ page }) => {
    // X beginnt - Klick auf Feld 0
    await page.click('[data-cell="0"]');
    await expect(page.locator('[data-cell="0"]')).toHaveText('X');

    // O - Klick auf Feld 4
    await page.click('[data-cell="4"]');
    await expect(page.locator('[data-cell="4"]')).toHaveText('O');

    // X - Klick auf Feld 1
    await page.click('[data-cell="1"]');

    // O - Klick auf Feld 5
    await page.click('[data-cell="5"]');

    // X - Klick auf Feld 2 (Gewinn!)
    await page.click('[data-cell="2"]');

    // Ergebnis prüfen
    await expect(page.locator('[data-message]')).toContainText('Gewinner: X');
    
    // Keine weiteren Klicks möglich
    await page.click('[data-cell="8"]');
    await expect(page.locator('[data-cell="8"]')).toHaveText('');
  });

  test('vollständiger Spielablauf - Unentschieden', async ({ page }) => {
    // Unentschieden-Szenario
    const moves = [0, 1, 2, 4, 3, 6, 5, 8, 7];
    
    for (const move of moves) {
      await page.click(`[data-cell="${move}"]`);
    }

    await expect(page.locator('[data-message]')).toContainText('Unentschieden');
  });

  test('Neustart-Funktionalität', async ({ page }) => {
    // Einige Züge machen
    await page.click('[data-cell="0"]');
    await page.click('[data-cell="1"]');

    // Neustart
    await page.click('[data-restart]');

    // Alle Felder leer
    for (let i = 0; i < 9; i++) {
      await expect(page.locator(`[data-cell="${i}"]`)).toHaveText('');
    }

    // Status zurückgesetzt
    await expect(page.locator('[data-status]')).toContainText('X');
  });

  test('Klick auf belegtes Feld - kein Effekt', async ({ page }) => {
    await page.click('[data-cell="4"]');
    await expect(page.locator('[data-cell="4"]')).toHaveText('X');
    
    // Erneut klicken
    await page.click('[data-cell="4"]');
    await expect(page.locator('[data-cell="4"]')).toHaveText('X');
    
    // O sollte auf einem anderen Feld sein
    const otherCells = ['0', '1', '2', '3', '5', '6', '7', '8'];
    const hasO = await page.locator(otherCells.map(c => `[data-cell="${c}"]`).join(',')).filter({ hasText: 'O' }).count();
    expect(hasO).toBe(1);
  });

  test('Spieler-Anzeige aktualisiert korrekt', async ({ page }) => {
    await expect(page.locator('[data-status]')).toContainText('X');
    
    await page.click('[data-cell="0"]');
    await expect(page.locator('[data-status]')).toContainText('O');
    
    await page.click('[data-cell="1"]');
    await expect(page.locator('[data-status]')).toContainText('X');
  });
});
```

### Datei: `tests/e2e/responsive.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Responsive Design', () => {
  test('Desktop-Ansicht', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('file://' + process.cwd() + '/dist/index.html');
    
    const board = page.locator('[data-board]');
    await expect(board).toBeVisible();
    
    const cells = page.locator('[data-cell]');
    await expect(cells).toHaveCount(9);
  });

  test('Mobile-Ansicht', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('file://' + process.cwd() + '/dist/index.html');
    
    const board = page.locator('[data-board]');
    await expect(board).toBeVisible();
    
    // Zellen noch klickbar
    await page.click('[data-cell="4"]');
    await expect(page.locator('[data-cell="4"]')).toHaveText('X');
  });
});
```

---

## 5. Playwright Konfiguration

### Datei: `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    baseURL: 'file://' + process.cwd() + '/dist',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
```

---

## 6. Vitest Konfiguration

### Datei: `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.config.ts'
      ]
    }
  }
});
```

---

## 7. Test-Abdeckungs-Matrix

| Anforderung | Test-Typ | Priorität | Status |
|-------------|----------|-----------|--------|
| REQ-001: Spielfeld anzeigen | Unit, E2E | High | - |
| REQ-002: Spielstein platzieren | Unit, Integration | High | - |
| REQ-003: Gewinner-Erkennung | Unit | High | - |
| REQ-004: Unentschieden-Erkennung | Unit | Medium | - |
| REQ-005: Neustart-Funktion | Integration, E2E | Medium | - |
| REQ-007: Responsive Design | E2E | Medium | - |
| REQ-008: Visuelles Feedback | Integration | Low | - |

---

## 8. Test-Ausführung Reihenfolge

```bash
# 1. Unit Tests (schnell, keine Browser-Abhängigkeit)
npm test

# 2. Mit Coverage
npm run test:coverage

# 3. E2E Tests (erfordert dist/ Ordner mit kompilierten Dateien)
npm run test:e2e

# 4. Alle Tests
npm test && npm run test:e2e
```
