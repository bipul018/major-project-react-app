// src/components/ProjectDetails.tsx
import React from "react";
import { Box, Typography, List, ListItem } from "@mui/material";

const ProjectDetails: React.FC = () => {
  return (
    <Box sx={{ padding: "2rem" }}>
      <Typography variant="h4" component="h2" gutterBottom id="details">
        Project Details
      </Typography>

      <Box sx={{ marginBottom: "2rem" }}>
        <Typography variant="h5" component="h3" gutterBottom>
          Project Overview
        </Typography>
        <Typography variant="body1" paragraph>
          Our project leverages cutting-edge computer vision techniques to solve [specific problem]. It involves designing a frontend in React with TypeScript and integrating it with backend systems for seamless data processing.
        </Typography>
      </Box>

      <Box sx={{ marginBottom: "2rem" }}>
        <Typography variant="h5" component="h3" gutterBottom>
          Key Objectives
        </Typography>
        <List>
          <ListItem>
            <Typography variant="body1">
              Develop a scalable and user-friendly interface using React and TypeScript.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="body1">
              Implement robust computer vision algorithms for [specific task, e.g., object detection].
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="body1">
              Ensure real-time processing with high accuracy.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="body1">
              Test and deploy the system for practical use cases.
            </Typography>
          </ListItem>
        </List>
      </Box>

      <Box sx={{ marginBottom: "2rem" }}>
        <Typography variant="h5" component="h3" gutterBottom>
          Technologies Used
        </Typography>
        <List>
          <ListItem>
            <Typography variant="body1">
              Frontend: React, TypeScript, Node.js
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="body1">
              Backend: Python (Flask/Django), OpenCV, TensorFlow
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="body1">
              Other Tools: Docker, GitHub for version control
            </Typography>
          </ListItem>
        </List>
      </Box>

      <Box>
        <Typography variant="h5" component="h3" gutterBottom>
          Expected Outcomes
        </Typography>
        <Typography variant="body1" paragraph>
          By the end of this project, we aim to deliver a functional prototype that demonstrates [specific feature, e.g., real-time object detection and tracking]. The results will be documented and shared via this platform.
        </Typography>
      </Box>
    </Box>
  );
};

export default ProjectDetails;
