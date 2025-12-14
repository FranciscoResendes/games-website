// sudokuValidator.js
// Standalone Sudoku board validation utility

function isValidSudoku(board) {
  // Check rows and columns
  for (let i = 0; i < 9; i++) {
    const rowSet = new Set();
    const colSet = new Set();
    for (let j = 0; j < 9; j++) {
      if (rowSet.has(board[i][j])) return false;
      if (colSet.has(board[j][i])) return false;
      if (board[i][j] < 1 || board[i][j] > 9) return false;
      if (board[j][i] < 1 || board[j][i] > 9) return false;
      rowSet.add(board[i][j]);
      colSet.add(board[j][i]);
    }
  }
  // Check 3x3 blocks
  for (let blockRow = 0; blockRow < 3; blockRow++) {
    for (let blockCol = 0; blockCol < 3; blockCol++) {
      const blockSet = new Set();
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          const val = board[blockRow * 3 + i][blockCol * 3 + j];
          if (blockSet.has(val)) return false;
          blockSet.add(val);
        }
      }
    }
  }
  return true;
}

export { isValidSudoku };
