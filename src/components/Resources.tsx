// src/components/Resources.tsx
import React from "react";

const Resources: React.FC = () => {
  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h2 id="resources">Resources</h2>
      <p>Here are some resources and references related to our project:</p>
      <ul>
        <li>
          <a
            href="https://reactjs.org/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#007BFF", textDecoration: "none" }}
          >
            React Documentation
          </a>
        </li>
        <li>
          <a
            href="https://www.typescriptlang.org/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#007BFF", textDecoration: "none" }}
          >
            TypeScript Documentation
          </a>
        </li>
        <li>
          <a
            href="https://opencv.org/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#007BFF", textDecoration: "none" }}
          >
            OpenCV Library
          </a>
        </li>
        <li>
          <a
            href="https://github.com/your-team/project-repo"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#007BFF", textDecoration: "none" }}
          >
            Project GitHub Repository
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Resources;
