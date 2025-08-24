import React, { useState, useEffect } from 'react';
import './SudokuGame.css';

function SudokuGame() {
  const [grid, setGrid] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/sudoku')
      .then(res => res.json())
      .then(data => setGrid(data.puzzle));
  }, []);

  return (
    <div>
      {/* Render your grid here */}
      {grid.length > 0 && (
        <pre>{JSON.stringify(grid, null, 2)}</pre>
      )}
    </div>
  );
}

export default SudokuGame;