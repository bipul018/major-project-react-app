// src/components/Home.tsx
import { Box, Typography, List, ListItem, Link, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import Progress from "./Progress";
import Contact from "./Contact";
import ProjectDetails from "./ProjectDetails";
import Resources from "./Resources";
import Team from "./Team";

const Home = () => {
  return (
    <Box sx={{ padding: "2rem" }}>
      <ProjectDetails />

      {/* Progress Section with anchor */}
      <Box id="progress" component="section" sx={{ marginBottom: "2rem" }}>
        <Progress />
      </Box>

      {/* Quick Links */}
      <Box id="quick-links" sx={{ mt: 4 }}>
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
              component={RouterLink}
              to="/demo"
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
	  {
            //<ListItem>
            //  {/*<Link href="#progress" color="primary">*/}
	    //  <Link to="#progress" color="primary">
	    //    View Project Progress
	    //  </Link>
            //</ListItem>
	    //<ListItem>
	    //  {/*<Link href="#contact" color="primary">*/}
	    //  <Link to="#contact" color="primary">
	    //    Contact Us
	    //  </Link>
	    //</ListItem>
	  }
        </List>
      </Box>
      <Resources />
      <Team />

      {/* Contact Section with anchor */}
      <Box id="contact" component="section">
        <Contact />
      </Box>


    </Box>
  );
};

export default Home;
