  // Navigate to main page
  const handleGoHome = () => {
    window.location.href = '/';
  };
import { useState, useEffect, useRef } from 'react';

import './SudokuGame.css';
import { isValidSudoku } from './sudokuValidator';


function SudokuGame() {
  const [grid, setGrid] = useState([]);
  const [userGrid, setUserGrid] = useState([]);
  const [selectedCell, setSelectedCell] = useState([0, 0]);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const boardRef = useRef(null);

  // Fetch puzzle on mount
  useEffect(() => {
    fetch('http://localhost:8000/api/sudoku')
      .then(res => res.json())
      .then(data => {
        setGrid(data.puzzle);
        setUserGrid(data.puzzle.map(row => row.slice()));
      });
  }, []);

  // Handle cell value change
  const handleChange = (rowIdx, colIdx, value) => {
    if (gameOver || !/^[1-9]?$/.test(value)) return;
    setUserGrid(prev => {
      const newGrid = prev.map(row => row.slice());
      newGrid[rowIdx][colIdx] = value === '' ? 0 : Number(value);
      return newGrid;
    });
  };

  // Check if all non-fixed cells are filled
  const allNonFixedFilled = () => {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (grid[i][j] === 0 && userGrid[i][j] === 0) return false;
      }
    }
    return true;
  };

  // Validate and finish game if board is filled
  useEffect(() => {
    if (!userGrid.length || !grid.length || gameOver) return;
    if (!allNonFixedFilled()) return;
    setGameOver(true);
    setMessage(isValidSudoku(userGrid)
      ? 'Congratulations! You solved the puzzle!'
      : 'Sorry, the solution is not correct.');
  }, [userGrid, grid, gameOver]);

  // Restart: clear all non-fixed cells
  const handleRestart = () => {
    if (!grid.length) return;
    setUserGrid(userGrid.map((row, i) =>
      row.map((cell, j) => (grid[i][j] === 0 ? 0 : cell))
    ));
    setGameOver(false);
    setMessage('');
  };

  // Keyboard navigation and input
  const handleKeyDown = (e) => {
    if (gameOver || !userGrid.length) return;
    const [row, col] = selectedCell;
    const maxRow = userGrid.length - 1;
    const maxCol = userGrid[0].length - 1;
    const isFixed = grid[row][col] !== 0;

    // Navigation helpers
    const move = (r, c) => setSelectedCell([r, c]);

    switch (e.key) {
      case 'Tab': {
        e.preventDefault();
        let [nextRow, nextCol] = [row, col];
        if (e.shiftKey) {
          if (col === 0) {
            nextCol = maxCol;
            nextRow = row === 0 ? maxRow : row - 1;
          } else {
            nextCol = col - 1;
          }
        } else {
          if (col === maxCol) {
            nextCol = 0;
            nextRow = row === maxRow ? 0 : row + 1;
          } else {
            nextCol = col + 1;
          }
        }
        move(nextRow, nextCol);
        break;
      }
      case 'ArrowUp':
        e.preventDefault();
        move(row === 0 ? maxRow : row - 1, col);
        break;
      case 'ArrowDown':
        e.preventDefault();
        move(row === maxRow ? 0 : row + 1, col);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        move(row, col === 0 ? maxCol : col - 1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        move(row, col === maxCol ? 0 : col + 1);
        break;
      default:
        // Number input (1-9)
        if (/^[1-9]$/.test(e.key) && !isFixed) {
          handleChange(row, col, e.key);
        }
        // Backspace/Delete to clear
        if ((e.key === 'Backspace' || e.key === 'Delete') && !isFixed) {
          handleChange(row, col, '');
        }
        break;
    }
  };

  // Focus the selected cell when it changes, allow navigation even on fixed cells
  useEffect(() => {
    if (!userGrid.length) return;
    const [row, col] = selectedCell;
    if (gameOver) {
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
      <button className="sudoku-nav-btn" onClick={handleGoHome}>Back to Main Page</button>
      <h1>Sudoku Game</h1>
      {message && <div className="sudoku-message">{message}</div>}
      <div
        className="sudoku-board sudoku-board-outline"
        ref={boardRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
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
      <button className="sudoku-restart-btn" onClick={handleRestart}>Restart</button>
    </>
  );
}

export default SudokuGame;