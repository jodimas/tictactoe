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
export declare const TEAMS: Team[];
export declare const WINNING_COMBINATIONS: readonly [readonly [0, 1, 2], readonly [3, 4, 5], readonly [6, 7, 8], readonly [0, 3, 6], readonly [1, 4, 7], readonly [2, 5, 8], readonly [0, 4, 8], readonly [2, 4, 6]];
export declare function createInitialState(): GameState;
export declare function getTeamById(id: TeamId): Team | undefined;
export declare function getAvailableTeams(selectedTeamId: TeamId | null): Team[];
export declare function checkWinner(board: (Player | null)[]): Player | 'draw' | null;
export declare function makeMove(state: GameState, index: number): GameState;
export declare function setPlayerXTeam(state: GameState, team: Team): GameState;
export declare function setPlayerOTeam(state: GameState, team: Team): GameState;
export declare function getWinningIndices(board: (Player | null)[]): number[] | null;
export {};
//# sourceMappingURL=game.d.ts.map