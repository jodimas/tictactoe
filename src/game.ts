type Player = 'X' | 'O';

export type TeamId = 'tas' | 'tebe' | 'stpauli' | 'babelsberg' | 'aschafftal';

export interface Team {
  id: TeamId;
  name: string;
  shortName: string;
  color: string;
  logoPath: string;
}

export interface GameState {
  board: (Player | null)[];
  currentPlayer: Player;
  winner: Player | 'draw' | null;
  isGameOver: boolean;
  playerXTeam: Team | null;
  playerOTeam: Team | null;
  phase: 'selection' | 'playing' | 'gameover';
}

export const TEAMS: Team[] = [
  { id: 'tas', name: 'Tasmania Berlin', shortName: 'TAS', color: '#FFD700', logoPath: 'logos/TAS_210809_Web-Header.png' },
  { id: 'tebe', name: 'TeBe Berlin', shortName: 'TBB', color: '#E31B23', logoPath: 'logos/Tennis_Borussia_Berlin.png' },
  { id: 'stpauli', name: 'FC St. Pauli', shortName: 'STP', color: '#E30613', logoPath: 'logos/stpauli.png' },
  { id: 'babelsberg', name: 'SV Babelsberg 03', shortName: 'BBL', color: '#E30A17', logoPath: 'logos/babelsberg03.svg' },
  { id: 'aschafftal', name: 'JFG Aschafftal', shortName: 'ASF', color: '#006633', logoPath: 'logos/JFG_Logo_2025_120.png' },
];

export const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
] as const;

export function createInitialState(): GameState {
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

export function getTeamById(id: TeamId): Team | undefined {
  return TEAMS.find(team => team.id === id);
}

export function getAvailableTeams(selectedTeamId: TeamId | null): Team[] {
  return TEAMS.filter(team => team.id !== selectedTeamId);
}

export function checkWinner(board: (Player | null)[]): Player | 'draw' | null {
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

export function makeMove(state: GameState, index: number): GameState {
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

export function setPlayerXTeam(state: GameState, team: Team): GameState {
  return { ...state, playerXTeam: team };
}

export function setPlayerOTeam(state: GameState, team: Team): GameState {
  return { ...state, playerOTeam: team, phase: 'playing' };
}

export function getWinningIndices(board: (Player | null)[]): number[] | null {
  for (const [a, b, c] of WINNING_COMBINATIONS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return [a, b, c];
    }
  }
  return null;
}
