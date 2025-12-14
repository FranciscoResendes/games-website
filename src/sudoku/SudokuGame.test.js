import { describe, it, expect } from 'vitest';
import { isValidSudoku } from './sudokuValidator';

// Helper: valid solved board
const validBoard = [
  [5,3,4,6,7,8,9,1,2],
  [6,7,2,1,9,5,3,4,8],
  [1,9,8,3,4,2,5,6,7],
  [8,5,9,7,6,1,4,2,3],
  [4,2,6,8,5,3,7,9,1],
  [7,1,3,9,2,4,8,5,6],
  [9,6,1,5,3,7,2,8,4],
  [2,8,7,4,1,9,6,3,5],
  [3,4,5,2,8,6,1,7,9],
];

// All non-fixed cells have the same number (invalid)
const allSame = Array(9).fill().map(() => Array(9).fill(1));

// 3x3 blocks valid, but rows/cols have duplicates
const blockValidButRowColInvalid = [
  [1,2,3,1,2,3,1,2,3],
  [4,5,6,4,5,6,4,5,6],
  [7,8,9,7,8,9,7,8,9],
  [1,2,3,1,2,3,1,2,3],
  [4,5,6,4,5,6,4,5,6],
  [7,8,9,7,8,9,7,8,9],
  [1,2,3,1,2,3,1,2,3],
  [4,5,6,4,5,6,4,5,6],
  [7,8,9,7,8,9,7,8,9],
];

// Board with a duplicate in a row
const rowDuplicate = [
  [5,3,4,6,7,8,9,1,2],
  [6,7,2,1,9,5,3,4,8],
  [1,9,8,3,4,2,5,6,7],
  [8,5,9,7,6,1,4,2,3],
  [4,2,6,8,5,3,7,9,1],
  [7,1,3,9,2,4,8,5,6],
  [9,6,1,5,3,7,2,8,4],
  [2,8,7,4,1,9,6,3,5],
  [3,4,5,2,8,6,1,7,7], // duplicate 7
];

// Board with a duplicate in a column
const colDuplicate = [
  [5,3,4,6,7,8,9,1,2],
  [6,7,2,1,9,5,3,4,8],
  [1,9,8,3,4,2,5,6,7],
  [8,5,9,7,6,1,4,2,3],
  [4,2,6,8,5,3,7,9,1],
  [7,1,3,9,2,4,8,5,6],
  [9,6,1,5,3,7,2,8,4],
  [2,8,7,4,1,9,6,3,5],
  [3,4,5,2,8,6,1,7,2], // duplicate 2 in last column
];

describe('isValidSudoku', () => {
  it('returns true for a valid solved board', () => {
    expect(isValidSudoku(validBoard)).toBe(true);
  });

  it('returns false for a board where all cells are the same', () => {
    expect(isValidSudoku(allSame)).toBe(false);
  });

  it('returns false for a board with valid 3x3 blocks but invalid rows/cols', () => {
    expect(isValidSudoku(blockValidButRowColInvalid)).toBe(false);
  });

  it('returns false for a board with a duplicate in a row', () => {
    expect(isValidSudoku(rowDuplicate)).toBe(false);
  });

  it('returns false for a board with a duplicate in a column', () => {
    expect(isValidSudoku(colDuplicate)).toBe(false);
  });
});
