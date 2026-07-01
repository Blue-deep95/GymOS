import React, { useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, TextField, InputAdornment } from '@mui/material';

// Mock members data
const INITIAL_MEMBERS = [
  { id: '1', fullName: 'Dorian Yates', email: 'dorian@shadow.com', phone: '555-0101', status: 'Active', trainer: 'Marcus Aurelius', goals: 'Hypertrophy & Power' },
  { id: '2', fullName: 'Lenda Murray', email: 'lenda@msolympia.com', phone: '555-0102', status: 'Active', trainer: 'Helena Rostov', goals: 'Championship Conditioning' },
  { id: '3', fullName: 'Frank Zane', email: 'frank@aesthetic.com', phone: '555-0103', status: 'Frozen', trainer: 'Kaelen Thorne', goals: 'Symmetry & Mobility' },
  { id: '4', fullName: 'Arnold S.', email: 'arnold@gold.com', phone: '555-0104', status: 'Expired', trainer: 'Marcus Aurelius', goals: 'Volume Training' },
  { id: '5', fullName: 'Franco Columbu', email: 'franco@power.com', phone: '555-0105', status: 'Inactive', trainer: 'None', goals: 'Powerlifting Base' },
  { id: '6', fullName: 'Cory Everson', email: 'cory@conditioning.com', phone: '555-0106', status: 'Active', trainer: 'Serena Vance', goals: 'Cardiovascular Athletics' },
];

export const MembersList: React.FC = () => {
  const [search, setSearch] = useState('');

  const filteredMembers = INITIAL_MEMBERS.filter(member => 
    member.fullName.toLowerCase().includes(search.toLowerCase()) ||
    member.email.toLowerCase().includes(search.toLowerCase()) ||
    member.trainer.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return { bg: '#1a1a1a', text: '#ffffff' }; // High-contrast dark active status
      case 'Frozen':
        return { bg: '#f2ede9', text: '#1a1a1a' }; // Warm neutral cream stone
      case 'Expired':
        return { bg: '#fdf313', text: '#1a1a1a' }; // Electric yellow highlight warning
      default:
        return { bg: '#f2f2f2', text: '#949494' }; // Muted grey
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box>
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
            Member Directory
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Search and manage member accounts, subscription states, and trainer assignments.
          </Typography>
        </Box>
      </Box>

      {/* Filter Toolbar */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
        <TextField
          placeholder="Filter by name, email, or trainer..."
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            width: '320px',
            backgroundColor: '#ffffff',
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              borderColor: '#e6e6e6',
              '&:hover fieldset': { borderColor: '#1a1a1a' },
              '&.Mui-focused fieldset': { borderColor: '#1a1a1a', borderWidth: '1px' }
            }
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>/</Typography>
                </InputAdornment>
              ),
            }
          }}
        />
      </Box>

      {/* Directory Table */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e6e6e6', borderRadius: '8px', backgroundColor: '#ffffff' }}>
        <Table aria-label="members directory table">
          <TableHead sx={{ backgroundColor: '#f2f2f2' }}>
            <TableRow sx={{ borderBottom: '1px solid #e6e6e6' }}>
              <TableCell sx={{ fontWeight: 700, color: '#1a1a1a' }}>Full Name</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1a1a1a' }}>Email Address</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1a1a1a' }}>Phone Number</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1a1a1a' }}>Subscription</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1a1a1a' }}>Assigned Coach</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1a1a1a' }}>Primary Focus</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMembers.map((member) => {
              const statusColors = getStatusColor(member.status);
              return (
                <TableRow
                  key={member.id}
                  sx={{
                    borderBottom: '1px solid #e6e6e6',
                    '&:hover': { backgroundColor: '#f2f2f2' }
                  }}
                >
                  <TableCell component="th" scope="row" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                    {member.fullName}
                  </TableCell>
                  <TableCell sx={{ color: '#757575' }}>{member.email}</TableCell>
                  <TableCell sx={{ color: '#757575' }}>{member.phone}</TableCell>
                  <TableCell>
                    <Chip
                      label={member.status}
                      size="small"
                      sx={{
                        backgroundColor: statusColors.bg,
                        color: statusColors.text,
                        fontWeight: 700,
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontFamily: "'Manrope', sans-serif"
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#1a1a1a' }}>{member.trainer}</TableCell>
                  <TableCell sx={{ color: '#757575' }}>{member.goals}</TableCell>
                </TableRow>
              );
            })}
            {filteredMembers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6, color: '#949494' }}>
                  No members match the query parameters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
