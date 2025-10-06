import React, { useState } from "react";
import "../styles/Board.css";

const snakes = { 16: 6, 48: 26, 49: 11, 56: 53, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 98: 78 };
const ladders = { 1: 38, 4: 14, 9: 31, 21: 42, 28: 84, 36: 44, 51: 67, 71: 91, 80: 100 };

function Board() {
  const [player1, setPlayer1] = useState(0);
  const [player2, setPlayer2] = useState(0);
  const [turn, setTurn] = useState(1);
  const [dice, setDice] = useState(1);

  const rollDice = () => {
    const roll = Math.floor(Math.random() * 6) + 1;
    setDice(roll);

    if (turn === 1) {
      movePlayer(1, roll);
    } else {
      movePlayer(2, roll);
    }
  };

  const movePlayer = (player, roll) => {
    if (player === 1) {
      let newPos = player1 + roll;
      if (newPos > 100) newPos = player1;
      if (snakes[newPos]) newPos = snakes[newPos];
      if (ladders[newPos]) newPos = ladders[newPos];
      setPlayer1(newPos);
      if (newPos === 100) {
        alert("Player 1 Wins!");
        resetGame();
      } else {
        setTurn(2);
      }
    } else {
      let newPos = player2 + roll;
      if (newPos > 100) newPos = player2;
      if (snakes[newPos]) newPos = snakes[newPos];
      if (ladders[newPos]) newPos = ladders[newPos];
      setPlayer2(newPos);
      if (newPos === 100) {
        alert("Player 2 Wins!");
        resetGame();
      } else {
        setTurn(1);
      }
    }
  };

  const resetGame = () => {
    setPlayer1(0);
    setPlayer2(0);
    setTurn(1);
  };

  return (
    <div className="board-container">
      <h1>Snakes and Ladders</h1>
      <div className="board">
        {[...Array(100)].map((_, i) => {
          const square = 100 - i;
          const p1 = player1 === square ? "P1" : "";
          const p2 = player2 === square ? "P2" : "";
          return (
            <div key={square} className="square">
              <span>{square}</span>
              <div className="players">
                {p1 && <div className="token token1">{p1}</div>}
                {p2 && <div className="token token2">{p2}</div>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="controls">
        <p>Dice Roll: {dice}</p>
        <button onClick={rollDice}>Roll Dice</button>
        <p>Turn: Player {turn}</p>
      </div>
    </div>
  );
}

export default Board;
