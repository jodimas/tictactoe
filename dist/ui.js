import { getWinningIndices, TEAMS, getAvailableTeams } from './game';
export class UI {
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
//# sourceMappingURL=ui.js.map