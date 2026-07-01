import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';

const TRAINERS = [
  { name: 'Marcus Aurelius', specialization: 'Strength & Conditioning', clientCount: 22, load: 'Optimal', availability: 'Mon - Fri (AM/PM)' },
  { name: 'Serena Vance', specialization: 'Cardiovascular Athletics', clientCount: 15, load: 'Optimal', availability: 'Tue - Sat (AM/PM)' },
  { name: 'Helena Rostov', specialization: 'Postural Rehabilitation', clientCount: 28, load: 'High', availability: 'Mon - Thu (AM/PM)' },
  { name: 'Kaelen Thorne', specialization: 'Calisthenics & Mobility', clientCount: 8, load: 'Low', availability: 'Wed - Sun (PM)' },
];

export const TrainersList: React.FC = () => {
  return (
    <Box>
      <Box sx={{ mb: 5 }}>
        <Typography
          variant="h3"
          sx={{
            fontFamily: "'Suisse Intl', 'Manrope', sans-serif",
            fontWeight: 900,
            color: '#1a1a1a',
            letterSpacing: '-1.5px',
            textTransform: 'uppercase'
          }}
        >
          Trainer Registry
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Overview of training staff specialists, availability windows, and member allocations.
        </Typography>
      </Box>

      {/* Registry Table */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e6e6e6', borderRadius: '8px', backgroundColor: '#ffffff' }}>
        <Table aria-label="trainers registry table">
          <TableHead sx={{ backgroundColor: '#f2f2f2' }}>
            <TableRow sx={{ borderBottom: '1px solid #e6e6e6' }}>
              <TableCell sx={{ fontWeight: 700, color: '#1a1a1a' }}>Trainer Name</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1a1a1a' }}>Core Specialization</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: '#1a1a1a' }}>Client Load</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: '#1a1a1a' }}>Load Indicator</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1a1a1a' }}>Active Availability</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {TRAINERS.map((trainer) => (
              <TableRow
                key={trainer.name}
                sx={{
                  borderBottom: '1px solid #e6e6e6',
                  '&:hover': { backgroundColor: '#f2f2f2' }
                }}
              >
                <TableCell component="th" scope="row" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                  {trainer.name}
                </TableCell>
                <TableCell sx={{ color: '#757575' }}>{trainer.specialization}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                  {trainer.clientCount} members
                </TableCell>
                <TableCell align="right">
                  <Chip
                    label={trainer.load}
                    size="small"
                    sx={{
                      backgroundColor: trainer.load === 'High' ? '#fdf313' : trainer.load === 'Optimal' ? '#1a1a1a' : '#f2f2f2',
                      color: trainer.load === 'High' ? '#1a1a1a' : trainer.load === 'Optimal' ? '#ffffff' : '#1a1a1a',
                      fontWeight: 700,
                      borderRadius: '4px',
                      fontFamily: "'Manrope', sans-serif",
                      fontSize: '11px'
                    }}
                  />
                </TableCell>
                <TableCell sx={{ color: '#757575' }}>{trainer.availability}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
