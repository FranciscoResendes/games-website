
export type SquareProps = {
  value: 'X' | 'O' | null;
  onClick: () => void;
  gameOver?: boolean;
};

const Square = ({ value, onClick, gameOver }: SquareProps) => (
  <p
    className="square"
    tabIndex={gameOver || value ? -1 : 0}
    role="button"
    aria-disabled={!!value || !!gameOver}
    onClick={onClick}
    onKeyDown={e => {
      if ((e.key === 'Enter' || e.key === ' ') && !value && !gameOver) {
        onClick();
      }
    }}
    style={{ userSelect: 'none', cursor: !!value || gameOver ? 'not-allowed' : 'pointer' }}
  >
    {value}
  </p>
);

export default Square;
