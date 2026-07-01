import React from 'react';
import { Box, Typography, Container, TextField, Button } from '@mui/material';

export const Contact: React.FC = () => {
  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <Box sx={{ textTransform: 'uppercase', mb: 6 }}>
        <Typography
          variant="h3"
          sx={{
            fontFamily: "'Suisse Intl', 'Manrope', sans-serif",
            fontWeight: 900,
            color: '#1a1a1a',
            letterSpacing: '-1.5px'
          }}
        >
          Contact Strength Lab
        </Typography>
      </Box>

      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField label="Full Name" required fullWidth />
        <TextField label="Email Address" required type="email" fullWidth />
        <TextField label="Message Inquiry" required multiline rows={4} fullWidth />
        <Button
          variant="contained"
          sx={{
            py: 1.5,
            backgroundColor: '#1a1a1a',
            color: '#ffffff',
            fontWeight: 700,
            textTransform: 'none',
            borderRadius: '6px',
            '&:hover': { backgroundColor: '#000000' }
          }}
        >
          Dispatch Message
        </Button>
      </Box>
    </Container>
  );
};
