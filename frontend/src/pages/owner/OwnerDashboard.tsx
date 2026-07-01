import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';

// Mock data for Owner Dashboard Metrics
const METRICS = [
  { label: 'Active Members', value: '142', change: '+12% this month', status: 'normal' },
  { label: 'Expired Memberships', value: '8', change: 'Action required', status: 'warning' },
  { label: 'Today\'s Attendance', value: '45', change: '12 active sessions now', status: 'normal' },
  { label: 'New Members (Monthly)', value: '24', change: 'Target: 30', status: 'normal' },
];

const TRAINERS = [
  { name: 'Marcus Aurelius', specialization: 'Strength & Conditioning', clientCount: 22, load: 'Optimal' },
  { name: 'Serena Vance', specialization: 'Cardiovascular Athletics', clientCount: 15, load: 'Optimal' },
  { name: 'Helena Rostov', specialization: 'Postural Rehabilitation', clientCount: 28, load: 'High' },
  { name: 'Kaelen Thorne', specialization: 'Calisthenics & Mobility', clientCount: 8, load: 'Low' },
];

// Mock daily check-ins for the last 30 days (percentages for visual bar representation)
const ATTENDANCE_TREND = [
  40, 45, 55, 60, 30, 20, 65, 70, 75, 80, 50, 45, 60, 72, 85, 90, 40, 35, 58, 62, 70, 78, 30, 25, 60, 68, 74, 82, 88, 95
];

export const OwnerDashboard: React.FC = () => {
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

      {/* Metrics Grid */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {METRICS.map((metric, i) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
            <Card
              elevation={0}
              sx={{
                border: '1px solid #e6e6e6',
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
                  {TRAINERS.map((trainer) => (
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
              {ATTENDANCE_TREND.map((val, i) => (
                <Box
                  key={i}
                  sx={{
                    width: `${90 / ATTENDANCE_TREND.length}%`,
                    height: `${val}%`,
                    backgroundColor: i === ATTENDANCE_TREND.length - 1 ? '#fdf313' : '#1a1a1a', // Highlight last day with Electric Yellow
                    borderRadius: '1px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#fdf313',
                      transform: 'scaleY(1.05)'
                    }
                  }}
                  title={`Day ${i + 1}: ${val}% capacity`}
                />
              ))}
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
