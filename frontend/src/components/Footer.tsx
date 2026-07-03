import { Box, Container, Grid, Typography, Link, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router';

export const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#f2f2f2', // Fog Surface
        color: '#1a1a1a',
        pt: 12,
        pb: 18, // Generous breathing space (128px+)
        borderTop: '1px solid #e6e6e6',
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, md: 4 } }}>
        <Grid container spacing={6}>
          {/* Logo & Manifesto Column */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography
              sx={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 900,
                fontSize: '28px',
                color: '#000000',
                letterSpacing: '-1.5px',
                mb: 2,
              }}
            >
              S/
            </Typography>
            <Typography
              variant="body2"
              sx={{
                lineHeight: 1.6,
                color: 'text.secondary',
                maxWidth: '280px',
              }}
            >
              A temple for strength. A community of movement. Zero commercial noise. gymOS is the premier strength training laboratory.
            </Typography>
          </Grid>

          {/* Spaces links */}
          <Grid size={{ xs: 6, md: 3 }}>
            <Typography
              sx={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 700,
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#1a1a1a',
                mb: 3,
              }}
            >
              The Labs
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {['Strength Sanctuary', 'Conditioning Arena', 'Coaching Bureau', 'Recovery Compound'].map((item) => (
                <Link
                  key={item}
                  href="#"
                  sx={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '15px',
                    color: 'text.secondary',
                    textDecoration: 'none',
                    '&:hover': {
                      color: 'text.primary',
                    },
                  }}
                >
                  {item}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Membership links */}
          <Grid size={{ xs: 6, md: 3 }}>
            <Typography
              sx={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 700,
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#1a1a1a',
                mb: 3,
              }}
            >
              Membership
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {['Pricing Plans', 'Coaching Schemes', 'Facility Rules', 'Guest Pass Request'].map((item) => (
                <Link
                  key={item}
                  href="#"
                  sx={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '15px',
                    color: 'text.secondary',
                    textDecoration: 'none',
                    '&:hover': {
                      color: 'text.primary',
                    },
                  }}
                >
                  {item}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Action Column */}
          <Grid size={{ xs: 12, md: 2 }}>
            <Typography
              sx={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 700,
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#1a1a1a',
                mb: 3,
              }}
            >
              Portal
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="outlined"
                fullWidth
                component={RouterLink}
                to="/signin"
                sx={{
                  py: 1.25,
                  fontSize: '14px',
                  borderColor: '#1a1a1a',
                  color: '#1a1a1a',
                }}
              >
                Sign In
              </Button>
              <Button
                variant="contained"
                fullWidth
                component={RouterLink}
                to="/register"
                sx={{
                  py: 1.25,
                  fontSize: '14px',
                  backgroundColor: '#ffffff',
                  color: '#1a1a1a',
                  '&:hover': {
                    backgroundColor: '#e6e6e6',
                  },
                }}
              >
                Register
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Bottom copyright */}
        <Box
          sx={{
            mt: 12,
            pt: 4,
            borderTop: '1px solid #e6e6e6',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontFamily: "'Inter', sans-serif",
              color: 'text.secondary',
              fontSize: '14px',
            }}
          >
            © {new Date().getFullYear()} gymOS Strength Lab. All rights reserved.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontFamily: "'Inter', sans-serif",
              color: 'text.secondary',
              fontSize: '14px',
              letterSpacing: '0.05em',
            }}
          >
            SINGLE-LOCATION PREMIUM TRAINING COMPOUND.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};
