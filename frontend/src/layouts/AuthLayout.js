import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container, Paper, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';

function AuthLayout() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return null; // Will be redirected by ProtectedRoute
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            sx={{ mb: 4, fontWeight: 'bold' }}
          >
            ROKFAM HMS
          </Typography>
          <Outlet />
        </Paper>
      </Container>
    </Box>
  );
}

export default AuthLayout; 