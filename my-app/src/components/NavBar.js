import React from "react";

function NavBar() {
  return (
    <nav style={{ background: "#333", padding: "10px" }}>
      <a href="/" style={{ color: "white", marginRight: "15px" }}>Home</a>
      <a href="/about" style={{ color: "white" }}>About</a>
    </nav>
  );
}

export default NavBar;
