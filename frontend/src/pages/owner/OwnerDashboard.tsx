import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import { useFetch } from '../../hooks/useApi';

export const OwnerDashboard: React.FC = () => {
  const { data, loading, error } = useFetch('/api/owner/dashboard');

  const stats = data || {
    activeMembersCount: 0,
    expiredMembersCount: 0,
    todayCheckinsCount: 0,
    newMembersThisMonthCount: 0,
    trainerWorkload: [],
    attendanceTrend: []
  };

  const metrics = [
    { label: 'Active Members', value: loading ? '...' : stats.activeMembersCount.toString(), change: 'Holding active contracts', status: 'normal' },
    { label: 'Expired Memberships', value: loading ? '...' : stats.expiredMembersCount.toString(), change: stats.expiredMembersCount > 0 ? 'Requires renewal action' : 'All contracts up to date', status: stats.expiredMembersCount > 0 ? 'warning' : 'normal' },
    { label: 'Today\'s Attendance', value: loading ? '...' : stats.todayCheckinsCount.toString(), change: 'Live check-in counter', status: 'normal' },
    { label: 'New Members (Monthly)', value: loading ? '...' : stats.newMembersThisMonthCount.toString(), change: 'Registrations this month', status: 'normal' },
  ];

  // Find max value in attendance trend to scale bars to 100% height
  const maxTrendVal = stats.attendanceTrend && stats.attendanceTrend.length > 0
    ? Math.max(...stats.attendanceTrend, 1)
    : 1;

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Editorial Header */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h3"
          sx={{
            fontFamily: "'Suisse Intl', 'Manrope', sans-serif",
            fontWeight: 900,
            color: '#1a1a1a',
            letterSpacing: '-1.5px',
            fontSize: { xs: '36px', md: '48px' },
            textTransform: 'uppercase'
          }}
        >
          Operational Analytics
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1, maxWidth: '600px' }}>
          Overview of strength laboratory operations, membership lifecycle metrics, and workforce volume distributions.
        </Typography>
      </Box>

      {error && (
        <Box sx={{ mb: 3 }}>
          <Typography color="error" variant="body2" sx={{ fontWeight: 600 }}>
            {error}
          </Typography>
        </Box>
      )}

      {/* Metrics Grid */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {metrics.map((metric, i) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
            <Card
              elevation={0}
              sx={{
                border: '1px solid #e6e6e6',
                borderLeft: '4px solid #fdf313',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                transition: 'all 0.2s ease',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  borderColor: '#1a1a1a',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              {/* Electric Yellow Accent Border for warning status */}
              {metric.status === 'warning' && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    backgroundColor: '#fdf313'
                  }}
                />
              )}
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="caption"
                  sx={{
                    textTransform: 'uppercase',
                    color: '#949494',
                    fontWeight: 700,
                    letterSpacing: '1px'
                  }}
                >
                  {metric.label}
                </Typography>
                <Typography
                  variant="h2"
                  sx={{
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 900,
                    fontSize: '44px',
                    color: '#1a1a1a',
                    my: 1,
                    letterSpacing: '-1.5px'
                  }}
                >
                  {metric.value}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {metric.status === 'warning' && (
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: '#fdf313',
                        display: 'inline-block'
                      }}
                    />
                  )}
                  <Typography variant="body2" color={metric.status === 'warning' ? '#1a1a1a' : 'text.secondary'} sx={{ fontWeight: 500 }}>
                    {metric.change}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        {/* Left Column: Trainer Workload */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Box sx={{ border: '1px solid #e6e6e6', borderRadius: '8px', p: 3, backgroundColor: '#ffffff' }}>
            <Typography variant="h6" sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, color: '#1a1a1a', mb: 3 }}>
              Trainer Client Distribution
            </Typography>
            <TableContainer component={Paper} elevation={0} sx={{ backgroundColor: 'transparent' }}>
              <Table aria-label="trainers workload table" size="medium">
                <TableHead>
                  <TableRow sx={{ borderBottom: '2px solid #1a1a1a' }}>
                    <TableCell sx={{ fontWeight: 700, px: 1, color: '#1a1a1a' }}>Trainer Name</TableCell>
                    <TableCell sx={{ fontWeight: 700, px: 1, color: '#1a1a1a' }}>Specialization</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, px: 1, color: '#1a1a1a' }}>Clients</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, px: 1, color: '#1a1a1a' }}>Load State</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.trainerWorkload && stats.trainerWorkload.map((trainer: any) => (
                    <TableRow
                      key={trainer.name}
                      sx={{
                        borderBottom: '1px solid #e6e6e6',
                        '&:hover': { backgroundColor: '#f2f2f2' }
                      }}
                    >
                      <TableCell component="th" scope="row" sx={{ px: 1, fontWeight: 600, color: '#1a1a1a' }}>
                        {trainer.name}
                      </TableCell>
                      <TableCell sx={{ px: 1, color: '#757575' }}>{trainer.specialization}</TableCell>
                      <TableCell align="right" sx={{ px: 1, fontWeight: 700, color: '#1a1a1a' }}>
                        {trainer.clientCount}
                      </TableCell>
                      <TableCell align="right" sx={{ px: 1 }}>
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
                    </TableRow>
                  ))}
                  {(!stats.trainerWorkload || stats.trainerWorkload.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 4, color: '#949494' }}>
                        {loading ? 'Compiling trainer registry...' : 'No trainers registered.'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>

        {/* Right Column: Attendance Trend */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Box sx={{ border: '1px solid #e6e6e6', borderRadius: '8px', p: 3, backgroundColor: '#ffffff', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, color: '#1a1a1a', mb: 1 }}>
              Attendance Volume (30D)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Daily member check-in frequencies for the last 30 active operating cycles.
            </Typography>
            
            {/* Visual Bar Graph */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                height: '180px',
                mt: 'auto',
                pb: 1,
                borderBottom: '1px solid #1a1a1a'
              }}
            >
              {stats.attendanceTrend && stats.attendanceTrend.map((val: number, i: number) => {
                const scaledHeight = Math.min((val / maxTrendVal) * 100, 100);
                return (
                  <Box
                    key={i}
                    sx={{
                      width: `${90 / stats.attendanceTrend.length}%`,
                      height: `${scaledHeight}%`,
                      backgroundColor: i === stats.attendanceTrend.length - 1 ? '#fdf313' : '#1a1a1a', // Highlight last day with Electric Yellow
                      borderRadius: '1px',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: '#fdf313',
                        transform: 'scaleY(1.05)'
                      }
                    }}
                    title={`Day ${i + 1}: ${val} check-ins`}
                  />
                );
              })}
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>30 days ago</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Today</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
