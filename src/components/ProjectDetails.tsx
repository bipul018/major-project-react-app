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
	  Yoga has been recognized for its profound impact on the physical and mental well-being
of individuals, promoting a harmonious balance between the body, mind, and soul. Yoga’s
ability to alleviate stress, enhance flexibility, and build muscle strength are just a few benefits
that have contributed to its widespread adoption.
        </Typography>
        <Typography variant="body1" paragraph>	
Our proposed project aims to harness the power of artificial intelligence to develop an
innovative AI yoga trainer. This AI-driven system is designed to check the user’s position,
assess their posture, and provide feedback, ensuring that practitioners perform yoga poses
correctly and effectively. By offering guidance, our AI yoga trainer seeks to optimize yoga
practice, helping users achieve better alignment, prevent injuries, and experience the full
range of benefits that yoga offers.


        </Typography>
      </Box>

      <Box sx={{ marginBottom: "2rem" }}>
        <Typography variant="h5" component="h3" gutterBottom>
          Key Objectives
        </Typography>
        <List>
	  
          <ListItem>
            <Typography variant="body1">
	      To develop a system that can capture video of user performing yoga poses and by extracting the key points track the user's body movements.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="body1">
	      To train a deep learning model to classify various yoga poses and detect errors in the user's performance.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="body1">
	      To create a user-friendly interface that makes the application accessible to all. 
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
              Backend: Python (fastapi)
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="body1">
              ML and CV Frameworks/Libraries : OpenCV, Tensorflow, Pytorch
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="body1">
              Other Tools: Google Colab, Docker, GitHub for version control
            </Typography>
          </ListItem>
        </List>
      </Box>

      <Box>
        <Typography variant="h5" component="h3" gutterBottom>
          Expected Outcomes
        </Typography>
        <Typography variant="body1" paragraph>
	  
          By the end of this project, we aim to deliver a real-time feedback on yoga poses along with scalable AI solution with a comprehensive pose library. The results will be documented and shared via this platform.
        </Typography>
      </Box>
    </Box>
  );
};

export default ProjectDetails;
