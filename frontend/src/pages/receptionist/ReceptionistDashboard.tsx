import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { useFetch } from '../../hooks/useApi';
import { Link } from 'react-router';

export const ReceptionistDashboard: React.FC = () => {
  const { data, loading, error } = useFetch('/api/receptionist/members');

  const members = data?.members || [];

  // Calculate live counts
  const activeMembersCount = members.filter((m: any) => m.currentMembership?.status === 'Active').length;
  const expiredMembersCount = members.filter((m: any) => m.currentMembership?.status === 'Expired').length;
  
  // Calculate memberships expiring in the next 10 days
  const today = new Date();
  const tenDaysFromNow = new Date();
  tenDaysFromNow.setDate(today.getDate() + 10);

  const expiringMembers = members.filter((m: any) => {
    if (!m.currentMembership || m.currentMembership.status !== 'Active') return false;
    const endDate = new Date(m.currentMembership.endDate);
    return endDate >= today && endDate <= tenDaysFromNow;
  });

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
          Operations Desk
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Live metrics overview for memberships and active operating parameters.
        </Typography>
      </Box>

      {error && (
        <Box sx={{ mb: 3 }}>
          <Typography color="error" variant="body2" sx={{ fontWeight: 600 }}>
            {error}
          </Typography>
        </Box>
      )}

      {/* Metrics Row */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card elevation={0} sx={{ border: '1px solid #e6e6e6', borderLeft: '4px solid #fdf313', borderRadius: '8px', backgroundColor: '#ffffff' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="caption" sx={{ textTransform: 'uppercase', color: '#949494', fontWeight: 700, letterSpacing: '1px' }}>
                Active Memberships
              </Typography>
              <Typography variant="h2" sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 900, fontSize: '44px', color: '#1a1a1a', my: 1, letterSpacing: '-1.5px' }}>
                {loading ? '...' : activeMembersCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Currently holding active packages
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card elevation={0} sx={{ border: '1px solid #e6e6e6', borderLeft: '4px solid #fdf313', borderRadius: '8px', backgroundColor: '#ffffff', position: 'relative' }}>
            {/* Yellow accent on warning */}
            {expiringMembers.length > 0 && (
              <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', backgroundColor: '#fdf313' }} />
            )}
            <CardContent sx={{ p: 3 }}>
              <Typography variant="caption" sx={{ textTransform: 'uppercase', color: '#949494', fontWeight: 700, letterSpacing: '1px' }}>
                Expiring Soon (10D)
              </Typography>
              <Typography variant="h2" sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 900, fontSize: '44px', color: '#1a1a1a', my: 1, letterSpacing: '-1.5px' }}>
                {loading ? '...' : expiringMembers.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Renewal actions required shortly
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card elevation={0} sx={{ border: '1px solid #e6e6e6', borderLeft: '4px solid #fdf313', borderRadius: '8px', backgroundColor: '#ffffff' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="caption" sx={{ textTransform: 'uppercase', color: '#949494', fontWeight: 700, letterSpacing: '1px' }}>
                Expired Profiles
              </Typography>
              <Typography variant="h2" sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 900, fontSize: '44px', color: '#1a1a1a', my: 1, letterSpacing: '-1.5px' }}>
                {loading ? '...' : expiredMembersCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Packages fully elapsed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Expiring List Table */}
      <Box sx={{ border: '1px solid #e6e6e6', borderRadius: '8px', p: 3, backgroundColor: '#ffffff' }}>
        <Typography variant="h6" sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, color: '#1a1a1a', mb: 3 }}>
          Expiring Membership Actions
        </Typography>
        
        <TableContainer component={Paper} elevation={0} sx={{ backgroundColor: 'transparent' }}>
          <Table aria-label="expiring memberships table">
            <TableHead>
              <TableRow sx={{ borderBottom: '2px solid #1a1a1a' }}>
                <TableCell sx={{ fontWeight: 700, px: 1, color: '#1a1a1a' }}>Member Name</TableCell>
                <TableCell sx={{ fontWeight: 700, px: 1, color: '#1a1a1a' }}>Plan Duration</TableCell>
                <TableCell sx={{ fontWeight: 700, px: 1, color: '#1a1a1a' }}>Expiration Date</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, px: 1, color: '#1a1a1a' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expiringMembers.map((member: any) => (
                <TableRow key={member._id} sx={{ borderBottom: '1px solid #e6e6e6', '&:hover': { backgroundColor: '#f2f2f2' } }}>
                  <TableCell component="th" scope="row" sx={{ px: 1, fontWeight: 600, color: '#1a1a1a' }}>
                    {member.fullName}
                  </TableCell>
                  <TableCell sx={{ px: 1, color: '#757575' }}>
                    {member.currentMembership?.planType}
                  </TableCell>
                  <TableCell sx={{ px: 1, color: '#757575' }}>
                    {new Date(member.currentMembership?.endDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right" sx={{ px: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      component={Link}
                      to="/receptionist/members"
                      sx={{
                        borderColor: '#e6e6e6',
                        color: '#1a1a1a',
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': { borderColor: '#1a1a1a', backgroundColor: '#f2f2f2' }
                      }}
                    >
                      Renew / Update
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {expiringMembers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4, color: '#949494' }}>
                    {loading ? 'Fetching member states...' : 'No memberships expiring in the next 10 days.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};
