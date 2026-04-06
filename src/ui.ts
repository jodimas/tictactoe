import { GameState, getWinningIndices, Team, TEAMS, getAvailableTeams } from './game';

export class UI {
  private cells: NodeListOf<HTMLElement>;
  private statusEl: HTMLElement;
  private restartBtn: HTMLElement;
  private boardEl: HTMLElement;
  private selectionEl: HTMLElement;
  private selectionXEl: HTMLElement;
  private selectionOEl: HTMLElement;
  private playerXSelect: HTMLSelectElement;
  private playerOSelect: HTMLSelectElement;
  private confirmXBtn: HTMLButtonElement;
  private confirmOBtn: HTMLButtonElement;
  private onCellClick: (index: number) => void;
  private onRestart: () => void;
  private onSelectX: (team: Team) => void;
  private onSelectO: (team: Team) => void;

  constructor(
    onCellClick: (index: number) => void,
    onRestart: () => void,
    onSelectX: (team: Team) => void,
    onSelectO: (team: Team) => void
  ) {
    this.cells = document.querySelectorAll('.cell');
    this.statusEl = document.getElementById('status')!;
    this.restartBtn = document.getElementById('restart')!;
    this.boardEl = document.getElementById('board')!;
    this.selectionEl = document.getElementById('team-selection')!;
    this.selectionXEl = document.getElementById('selection-x')!;
    this.selectionOEl = document.getElementById('selection-o')!;
    this.playerXSelect = document.getElementById('player-x-team') as HTMLSelectElement;
    this.playerOSelect = document.getElementById('player-o-team') as HTMLSelectElement;
    this.confirmXBtn = document.getElementById('confirm-x') as HTMLButtonElement;
    this.confirmOBtn = document.getElementById('confirm-o') as HTMLButtonElement;
    this.onCellClick = onCellClick;
    this.onRestart = onRestart;
    this.onSelectX = onSelectX;
    this.onSelectO = onSelectO;
    
    this.populateTeamSelects();
    this.bindEvents();
  }

  private populateTeamSelects(): void {
    const options = TEAMS.map(team => 
      `<option value="${team.id}">${team.name}</option>`
    ).join('');
    
    this.playerXSelect.innerHTML = '<option value="">-- Team wählen --</option>' + options;
    this.playerOSelect.innerHTML = '<option value="">-- Team wählen --</option>' + 
      '<option value="" disabled>-- Zuerst Spieler X --</option>';
    this.playerOSelect.disabled = true;
  }

  private bindEvents(): void {
    this.cells.forEach((cell, index) => {
      cell.addEventListener('click', () => this.onCellClick(index));
    });
    
    this.restartBtn.addEventListener('click', () => this.onRestart());
    
    this.confirmXBtn.addEventListener('click', () => {
      const teamId = this.playerXSelect.value as any;
      const team = TEAMS.find(t => t.id === teamId);
      if (team) {
        this.onSelectX(team);
      }
    });
    
    this.confirmOBtn.addEventListener('click', () => {
      const teamId = this.playerOSelect.value as any;
      const team = TEAMS.find(t => t.id === teamId);
      if (team) {
        this.onSelectO(team);
      }
    });
  }

  updatePlayerOSelect(selectedXId: string | null): void {
    const availableTeams = getAvailableTeams(selectedXId as any);
    this.playerOSelect.innerHTML = '<option value="">-- Team wählen --</option>' +
      availableTeams.map(team => 
        `<option value="${team.id}">${team.name}</option>`
      ).join('');
    this.playerOSelect.disabled = false;
  }

  showOXSelection(): void {
    this.selectionXEl.style.display = 'none';
    this.selectionOEl.style.display = 'block';
  }

  private getTeamLogo(team: Team): string {
    return `<img src="${team.logoPath}" alt="${team.name}" class="team-logo-img">`;
  }

  private getPlayerLabel(player: 'X' | 'O', team: Team | null): string {
    return team 
      ? `<span class="player-label" style="color: ${team.color}">${team.name}</span>` 
      : `Spieler ${player}`;
  }

  render(state: GameState): void {
    this.cells.forEach((cell, index) => {
      const value = state.board[index];
      if (value === 'X') {
        cell.innerHTML = state.playerXTeam 
          ? this.getTeamLogo(state.playerXTeam) 
          : 'X';
      } else if (value === 'O') {
        cell.innerHTML = state.playerOTeam 
          ? this.getTeamLogo(state.playerOTeam) 
          : 'O';
      } else {
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
    } else if (state.winner === 'X') {
      const label = this.getPlayerLabel('X', state.playerXTeam);
      this.statusEl.innerHTML = `<span style="color: ${state.playerXTeam?.color || 'inherit'}">${label}</span> gewinnt!`;
    } else if (state.winner === 'O') {
      const label = this.getPlayerLabel('O', state.playerOTeam);
      this.statusEl.innerHTML = `<span style="color: ${state.playerOTeam?.color || 'inherit'}">${label}</span> gewinnt!`;
    } else if (state.phase === 'playing') {
      const currentTeam = state.currentPlayer === 'X' ? state.playerXTeam : state.playerOTeam;
      const label = this.getPlayerLabel(state.currentPlayer, currentTeam);
      this.statusEl.innerHTML = `<span style="color: ${currentTeam?.color || 'inherit'}">${label}</span> ist dran`;
    }
  }
}