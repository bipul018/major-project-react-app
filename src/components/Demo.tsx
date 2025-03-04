import React from "react";
import { MainDemoController } from '../main_demo/MainDemoController';
import { Box, Typography, Container } from "@mui/material";

const Demo: React.FC = () => {
  return (
    <Box id="demo" sx={{ padding: "2rem", width: '100%' }} >
      {/* Set maxWidth to false for full-width layout */}
      <Container maxWidth={false}>
        <Typography variant="h4" component="h2" gutterBottom>
          Demo
        </Typography>
        <Typography variant="body1" paragraph>
          Here is a live demo of our project. You can interact with the form, see results, and more.
        </Typography>
        {/* Your demo content (dropdown, form fields, etc.) */}
        <MainDemoController/>
      </Container>
    </Box>
  );
};

export default Demo;
