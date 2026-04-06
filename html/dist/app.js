const TEAMS = [
    { id: 'tas', name: 'Tasmania Berlin', shortName: 'TAS', color: '#FFD700', logoPath: 'logos/TAS_210809_Web-Header.png' },
    { id: 'tebe', name: 'TeBe Berlin', shortName: 'TBB', color: '#E31B23', logoPath: 'logos/Tennis_Borussia_Berlin.png' },
    { id: 'stpauli', name: 'FC St. Pauli', shortName: 'STP', color: '#E30613', logoPath: 'logos/stpauli.png' },
    { id: 'babelsberg', name: 'SV Babelsberg 03', shortName: 'BBL', color: '#E30A17', logoPath: 'logos/babelsberg03.svg' },
    { id: 'aschafftal', name: 'JFG Aschafftal', shortName: 'ASF', color: '#006633', logoPath: 'logos/JFG_Logo_2025_120.png' },
];
const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];
function createInitialState() {
    return {
        board: Array(9).fill(null),
        currentPlayer: 'X',
        winner: null,
        isGameOver: false,
        playerXTeam: null,
        playerOTeam: null,
        phase: 'selection'
    };
}
function getTeamById(id) {
    return TEAMS.find(team => team.id === id);
}
function getAvailableTeams(selectedTeamId) {
    return TEAMS.filter(team => team.id !== selectedTeamId);
}
function checkWinner(board) {
    for (const [a, b, c] of WINNING_COMBINATIONS) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    if (board.every(cell => cell !== null)) {
        return 'draw';
    }
    return null;
}
function makeMove(state, index) {
    if (state.phase !== 'playing') {
        return state;
    }
    if (state.board[index] || state.isGameOver) {
        return state;
    }
    const newBoard = [...state.board];
    newBoard[index] = state.currentPlayer;
    const winner = checkWinner(newBoard);
    return {
        ...state,
        board: newBoard,
        currentPlayer: state.currentPlayer === 'X' ? 'O' : 'X',
        winner,
        isGameOver: winner !== null,
        phase: winner !== null ? 'gameover' : 'playing'
    };
}
function setPlayerXTeam(state, team) {
    return { ...state, playerXTeam: team };
}
function setPlayerOTeam(state, team) {
    return { ...state, playerOTeam: team, phase: 'playing' };
}
function getWinningIndices(board) {
    for (const [a, b, c] of WINNING_COMBINATIONS) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return [a, b, c];
        }
    }
    return null;
}
//# sourceMappingURL=game.js.mapimport { getWinningIndices, TEAMS, getAvailableTeams } from './game';
class UI {
    constructor(onCellClick, onRestart, onSelectX, onSelectO) {
        this.cells = document.querySelectorAll('.cell');
        this.statusEl = document.getElementById('status');
        this.restartBtn = document.getElementById('restart');
        this.boardEl = document.getElementById('board');
        this.selectionEl = document.getElementById('team-selection');
        this.selectionXEl = document.getElementById('selection-x');
        this.selectionOEl = document.getElementById('selection-o');
        this.playerXSelect = document.getElementById('player-x-team');
        this.playerOSelect = document.getElementById('player-o-team');
        this.confirmXBtn = document.getElementById('confirm-x');
        this.confirmOBtn = document.getElementById('confirm-o');
        this.onCellClick = onCellClick;
        this.onRestart = onRestart;
        this.onSelectX = onSelectX;
        this.onSelectO = onSelectO;
        this.populateTeamSelects();
        this.bindEvents();
    }
    populateTeamSelects() {
        const options = TEAMS.map(team => `<option value="${team.id}">${team.name}</option>`).join('');
        this.playerXSelect.innerHTML = '<option value="">-- Team wählen --</option>' + options;
        this.playerOSelect.innerHTML = '<option value="">-- Team wählen --</option>' +
            '<option value="" disabled>-- Zuerst Spieler X --</option>';
        this.playerOSelect.disabled = true;
    }
    bindEvents() {
        this.cells.forEach((cell, index) => {
            cell.addEventListener('click', () => this.onCellClick(index));
        });
        this.restartBtn.addEventListener('click', () => this.onRestart());
        this.confirmXBtn.addEventListener('click', () => {
            const teamId = this.playerXSelect.value;
            const team = TEAMS.find(t => t.id === teamId);
            if (team) {
                this.onSelectX(team);
            }
        });
        this.confirmOBtn.addEventListener('click', () => {
            const teamId = this.playerOSelect.value;
            const team = TEAMS.find(t => t.id === teamId);
            if (team) {
                this.onSelectO(team);
            }
        });
    }
    updatePlayerOSelect(selectedXId) {
        const availableTeams = getAvailableTeams(selectedXId);
        this.playerOSelect.innerHTML = '<option value="">-- Team wählen --</option>' +
            availableTeams.map(team => `<option value="${team.id}">${team.name}</option>`).join('');
        this.playerOSelect.disabled = false;
    }
    showOXSelection() {
        this.selectionXEl.style.display = 'none';
        this.selectionOEl.style.display = 'block';
    }
    getTeamLogo(team) {
        return `<img src="${team.logoPath}" alt="${team.name}" class="team-logo-img">`;
    }
    getPlayerLabel(player, team) {
        return team
            ? `<span class="player-label" style="color: ${team.color}">${team.name}</span>`
            : `Spieler ${player}`;
    }
    render(state) {
        this.cells.forEach((cell, index) => {
            const value = state.board[index];
            if (value === 'X') {
                cell.innerHTML = state.playerXTeam
                    ? this.getTeamLogo(state.playerXTeam)
                    : 'X';
            }
            else if (value === 'O') {
                cell.innerHTML = state.playerOTeam
                    ? this.getTeamLogo(state.playerOTeam)
                    : 'O';
            }
            else {
                cell.innerHTML = '';
            }
            cell.classList.remove('winner');
        });
        const winningCells = state.winner && state.winner !== 'draw'
            ? getWinningIndices(state.board)
            : null;
        this.cells.forEach((cell, index) => {
            cell.classList.toggle('winner', winningCells?.includes(index) ?? false);
        });
        this.boardEl.style.display = state.phase === 'selection' ? 'none' : 'grid';
        this.selectionEl.style.display = state.phase === 'selection' ? 'block' : 'none';
        if (state.phase === 'selection' && !state.playerXTeam) {
            this.selectionXEl.style.display = 'block';
            this.selectionOEl.style.display = 'none';
        }
        if (state.winner === 'draw') {
            this.statusEl.textContent = 'Unentschieden!';
        }
        else if (state.winner === 'X') {
            const label = this.getPlayerLabel('X', state.playerXTeam);
            this.statusEl.innerHTML = `<span style="color: ${state.playerXTeam?.color || 'inherit'}">${label}</span> gewinnt!`;
        }
        else if (state.winner === 'O') {
            const label = this.getPlayerLabel('O', state.playerOTeam);
            this.statusEl.innerHTML = `<span style="color: ${state.playerOTeam?.color || 'inherit'}">${label}</span> gewinnt!`;
        }
        else if (state.phase === 'playing') {
            const currentTeam = state.currentPlayer === 'X' ? state.playerXTeam : state.playerOTeam;
            const label = this.getPlayerLabel(state.currentPlayer, currentTeam);
            this.statusEl.innerHTML = `<span style="color: ${currentTeam?.color || 'inherit'}">${label}</span> ist dran`;
        }
    }
}
//# sourceMappingURL=ui.js.mapimport { createInitialState, makeMove, setPlayerXTeam, setPlayerOTeam } from './game';

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