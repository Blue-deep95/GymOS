import React, { useState } from 'react';
import { Box, Typography, Button, Grid, FormControl, InputLabel, Select, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

export const ReportGenerator: React.FC = () => {
  const [reportType, setReportType] = useState('attendance');
  const [timeRange, setTimeRange] = useState('30d');
  const [reportData, setReportData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    // Mimic API delay
    setTimeout(() => {
      if (reportType === 'attendance') {
        setReportData([
          { metric: 'Total Check-ins', value: '1,245 visits' },
          { metric: 'Peak Attendance Hour', value: '06:00 PM - 08:00 PM' },
          { metric: 'Most Active Day', value: 'Monday (284 visits avg)' },
          { metric: 'Absentee Alert (>30 Days)', value: '14 members flagged' }
        ]);
      } else if (reportType === 'memberships') {
        setReportData([
          { metric: 'Total Revenue Active', value: '134 active packages' },
          { metric: 'Expiring This Week', value: '12 members warning' },
          { metric: 'New Registrations (Period)', value: '+28 signups' },
          { metric: 'Churn Estimate Rate', value: '3.4% calculated' }
        ]);
      } else {
        setReportData([
          { metric: 'Marcus Aurelius workload', value: '22 active (optimal)' },
          { metric: 'Serena Vance workload', value: '15 active (optimal)' },
          { metric: 'Helena Rostov workload', value: '28 active (high)' },
          { metric: 'Kaelen Thorne workload', value: '8 active (low)' }
        ]);
      }
      setLoading(false);
    }, 800);
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

      {/* Control Block */}
      <Paper elevation={0} sx={{ p: 4, mb: 5, border: '1px solid #e6e6e6', borderRadius: '8px', backgroundColor: '#ffffff' }}>
        <Grid container spacing={3} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="report-type-label">Report Class</InputLabel>
              <Select
                labelId="report-type-label"
                value={reportType}
                label="Report Class"
                onChange={(e) => { setReportType(e.target.value); setReportData(null); }}
              >
                <MenuItem value="attendance">Daily Activity & Attendance</MenuItem>
                <MenuItem value="memberships">Membership Performance</MenuItem>
                <MenuItem value="trainers">Trainer Capacity Load</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="time-range-label">Time Window</InputLabel>
              <Select
                labelId="time-range-label"
                value={timeRange}
                label="Time Window"
                onChange={(e) => { setTimeRange(e.target.value); setReportData(null); }}
              >
                <MenuItem value="7d">Last 7 Active Operating Days</MenuItem>
                <MenuItem value="30d">Last 30 Active Operating Days</MenuItem>
                <MenuItem value="90d">Quarterly Metric Audit (90D)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Button
              variant="contained"
              fullWidth
              disabled={loading}
              onClick={handleGenerate}
              sx={{
                py: 1.5,
                backgroundColor: '#1a1a1a',
                color: '#ffffff',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': { backgroundColor: '#000000' }
              }}
            >
              {loading ? 'Compiling Report...' : 'Compile Operational Report'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Report Output */}
      {reportData && (
        <Box sx={{ border: '1px solid #e6e6e6', borderRadius: '8px', p: 3, backgroundColor: '#ffffff' }}>
          <Typography variant="h6" sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, color: '#1a1a1a', mb: 3 }}>
            Compiled Metrics Output
          </Typography>
          <TableContainer component={Paper} elevation={0} sx={{ backgroundColor: 'transparent' }}>
            <Table aria-label="report results table">
              <TableHead sx={{ backgroundColor: '#f2f2f2' }}>
                <TableRow sx={{ borderBottom: '2px solid #1a1a1a' }}>
                  <TableCell sx={{ fontWeight: 700, color: '#1a1a1a' }}>Key Performance Attribute</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: '#1a1a1a' }}>Audited Metrics Value</TableCell>
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
      )}
    </Box>
  );
};
