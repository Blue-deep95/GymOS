import React from 'react';
import { Box, Typography, Container } from '@mui/material';

export const About: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 10 }}>
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
          About gymOS
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Typography variant="body1" sx={{ color: '#1a1a1a', lineHeight: 1.8 }}>
          GymOS is a premium strength laboratory operating system designed to bridge the operational gap between facility owners, front check-in desks, athletic performance trainers, and members.
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
          Built with an emphasis on high-fidelity visual aesthetics and performance engineering, GymOS facilitates member roster tracking, real-time check-in desk logs, and customized routine prescription versioning.
        </Typography>
      </Box>
    </Container>
  );
};
