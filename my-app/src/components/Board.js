import React, { useEffect, useRef } from "react";

function Board() {
  const canvasRef = useRef(null);
  const boxSize = 60;

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

    const snakes = [
      { from: 65, to: 83 },
      { from: 70, to: 55 },
      { from: 45, to: 19 },
      { from: 36, to: 5 },
    ];

    const ladders = [
      { from: 46, to: 69 },
      { from: 6, to: 25 },
      { from: 11, to: 33},
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
  }, []);

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
    </div>
  );
}

export default Board;
