// src/components/Footer.tsx
import React from "react";
import { Box, Container, Typography } from "@mui/material";

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#f1f1f1",
        py: 3, // Padding on the y-axis
        mt: 4, // Margin top
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="textSecondary" align="center">
          &copy; {new Date().getFullYear()} Project Status Website.
        </Typography>
        <Typography variant="body2" color="textSecondary" align="center">
          Made by students in Pulchowk Campus as part of final year project. Supervised by Project Supervisors and Coordinators.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
