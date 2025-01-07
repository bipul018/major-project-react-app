// src/components/Team.tsx
import React from "react";
import { Box, Typography, Grid, Card, CardContent } from "@mui/material";

interface TeamMember {
  name: string;
  role: string;
  responsibilities: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Aagab Bhattarai",
    roll: "PUL077BCT001",
    //role: "Frontend Developer",
    //responsibilities: "Developing the React-based UI and ensuring responsiveness.",
  },
  {
    name: "Aayusha Odari",
    roll: "PUL077BCT001",
    //role: "Backend Developer",
    //responsibilities: "Designing the server-side logic and integrating APIs.",
  },
  {
    name: "Bipul Neupane",
    roll: "PUL077BCT001",
    //role: "Project Manager",
    //responsibilities: "Overseeing project progress and coordinating tasks.",
  },
];

const Team: React.FC = () => {
  return (
    <Box sx={{ padding: "2rem" }}>
      <Typography variant="h4" component="h2" gutterBottom id="team">
        Meet Our Team
      </Typography>
      <Typography variant="body1" paragraph>
        Our project is driven by a dedicated team of three members, each bringing unique skills to the table:
      </Typography>
      <Grid container spacing={3}>
        {teamMembers.map((member, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  {member.name}
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>Roll Number:</strong> {member.roll}
                </Typography>
		{/*
                <Typography variant="body1" paragraph>
                  <strong>Role:</strong> {member.role}
                </Typography>
                <Typography variant="body1">
                  <strong>Responsibilities:</strong> {member.responsibilities}
              </Typography>
		  */}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Team;
