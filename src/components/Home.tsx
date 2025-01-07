// src/components/Home.tsx
import React from "react";
import { Box, Typography, List, ListItem, Link, Button } from "@mui/material";

const Home: React.FC = () => {
  return (
    <Box sx={{ padding: "2rem" }}>
      {/* Project Introduction */}
      <Box id="home" sx={{ marginBottom: "2rem" }}>
        <Typography variant="h4" component="h2" gutterBottom>
	  DL Based Automated Yoga Assistance Using CNN and LSTM
        </Typography>
        <Typography variant="body1" paragraph>
	  This project leverages AI and deep learning techniques to guide and improve yoga practice. Using advanced computer vision algorithms, it offers real-time posture feedback and suggestions for improvement.
        </Typography>
      </Box>

      {/* Supervisors and Coordinators */}
      <Box id="supervisors" sx={{ marginBottom: "2rem" }}>
        <Typography variant="h5" component="h3" gutterBottom>
          Supervisors {/*and Coordinators*/}
        </Typography>
        <List>
          <ListItem>
            <Typography variant="body1">
              <strong>Supervisor:</strong> Dr. Ganesh Gautam
            </Typography>
          </ListItem>
          {/*<ListItem>
            <Typography variant="body1">
              <strong>Coordinators:</strong> 
            </Typography>
          </ListItem>*/}
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
              href="https://github.com/bipul018/a-pythonic-web-server"
              target="_blank"
              rel="noopener noreferrer"
              color="primary"
            >
              GitHub Repository to the Backend
            </Link>
          </ListItem>
          <ListItem>
            <Link
              href="https://github.com/bipul018/major-project-react-app"
              target="_blank"
              rel="noopener noreferrer"
              color="primary"
            >
              GitHub Repository to the Frontend
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
