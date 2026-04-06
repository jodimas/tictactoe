export const TEAMS = [
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
];
export function createInitialState() {
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
export function getTeamById(id) {
    return TEAMS.find(team => team.id === id);
}
export function getAvailableTeams(selectedTeamId) {
    return TEAMS.filter(team => team.id !== selectedTeamId);
}
export function checkWinner(board) {
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
export function makeMove(state, index) {
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
export function setPlayerXTeam(state, team) {
    return { ...state, playerXTeam: team };
}
export function setPlayerOTeam(state, team) {
    return { ...state, playerOTeam: team, phase: 'playing' };
}
export function getWinningIndices(board) {
    for (const [a, b, c] of WINNING_COMBINATIONS) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return [a, b, c];
        }
    }
    return null;
}
//# sourceMappingURL=game.js.map