// src/components/Layout.tsx
import { Box, Container } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%'}}>
      <Header />
      <Container component="main" maxWidth={false} sx={{ flex: 1, py: 4, width: '100%' }}>
        {/* Outlet is where child routes (e.g., Home, Demo) will be rendered */}
        <Outlet />
      </Container>
      <Footer />
    </Box>
  );
}
