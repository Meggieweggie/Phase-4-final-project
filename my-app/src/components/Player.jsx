import React from "react";
import "../styles/Player.css";

function Player({ color, position }) {
  return (
    <div
      className="player"
      style={{ backgroundColor: color, gridRow: 11 - Math.ceil(position / 10), gridColumn: ((position - 1) % 10) + 1 }}
    ></div>
  );
}

export default Player;
