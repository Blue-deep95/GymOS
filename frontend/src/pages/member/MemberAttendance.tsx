import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Card, CardContent } from '@mui/material';
import { useFetch } from '../../hooks/useApi';

export const MemberAttendance: React.FC = () => {
  const { data, loading, error } = useFetch('/api/member/dashboard');

  if (loading) {
    return <Typography sx={{ p: 4, fontWeight: 600 }}>Loading attendance metrics...</Typography>;
  }

  if (error) {
    return <Typography color="error" sx={{ p: 4, fontWeight: 600 }}>{error}</Typography>;
  }

  const { attendance } = data || {};

  return (
    <Box>
      <Box sx={{ mb: 6 }}>
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
          My Attendance
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Historical records of your check-ins at the strength laboratory.
        </Typography>
      </Box>

      {attendance && attendance.length > 0 ? (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e6e6e6', borderRadius: '8px', overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f9f9f9' }}>
                <TableCell sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, color: '#1a1a1a', py: 2 }}>
                  Check-In Date
                </TableCell>
                <TableCell sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, color: '#1a1a1a', py: 2 }}>
                  Check-In Time
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendance.map((log: any) => {
                const dateObj = new Date(log.checkInTime);
                return (
                  <TableRow key={log._id} sx={{ '&:hover': { backgroundColor: '#fafafa' } }}>
                    <TableCell sx={{ py: 2, fontWeight: 600, color: '#1a1a1a' }}>
                      {dateObj.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </TableCell>
                    <TableCell sx={{ py: 2, color: 'text.secondary', fontWeight: 600 }}>
                      {dateObj.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Card elevation={0} sx={{ border: '1px solid #e6e6e6', borderLeft: '4px solid #fdf313', borderRadius: '8px', p: 4, textAlign: 'center' }}>
          <CardContent>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#1a1a1a', mb: 2 }}>
              No Check-Ins Registered Yet
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Check in with the front desk receptionist upon entering the facility to track your attendance parameters.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};
