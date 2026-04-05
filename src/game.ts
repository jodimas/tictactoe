type Player = 'X' | 'O';

export interface GameState {
  board: (Player | null)[];
  currentPlayer: Player;
  winner: Player | 'draw' | null;
  isGameOver: boolean;
}

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
    isGameOver: false
  };
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
  if (state.board[index] || state.isGameOver) {
    return state;
  }
  
  const newBoard = [...state.board];
  newBoard[index] = state.currentPlayer;
  
  const winner = checkWinner(newBoard);
  
  return {
    board: newBoard,
    currentPlayer: state.currentPlayer === 'X' ? 'O' : 'X',
    winner,
    isGameOver: winner !== null
  };
}

export function getWinningIndices(board: (Player | null)[]): number[] | null {
  for (const [a, b, c] of WINNING_COMBINATIONS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return [a, b, c];
    }
  }
  return null;
}
