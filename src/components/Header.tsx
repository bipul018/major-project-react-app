
// src/components/Header.tsx
import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

const Header: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Project Status Website
        </Typography>
        <Box>
          <Button color="inherit" href="#home">
            Home
          </Button>
          <Button color="inherit" href="#details">
            Project Details
          </Button>
          <Button color="inherit" href="#team">
            Team
          </Button>
          <Button color="inherit" href="#progress">
            Progress
          </Button>
          <Button color="inherit" href="#resources">
            Resources
          </Button>
          <Button color="inherit" href="#contact">
            Contact
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
