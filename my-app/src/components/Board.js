import React, { useEffect, useRef, useState, useCallback } from "react";

function Board({ players, onGameEnd }) {
  const canvasRef = useRef(null);
  const boxSize = 60;
  const [dice, setDice] = useState("-");
  const [turn, setTurn] = useState(1);
  const [playerPos, setPlayerPos] = useState({ p1: 1, p2: 1 });
  const [gameMessage, setGameMessage] = useState("");
  const [winner, setWinner] = useState(null);

  // Snake and ladder mappings matching backend
  const snakes = {16: 6, 47: 26, 49: 11, 56: 53, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 98: 78};
  const ladders = {1: 38, 4: 14, 9: 31, 21: 42, 28: 84, 36: 44, 51: 67, 71: 91, 80: 100};


  const getPosition = useCallback((num) => {
    const row = Math.floor((num - 1) / 10);
    const col = (num - 1) % 10;
    const evenRow = row % 2 === 1;
    const x = evenRow
      ? (9 - col) * boxSize + boxSize / 2
      : col * boxSize + boxSize / 2;
    const y = (9 - row) * boxSize + boxSize / 2;
    return { x, y };
  }, [boxSize]);

  const drawPlayer = useCallback(
    (ctx, pos, color) => {
      const { x, y } = getPosition(pos);
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.stroke();
    },
    [getPosition]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");


    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        const x = col * boxSize;
        const y = row * boxSize;
        ctx.fillStyle = (row + col) % 2 === 0 ? "#FFF8DC" : "#F5DEB3";
        ctx.fillRect(x, y, boxSize, boxSize);
        const num = 100 - (row * 10 + (9 - col));
        ctx.fillStyle = "#333";
        ctx.font = "12px Arial";
        ctx.fillText(num, x + 5, y + 15);
      }
    }


    // Draw snakes
    Object.entries(snakes).forEach(([from, to]) => {
      const start = getPosition(parseInt(from));
      const end = getPosition(parseInt(to));
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.quadraticCurveTo(
        (start.x + end.x) / 2 + 10,
        (start.y + end.y) / 2,
        end.x,
        end.y
      );
      ctx.strokeStyle = "red";
      ctx.lineWidth = 4;
      ctx.stroke();
    });

    // Draw ladders
    Object.entries(ladders).forEach(([from, to]) => {
      const start = getPosition(parseInt(from));
      const end = getPosition(parseInt(to));

      ctx.strokeStyle = "#8B4513";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(start.x - 5, start.y);
      ctx.lineTo(end.x - 5, end.y);
      ctx.moveTo(start.x + 5, start.y);
      ctx.lineTo(end.x + 5, end.y);
      ctx.stroke();

      const steps = 4;
      for (let i = 1; i < steps; i++) {
        const x1 = start.x - 5 + ((end.x - start.x) * i) / steps;
        const y1 = start.y + ((end.y - start.y) * i) / steps;
        const x2 = x1 + 10;
        const y2 = y1;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    });


    drawPlayer(ctx, playerPos.p1, "blue");
    drawPlayer(ctx, playerPos.p2, "red");
  }, [playerPos, drawPlayer, boxSize, getPosition, snakes, ladders]);

  const checkPosition = (position) => {
    if (snakes[position]) {
      setGameMessage(`Snake! Slide down to ${snakes[position]}`);
      return snakes[position];
    } else if (ladders[position]) {
      setGameMessage(`Ladder! Climb up to ${ladders[position]}`);
      return ladders[position];
    } else {
      setGameMessage(`Safe at ${position}`);
      return position;
    }
  };

  const rollDice = async () => {
    if (winner) return;
    
    const roll = Math.floor(Math.random() * 6) + 1;
    setDice(roll);

    const currentPlayer = turn === 1 ? 'p1' : 'p2';
    const currentPos = playerPos[currentPlayer];
    let newPos = currentPos + roll;
    
    // Can't go beyond 100
    if (newPos > 100) {
      setGameMessage(`Need exactly ${100 - currentPos} to win!`);
      setTurn(turn === 1 ? 2 : 1);
      return;
    }
    
    // Check for snakes and ladders
    const finalPos = checkPosition(newPos);
    
    setPlayerPos(prev => ({
      ...prev,
      [currentPlayer]: finalPos
    }));
    
    // Check win condition
    if (finalPos >= 100) {
      const winnerName = turn === 1 ? players.player1 : players.player2;
      setWinner(winnerName);
      setGameMessage(`🎉 ${winnerName} wins!`);
      if (onGameEnd) onGameEnd(winnerName);
      return;
    }
    
    // Switch turn
    setTurn(turn === 1 ? 2 : 1);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>Snakes and Ladders Board</h2>
      <canvas
        ref={canvasRef}
        width={600}
        height={600}
        style={{
          border: "3px solid black",
          backgroundColor: "#fff",
        }}
      ></canvas>

      <div style={{ marginTop: "20px" }}>
        <div style={{ marginBottom: "10px" }}>
          <p><strong>{players.player1}:</strong> Position {playerPos.p1}</p>
          <p><strong>{players.player2}:</strong> Position {playerPos.p2}</p>
        </div>
        <p><strong>Current Turn:</strong> {turn === 1 ? players.player1 : players.player2}</p>
        <button
          onClick={rollDice}
          disabled={winner}
          style={{
            padding: "10px 20px",
            backgroundColor: winner ? "#ccc" : "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: winner ? "not-allowed" : "pointer",
          }}
        >
          {winner ? "Game Over" : "Roll Dice"}
        </button>
        <p><strong>Dice Result:</strong> {dice}</p>
        {gameMessage && <p style={{ color: "#333", fontWeight: "bold" }}>{gameMessage}</p>}
        {winner && (
          <div style={{ marginTop: "20px" }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "10px 20px",
                backgroundColor: "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Board;
