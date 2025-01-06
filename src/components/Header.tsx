
// src/components/Header.tsx
import React from "react";

const Header: React.FC = () => {
  return (
    <header style={{ backgroundColor: "#282c34", padding: "1rem", color: "white" }}>
      <h1>Project Status Website</h1>
      <nav>
        <a href="#home" style={{ margin: "0 1rem", color: "white", textDecoration: "none" }}>Home</a>
        <a href="#details" style={{ margin: "0 1rem", color: "white", textDecoration: "none" }}>Project Details</a>
        <a href="#team" style={{ margin: "0 1rem", color: "white", textDecoration: "none" }}>Team</a>
        <a href="#progress" style={{ margin: "0 1rem", color: "white", textDecoration: "none" }}>Progress</a>
        <a href="#resources" style={{ margin: "0 1rem", color: "white", textDecoration: "none" }}>Resources</a>
        <a href="#contact" style={{ margin: "0 1rem", color: "white", textDecoration: "none" }}>Contact</a>
      </nav>
    </header>
  );
};

export default Header;
