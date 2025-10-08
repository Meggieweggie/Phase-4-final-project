import React, { useState, useEffect } from "react";
import Board from "./components/Board";
import "./styles/Board.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('snakesUser');
    if (savedUser) {
      setCurrentUser(savedUser);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setCurrentUser(username.trim());
      setIsLoggedIn(true);
      localStorage.setItem('snakesUser', username.trim());
    }
  };

  const handleLogout = () => {
    setCurrentUser('');
    setIsLoggedIn(false);
    setUsername('');
    localStorage.removeItem('snakesUser');
  };

  if (!isLoggedIn) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '25px',
          padding: '40px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)',
          textAlign: 'center',
          maxWidth: '400px',
          width: '100%'
        }}>
          <h1 style={{ marginBottom: '10px', color: '#333' }}>Snakes & Ladders</h1>
          <p style={{ color: '#666', marginBottom: '30px' }}>Classic Board Game</p>
          
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '15px',
                border: '2px solid #e1e8ed',
                borderRadius: '15px',
                fontSize: '16px',
                marginBottom: '20px',
                background: 'rgba(255, 255, 255, 0.9)',
                boxSizing: 'border-box'
              }}
            />
            
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '15px',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                border: 'none',
                borderRadius: '15px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxSizing: 'border-box'
              }}
            >
              Start Playing
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      <header style={{
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 5px 20px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ color: '#333', margin: 0 }}>Snakes & Ladders</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontWeight: '600', color: '#333' }}>Welcome, {currentUser}!</span>
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 20px',
              background: 'linear-gradient(135deg, #ff6b6b, #ee5a52)',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Logout
          </button>
        </div>
      </header>
      
      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: 'calc(100vh - 80px)' }}>
        <Board />
      </div>
    </div>
  );
}

export default App;
