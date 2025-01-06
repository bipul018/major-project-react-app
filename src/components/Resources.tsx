// src/components/Resources.tsx
import React from "react";
import { Box, Typography, List, ListItem, Link } from "@mui/material";

const Resources: React.FC = () => {
  return (
    <Box sx={{ padding: "2rem" }}>
      <Typography variant="h4" component="h2" gutterBottom id="resources">
        Resources
      </Typography>
      <Typography variant="body1" paragraph>
        Here are some resources and references related to our project:
      </Typography>
      <List>
        <ListItem>
          <Link
            href="https://reactjs.org/"
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
          >
            React Documentation
          </Link>
        </ListItem>
        <ListItem>
          <Link
            href="https://www.typescriptlang.org/"
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
          >
            TypeScript Documentation
          </Link>
        </ListItem>
        <ListItem>
          <Link
            href="https://opencv.org/"
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
          >
            OpenCV Library
          </Link>
        </ListItem>
        <ListItem>
          <Link
            href="https://github.com/your-team/project-repo"
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
          >
            Project GitHub Repository
          </Link>
        </ListItem>
      </List>
    </Box>
  );
};

export default Resources;
