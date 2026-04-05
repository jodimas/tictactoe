import { GameState, createInitialState, makeMove } from './game';
import { UI } from './ui';

class TicTacToe {
  private state: GameState;
  private ui: UI;

  constructor() {
    this.state = createInitialState();
    this.ui = new UI(
      (index) => this.handleCellClick(index),
      () => this.restart()
    );
    this.ui.render(this.state);
  }

  private handleCellClick(index: number): void {
    this.state = makeMove(this.state, index);
    this.ui.render(this.state);
  }

  private restart(): void {
    this.state = createInitialState();
    this.ui.render(this.state);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new TicTacToe();
});
