import React, { useState, useEffect } from 'react';
import * as api from './api';

function useGameState() {
  const [players, setPlayers] = useState([
    { id: 1, name: 'Player 1', position: 0 },
    { id: 2, name: 'Player 2', position: 0 }
  ]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [gameMessage, setGameMessage] = useState('Click Roll Dice to start!');
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [winner, setWinner] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);

  const resetGame = () => {
    setPlayers([
      { id: 1, name: 'Player 1', position: 0 },
      { id: 2, name: 'Player 2', position: 0 }
    ]);
    setCurrentPlayerIndex(0);
    setGameMessage('Game reset! Click Roll Dice to start.');
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

  return {
    players,
    currentPlayerIndex,
    gameMessage,
    diceValue,
    isRolling,
    gameWon,
    winner,
    gameHistory,
    rollDice,
    resetGame
  };
}

function GameStateManager() {
  const gameState = useGameState();
  
  return {
    ...gameState,
    getCurrentPlayer: () => gameState.players[gameState.currentPlayerIndex],
    getPlayerPositions: () => gameState.players.map(p => ({ name: p.name, position: p.position })),
    isGameActive: () => !gameState.gameWon,
    canRoll: () => !gameState.isRolling && !gameState.gameWon
  };
}

export default GameStateManager;