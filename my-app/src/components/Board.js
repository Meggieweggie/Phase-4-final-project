import React from "react";

function Board() {
  const squares = [];
  for (let i = 100; i >= 1; i--) {
    squares.push(<div key={i} className="square">{i}</div>);
  }

  return (
    <div className="board-container">
      <div className="board">
        {squares}
      </div>
    </div>
  );
}

export default Board;
