import React from "react";
import "../styles/Square.css";

function Square({ number }) {
  return (
    <div className="square">
      <span>{number}</span>
    </div>
  );
}

export default Square;
