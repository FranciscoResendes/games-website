import { use, useState } from 'react'
import { useNavigate, Routes, Route } from 'react-router-dom';
import TicTacToeGame from './tic-tac-toe/TicTacToeGame'
import './App.css'

function HomePage() {
    const navigate = useNavigate();
  return (
    <div>
      <div>
        <h1>Game page</h1>
      </div>
      <div className="card">
        <button onClick={() => navigate('/tic-tac-toe')}>tic-tac-toe</button>
      </div>
    </div>
  )
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tic-tac-toe" element={<TicTacToeGame />} />
        </Routes>
    </>
  )
}

export default App
