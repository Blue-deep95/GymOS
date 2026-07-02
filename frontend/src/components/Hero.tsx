import { Box, Typography, Button, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router';
import { useAuth } from '../context/AuthContext';

export const Hero = () => {
  const { token, role } = useAuth();

  const getDashboardLink = () => {
    if (role === 'owner') return '/owner/dashboard';
    if (role === 'receptionist') return '/receptionist/dashboard';
    if (role === 'trainer') return '/trainer/dashboard';
    if (role === 'user' || role === 'member') return '/member/dashboard';
    return '/';
  };

  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: '90vh', md: '80vh', lg: '85vh' },
        minHeight: { xs: '550px', md: '700px' },
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        borderBottom: '1px solid #e6e6e6',
      }}
    >
      {/* Background Image with Cinematic Filter */}
      <Box
        component="img"
        src="/gym_hero_cinematic.jpg"
        alt="Modern Minimalist Gym Interior"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'grayscale(100%) brightness(50%) contrast(110%)',
          zIndex: 1,
        }}
      />

      {/* Dark Overlay for Text Legibility */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 2,
        }}
      />

      {/* Content Container */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 3 }}>
        <Box sx={{ maxWidth: '800px', textAlign: 'left' }}>
          {/* Editorial Display Text */}
          <Typography
            variant="h1"
            sx={{
              fontFamily: "'Suisse Intl', 'Manrope', sans-serif",
              fontWeight: 900,
              color: '#ffffff',
              fontSize: { xs: '42px', sm: '55px', md: '72px' },
              lineHeight: 1.05,
              letterSpacing: '-2px',
              textTransform: 'uppercase',
              mb: 3,
            }}
          >
            A temple for strength.
            <br />
            No clutter. Just movement.
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontFamily: "'Suisse Intl', 'Manrope', sans-serif",
              fontSize: { xs: '15px', md: '18px' },
              lineHeight: 1.4,
              color: '#f2f2f2',
              mb: 5,
              maxWidth: '680px',
              textShadow: '0 1px 2px rgba(0,0,0,0.1)',
            }}
          >
            Welcome to gymOS, a state-of-the-art physical laboratory engineered for performance. We provide serious athletes and fitness pursuers with premium equipment, custom coaching scripts, and digital metric tracking. Zero hype. 100% execution.
          </Typography>

          {/* Overlay CTA Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {token ? (
              <Button
                variant="contained"
                component={RouterLink}
                to={getDashboardLink()}
                sx={{
                  py: 2,
                  px: 5,
                  fontSize: '16px',
                  fontWeight: 700,
                  backgroundColor: '#fdf313', // Highlight dashboard with Electric Yellow
                  color: '#1a1a1a',
                  fontFamily: "'Manrope', sans-serif",
                  '&:hover': {
                    backgroundColor: '#e5dc10',
                  },
                }}
              >
                Control Lab
              </Button>
            ) : (
              <>
                <Button
                  variant="contained"
                  component={RouterLink}
                  to="/signin"
                  sx={{
                    py: 2,
                    px: 4,
                    fontSize: '16px',
                    fontWeight: 600,
                    backgroundColor: '#ffffff', // Inverse solid button
                    color: '#1a1a1a',
                    '&:hover': {
                      backgroundColor: '#f2f2f2',
                    },
                  }}
                >
                  Sign In
                </Button>
                <Button
                  variant="outlined"
                  component={RouterLink}
                  to="/register"
                  sx={{
                    py: 2,
                    px: 4,
                    fontSize: '16px',
                    fontWeight: 600,
                    borderColor: '#ffffff', // Inverse outlined button
                    color: '#ffffff',
                    '&:hover': {
                      borderColor: '#ffffff',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
