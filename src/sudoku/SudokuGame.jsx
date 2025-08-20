import React, { useState } from 'react';
import './SudokuGame.css';

function SudokuGame() {
  // Example: 9x9 grid with empty cells
  const [grid, setGrid] = useState(Array(9).fill().map(() => Array(9).fill('')));

  const handleChange = (row, col, value) => {
    const newGrid = grid.map(arr => arr.slice());
    newGrid[row][col] = value.replace(/[^1-9]/, ''); // Only allow 1-9
    setGrid(newGrid);
  };

  return (
    <div className="sudoku-board">
      {grid.map((row, rIdx) => (
        <div className="sudoku-row" key={rIdx}>
          {row.map((cell, cIdx) => (
            <input
              className="sudoku-cell"
              key={cIdx}
              value={cell}
              maxLength={1}
              onChange={e => handleChange(rIdx, cIdx, e.target.value)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default SudokuGame;