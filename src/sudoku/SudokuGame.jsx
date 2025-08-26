import React, { useState, useEffect } from 'react';
import './SudokuGame.css';

function SudokuGame() {
  const [grid, setGrid] = useState([]);
  const [userGrid, setUserGrid] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/sudoku')
      .then(res => res.json())
      .then(data => {
        setGrid(data.puzzle);
        setUserGrid(data.puzzle.map(row => row.slice())); // Deep copy for user edits
      });
  }, []);

  const handleChange = (rowIdx, colIdx, value) => {
    if (!/^[1-9]?$/.test(value)) return; // Only allow 1-9 or empty
    const newGrid = userGrid.map(row => row.slice());
    newGrid[rowIdx][colIdx] = value === '' ? 0 : Number(value);
    setUserGrid(newGrid);
  };

  return (
    <div className="sudoku-board">
      {userGrid.map((row, rowIdx) => (
        <div className="sudoku-row" key={rowIdx}>
          {row.map((cell, colIdx) => {
            const isFixed = grid[rowIdx][colIdx] !== 0;
            return (
              <input
                className="sudoku-cell"
                key={colIdx}
                value={cell === 0 ? '' : cell}
                disabled={isFixed}
                onChange={e => handleChange(rowIdx, colIdx, e.target.value)}
                maxLength={1}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default SudokuGame;