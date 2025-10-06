import React from "react";
import "../styles/Board.css";
import Square from "./Square";

function Board() {
  const squares = [];
  for (let i = 100; i >= 1; i--) {
    squares.push(<Square key={i} number={i} />);
  }

  return (
    <div className="board">
      {squares}
    </div>
  );
}

export default Board;
