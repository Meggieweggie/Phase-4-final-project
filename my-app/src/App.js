import React, { useState } from "react";
import Board from "./components/Board";
import Login from "./components/Login";

function App() {
  const [players, setPlayers] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);

  const handleLogin = (playerData) => {
    setPlayers(playerData);
    setGameStarted(true);
  };

  const handleGameEnd = (winner) => {
    console.log(`Game ended. Winner: ${winner}`);
  };

  if (!gameStarted) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div>
      <Board players={players} onGameEnd={handleGameEnd} />
    </div>
  );
}

export default App;
