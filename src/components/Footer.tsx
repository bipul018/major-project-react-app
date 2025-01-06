// src/components/Footer.tsx
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer
      style={{
        backgroundColor: "#f1f1f1",
        padding: "1rem",
        textAlign: "center",
        marginTop: "2rem",
        fontSize: "0.9rem",
      }}
    >
      <p>&copy; {new Date().getFullYear()} Project Status Website. All rights reserved.</p>
      <p>
        Made by Team VisionAI. Supervised by Project Supervisors and Coordinators.
      </p>
    </footer>
  );
};

export default Footer;
