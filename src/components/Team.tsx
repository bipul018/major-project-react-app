// src/components/Team.tsx
import React from "react";

interface TeamMember {
  name: string;
  role: string;
  responsibilities: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Alice Johnson",
    role: "Frontend Developer",
    responsibilities: "Developing the React-based UI and ensuring responsiveness."
  },
  {
    name: "Bob Smith",
    role: "Backend Developer",
    responsibilities: "Designing the server-side logic and integrating APIs."
  },
  {
    name: "Charlie Brown",
    role: "Project Manager",
    responsibilities: "Overseeing project progress and coordinating tasks."
  },
];

const Team: React.FC = () => {
  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h2 id="team">Meet Our Team</h2>
      <p>Our project is driven by a dedicated team of three members, each bringing unique skills to the table:</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {teamMembers.map((member, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "1rem",
              width: "300px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3>{member.name}</h3>
            <p>
              <strong>Role:</strong> {member.role}
            </p>
            <p>
              <strong>Responsibilities:</strong> {member.responsibilities}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;
