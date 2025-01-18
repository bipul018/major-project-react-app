// src/components/Demo.tsx
import React from "react";
//import {FormComponent} from '../main_demo/RequestMaker.tsx';
import {taskItems} from '../main_demo/taskItems.ts';
import {TaskListWithDropdown} from '../main_demo/ChooseTask.tsx';
//import {VideoComponent, VideoComponentRef} from '../main_demo/ChooseTask.tsx';
import { Box, Typography, Container } from "@mui/material";


const Demo: React.FC = () => {
  return (
    <Box id="demo" sx={{ padding: "2rem" }}>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h2" gutterBottom>
          Demo
        </Typography>
        <Typography variant="body1" paragraph>
          Here is a live demo of our project. You can interact with the form, see results, and more.
        </Typography>
        {/* Your demo content (dropdown, form fields, etc.) */}
        <TaskListWithDropdown taskItems={taskItems} />
      </Container>
    </Box>
  );
};

export default Demo;
