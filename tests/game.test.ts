import { describe, it, expect, beforeEach } from 'vitest';
import { createInitialState, makeMove, checkWinner, getWinningIndices, setPlayerXTeam, setPlayerOTeam, TEAMS, getTeamById, getAvailableTeams } from '../src/game';

describe('Game Logic', () => {
  let state: ReturnType<typeof createInitialState>;

  beforeEach(() => {
    state = createInitialState();
  });

  it('Initial state is correct', () => {
    expect(state.board).toEqual(Array(9).fill(null));
    expect(state.currentPlayer).toBe('X');
    expect(state.winner).toBeNull();
    expect(state.isGameOver).toBe(false);
    expect(state.phase).toBe('selection');
    expect(state.playerXTeam).toBeNull();
    expect(state.playerOTeam).toBeNull();
  });

  it('Cannot move in selection phase', () => {
    const newState = makeMove(state, 0);
    expect(newState.board[0]).toBeNull();
    expect(state.phase).toBe('selection');
  });

  it('X move on empty cell after teams selected', () => {
    state = setPlayerOTeam(setPlayerXTeam(state, TEAMS[0]), TEAMS[1]);
    const newState = makeMove(state, 0);
    expect(newState.board[0]).toBe('X');
    expect(newState.currentPlayer).toBe('O');
    expect(newState.phase).toBe('playing');
  });

  it('O move after X', () => {
    state = setPlayerOTeam(setPlayerXTeam(state, TEAMS[0]), TEAMS[1]);
    let newState = makeMove(state, 0);
    newState = makeMove(newState, 1);
    expect(newState.board[0]).toBe('X');
    expect(newState.board[1]).toBe('O');
    expect(newState.currentPlayer).toBe('X');
  });

  it('Cannot move on occupied cell', () => {
    state = setPlayerOTeam(setPlayerXTeam(state, TEAMS[0]), TEAMS[1]);
    let newState = makeMove(state, 0);
    newState = makeMove(newState, 0);
    expect(newState.board.filter(x => x !== null).length).toBe(1);
  });

  it('X wins horizontally - top row', () => {
    state = setPlayerOTeam(setPlayerXTeam(state, TEAMS[0]), TEAMS[1]);
    let newState = makeMove(state, 0);
    newState = makeMove(newState, 3);
    newState = makeMove(newState, 1);
    newState = makeMove(newState, 4);
    newState = makeMove(newState, 2);
    expect(newState.winner).toBe('X');
    expect(newState.isGameOver).toBe(true);
    expect(newState.phase).toBe('gameover');
  });

  it('O wins vertically - middle column', () => {
    state = setPlayerOTeam(setPlayerXTeam(state, TEAMS[0]), TEAMS[1]);
    let newState = makeMove(state, 0);
    newState = makeMove(newState, 1);
    newState = makeMove(newState, 2);
    newState = makeMove(newState, 4);
    newState = makeMove(newState, 3);
    newState = makeMove(newState, 7);
    expect(newState.winner).toBe('O');
  });

  it('X wins diagonally - main diagonal', () => {
    state = setPlayerOTeam(setPlayerXTeam(state, TEAMS[0]), TEAMS[1]);
    let newState = makeMove(state, 0);
    newState = makeMove(newState, 1);
    newState = makeMove(newState, 4);
    newState = makeMove(newState, 2);
    newState = makeMove(newState, 8);
    expect(newState.winner).toBe('X');
  });

  it('O wins anti-diagonally', () => {
    state = setPlayerOTeam(setPlayerXTeam(state, TEAMS[0]), TEAMS[1]);
    let newState = makeMove(state, 0);
    newState = makeMove(newState, 2);
    newState = makeMove(newState, 1);
    newState = makeMove(newState, 4);
    newState = makeMove(newState, 3);
    newState = makeMove(newState, 6);
    expect(newState.winner).toBe('O');
  });

  it('Draw when board full', () => {
    state = setPlayerOTeam(setPlayerXTeam(state, TEAMS[0]), TEAMS[1]);
    const moves = [0, 1, 2, 4, 3, 5, 7, 6, 8];
    for (const move of moves) {
      state = makeMove(state, move);
    }
    expect(state.winner).toBe('draw');
    expect(state.isGameOver).toBe(true);
    expect(state.phase).toBe('gameover');
  });

  it('No move after game over', () => {
    state = setPlayerOTeam(setPlayerXTeam(state, TEAMS[0]), TEAMS[1]);
    let newState = makeMove(state, 0);
    newState = makeMove(newState, 3);
    newState = makeMove(newState, 1);
    newState = makeMove(newState, 4);
    newState = makeMove(newState, 2);
    const boardBefore = [...newState.board];
    newState = makeMove(newState, 8);
    expect(newState.board).toEqual(boardBefore);
  });

  it('getWinningIndices returns correct indices', () => {
    state = setPlayerOTeam(setPlayerXTeam(state, TEAMS[0]), TEAMS[1]);
    let newState = makeMove(state, 0);
    newState = makeMove(newState, 3);
    newState = makeMove(newState, 1);
    newState = makeMove(newState, 4);
    newState = makeMove(newState, 2);
    const indices = getWinningIndices(newState.board);
    expect(indices).toEqual([0, 1, 2]);
  });
});

describe('Team Functions', () => {
  it('getTeamById returns correct team', () => {
    const team = getTeamById('tas');
    expect(team?.name).toBe('Tasmania Berlin');
    expect(team?.shortName).toBe('TAS');
  });

  it('getAvailableTeams excludes selected team', () => {
    const available = getAvailableTeams('tas');
    expect(available.length).toBe(4);
    expect(available.find(t => t.id === 'tas')).toBeUndefined();
  });

  it('setPlayerXTeam assigns team', () => {
    const state = createInitialState();
    const team = TEAMS[0];
    const newState = setPlayerXTeam(state, team);
    expect(newState.playerXTeam).toEqual(team);
  });

  it('setPlayerOTeam assigns team and starts game', () => {
    let state = createInitialState();
    state = setPlayerXTeam(state, TEAMS[0]);
    state = setPlayerOTeam(state, TEAMS[1]);
    expect(state.playerOTeam).toEqual(TEAMS[1]);
    expect(state.phase).toBe('playing');
  });
});
