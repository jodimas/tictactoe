import { GameState, createInitialState, makeMove, setPlayerXTeam, setPlayerOTeam, Team } from './game';
import { UI } from './ui';

class TicTacToe {
  private state: GameState;
  private ui: UI;

  constructor() {
    this.state = createInitialState();
    this.ui = new UI(
      (index) => this.handleCellClick(index),
      () => this.restart(),
      (team) => this.handleSelectX(team),
      (team) => this.handleSelectO(team)
    );
    this.ui.render(this.state);
  }

  private handleCellClick(index: number): void {
    this.state = makeMove(this.state, index);
    this.ui.render(this.state);
  }

  private handleSelectX(team: Team): void {
    this.state = setPlayerXTeam(this.state, team);
    this.ui.updatePlayerOSelect(team.id);
    this.ui.showOXSelection();
    this.ui.render(this.state);
  }

  private handleSelectO(team: Team): void {
    this.state = setPlayerOTeam(this.state, team);
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
