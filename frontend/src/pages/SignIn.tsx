import { useState } from 'react';
import { Box, Typography, TextField, Button, Container, Grid, Link as MuiLink } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useMutation } from '../hooks/useApi';

export const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setAuthData } = useAuth();
  const { execute: login, loading, error } = useMutation('/api/auth/login', 'POST');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login({ email, password });
      if (response && response.accessToken) {
        setAuthData(response.accessToken, response.user.role);
        if (response.user.role === 'owner') {
          navigate('/owner/dashboard');
        } else if (response.user.role === 'trainer') {
          navigate('/trainer/dashboard');
        } else if (response.user.role === 'receptionist') {
          navigate('/receptionist/dashboard');
        } else if (response.user.role === 'user' || response.user.role === 'member') {
          navigate('/member/dashboard');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      // Error handled by useMutation hook
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        backgroundColor: '#ffffff',
      }}
    >
      <Grid container>
        {/* Left Side: Editorial Branding / Image (Hidden on Mobile) */}
        <Grid
          size={{ xs: 0, md: 6 }}
          sx={{
            display: { xs: 'none', md: 'block' },
            position: 'relative',
            backgroundColor: '#f2f2f2',
            borderRight: '1px solid #e6e6e6',
          }}
        >
          <Box
            component="img"
            src="/gym_hero_cinematic.jpg"
            alt="gymOS Strength Lab"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'grayscale(100%) brightness(50%) contrast(105%)',
            }}
          />
          {/* Custom Overlay Logotype */}
          <Box
            sx={{
              position: 'absolute',
              top: '40px',
              left: '40px',
              color: '#ffffff',
              zIndex: 3,
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 900,
                fontSize: '32px',
                letterSpacing: '-1.5px',
              }}
            >
              A/ gymOS
            </Typography>
          </Box>
        </Grid>

        {/* Right Side: Form Content */}
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: { xs: 3, md: 8 },
            py: 6,
          }}
        >
          <Container maxWidth="xs" sx={{ px: 0 }}>
            {/* Header / Logo for mobile view */}
            <Box sx={{ mb: 6 }}>
              <MuiLink
                component={RouterLink}
                to="/"
                sx={{
                  display: { xs: 'inline-flex', md: 'none' },
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 900,
                  fontSize: '28px',
                  color: '#000000',
                  letterSpacing: '-1.5px',
                  mb: 4,
                  textDecoration: 'none',
                }}
              >
                A/ gymOS
              </MuiLink>
              
              <Typography
                variant="h2"
                sx={{
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  fontSize: '32px',
                  letterSpacing: '-0.02em',
                  mb: 1.5,
                }}
              >
                Sign In
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '15px' }}>
                Enter your credentials to access the member portal.
              </Typography>
            </Box>

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit} noValidate>
              {error && (
                <Box sx={{ mb: 3 }}>
                  <Typography color="error" variant="body2" sx={{ fontWeight: 600 }}>
                    {error}
                  </Typography>
                </Box>
              )}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
                <TextField
                  label="Email Address"
                  type="email"
                  fullWidth
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  slotProps={{
                    inputLabel: {
                      style: { fontFamily: "'Inter', sans-serif", fontSize: '14px' },
                    },
                  }}
                />
                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  slotProps={{
                    inputLabel: {
                      style: { fontFamily: "'Inter', sans-serif", fontSize: '14px' },
                    },
                  }}
                />
              </Box>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  py: 2,
                  fontSize: '16px',
                  fontWeight: 600,
                  backgroundColor: '#1a1a1a', // Dark graphite primary button style for forms
                  color: '#ffffff',
                  '&:hover': {
                    backgroundColor: '#000000',
                  },
                  mb: 4,
                }}
              >
                {loading ? 'Signing In...' : 'Sign In to Portal'}
              </Button>

              {/* Footer Links */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5 }}>
                <MuiLink
                  component={RouterLink}
                  to="/register"
                  sx={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '14px',
                    color: 'text.primary',
                    textDecoration: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      color: 'text.secondary',
                    },
                  }}
                >
                  Create an account →
                </MuiLink>
                <MuiLink
                  component={RouterLink}
                  to="/"
                  sx={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '14px',
                    color: 'text.secondary',
                    textDecoration: 'none',
                    '&:hover': {
                      color: 'text.primary',
                    },
                  }}
                >
                  Back to home
                </MuiLink>
              </Box>
            </Box>
          </Container>
        </Grid>
      </Grid>
    </Box>
  );
};
