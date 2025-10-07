import { useState } from 'react';
import * as api from './api';

export const GAME_CONSTANTS = {
  BOARD_SIZE: 100,
  WINNING_POSITION: 100,
  DICE_MIN: 1,
  DICE_MAX: 6,
  PLAYER_COUNT: 2
};

export const GAME_STATES = {
  WAITING: 'waiting',
  ROLLING: 'rolling',
  MOVING: 'moving',
  FINISHED: 'finished'
};

export function useGameLogic() {
  const [gameState, setGameState] = useState({
    players: [
      { id: 1, name: 'Player 1', position: 0 },
      { id: 2, name: 'Player 2', position: 0 }
    ],
    currentPlayerIndex: 0,
    status: GAME_STATES.WAITING,
    winner: null,
    lastDiceRoll: null,
    moveHistory: []
  });

  const getCurrentPlayer = () => {
    return gameState.players[gameState.currentPlayerIndex];
  };

  const updatePlayerPosition = (playerId, newPosition) => {
    setGameState(prev => ({
      ...prev,
      players: prev.players.map(player => 
        player.id === playerId 
          ? { ...player, position: newPosition }
          : player
      )
    }));
  };

  const switchToNextPlayer = () => {
    setGameState(prev => ({
      ...prev,
      currentPlayerIndex: (prev.currentPlayerIndex + 1) % GAME_CONSTANTS.PLAYER_COUNT,
      status: GAME_STATES.WAITING
    }));
  };

  const addMoveToHistory = (move) => {
    setGameState(prev => ({
      ...prev,
      moveHistory: [...prev.moveHistory.slice(-9), move]
    }));
  };

  const rollDice = async () => {
    if (gameState.status !== GAME_STATES.WAITING) return null;

    setGameState(prev => ({ ...prev, status: GAME_STATES.ROLLING }));

    try {
      const response = await api.rollDice();
      const diceValue = response.diceValue;
      
      setGameState(prev => ({ 
        ...prev, 
        lastDiceRoll: diceValue,
        status: GAME_STATES.MOVING 
      }));

      return diceValue;
    } catch (error) {
      setGameState(prev => ({ ...prev, status: GAME_STATES.WAITING }));
      throw error;
    }
  };

  const movePlayer = async (steps) => {
    const currentPlayer = getCurrentPlayer();
    const oldPosition = currentPlayer.position;
    const newPosition = oldPosition + steps;

    if (newPosition > GAME_CONSTANTS.WINNING_POSITION) {
      addMoveToHistory(`${currentPlayer.name} rolled ${steps} - stayed at ${oldPosition}`);
      switchToNextPlayer();
      return { moved: false, reason: 'exceeded_board' };
    }

    updatePlayerPosition(currentPlayer.id, newPosition);
    addMoveToHistory(`${currentPlayer.name}: ${oldPosition} → ${newPosition} (rolled ${steps})`);

    try {
      const positionCheck = await api.checkPosition(newPosition);
      let finalPosition = newPosition;

      if (positionCheck.type !== 'normal') {
        finalPosition = positionCheck.newPosition;
        updatePlayerPosition(currentPlayer.id, finalPosition);
        addMoveToHistory(`${positionCheck.type === 'snake' ? 'Snake' : 'Ladder'}: ${newPosition} → ${finalPosition}`);
      }

      const gameStatus = await api.checkGameStatus(finalPosition);
      
      if (gameStatus.won) {
        setGameState(prev => ({
          ...prev,
          status: GAME_STATES.FINISHED,
          winner: currentPlayer.name
        }));
        addMoveToHistory(`${currentPlayer.name} WINS!`);
        return { moved: true, won: true, finalPosition };
      }

      switchToNextPlayer();
      return { moved: true, won: false, finalPosition, specialMove: positionCheck.type };

    } catch (error) {
      switchToNextPlayer();
      throw error;
    }
  };

  const resetGame = () => {
    setGameState({
      players: [
        { id: 1, name: 'Player 1', position: 0 },
        { id: 2, name: 'Player 2', position: 0 }
      ],
      currentPlayerIndex: 0,
      status: GAME_STATES.WAITING,
      winner: null,
      lastDiceRoll: null,
      moveHistory: []
    });
  };

  const isValidMove = (fromPosition, steps) => {
    return fromPosition + steps <= GAME_CONSTANTS.WINNING_POSITION;
  };

  const getGameStats = () => {
    return {
      totalMoves: gameState.moveHistory.length,
      currentTurn: gameState.currentPlayerIndex + 1,
      gameStatus: gameState.status,
      winner: gameState.winner,
      playerPositions: gameState.players.map(p => ({ name: p.name, position: p.position }))
    };
  };

  return {
    gameState,
    getCurrentPlayer,
    rollDice,
    movePlayer,
    resetGame,
    isValidMove,
    getGameStats,
    canRoll: () => gameState.status === GAME_STATES.WAITING,
    isGameFinished: () => gameState.status === GAME_STATES.FINISHED,
    isRolling: () => gameState.status === GAME_STATES.ROLLING
  };
}