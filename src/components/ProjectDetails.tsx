// src/components/ProjectDetails.tsx
import React from "react";

const ProjectDetails: React.FC = () => {
  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h2 id="details">Project Details</h2>
      <section style={{ marginBottom: "2rem" }}>
        <h3>Project Overview</h3>
        <p>
          Our project leverages cutting-edge computer vision techniques to solve [specific problem]. 
          It involves designing a frontend in React with TypeScript and integrating it with backend 
          systems for seamless data processing.
        </p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h3>Key Objectives</h3>
        <ul>
          <li>Develop a scalable and user-friendly interface using React and TypeScript.</li>
          <li>Implement robust computer vision algorithms for [specific task, e.g., object detection].</li>
          <li>Ensure real-time processing with high accuracy.</li>
          <li>Test and deploy the system for practical use cases.</li>
        </ul>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h3>Technologies Used</h3>
        <ul>
          <li>Frontend: React, TypeScript, Node.js</li>
          <li>Backend: Python (Flask/Django), OpenCV, TensorFlow</li>
          <li>Other Tools: Docker, GitHub for version control</li>
        </ul>
      </section>

      <section>
        <h3>Expected Outcomes</h3>
        <p>
          By the end of this project, we aim to deliver a functional prototype that demonstrates
          [specific feature, e.g., real-time object detection and tracking]. The results will be documented 
          and shared via this platform.
        </p>
      </section>
    </div>
  );
};

export default ProjectDetails;
