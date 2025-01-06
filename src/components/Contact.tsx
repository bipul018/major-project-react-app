// src/components/Contact.tsx
import React from "react";
import { Box, Typography, List, ListItem, Link } from "@mui/material";

const Contact: React.FC = () => {
  return (
    <Box sx={{ padding: "2rem" }}>
      <Typography variant="h4" component="h2" gutterBottom id="contact">
        Contact Us
      </Typography>
      <Typography variant="body1" paragraph>
        If you have any questions or would like to learn more about our project, feel free to reach out:
      </Typography>
      <List>
        <ListItem>
          <Typography variant="body1">
            <strong>Email:</strong> team.visionai@example.com
          </Typography>
        </ListItem>
        <ListItem>
          <Typography variant="body1">
            <strong>Phone:</strong> +123 456 7890
          </Typography>
        </ListItem>
        <ListItem>
          <Typography variant="body1">
            <strong>GitHub Issues:</strong>{" "}
            <Link
              href="https://github.com/your-team/project-repo/issues"
              target="_blank"
              rel="noopener noreferrer"
              color="primary"
            >
              Report an Issue
            </Link>
          </Typography>
        </ListItem>
      </List>
    </Box>
  );
};

export default Contact;
