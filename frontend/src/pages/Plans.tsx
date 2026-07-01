import React from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, Button } from '@mui/material';

export const Plans: React.FC = () => {
  const tiers = [
    { name: 'Standard Club', price: '$49/mo', desc: 'Full access to training floors and basic locker amenities.' },
    { name: 'Strength Lab', price: '$89/mo', desc: 'Includes custom workout templates, trainer matching, and check-in metrics.' },
    { name: 'Elite Performance', price: '$149/mo', desc: 'Uncapped 1-on-1 coach prescription, full locker logs, and custom plans.' }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 10 }}>
      <Box sx={{ textTransform: 'uppercase', mb: 8, textAlign: 'center' }}>
        <Typography
          variant="h3"
          sx={{
            fontFamily: "'Suisse Intl', 'Manrope', sans-serif",
            fontWeight: 900,
            color: '#1a1a1a',
            letterSpacing: '-1.5px'
          }}
        >
          Membership Tiers
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2, textTransform: 'none' }}>
          Select a package that fits your training volume and performance objectives.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {tiers.map((tier) => (
          <Grid size={{ xs: 12, md: 4 }} key={tier.name}>
            <Card elevation={0} sx={{ border: '1px solid #e6e6e6', borderRadius: '8px', backgroundColor: '#ffffff', height: '100%' }}>
              <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#1a1a1a', mb: 1 }}>
                  {tier.name}
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 900, color: '#1a1a1a', mb: 2 }}>
                  {tier.price}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4, flexGrow: 1 }}>
                  {tier.desc}
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    py: 1.5,
                    backgroundColor: '#1a1a1a',
                    color: '#ffffff',
                    fontWeight: 700,
                    borderRadius: '6px',
                    textTransform: 'none',
                    '&:hover': { backgroundColor: '#000000' }
                  }}
                >
                  Acquire Membership
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
