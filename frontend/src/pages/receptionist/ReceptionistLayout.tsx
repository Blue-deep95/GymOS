import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router';
import { Box, Typography, Button, Container } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

export const ReceptionistLayout: React.FC = () => {
  const { token, role, setAuthData } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    setAuthData(null, null);
    navigate('/signin');
  };

  // If user is not authenticated, redirect to signin
  if (!token) {
    return (
      <Container maxWidth="sm" sx={{ mt: 10, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700 }}>
          Authentication Required
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          You must sign in as a receptionist to access this portal.
        </Typography>
        <Button
          variant="contained"
          component={Link}
          to="/signin"
          sx={{
            backgroundColor: '#1a1a1a',
            color: '#ffffff',
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': { backgroundColor: '#333333' }
          }}
        >
          Go to Sign In
        </Button>
      </Container>
    );
  }

  // Allow receptionist or owner
  if (role !== 'receptionist' && role !== 'owner') {
    return (
      <Container maxWidth="sm" sx={{ mt: 10, textAlign: 'center' }}>
        <Typography variant="h3" color="error" gutterBottom sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 900 }}>
          ACCESS DENIED
        </Typography>
        <Typography variant="h6" gutterBottom>
          Role '{role}' is not authorized.
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Only receptionists or owners are permitted to access the receptionist console.
        </Typography>
        <Button
          variant="outlined"
          component={Link}
          to="/"
          sx={{
            borderColor: '#1a1a1a',
            color: '#1a1a1a',
            textTransform: 'none',
            fontWeight: 600,
            mr: 2,
            '&:hover': { borderColor: '#333333', backgroundColor: '#f2f2f2' }
          }}
        >
          Return Home
        </Button>
        <Button
          variant="contained"
          onClick={handleLogout}
          sx={{
            backgroundColor: '#1a1a1a',
            color: '#ffffff',
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': { backgroundColor: '#333333' }
          }}
        >
          Sign In with Another Account
        </Button>
      </Container>
    );
  }

  const navItems = [
    { label: 'Overview', path: '/receptionist/dashboard' },
    { label: 'Members Directory', path: '/receptionist/members' },
    { label: 'Check-in Desk', path: '/receptionist/checkin' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#ffffff', py: 4 }}>
      <Container maxWidth="lg">
        {/* Top Header Row */}
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 900,
              fontSize: '24px',
              letterSpacing: '-1px',
              color: '#1a1a1a',
              lineHeight: 1.2
            }}
          >
            S/ gymOS
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 600 }}>
            Reception Operations Desk
          </Typography>
        </Box>

        {/* Horizontal Navigation Tabs */}
        <Box
          sx={{
            display: 'flex',
            borderBottom: '1px solid #e6e6e6',
            mb: 5,
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            gap: { xs: 3, sm: 5 },
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
              display: 'none'
            }
          }}
        >
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Box
                key={item.path}
                component={Link}
                to={item.path}
                sx={{
                  textDecoration: 'none',
                  color: isActive ? '#1a1a1a' : '#757575',
                  fontWeight: isActive ? 700 : 600,
                  fontSize: '15px',
                  fontFamily: "'Manrope', sans-serif",
                  pb: 1.5,
                  position: 'relative',
                  transition: 'color 0.2s ease',
                  borderBottom: isActive ? '3px solid #fdf313' : '3px solid transparent',
                  '&:hover': {
                    color: '#1a1a1a'
                  }
                }}
              >
                {item.label}
              </Box>
            );
          })}
        </Box>

        {/* Main Dashboard Sub-Page Content */}
        <Box sx={{ minHeight: '60vh' }}>
          <Outlet />
        </Box>
      </Container>
    </Box>
  );
};
