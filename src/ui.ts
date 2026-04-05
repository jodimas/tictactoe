import { GameState, getWinningIndices } from './game';

export class UI {
  private cells: NodeListOf<HTMLElement>;
  private statusEl: HTMLElement;
  private restartBtn: HTMLElement;
  private onCellClick: (index: number) => void;
  private onRestart: () => void;

  constructor(
    onCellClick: (index: number) => void,
    onRestart: () => void
  ) {
    this.cells = document.querySelectorAll('.cell');
    this.statusEl = document.getElementById('status')!;
    this.restartBtn = document.getElementById('restart')!;
    this.onCellClick = onCellClick;
    this.onRestart = onRestart;
    
    this.bindEvents();
  }

  private bindEvents(): void {
    this.cells.forEach((cell, index) => {
      cell.addEventListener('click', () => this.onCellClick(index));
    });
    
    this.restartBtn.addEventListener('click', () => this.onRestart());
  }

  render(state: GameState): void {
    this.cells.forEach((cell, index) => {
      cell.textContent = state.board[index] || '';
    });
    
    const winningCells = state.winner && state.winner !== 'draw' 
      ? getWinningIndices(state.board) 
      : null;
    
    this.cells.forEach((cell, index) => {
      cell.classList.toggle('winner', winningCells?.includes(index) ?? false);
    });
    
    if (state.winner === 'draw') {
      this.statusEl.textContent = 'Unentschieden!';
    } else if (state.winner) {
      this.statusEl.textContent = `Spieler ${state.winner} gewinnt!`;
    } else {
      this.statusEl.textContent = `Spieler ${state.currentPlayer} ist dran`;
    }
  }
}
