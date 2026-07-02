import React, { useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, List, ListItem, LinearProgress } from '@mui/material';
import { useFetch } from '../../hooks/useApi';
import { AthleteConsole } from '../../components/AthleteConsole';

export const TrainerDashboard: React.FC = () => {
  const { data, loading, error, refetch } = useFetch('/api/trainer/dashboard');
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [consoleOpen, setConsoleOpen] = useState(false);

  const stats = data || {
    assignedMembersCount: 0,
    recentAttendance: [],
    attendance30Days: [],
    topAttending: [],
    needsUpdate: []
  };

  // Calculate total check-ins in the last 30 days
  const checkIns30DaysTotal = stats.attendance30Days?.reduce((acc: number, curr: any) => acc + curr.count, 0) || 0;

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
          Coaching Overview
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Live metrics tracking assigned athletes and daily training attendance indicators.
        </Typography>
      </Box>

      {error && (
        <Box sx={{ mb: 3 }}>
          <Typography color="error" variant="body2" sx={{ fontWeight: 600 }}>
            {error}
          </Typography>
        </Box>
      )}

      {/* Stats Counter Row */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card elevation={0} sx={{ border: '1px solid #e6e6e6', borderLeft: '4px solid #fdf313', borderRadius: '8px', backgroundColor: '#ffffff' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="caption" sx={{ textTransform: 'uppercase', color: '#949494', fontWeight: 700, letterSpacing: '1px' }}>
                Assigned Athletes
              </Typography>
              <Typography variant="h2" sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 900, fontSize: '44px', color: '#1a1a1a', my: 1, letterSpacing: '-1.5px' }}>
                {loading ? '...' : stats.assignedMembersCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Members matched with your training schedule
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card elevation={0} sx={{ border: '1px solid #e6e6e6', borderLeft: '4px solid #fdf313', borderRadius: '8px', backgroundColor: '#ffffff' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="caption" sx={{ textTransform: 'uppercase', color: '#949494', fontWeight: 700, letterSpacing: '1px' }}>
                Last 30 Days Check-Ins
              </Typography>
              <Typography variant="h2" sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 900, fontSize: '44px', color: '#1a1a1a', my: 1, letterSpacing: '-1.5px' }}>
                {loading ? '...' : checkIns30DaysTotal}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total aggregate gym visits by your athletes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {/* Alert / Warning Row for Progress Updates */}
      {stats.needsUpdate && stats.needsUpdate.length > 0 && (
        <Card
          elevation={0}
          sx={{
            border: '1px solid #e6e6e6',
            borderLeft: '4px solid #fdf313',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            mb: 5,
            p: 3
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 800, color: '#1a1a1a', mb: 2, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <span style={{ color: '#d32f2f', fontWeight: 900 }}>⚠️</span>
            Attention: Progress Updates Required ({stats.needsUpdate.length})
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            The following athletes have no measurement logs or have not had their measurements updated in over 30 days. Click their profile to log metrics.
          </Typography>
          <Grid container spacing={2}>
            {stats.needsUpdate.map((m: any) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={m._id}>
                <Box
                  onClick={() => {
                    setSelectedMemberId(m._id);
                    setConsoleOpen(true);
                  }}
                  sx={{
                    p: 2,
                    border: '1px solid #e6e6e6',
                    borderRadius: '8px',
                    backgroundColor: '#fafafa',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: '#1a1a1a',
                      backgroundColor: '#f2f2f2'
                    }
                  }}
                >
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '14px', color: '#1a1a1a' }}>
                      {m.fullName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      Last Log: {m.lastUpdated}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Card>
      )}
      {/* Main Aggregated Content Columns */}
      <Grid container spacing={4} sx={{ mb: 5 }}>
        {/* Left Column: 30-Day Check-in Trend list */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={0} sx={{ border: '1px solid #e6e6e6', borderRadius: '8px', backgroundColor: '#ffffff', height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, color: '#1a1a1a', mb: 3 }}>
                30-Day Attendance Trend
              </Typography>
              
              <Box sx={{ maxHeight: '280px', overflowY: 'auto', pr: 1 }}>
                {stats.attendance30Days && stats.attendance30Days.length > 0 ? (
                  stats.attendance30Days.map((trend: any, idx: number) => (
                    <Box key={idx} sx={{ mb: 2, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                          {new Date(trend._id).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                          {trend.count} check-in{trend.count > 1 ? 's' : ''}
                        </Typography>
                      </Box>
                      {/* Simple visual bar using LinearProgress */}
                      <LinearProgress
                        variant="determinate"
                        value={Math.min((trend.count / 10) * 100, 100)} // assume 10 check-ins is max
                        sx={{
                          height: '6px',
                          borderRadius: '3px',
                          backgroundColor: '#f2f2f2',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: '#1a1a1a'
                          }
                        }}
                      />
                    </Box>
                  ))
                ) : (
                  <Box sx={{ py: 6, textAlign: 'center', color: '#949494' }}>
                    {loading ? 'Analyzing trend records...' : 'No check-in history logged in the last 30 days.'}
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column: Leaderboard of Top Attenders */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={0} sx={{ border: '1px solid #e6e6e6', borderRadius: '8px', backgroundColor: '#ffffff', height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, color: '#1a1a1a', mb: 3 }}>
                Top Attending Athletes
              </Typography>

              <List sx={{ p: 0 }}>
                {stats.topAttending && stats.topAttending.length > 0 ? (
                  stats.topAttending.map((leader: any, idx: number) => {
                    const maxVal = stats.topAttending[0]?.checkInCount || 1;
                    const percent = Math.min((leader.checkInCount / maxVal) * 100, 100);
                    return (
                      <ListItem
                        key={idx}
                        sx={{
                          p: 1.5,
                          mb: 1.5,
                          border: '1px solid #e6e6e6',
                          borderRadius: '8px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'stretch',
                          gap: 1
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography sx={{ fontWeight: 700, color: '#1a1a1a', fontSize: '14px' }}>
                              {idx + 1}. {leader.member?.fullName || 'Active Athlete'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {leader.member?.email || 'N/A'}
                            </Typography>
                          </Box>
                          <Typography sx={{ fontWeight: 800, color: '#1a1a1a', fontSize: '15px' }}>
                            {leader.checkInCount} visits
                          </Typography>
                        </Box>
                        {/* Leaderboard status indicator */}
                        <LinearProgress
                          variant="determinate"
                          value={percent}
                          sx={{
                            height: '4px',
                            borderRadius: '2px',
                            backgroundColor: '#f2f2f2',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: '#1a1a1a'
                            }
                          }}
                        />
                      </ListItem>
                    );
                  })
                ) : (
                  <Box sx={{ py: 6, textAlign: 'center', color: '#949494' }}>
                    {loading ? 'Compiling athlete statistics...' : 'No attendance data collected yet.'}
                  </Box>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Attendance Feed Row */}
      <Box sx={{ border: '1px solid #e6e6e6', borderRadius: '8px', p: 3, backgroundColor: '#ffffff' }}>
        <Typography variant="h6" sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, color: '#1a1a1a', mb: 3 }}>
          Recent Client Check-Ins
        </Typography>

        <TableContainer component={Paper} elevation={0} sx={{ backgroundColor: 'transparent' }}>
          <Table aria-label="assigned members attendance table">
            <TableHead>
              <TableRow sx={{ borderBottom: '2px solid #1a1a1a' }}>
                <TableCell sx={{ fontWeight: 700, px: 1, color: '#1a1a1a' }}>Athlete Name</TableCell>
                <TableCell sx={{ fontWeight: 700, px: 1, color: '#1a1a1a' }}>Email Address</TableCell>
                <TableCell sx={{ fontWeight: 700, px: 1, color: '#1a1a1a' }}>Check-In Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stats.recentAttendance && stats.recentAttendance.map((attendance: any) => (
                <TableRow key={attendance._id} sx={{ borderBottom: '1px solid #e6e6e6', '&:hover': { backgroundColor: '#f2f2f2' } }}>
                  <TableCell component="th" scope="row" sx={{ px: 1, fontWeight: 600, color: '#1a1a1a' }}>
                    {attendance.memberId?.fullName || 'Removed User'}
                  </TableCell>
                  <TableCell sx={{ px: 1, color: '#757575' }}>
                    {attendance.memberId?.email || 'N/A'}
                  </TableCell>
                  <TableCell sx={{ px: 1, color: '#757575' }}>
                    {new Date(attendance.checkInTime).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
              {(!stats.recentAttendance || stats.recentAttendance.length === 0) && (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 4, color: '#949494' }}>
                    {loading ? 'Fetching attendance feed...' : 'No recent check-ins recorded for your members.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <AthleteConsole
        memberId={selectedMemberId}
        open={consoleOpen}
        onClose={() => setConsoleOpen(false)}
        onLogged={refetch}
      />
    </Box>
  );
};
