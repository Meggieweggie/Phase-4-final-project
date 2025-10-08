import React, { useState, useEffect } from 'react';
import * as api from './api';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [username, setUsername] = useState('');
  
  const [players, setPlayers] = useState([
    { id: 1, name: 'Player 1', position: 0 },
    { id: 2, name: 'Player 2', position: 0 }
  ]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [gameMessage, setGameMessage] = useState('Welcome! Please login to start playing.');
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [winner, setWinner] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('snakesUser');
    if (savedUser) {
      setCurrentUser(savedUser);
      setIsLoggedIn(true);
      setGameMessage(`Welcome back, ${savedUser}! Ready to play?`);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setCurrentUser(username.trim());
      setIsLoggedIn(true);
      localStorage.setItem('snakesUser', username.trim());
      setGameMessage(`Welcome ${username.trim()}! Click Roll Dice to start playing.`);
    }
  };

  const handleLogout = () => {
    setCurrentUser('');
    setIsLoggedIn(false);
    setUsername('');
    localStorage.removeItem('snakesUser');
    resetGame();
    setGameMessage('Thanks for playing! Please login to play again.');
  };

  const resetGame = () => {
    setPlayers([
      { id: 1, name: 'Player 1', position: 0 },
      { id: 2, name: 'Player 2', position: 0 }
    ]);
    setCurrentPlayerIndex(0);
    setGameMessage('New game started! Click Roll Dice to begin.');
    setDiceValue(1);
    setIsRolling(false);
    setGameWon(false);
    setWinner(null);
    setGameHistory([]);
  };

  const rollDice = async () => {
    if (isRolling || gameWon) return;
    
    setIsRolling(true);
    setGameMessage('Rolling dice...');

    try {
      const { diceValue: value } = await api.rollDice();
      setDiceValue(value);
      setTimeout(() => movePlayer(value), 1000);
    } catch (error) {
      setGameMessage('Error rolling dice. Try again.');
      setIsRolling(false);
    }
  };

  const movePlayer = async (steps) => {
    const updated = [...players];
    const player = updated[currentPlayerIndex];
    const oldPosition = player.position;
    const newPosition = player.position + steps;

    if (newPosition > 100) {
      setGameMessage(`${player.name} rolled ${steps} but needs exactly ${100 - player.position} to win!`);
      setIsRolling(false);
      addToHistory(`${player.name} rolled ${steps} - stayed at ${oldPosition}`);
      setTimeout(switchTurn, 2000);
      return;
    }

    player.position = newPosition;
    setPlayers(updated);
    setGameMessage(`${player.name} rolled ${steps} and moved to square ${newPosition}`);
    addToHistory(`${player.name} rolled ${steps}: ${oldPosition} → ${newPosition}`);

    try {
      const { newPosition: finalPos, type, message } = await api.checkPosition(newPosition);
      
      if (type !== 'normal') {
        player.position = finalPos;
        setPlayers([...updated]);
        setGameMessage(message);
        addToHistory(`${type === 'snake' ? 'Snake' : 'Ladder'}: ${newPosition} → ${finalPos}`);
      }

      const { won } = await api.checkGameStatus(player.position);
      
      if (won) {
        setGameWon(true);
        setWinner(player.name);
        setGameMessage(`${player.name} wins the game!`);
        addToHistory(`${player.name} WINS!`);
      } else {
        setTimeout(switchTurn, 2000);
      }
    } catch (error) {
      setGameMessage('Something went wrong. Try again.');
      setTimeout(switchTurn, 1000);
    }
    
    setIsRolling(false);
  };

  const switchTurn = () => {
    const next = (currentPlayerIndex + 1) % players.length;
    setCurrentPlayerIndex(next);
    setGameMessage(`${players[next].name}'s turn to roll!`);
  };

  const addToHistory = (move) => {
    setGameHistory(prev => [...prev.slice(-9), move]);
  };

  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="game-logo">
            <h1>Snakes & Ladders</h1>
            <p>Classic Board Game</p>
          </div>
          
          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="username-input"
                required
              />
            </div>
            
            <button type="submit" className="login-btn">
              Start Playing
            </button>
          </form>
          
          <div className="game-preview">
            <div className="preview-board">
              {[...Array(25)].map((_, i) => (
                <div key={i} className="preview-square"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-app">
      <header className="game-header">
        <h1>Snakes & Ladders</h1>
        <div className="user-info">
          <span>Welcome, {currentUser}!</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <div className="game-container">
        <div className="game-panel">
          <div className="players-section">
            <h3>Players</h3>
            {players.map((player, index) => (
              <div 
                key={player.id} 
                className={`player-card ${index === currentPlayerIndex ? 'active' : ''}`}
              >
                <div className="player-info">
                  <span className="player-name">{player.name}</span>
                  <span className="player-position">Position: {player.position}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="game-status">
            <p>{gameMessage}</p>
          </div>

          <div className="dice-section">
            <div className="dice-display">
              <div className={`dice ${isRolling ? 'rolling' : ''}`}>
                {diceValue}
              </div>
            </div>
            
            <button
              onClick={rollDice}
              disabled={isRolling || gameWon}
              className="roll-btn"
            >
              {isRolling ? 'Rolling...' : 'Roll Dice'}
            </button>
            
            <button onClick={resetGame} className="reset-btn">
              New Game
            </button>
          </div>

          {gameHistory.length > 0 && (
            <div className="game-history">
              <h4>Game History</h4>
              <div className="history-list">
                {gameHistory.map((move, index) => (
                  <div key={index} className="history-item">{move}</div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="board-section">
          <GameBoard players={players} />
        </div>
      </div>

      {gameWon && (
        <div className="winner-modal">
          <div className="modal-content">
            <h2>Game Over!</h2>
            <h3>{winner} Wins!</h3>
            <button onClick={resetGame} className="play-again-btn">
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function GameBoard({ players }) {
  const createBoard = () => {
    const squares = [];
    for (let i = 100; i >= 1; i--) {
      const playersOnSquare = players.filter(p => p.position === i);
      
      squares.push(
        <div key={i} className="board-square">
          <span className="square-number">{i}</span>
          {playersOnSquare.map((player, index) => (
            <div
              key={player.id}
              className={`player-piece player-${player.id}`}
              style={{ top: `${5 + index * 15}px` }}
            />
          ))}
        </div>
      );
    }
    return squares;
  };

  return (
    <div className="game-board">
      {createBoard()}
    </div>
  );
}

export default App;