import Square from './Square';

export type BoardProps = {
  squares: ('X' | 'O' | null)[];
  onSquareClick: (index: number) => void;
  gameOver?: boolean;
};

const Board = ({ squares, onSquareClick, gameOver }: BoardProps) => {
  const renderSquare = (i: number) => (
    <Square
      key={i}
      value={squares[i]}
      onClick={() => onSquareClick(i)}
      gameOver={gameOver}
    />
  );

  return (
    <div className="board">
      {Array.from({ length: 9 }, (_, i) => renderSquare(i))}
    </div>
  );
};

export default Board;
