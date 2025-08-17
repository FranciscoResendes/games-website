import { useState } from 'react'
import './App.css'


type BoardState = ('X' | 'O' | null);

function App() {
  const [squares, setSquares] = useState<BoardState[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [winner, setWinner] = useState<'X' | 'O' | 'draw' | null>(null);

  function handleSquareClick(index: number) {
    if (squares[index] || gameOver) return;
    
    const newSquares = squares.slice();
    newSquares[index] = currentPlayer;

    setSquares(newSquares);
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    const result = calculateWinner(newSquares);

    if (result) {
      setWinner(result);
      setGameOver(true);
    }
  }
  function restartGame() {
    setSquares(Array(9).fill(null));
    setCurrentPlayer('X');
    setGameOver(false);
    setWinner(null);
  }

  return (
    <>
      <div>
        <h1>Tic Tac Toe</h1>
        <h3>Current Player: {currentPlayer}</h3>
        {gameOver && 
          (winner === 'draw' ? <h2 className="endText">It's a draw!!</h2> : <h2 className="endText">Winner: {winner}</h2>)
        }
      </div>
      <Board squares={squares} onSquareClick={handleSquareClick} gameOver={gameOver} />
      <button className='restart-button' onClick={restartGame}>Restart Game</button>
    </>
  )
}

function calculateWinner(
  squares: BoardState[],
): 'X' | 'O' | 'draw' | null {
  for (let i = 0; i < 3; i++) {
    const row = [squares[i * 3], squares[i * 3 + 1], squares[i * 3 + 2]];
    const col = [squares[i], squares[i + 3], squares[i + 6]];
    if (row.every((val) => val === 'X') || col.every((val) => val === 'X')) {
      return 'X';
    }
    if (row.every((val) => val === 'O') || col.every((val) => val === 'O')) {
      return 'O';
    }
  }
  if (
    squares[0] &&
    squares[0] === squares[4] &&
    squares[0] === squares[8]
  ) {
    return squares[0];
  }
  if (
    squares[2] &&
    squares[2] === squares[4] &&
    squares[2] === squares[6]
  ) {
    return squares[2];
  }
  if (squares.every((square) => square !== null)) {
    return 'draw';
  }
  return null;
}

type SquareProps = {
  value: BoardState;
  onClick: () => void;
  gameOver: boolean;
};

function Square({ value, onClick, gameOver }: SquareProps) {
  return (
    <p className="square" onClick={onClick} style={{ pointerEvents: gameOver ? 'none' : 'auto' }}>
      {value}
    </p>
  )
}
type BoardProps = {
  squares: BoardState[];
  onSquareClick: (index: number) => void;
  gameOver: boolean;
};

function Board({ squares, onSquareClick, gameOver }: BoardProps) {
  const renderSquare = (i: number) => (
    <Square key={i} value={squares[i]} onClick={() => onSquareClick(i)} gameOver={gameOver} />
  );

  return (
    <div className="board">
      {Array.from({ length: 9 }, (_, i) => renderSquare(i))}
    </div>
  );
}

export default App
