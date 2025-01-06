// src/components/Contact.tsx
import React from "react";

const Contact: React.FC = () => {
  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h2 id="contact">Contact Us</h2>
      <p>If you have any questions or would like to learn more about our project, feel free to reach out:</p>
      <ul>
        <li>
          <strong>Email:</strong> team.visionai@example.com
        </li>
        <li>
          <strong>Phone:</strong> +123 456 7890
        </li>
        <li>
          <strong>GitHub Issues:</strong>{" "}
          <a
            href="https://github.com/your-team/project-repo/issues"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#007BFF", textDecoration: "none" }}
          >
            Report an Issue
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Contact;
