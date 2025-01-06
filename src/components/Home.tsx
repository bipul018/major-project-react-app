// src/components/Home.tsx
import React from "react";
import { Box, Typography, List, ListItem, Link, Button } from "@mui/material";

const Home: React.FC = () => {
  return (
    <Box sx={{ padding: "2rem" }}>
      {/* Project Introduction */}
      <Box id="home" sx={{ marginBottom: "2rem" }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Welcome to the Project Status Website
        </Typography>
        <Typography variant="body1" paragraph>
          Our project focuses on leveraging cutting-edge computer vision techniques to solve real-world challenges. Hosted with a React-based frontend, it highlights progress, technical details, and contributions from the team.
        </Typography>
      </Box>

      {/* Supervisors and Coordinators */}
      <Box id="supervisors" sx={{ marginBottom: "2rem" }}>
        <Typography variant="h5" component="h3" gutterBottom>
          Supervisors and Coordinators
        </Typography>
        <List>
          <ListItem>
            <Typography variant="body1">
              <strong>Supervisors:</strong> Dr. Jane Doe, Prof. John Smith
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="body1">
              <strong>Coordinators:</strong> Ms. Alice Green, Mr. Bob Brown
            </Typography>
          </ListItem>
        </List>
      </Box>

      {/* Quick Links */}
      <Box id="quick-links">
        <Typography variant="h5" component="h3" gutterBottom>
          Quick Links
        </Typography>
        <Typography variant="body1" paragraph>
          Access our project resources and updates:
        </Typography>
        <List>
          <ListItem>
            <Button
              variant="contained"
              color="primary"
              href="#demo"
              sx={{ textTransform: "none" }}
            >
              Go to Demo
            </Button>
          </ListItem>
          <ListItem>
            <Link
              href="https://github.com/your-team/project-repo"
              target="_blank"
              rel="noopener noreferrer"
              color="primary"
            >
              GitHub Repository
            </Link>
          </ListItem>
          <ListItem>
            <Link href="#progress" color="primary">
              View Project Progress
            </Link>
          </ListItem>
          <ListItem>
            <Link href="#contact" color="primary">
              Contact Us
            </Link>
          </ListItem>
        </List>
      </Box>
    </Box>
  );
};

export default Home;
