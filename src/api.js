const API = 'http://localhost:5000/api';

export const rollDice = () => 
  fetch(`${API}/roll-dice`, { method: 'POST' }).then(r => r.json());

export const checkPosition = (pos) => 
  fetch(`${API}/check-position`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ position: pos })
  }).then(r => r.json());

export const checkGameStatus = (pos) => 
  fetch(`${API}/game-status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ position: pos })
  }).then(r => r.json());