import React from "react";
import Board from "./components/Board";
import "./styles/Board.css";

function App() {
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Snakes and Ladders Board Setup</h1>
      <Board />
    </div>
  );
}

export default App;
