import { describe, it, expect, beforeEach } from 'vitest';
import { createInitialState, makeMove, checkWinner, getWinningIndices } from '../src/game';

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
  });

  it('X move on empty cell', () => {
    const newState = makeMove(state, 0);
    expect(newState.board[0]).toBe('X');
    expect(newState.currentPlayer).toBe('O');
  });

  it('O move after X', () => {
    let newState = makeMove(state, 0);
    newState = makeMove(newState, 1);
    expect(newState.board[0]).toBe('X');
    expect(newState.board[1]).toBe('O');
    expect(newState.currentPlayer).toBe('X');
  });

  it('Cannot move on occupied cell', () => {
    let newState = makeMove(state, 0);
    newState = makeMove(newState, 0);
    expect(newState.board.filter(x => x !== null).length).toBe(1);
  });

  it('X wins horizontally - top row', () => {
    let newState = makeMove(state, 0);
    newState = makeMove(newState, 3);
    newState = makeMove(newState, 1);
    newState = makeMove(newState, 4);
    newState = makeMove(newState, 2);
    expect(newState.winner).toBe('X');
    expect(newState.isGameOver).toBe(true);
  });

  it('O wins vertically - middle column', () => {
    let newState = makeMove(state, 0);
    newState = makeMove(newState, 1); // O on 1
    newState = makeMove(newState, 2);
    newState = makeMove(newState, 4); // O on 4
    newState = makeMove(newState, 3);
    newState = makeMove(newState, 7); // O on 7 - wins!
    expect(newState.winner).toBe('O');
  });

  it('X wins diagonally - main diagonal', () => {
    let newState = makeMove(state, 0);
    newState = makeMove(newState, 1);
    newState = makeMove(newState, 4);
    newState = makeMove(newState, 2);
    newState = makeMove(newState, 8);
    expect(newState.winner).toBe('X');
  });

  it('O wins anti-diagonally', () => {
    let newState = makeMove(state, 0);
    newState = makeMove(newState, 2);
    newState = makeMove(newState, 1);
    newState = makeMove(newState, 4);
    newState = makeMove(newState, 3);
    newState = makeMove(newState, 6);
    expect(newState.winner).toBe('O');
  });

  it('Draw when board full', () => {
    const moves = [0, 1, 2, 4, 3, 5, 7, 6, 8];
    for (const move of moves) {
      state = makeMove(state, move);
    }
    expect(state.winner).toBe('draw');
    expect(state.isGameOver).toBe(true);
  });

  it('No move after game over', () => {
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
    let newState = makeMove(state, 0);
    newState = makeMove(newState, 3);
    newState = makeMove(newState, 1);
    newState = makeMove(newState, 4);
    newState = makeMove(newState, 2);
    const indices = getWinningIndices(newState.board);
    expect(indices).toEqual([0, 1, 2]);
  });
});
