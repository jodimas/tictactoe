import { createInitialState, makeMove, setPlayerXTeam, setPlayerOTeam } from './game';
import { UI } from './ui';
class TicTacToe {
    constructor() {
        this.state = createInitialState();
        this.ui = new UI((index) => this.handleCellClick(index), () => this.restart(), (team) => this.handleSelectX(team), (team) => this.handleSelectO(team));
        this.ui.render(this.state);
    }
    handleCellClick(index) {
        this.state = makeMove(this.state, index);
        this.ui.render(this.state);
    }
    handleSelectX(team) {
        this.state = setPlayerXTeam(this.state, team);
        this.ui.updatePlayerOSelect(team.id);
        this.ui.showOXSelection();
        this.ui.render(this.state);
    }
    handleSelectO(team) {
        this.state = setPlayerOTeam(this.state, team);
        this.ui.render(this.state);
    }
    restart() {
        this.state = createInitialState();
        this.ui.render(this.state);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});
//# sourceMappingURL=main.js.map