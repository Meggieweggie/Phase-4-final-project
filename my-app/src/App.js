import React from "react";
import "./App.css";
import NavBar from "../../src/components/NavBar";
import Home from "../../src/components/Home";
import About from "../../src/components/About";

function App() {
  return (
    <div>
      <NavBar />
      <Home />
      <About />
    </div>
  );
}

export default App;
