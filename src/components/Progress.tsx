// src/components/Progress.tsx
import React from "react";

interface Milestone {
  title: string;
  description: string;
  status: "Completed" | "In Progress" | "Pending";
  date: string;
}

const milestones: Milestone[] = [
  {
    title: "Project Proposal",
    description: "Submitted and approved by the supervisors.",
    status: "Completed",
    date: "2024-09-01",
  },
  {
    title: "Mid-Progress Defence",
    description: "Presented the project's current progress to the panel.",
    status: "Completed",
    date: "2024-12-01",
  },
  {
    title: "Frontend Development",
    description: "Building the React frontend with TypeScript.",
    status: "In Progress",
    date: "2025-01-15 (expected)",
  },
  {
    title: "Backend Development",
    description: "Integrating computer vision algorithms and APIs.",
    status: "Pending",
    date: "2025-02-15 (expected)",
  },
  {
    title: "Final Submission",
    description: "Submission of the complete project.",
    status: "Pending",
    date: "2025-05-01 (expected)",
  },
];

const Progress: React.FC = () => {
  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h2 id="progress">Project Progress</h2>
      <p>
        Here is an overview of the project milestones, their descriptions, and
        their current status:
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {milestones.map((milestone, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "1rem",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3>{milestone.title}</h3>
            <p>
              <strong>Description:</strong> {milestone.description}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                style={{
                  color:
                    milestone.status === "Completed"
                      ? "green"
                      : milestone.status === "In Progress"
                      ? "orange"
                      : "red",
                }}
              >
                {milestone.status}
              </span>
            </p>
            <p>
              <strong>Date:</strong> {milestone.date}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Progress;
