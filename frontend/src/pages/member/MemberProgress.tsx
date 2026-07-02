import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useFetch } from '../../hooks/useApi';

export const MemberProgress: React.FC = () => {
  const { data, loading, error } = useFetch('/api/member/progress');

  if (loading) {
    return <Typography sx={{ p: 4, fontWeight: 600 }}>Loading progress metrics...</Typography>;
  }

  if (error) {
    return <Typography color="error" sx={{ p: 4, fontWeight: 600 }}>{error}</Typography>;
  }

  const logs = data?.progressHistory || [];
  const latestLog = logs[0];

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
          My Progress
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Track your physical anthropometric markers and structural growth history.
        </Typography>
      </Box>

      {latestLog ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {/* Latest Metric Summary Cards */}
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1a1a1a', mb: 2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Latest Metrics (Logged on {new Date(latestLog.recordedAt).toLocaleDateString()})
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                <Card elevation={0} sx={{ border: '1px solid #e6e6e6', borderLeft: '4px solid #fdf313', borderRadius: '8px', backgroundColor: '#ffffff' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>Weight</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: '#1a1a1a', mt: 0.5 }}>{latestLog.weight} kg</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                <Card elevation={0} sx={{ border: '1px solid #e6e6e6', borderLeft: '4px solid #fdf313', borderRadius: '8px', backgroundColor: '#ffffff' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>Body Fat</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: '#1a1a1a', mt: 0.5 }}>{latestLog.bodyFat}%</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                <Card elevation={0} sx={{ border: '1px solid #e6e6e6', borderLeft: '4px solid #fdf313', borderRadius: '8px', backgroundColor: '#ffffff' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>Chest</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: '#1a1a1a', mt: 0.5 }}>{latestLog.chest} cm</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                <Card elevation={0} sx={{ border: '1px solid #e6e6e6', borderLeft: '4px solid #fdf313', borderRadius: '8px', backgroundColor: '#ffffff' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>Waist</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: '#1a1a1a', mt: 0.5 }}>{latestLog.waist} cm</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                <Card elevation={0} sx={{ border: '1px solid #e6e6e6', borderLeft: '4px solid #fdf313', borderRadius: '8px', backgroundColor: '#ffffff' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>Arms</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: '#1a1a1a', mt: 0.5 }}>{latestLog.arms} cm</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                <Card elevation={0} sx={{ border: '1px solid #e6e6e6', borderLeft: '4px solid #fdf313', borderRadius: '8px', backgroundColor: '#ffffff' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>Thighs</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: '#1a1a1a', mt: 0.5 }}>{latestLog.thighs} cm</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* Historical Log Comparison Table */}
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1a1a1a', mb: 2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Historical Comparison Table
            </Typography>
            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e6e6e6', borderRadius: '8px', overflow: 'hidden' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f9f9f9' }}>
                    <TableCell sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, color: '#1a1a1a' }}>Logged Date</TableCell>
                    <TableCell sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, color: '#1a1a1a' }}>Weight</TableCell>
                    <TableCell sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, color: '#1a1a1a' }}>Body Fat %</TableCell>
                    <TableCell sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, color: '#1a1a1a' }}>Chest</TableCell>
                    <TableCell sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, color: '#1a1a1a' }}>Waist</TableCell>
                    <TableCell sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, color: '#1a1a1a' }}>Arms</TableCell>
                    <TableCell sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, color: '#1a1a1a' }}>Thighs</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {logs.map((log: any) => (
                    <TableRow key={log._id} sx={{ '&:hover': { backgroundColor: '#fafafa' } }}>
                      <TableCell sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                        {new Date(log.recordedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{log.weight} kg</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{log.bodyFat}%</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{log.chest} cm</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{log.waist} cm</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{log.arms} cm</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{log.thighs} cm</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      ) : (
        <Card elevation={0} sx={{ border: '1px solid #e6e6e6', borderLeft: '4px solid #fdf313', borderRadius: '8px', p: 4, textAlign: 'center' }}>
          <CardContent>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#1a1a1a', mb: 2 }}>
              No Measurements Recorded Yet
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Contact your strength coach to record your starting weight, body fat %, and circumference measurements.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};
export default MemberProgress;
