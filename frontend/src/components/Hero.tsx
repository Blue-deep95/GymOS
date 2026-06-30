import { Box, Typography, Button, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router';

export const Hero = () => {
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
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
          zIndex: 2,
        }}
      />

      {/* Content Container */}
      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 3,
          px: { xs: 2, md: 4 },
        }}
      >
        <Box sx={{ maxWidth: '900px' }}>
          <Typography
            variant="h1"
            sx={{
              textTransform: 'uppercase',
              mb: 3,
              fontWeight: 800,
              color: '#ffffff', // Pure White for inverse layout
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            A temple for strength.
            <br />
            No clutter. Just movement.
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: '#e6e6e6', // Hairline color for high contrast secondary text
              fontSize: { xs: '18px', md: '20px' },
              lineHeight: 1.6,
              mb: 5,
              maxWidth: '680px',
              textShadow: '0 1px 2px rgba(0,0,0,0.1)',
            }}
          >
            Welcome to gymOS, a state-of-the-art physical laboratory engineered for performance. We provide serious athletes and fitness pursuers with premium equipment, custom coaching scripts, and digital metric tracking. Zero hype. 100% execution.
          </Typography>

          {/* Overlay CTA Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
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
              Contact Sales
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
