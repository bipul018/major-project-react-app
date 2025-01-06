// src/components/Progress.tsx
import React from "react";
import { Box, Typography, Card, CardContent, Chip } from "@mui/material";

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
    <Box sx={{ padding: "2rem" }}>
      <Typography variant="h4" component="h2" gutterBottom id="progress">
        Project Progress
      </Typography>
      <Typography variant="body1" paragraph>
        Here is an overview of the project milestones, their descriptions, and their current status:
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {milestones.map((milestone, index) => (
          <Card key={index} sx={{ borderRadius: "8px", boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                {milestone.title}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Description:</strong> {milestone.description}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Status:</strong>{" "}
                <Chip
                  label={milestone.status}
                  color={
                    milestone.status === "Completed"
                      ? "success"
                      : milestone.status === "In Progress"
                      ? "warning"
                      : "error"
                  }
                  size="small"
                />
              </Typography>
              <Typography variant="body1">
                <strong>Date:</strong> {milestone.date}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Progress;
