import React from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Plans: React.FC = () => {
  const navigate = useNavigate();
  const { token, role } = useAuth();
  const { showToast } = useToast();

  const packages = [
    {
      name: '1 Month Membership',
      price: '₹1,500',
      duration: '1 Month',
      desc: 'Full access to training floors, locker amenities, and athlete progress logs for 30 days.',
      popular: false
    },
    {
      name: '3 Months Membership',
      price: '₹3,500',
      duration: '3 Months',
      desc: 'Discounted 90-day package including coach pairing and custom routine builders.',
      popular: true // Highlight this package with Electric Yellow
    },
    {
      name: '6 Months Membership',
      price: '₹6,500',
      duration: '6 Months',
      desc: 'Our best-value 180-day package with unrestricted program tracking and metrics updates.',
      popular: false
    }
  ];

  const handleAcquire = (plan: any) => {
    if (!token) {
      showToast('Please sign in to acquire a membership plan.', 'info');
      navigate('/signin');
      return;
    }

    if (role !== 'member' && role !== 'user') {
      showToast('Staff profiles cannot acquire membership contracts directly.', 'warning');
      return;
    }

    navigate(`/member/confirm-purchase?planType=${encodeURIComponent(plan.duration)}&price=${encodeURIComponent(plan.price)}`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 10 }}>
      {/* Editorial Header */}
      <Box sx={{ mb: 8, textAlign: 'left', maxWidth: '800px' }}>
        <Typography
          variant="h3"
          sx={{
            fontFamily: "'Suisse Intl', 'Manrope', sans-serif",
            fontWeight: 900,
            color: '#1a1a1a',
            letterSpacing: '-1.5px',
            textTransform: 'uppercase',
            fontSize: { xs: '36px', md: '55px' },
            lineHeight: 1.10
          }}
        >
          Membership Packages
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 3, fontSize: '18px', maxWidth: '600px', lineHeight: 1.4 }}>
          Select a strength laboratory duration option that fits your training volume and performance objectives.
        </Typography>
      </Box>


      <Grid container spacing={4}>
        {packages.map((pkg) => (
          <Grid size={{ xs: 12, md: 4 }} key={pkg.name}>
            <Card
              elevation={0}
              sx={{
                border: pkg.popular ? '2px solid #1a1a1a' : '1px solid #e6e6e6',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: '#1a1a1a',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              {/* Electric Yellow top accent bar for the featured plan */}
              {pkg.popular && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '6px',
                    backgroundColor: '#fdf313'
                  }}
                />
              )}

              <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%', pt: pkg.popular ? 5 : 4 }}>
                {pkg.popular && (
                  <ChipLabel />
                )}
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#1a1a1a', mb: 1, fontFamily: "'Manrope', sans-serif" }}>
                  {pkg.name}
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 900, color: '#1a1a1a', mb: 2, fontFamily: "'Manrope', sans-serif", fontSize: '42px', letterSpacing: '-1px' }}>
                  {pkg.price}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 5, flexGrow: 1, fontSize: '14px', lineHeight: 1.5 }}>
                  {pkg.desc}
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleAcquire(pkg)}
                  sx={{
                    py: 1.8,
                    backgroundColor: pkg.popular ? '#fdf313' : '#1a1a1a',
                    color: pkg.popular ? '#1a1a1a' : '#ffffff',
                    fontWeight: 800,
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontFamily: "'Manrope', sans-serif",
                    border: pkg.popular ? 'none' : '1px solid #1a1a1a',
                    '&:hover': {
                      backgroundColor: pkg.popular ? '#e5dc10' : '#000000',
                      color: pkg.popular ? '#1a1a1a' : '#ffffff'
                    }
                  }}
                >
                  Acquire Membership
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Editorial Image Block */}
      <Box sx={{ mt: 10, mb: 5, height: '450px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e6e6e6' }}>
        <img
          src="/strength_lab_space.jpg"
          alt="GymOS Strength Lab Facility"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ mt: 15, borderTop: '1px solid #e6e6e6', pt: 8 }}>
        <Typography
          variant="h4"
          sx={{
            fontFamily: "'Suisse Intl', 'Manrope', sans-serif",
            fontWeight: 900,
            color: '#1a1a1a',
            letterSpacing: '-1.5px',
            textTransform: 'uppercase',
            mb: 6
          }}
        >
          Athletes Feedback
        </Typography>
        <Grid container spacing={4}>
          {[
            {
              author: 'Dorian Y.',
              role: 'Powerlifter',
              quote: 'The tracking interface is completely clean. No bloat, just pure weight progression logging that keeps my training focused.'
            },
            {
              author: 'Lenda M.',
              role: 'Bodybuilder',
              quote: 'Having my coach prescribe my workout blueprints directly to my phone is a game changer. The interface is stunning and responsive.'
            },
            {
              author: 'Frank Z.',
              role: 'Aesthetic Specialist',
              quote: 'The visual clarity of check-ins and performance logging makes it easy to monitor metrics without feeling overwhelmed.'
            }
          ].map((item, idx) => (
            <Grid size={{ xs: 12, md: 4 }} key={idx}>
              <Card elevation={0} sx={{ backgroundColor: '#f2f2f2', borderRadius: '8px', border: 'none', height: '100%' }}>
                <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <Typography variant="body1" sx={{ color: '#1a1a1a', fontStyle: 'italic', mb: 3, flexGrow: 1, lineHeight: 1.6 }}>
                    "{item.quote}"
                  </Typography>
                  <Box sx={{ borderLeft: '3px solid #fdf313', pl: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1a1a1a' }}>
                      {item.author}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.role}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

// Helper component for Popular badge chip in Electric Yellow
const ChipLabel: React.FC = () => (
  <Box
    sx={{
      display: 'inline-block',
      alignSelf: 'flex-start',
      backgroundColor: '#fdf313',
      color: '#1a1a1a',
      fontSize: '11px',
      fontWeight: 900,
      px: 1.5,
      py: 0.5,
      borderRadius: '4px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      mb: 2
    }}
  >
    Recommended
  </Box>
);

export default Plans;
