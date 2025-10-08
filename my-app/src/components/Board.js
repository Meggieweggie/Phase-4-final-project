import React, { useEffect, useRef, useState } from "react";

function Board() {
  const canvasRef = useRef(null);
  const boxSize = 60;
  const [dice, setDice] = useState("-");
  const [turn, setTurn] = useState("Player 1");
  const [playerPos, setPlayerPos] = useState({ p1: 1, p2: 1 });

  function getPosition(num) {
    const row = Math.floor((num - 1) / 10);
    const col = (num - 1) % 10;
    const evenRow = row % 2 === 1;
    const x = evenRow
      ? (9 - col) * boxSize + boxSize / 2
      : col * boxSize + boxSize / 2;
    const y = (9 - row) * boxSize + boxSize / 2;
    return { x, y };
  }

  function drawPlayer(ctx, pos, color) {
    const { x, y } = getPosition(pos);
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.stroke();
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        const x = col * boxSize;
        const y = row * boxSize;
        ctx.fillStyle = (row + col) % 2 === 0 ? "#FFF8DC" : "#F5DEB3";
        ctx.fillRect(x, y, boxSize, boxSize);
        let num;
        if (row % 2 === 0) {
          num = 100 - (row * 10) - col;
        } else {
          num = 100 - (row * 10) - (9 - col);
        }
        if (num < 1) num = 1;
        ctx.fillStyle = "#333";
        ctx.font = "12px Arial";
        ctx.fillText(num, x + 5, y + 15);
      }
    }

    const snakes = [
      { from: 83, to: 65 },
      { from: 55, to: 70 },
      { from: 19, to: 45 },
      { from: 5, to: 36 },
    ];

    const ladders = [
      { from: 46, to: 69 },
      { from: 6, to: 25 },
      { from: 11, to: 33 },
      { from: 36, to: 44 },
      { from: 63, to: 81 },
    ];

    snakes.forEach((snake) => {
      const start = getPosition(snake.from);
      const end = getPosition(snake.to);
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.quadraticCurveTo(
        (start.x + end.x) / 2 + 10,
        (start.y + end.y) / 2,
        end.x,
        end.y
      );
      ctx.strokeStyle = "green";
      ctx.lineWidth = 4;
      ctx.stroke();
    });

    ladders.forEach((ladder) => {
      const start = getPosition(ladder.from);
      const end = getPosition(ladder.to);

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
  }, [playerPos]);

  function checkSnakesAndLadders(position) {
    const snakeMap = { 83: 65, 55: 70, 19: 45, 5: 36 };
    const ladderMap = { 69: 46, 25: 6, 33: 11, 44: 36, 81: 63 };
    
    if (snakeMap[position]) return snakeMap[position];
    if (ladderMap[position]) return ladderMap[position];
    return position;
  }

  function rollDice() {
    if (playerPos.p1 >= 100 || playerPos.p2 >= 100) return;
    
    const roll = Math.floor(Math.random() * 6) + 1;
    setDice(roll);

    if (turn === "Player 1") {
      const newPos = Math.min(playerPos.p1 + roll, 100);
      const finalPos = checkSnakesAndLadders(newPos);
      setPlayerPos((prev) => ({ ...prev, p1: finalPos }));
      if (finalPos < 100) setTurn("Player 2");
    } else {
      const newPos = Math.min(playerPos.p2 + roll, 100);
      const finalPos = checkSnakesAndLadders(newPos);
      setPlayerPos((prev) => ({ ...prev, p2: finalPos }));
      if (finalPos < 100) setTurn("Player 1");
    }
  }

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

      <div style={{ marginTop: "20px", background: 'rgba(255,255,255,0.9)', padding: '20px', borderRadius: '15px', margin: '20px auto', maxWidth: '400px' }}>
        <p style={{ fontSize: '18px', marginBottom: '15px' }}>
          <strong>Turn:</strong> {turn}
        </p>
        <p style={{ fontSize: '16px', marginBottom: '15px' }}>
          <strong>Player 1 Position:</strong> {playerPos.p1} | <strong>Player 2 Position:</strong> {playerPos.p2}
        </p>
        <button
          onClick={rollDice}
          disabled={playerPos.p1 >= 100 || playerPos.p2 >= 100}
          style={{
            padding: "15px 30px",
            background: (playerPos.p1 >= 100 || playerPos.p2 >= 100) ? "#ccc" : "linear-gradient(135deg, #4CAF50, #45a049)",
            color: "white",
            border: "none",
            borderRadius: "25px",
            cursor: (playerPos.p1 >= 100 || playerPos.p2 >= 100) ? "not-allowed" : "pointer",
            fontSize: "16px",
            fontWeight: "bold",
            marginBottom: "15px"
          }}
        >
          Roll Dice
        </button>
        <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
          <strong>Dice Result:</strong> {dice}
        </p>
        {(playerPos.p1 >= 100 || playerPos.p2 >= 100) && (
          <div style={{ marginTop: '20px', padding: '15px', background: 'linear-gradient(135deg, #ff6b6b, #ee5a52)', color: 'white', borderRadius: '15px' }}>
            <h3>{playerPos.p1 >= 100 ? 'Player 1 Wins!' : 'Player 2 Wins!'}</h3>
            <button
              onClick={() => {
                setPlayerPos({ p1: 1, p2: 1 });
                setTurn('Player 1');
                setDice('-');
              }}
              style={{
                padding: '10px 20px',
                background: 'white',
                color: '#333',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 'bold',
                marginTop: '10px'
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
