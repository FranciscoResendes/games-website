import { useState, useEffect, useRef } from 'react';
import './SudokuGame.css';

function SudokuGame() {
  const [grid, setGrid] = useState([]);
  const [userGrid, setUserGrid] = useState([]);
  const [selectedCell, setSelectedCell] = useState([0, 0]); // [row, col]
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const boardRef = useRef(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/sudoku')
      .then(res => res.json())
      .then(data => {
        setGrid(data.puzzle);
        setUserGrid(data.puzzle.map(row => row.slice())); // Deep copy for user edits
      });
  }, []);



  const handleChange = (rowIdx, colIdx, value) => {
    if (gameOver) return;
    if (!/^[1-9]?$/.test(value)) return; // Only allow 1-9 or empty
    const newGrid = userGrid.map(row => row.slice());
    newGrid[rowIdx][colIdx] = value === '' ? 0 : Number(value);
    setUserGrid(newGrid);
  };

  // Validate board: check rows, columns, and 3x3 blocks
  const isValidSudoku = (board) => {
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
  };

  // Check if all non-fixed cells are filled
  useEffect(() => {
    if (!userGrid.length || !grid.length || gameOver) return;
    let allFilled = true;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (grid[i][j] === 0 && userGrid[i][j] === 0) {
          allFilled = false;
          break;
        }
      }
      if (!allFilled) break;
    }
    if (allFilled) {
      // Validate
      if (isValidSudoku(userGrid)) {
        setMessage('Congratulations! You solved the puzzle!');
      } else {
        setMessage('Sorry, the solution is not correct.');
      }
      setGameOver(true);
    }
  }, [userGrid, grid, gameOver]);

  // Restart: clear all non-fixed cells
  const handleRestart = () => {
    if (!grid.length) return;
    const cleared = userGrid.map((row, i) =>
      row.map((cell, j) => (grid[i][j] === 0 ? 0 : cell))
    );
    setUserGrid(cleared);
    setGameOver(false);
    setMessage('');
  };

  // Keyboard navigation and input
  const handleKeyDown = (e) => {
    if (gameOver) return;
    const [row, col] = selectedCell;
    if (!userGrid.length) return;
    const maxRow = userGrid.length - 1;
    const maxCol = userGrid[0].length - 1;
    const isFixed = grid[row][col] !== 0;

    // Tab navigation
    if (e.key === 'Tab') {
      e.preventDefault();
      let nextRow = row, nextCol = col;
      if (e.shiftKey) {
        // Move backward
        if (col === 0) {
          nextCol = maxCol;
          nextRow = row === 0 ? maxRow : row - 1;
        } else {
          nextCol = col - 1;
        }
      } else {
        // Move forward
        if (col === maxCol) {
          nextCol = 0;
          nextRow = row === maxRow ? 0 : row + 1;
        } else {
          nextCol = col + 1;
        }
      }
      setSelectedCell([nextRow, nextCol]);
      return;
    }

    // Arrow keys navigation
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedCell([row === 0 ? maxRow : row - 1, col]);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedCell([row === maxRow ? 0 : row + 1, col]);
      return;
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setSelectedCell([row, col === 0 ? maxCol : col - 1]);
      return;
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setSelectedCell([row, col === maxCol ? 0 : col + 1]);
      return;
    }

    // Number input (1-9)
    if (/^[1-9]$/.test(e.key) && !isFixed) {
      const newGrid = userGrid.map(r => r.slice());
      newGrid[row][col] = Number(e.key);
      setUserGrid(newGrid);
      return;
    }

    // Backspace/Delete to clear
    if ((e.key === 'Backspace' || e.key === 'Delete') && !isFixed) {
      const newGrid = userGrid.map(r => r.slice());
      newGrid[row][col] = 0;
      setUserGrid(newGrid);
      return;
    }
  };

  // Focus the selected cell when it changes, but skip fixed cells
  useEffect(() => {
    if (!userGrid.length) return;
    const [row, col] = selectedCell;
    const isFixed = grid[row]?.[col] !== undefined && grid[row][col] !== 0;
    if (isFixed || gameOver) {
      // If fixed or game over, blur any active element
      if (document.activeElement && document.activeElement.tagName === 'INPUT') {
        document.activeElement.blur();
      }
      return;
    }
    const cell = document.getElementById(`cell-${row}-${col}`);
    if (cell) cell.focus();
  }, [selectedCell, userGrid, grid, gameOver]);

  return (
    <>
      <h1>Sudoku Game</h1>
      {message && <div style={{ marginBottom: '1rem', fontWeight: 'bold', color: '#fff' }}>{message}</div>}
      <div
        className="sudoku-board"
        ref={boardRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        style={{ outline: 'none' }}
      >
        {userGrid.map((row, rowIdx) => (
          <div className="sudoku-row" key={rowIdx}>
            {row.map((cell, colIdx) => {
              const isFixed = grid[rowIdx][colIdx] !== 0;
              const isSelected = selectedCell[0] === rowIdx && selectedCell[1] === colIdx;
              return (
                <input
                  className={`sudoku-cell${isSelected ? ' selected' : ''}${isFixed ? ' fixed' : ''}`}
                  key={colIdx}
                  id={`cell-${rowIdx}-${colIdx}`}
                  value={cell === 0 ? '' : cell}
                  disabled={isFixed || gameOver}
                  tabIndex={isSelected ? 0 : -1}
                  onFocus={() => setSelectedCell([rowIdx, colIdx])}
                  onClick={() => setSelectedCell([rowIdx, colIdx])}
                  onChange={e => handleChange(rowIdx, colIdx, e.target.value)}
                  maxLength={1}
                  autoComplete="off"
                />
              );
            })}
          </div>
        ))}
      </div>
      <button onClick={handleRestart} style={{ marginBottom: '1rem' }}>Restart</button>
    </>
  );
}

export default SudokuGame;