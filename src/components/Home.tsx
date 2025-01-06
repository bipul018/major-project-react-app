// src/components/Home.tsx
import React from "react";

const Home: React.FC = () => {
  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      {/* Project Introduction */}
      <section id="home" style={{ marginBottom: "2rem" }}>
        <h2>Welcome to the Project Status Website</h2>
        <p>
          Our project focuses on leveraging cutting-edge computer vision
          techniques to solve real-world challenges. Hosted with a React-based frontend, 
          it highlights progress, technical details, and contributions from the team.
        </p>
      </section>

      {/* Supervisors and Coordinators */}
      <section id="supervisors" style={{ marginBottom: "2rem" }}>
        <h3>Supervisors and Coordinators</h3>
        <ul>
          <li>
            <strong>Supervisors:</strong> Dr. Jane Doe, Prof. John Smith
          </li>
          <li>
            <strong>Coordinators:</strong> Ms. Alice Green, Mr. Bob Brown
          </li>
        </ul>
      </section>

      {/* Quick Links */}
      <section id="quick-links">
        <h3>Quick Links</h3>
        <p>Access our project resources and updates:</p>
        <ul>
	  <li>
	  {/* Go to Demo button */}
	  <div style={{ marginTop: "2rem" }}>
  <a
    href="#demo"  // This will navigate to the demo section directly
    style={{
      display: "inline-block",
      padding: "10px 20px",
      backgroundColor: "#007BFF",
      color: "#fff",
      textDecoration: "none",
      borderRadius: "5px",
      fontSize: "16px",
    }}
  >
    Go to Demo
  </a>
</div>
	  </li>
          <li>
            <a
              href="https://github.com/your-team/project-repo"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#007BFF", textDecoration: "none" }}
            >
              GitHub Repository
            </a>
          </li>
          <li>
            <a
              href="#progress"
              style={{ color: "#007BFF", textDecoration: "none" }}
            >
              View Project Progress
            </a>
          </li>
          <li>
            <a
              href="#contact"
              style={{ color: "#007BFF", textDecoration: "none" }}
            >
              Contact Us
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default Home;
