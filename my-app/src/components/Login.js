import React, { useState } from 'react';
import './Login.css';

function Login({ onLogin }) {
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (player1.trim() && player2.trim()) {
      onLogin({ player1: player1.trim(), player2: player2.trim() });
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1>Snakes and Ladders</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Player 1 Name:</label>
            <input
              type="text"
              value={player1}
              onChange={(e) => setPlayer1(e.target.value)}
              placeholder="Enter Player 1 name"
              required
            />
          </div>
          <div className="input-group">
            <label>Player 2 Name:</label>
            <input
              type="text"
              value={player2}
              onChange={(e) => setPlayer2(e.target.value)}
              placeholder="Enter Player 2 name"
              required
            />
          </div>
          <button type="submit" className="start-btn">
            Start Game
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;