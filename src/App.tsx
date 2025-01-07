//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import { ThemeProvider, createTheme, CssBaseline, Container, Box } from '@mui/material';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Customize your primary color
    },
    secondary: {
      main: '#dc004e', // Customize your secondary color
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif', // Use a custom font
  },
});

import Header from "./components/Header";
import Footer from "./components/Footer";
import Team from "./components/Team";
import Home from "./components/Home";
import ProjectDetails from "./components/ProjectDetails";
//import Resources from "./components/Resources";
//import Contact from "./components/Contact";
import Progress from "./components/Progress";
import Demo from "./components/Demo";

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Reset browser styles */}
      <Header />
      <Container component="main" maxWidth="lg">
        <Box sx={{ my: 4 }}> {/* Add spacing around the content */}
          <Home />
          <ProjectDetails />
          <Progress />
          <Team />
          {/*<Resources />*/}
          {/*<Contact />*/}
          <Demo />
        </Box>
      </Container>
      <Footer />
    </ThemeProvider>
  );
};

export default App;
