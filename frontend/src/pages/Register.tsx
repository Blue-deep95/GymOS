import { useState } from 'react';
import { Box, Typography, TextField, Button, Container, Grid, Link as MuiLink } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useMutation } from '../hooks/useApi';

export const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [fitnessGoals, setFitnessGoals] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');

  const navigate = useNavigate();
  const { setAuthData } = useAuth();
  const { execute: register, loading, error } = useMutation('/api/auth/register', 'POST');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await register({
        fullName,
        email,
        password,
        phone,
        emergencyContact,
        fitnessGoals,
        medicalNotes,
      });
      if (response && response.accessToken) {
        setAuthData(response.accessToken, response.user.role);
        navigate('/');
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
          size={{ xs: 0, md: 5 }}
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

        {/* Right Side: Form Content (Spaced for multiple fields) */}
        <Grid
          size={{ xs: 12, md: 7 }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: { xs: 3, md: 8 },
            py: 6,
          }}
        >
          <Container maxWidth="sm" sx={{ px: 0 }}>
            {/* Header / Logo for mobile view */}
            <Box sx={{ mb: 4 }}>
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
                Register
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '15px' }}>
                Join the Strength Lab. Fill in your details to create an account.
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
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* Account Details */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Full Name"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Email Address"
                    type="email"
                    fullWidth
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Phone Number"
                    type="tel"
                    fullWidth
                    variant="outlined"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </Grid>

                {/* Gym Profiles */}
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Emergency Contact Info"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    placeholder="Name, relationship, and phone number"
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Fitness & Strength Goals"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={fitnessGoals}
                    onChange={(e) => setFitnessGoals(e.target.value)}
                    placeholder="e.g. increase deadlift max, improve metabolic conditioning"
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Medical Clearances & Notes (Optional)"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={medicalNotes}
                    onChange={(e) => setMedicalNotes(e.target.value)}
                    placeholder="List any injuries, cardiac warnings, or training constraints"
                    multiline
                    rows={2}
                  />
                </Grid>
              </Grid>

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
                  backgroundColor: '#1a1a1a', // Dark graphite style
                  color: '#ffffff',
                  '&:hover': {
                    backgroundColor: '#000000',
                  },
                  mb: 4,
                }}
              >
                {loading ? 'Registering...' : 'Submit Registration'}
              </Button>

              {/* Footer Links */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5 }}>
                <MuiLink
                  component={RouterLink}
                  to="/signin"
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
                  Already have an account? Sign In →
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
