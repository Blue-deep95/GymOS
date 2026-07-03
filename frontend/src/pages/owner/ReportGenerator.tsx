import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, FormControl, InputLabel, Select, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Divider } from '@mui/material';
import api from '../../api';

interface Trainer {
  _id: string;
  fullName: string;
}

export const ReportGenerator: React.FC = () => {
  const [reportType, setReportType] = useState('attendance');
  const [timeRange, setTimeRange] = useState('30d');
  const [trainerId, setTrainerId] = useState('');
  const [planType, setPlanType] = useState('');

  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [reportData, setReportData] = useState<any[] | null>(null);
  const [activeMembersDetailed, setActiveMembersDetailed] = useState<any[] | null>(null);
  const [absenteesDetailed, setAbsenteesDetailed] = useState<any[] | null>(null);
  const [expiringMembershipsDetailed, setExpiringMembershipsDetailed] = useState<any[] | null>(null);
  const [trainersDetailed, setTrainersDetailed] = useState<any[] | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch registered trainers for the filter dropdown
  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const response = await api.get('/api/owner/trainers');
        if (response && response.data && response.data.list) {
          setTrainers(response.data.list);
        }
      } catch (err) {
        console.error('Failed to load trainers for filter dropdown', err);
      }
    };
    fetchTrainers();
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `/api/owner/reports?reportType=${reportType}&timeRange=${timeRange}&trainerId=${trainerId}&planType=${planType}`;
      const response = await api.get(url);
      if (response && response.data) {
        setReportData(response.data.reportData || null);
        setActiveMembersDetailed(response.data.activeMembersDetailed || null);
        setAbsenteesDetailed(response.data.absenteesDetailed || null);
        setExpiringMembershipsDetailed(response.data.expiringMembershipsDetailed || null);
        setTrainersDetailed(response.data.trainersDetailed || null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to compile operational intelligence reports');
    } finally {
      setLoading(false);
    }
  };

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
          Operational Intelligence
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Compile metrics, track attendance ratios, and audit personnel utilization loads.
        </Typography>
      </Box>

      {/* Control Block with Advanced Filters */}
      <Paper elevation={0} sx={{ p: 4, mb: 5, border: '1px solid #e6e6e6', borderRadius: '8px', backgroundColor: '#ffffff' }}>
        <Grid container spacing={3} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="report-type-label">Report Class</InputLabel>
              <Select
                labelId="report-type-label"
                value={reportType}
                label="Report Class"
                onChange={(e) => {
                  setReportType(e.target.value);
                  setReportData(null);
                  setActiveMembersDetailed(null);
                  setAbsenteesDetailed(null);
                  setExpiringMembershipsDetailed(null);
                  setTrainersDetailed(null);
                }}
              >
                <MenuItem value="attendance">Daily Activity & Attendance</MenuItem>
                <MenuItem value="memberships">Membership Performance</MenuItem>
                <MenuItem value="trainers">Trainer Capacity Load</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="time-range-label">Time Window</InputLabel>
              <Select
                labelId="time-range-label"
                value={timeRange}
                label="Time Window"
                onChange={(e) => { setTimeRange(e.target.value); setReportData(null); }}
              >
                <MenuItem value="7d">Last 7 Operating Days</MenuItem>
                <MenuItem value="30d">Last 30 Operating Days</MenuItem>
                <MenuItem value="90d">Quarterly Metric Audit (90D)</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Advanced Filter: Trainer */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="trainer-filter-label">Trainer Filter</InputLabel>
              <Select
                labelId="trainer-filter-label"
                value={trainerId}
                label="Trainer Filter"
                onChange={(e) => { setTrainerId(e.target.value); setReportData(null); }}
              >
                <MenuItem value="">All Staff/Trainers</MenuItem>
                {trainers.map((t) => (
                  <MenuItem key={t._id} value={t._id}>{t.fullName}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Advanced Filter: Membership Plan */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="plan-filter-label">Plan Filter</InputLabel>
              <Select
                labelId="plan-filter-label"
                value={planType}
                label="Plan Filter"
                onChange={(e) => { setPlanType(e.target.value); setReportData(null); }}
              >
                <MenuItem value="">All Packages</MenuItem>
                <MenuItem value="1 Month">1 Month package</MenuItem>
                <MenuItem value="3 Months">3 Months package</MenuItem>
                <MenuItem value="6 Months">6 Months package</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Button
              variant="contained"
              fullWidth
              disabled={loading}
              onClick={handleGenerate}
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
              {loading ? 'Compiling Report...' : 'Compile Operational Report'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <Box sx={{ mb: 3, p: 2, border: '1px solid #d32f2f', borderRadius: '8px', backgroundColor: '#fde8e8' }}>
          <Typography color="error" variant="body2" sx={{ fontWeight: 600 }}>
            {error}
          </Typography>
        </Box>
      )}

      {/* Report Output */}
      {reportData && (
        <Grid container spacing={4}>
          {/* Summary Metrics */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ border: '1px solid #e6e6e6', borderRadius: '8px', p: 4, backgroundColor: '#ffffff', height: '100%' }}>
              <Typography variant="h6" sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, color: '#1a1a1a', mb: 3, textTransform: 'uppercase', letterSpacing: '-0.5px' }}>
                Summary Overview
              </Typography>
              <TableContainer component={Paper} elevation={0} sx={{ backgroundColor: 'transparent' }}>
                <Table aria-label="report results table">
                  <TableHead sx={{ backgroundColor: '#f2f2f2' }}>
                    <TableRow sx={{ borderBottom: '2px solid #1a1a1a' }}>
                      <TableCell sx={{ fontWeight: 700, color: '#1a1a1a' }}>Key Attribute</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: '#1a1a1a' }}>Value</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reportData.map((row, idx) => (
                      <TableRow key={idx} sx={{ borderBottom: '1px solid #e6e6e6', '&:hover': { backgroundColor: '#f2f2f2' } }}>
                        <TableCell sx={{ fontWeight: 600, color: '#1a1a1a' }}>{row.metric}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, color: '#1a1a1a' }}>{row.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Grid>

          {/* Detailed Lists Output based on Report Class */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box sx={{ border: '1px solid #e6e6e6', borderRadius: '8px', p: 4, backgroundColor: '#ffffff', height: '100%' }}>
              
              {/* ATTENDANCE DETAILS */}
              {reportType === 'attendance' && (
                <Box>
                  {/* Top Active Members */}
                  <Typography variant="h6" sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, color: '#1a1a1a', mb: 2, textTransform: 'uppercase', letterSpacing: '-0.5px' }}>
                    🔥 Most Active Members (Check-ins)
                  </Typography>
                  {activeMembersDetailed && activeMembersDetailed.length > 0 ? (
                    <TableContainer component={Paper} elevation={0} sx={{ mb: 5, backgroundColor: 'transparent' }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ borderBottom: '1px solid #1a1a1a' }}>
                            <TableCell sx={{ fontWeight: 700 }}>Full Name</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700 }}>Visits</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {activeMembersDetailed.map((m, idx) => (
                            <TableRow key={idx} sx={{ borderBottom: '1px solid #e6e6e6' }}>
                              <TableCell sx={{ fontWeight: 600 }}>{m.fullName}</TableCell>
                              <TableCell color="text.secondary">{m.email}</TableCell>
                              <TableCell align="right" sx={{ fontWeight: 700 }}>{m.checkinCount}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 5 }}>No check-in logs recorded in this period.</Typography>
                  )}

                  <Divider sx={{ my: 3, borderColor: '#e6e6e6' }} />

                  {/* Absentees */}
                  <Typography variant="h6" sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, color: '#1a1a1a', mb: 2, textTransform: 'uppercase', letterSpacing: '-0.5px' }}>
                    ❄️ Flagged Absent Members (&gt;30 Days)
                  </Typography>
                  {absenteesDetailed && absenteesDetailed.length > 0 ? (
                    <TableContainer component={Paper} elevation={0} sx={{ backgroundColor: 'transparent' }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ borderBottom: '1px solid #1a1a1a' }}>
                            <TableCell sx={{ fontWeight: 700 }}>Full Name</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700 }}>Last Active</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {absenteesDetailed.map((m, idx) => (
                            <TableRow key={idx} sx={{ borderBottom: '1px solid #e6e6e6' }}>
                              <TableCell sx={{ fontWeight: 600 }}>{m.fullName}</TableCell>
                              <TableCell color="text.secondary">{m.email}</TableCell>
                              <TableCell align="right" sx={{ fontWeight: 700, color: '#d32f2f' }}>{m.lastActive}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography variant="body2" color="text.secondary">All members have been active recently.</Typography>
                  )}
                </Box>
              )}

              {/* MEMBERSHIPS DETAILS */}
              {reportType === 'memberships' && (
                <Box>
                  <Typography variant="h6" sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, color: '#1a1a1a', mb: 3, textTransform: 'uppercase', letterSpacing: '-0.5px' }}>
                    ⏳ Warning: Expiring This Week
                  </Typography>
                  {expiringMembershipsDetailed && expiringMembershipsDetailed.length > 0 ? (
                    <TableContainer component={Paper} elevation={0} sx={{ backgroundColor: 'transparent' }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ borderBottom: '1px solid #1a1a1a' }}>
                            <TableCell sx={{ fontWeight: 700 }}>Member Name</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Package</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700 }}>Expiry Date</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {expiringMembershipsDetailed.map((m, idx) => (
                            <TableRow key={idx} sx={{ borderBottom: '1px solid #e6e6e6' }}>
                              <TableCell sx={{ fontWeight: 600 }}>
                                {m.fullName}
                                <Typography variant="caption" sx={{ display: 'block' }} color="text.secondary">{m.email}</Typography>
                              </TableCell>
                              <TableCell>{m.planType}</TableCell>
                              <TableCell align="right" sx={{ fontWeight: 700, color: '#e65100' }}>{m.endDate}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography variant="body2" color="text.secondary">No memberships are expiring in the next 7 days.</Typography>
                  )}
                </Box>
              )}

              {/* TRAINERS DETAILS */}
              {reportType === 'trainers' && (
                <Box>
                  <Typography variant="h6" sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, color: '#1a1a1a', mb: 3, textTransform: 'uppercase', letterSpacing: '-0.5px' }}>
                    💼 Personnel Workload Registry
                  </Typography>
                  {trainersDetailed && trainersDetailed.length > 0 ? (
                    <TableContainer component={Paper} elevation={0} sx={{ backgroundColor: 'transparent' }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ borderBottom: '1px solid #1a1a1a' }}>
                            <TableCell sx={{ fontWeight: 700 }}>Trainer Name</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Specialization</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700 }}>Clients Assigned</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {trainersDetailed.map((t, idx) => (
                            <TableRow key={idx} sx={{ borderBottom: '1px solid #e6e6e6' }}>
                              <TableCell sx={{ fontWeight: 600 }}>{t.fullName}</TableCell>
                              <TableCell color="text.secondary">{t.specialization}</TableCell>
                              <TableCell align="right" sx={{ fontWeight: 700 }}>{t.clientCount} members</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography variant="body2" color="text.secondary">No trainers loaded matching selection.</Typography>
                  )}
                </Box>
              )}

            </Box>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default ReportGenerator;
