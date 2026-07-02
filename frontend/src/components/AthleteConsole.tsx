import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, Box, Tabs, Tab, Typography, Grid, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, List, ListItem, ListItemText, CircularProgress, Chip } from '@mui/material';
import { useFetch, useMutation } from '../hooks/useApi';
import { useToast } from '../context/ToastContext';

interface AthleteConsoleProps {
  memberId: string | null;
  open: boolean;
  onClose: () => void;
  onLogged?: () => void;
}

export const AthleteConsole: React.FC<AthleteConsoleProps> = ({ memberId, open, onClose, onLogged }) => {
  const { showToast } = useToast();
  const [tabVal, setTabVal] = useState(0);

  // Fetch full consolidated athlete profile
  const { data, loading, error, refetch } = useFetch(
    memberId ? `/api/trainer/members/${memberId}/profile` : ''
  );

  // Record progress mutation
  const logProgressMutation = useMutation(
    memberId ? `/api/trainer/members/${memberId}/progress` : '',
    'POST'
  );

  // Form State
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [chest, setChest] = useState('');
  const [waist, setWaist] = useState('');
  const [arms, setArms] = useState('');
  const [thighs, setThighs] = useState('');
  const [notes, setNotes] = useState('');

  // Reset tab and refetch when memberId changes
  useEffect(() => {
    if (open && memberId) {
      setTabVal(0);
      refetch();
    }
  }, [memberId, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight || !bodyFat || !chest || !waist || !arms || !thighs) {
      showToast('Please fill out all required measurement metrics', 'error');
      return;
    }

    try {
      const url = `/api/trainer/members/${memberId}/progress`;
      await logProgressMutation.execute(
        {
          weight: parseFloat(weight),
          bodyFat: parseFloat(bodyFat),
          chest: parseFloat(chest),
          waist: parseFloat(waist),
          arms: parseFloat(arms),
          thighs: parseFloat(thighs),
          notes
        },
        { url }
      );

      showToast('Measurements logged successfully', 'success');
      
      // Clear form
      setWeight('');
      setBodyFat('');
      setChest('');
      setWaist('');
      setArms('');
      setThighs('');
      setNotes('');

      refetch();
      if (onLogged) onLogged();
    } catch (err: any) {
      showToast(err.message || 'Failed to record progress metrics', 'error');
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth slotProps={{ paper: { sx: { borderRadius: '12px', minHeight: '550px' } } }}>
      <DialogTitle sx={{ borderBottom: '1px solid #e6e6e6', p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, color: '#1a1a1a' }}>
            {loading ? 'Retrieving dossier...' : data?.member?.fullName || 'Athlete Console'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {data?.member?.email || 'Loading details...'}
          </Typography>
        </Box>
        <Button onClick={onClose} variant="text" sx={{ color: '#949494', minWidth: 0, p: 1, '&:hover': { color: '#1a1a1a' } }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </Button>
      </DialogTitle>

      <Box sx={{ borderBottom: '1px solid #e6e6e6', px: 2 }}>
        <Tabs
          value={tabVal}
          onChange={(_, val) => setTabVal(val)}
          sx={{
            '& .MuiTabs-indicator': { backgroundColor: '#fdf313', height: '3px' },
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 700, fontSize: '14px', fontFamily: "'Manrope', sans-serif", minWidth: 'auto', px: 2.5 }
          }}
        >
          <Tab label="Bio & Attendance" />
          <Tab label="Active Program" />
          <Tab label="Progress History" />
          <Tab label="Log Metrics" />
        </Tabs>
      </Box>

      <DialogContent sx={{ p: 4 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
            <CircularProgress size={36} sx={{ color: '#1a1a1a' }} />
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ fontWeight: 600 }}>{error}</Typography>
        ) : (
          <>
            {/* Tab 1: Bio & Attendance */}
            {tabVal === 0 && (
              <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 800 }}>Growth & Fitness Targets</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#1a1a1a', mt: 0.5 }}>
                      {data?.member?.fitnessGoals || 'None registered'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 800 }}>Medical Warnings</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700, color: data?.member?.medicalNotes ? '#d32f2f' : '#1a1a1a', mt: 0.5 }}>
                      {data?.member?.medicalNotes || 'No medical warnings present'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 800 }}>Emergency Contact</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#1a1a1a', mt: 0.5 }}>
                      {data?.member?.emergencyContact || 'None registered'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 4 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 800 }}>Phone</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.5 }}>{data?.member?.phone || 'N/A'}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 800 }}>Membership Status</Typography>
                      <Box sx={{ mt: 0.5 }}>
                        <Chip
                          label={data?.member?.currentMembership?.status || 'No Package'}
                          size="small"
                          sx={{
                            backgroundColor: data?.member?.currentMembership?.status === 'Active' ? '#1a1a1a' : '#fdf313',
                            color: data?.member?.currentMembership?.status === 'Active' ? '#ffffff' : '#1a1a1a',
                            fontWeight: 700,
                            borderRadius: '4px'
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1a1a1a', mb: 2 }}>
                    Recent Gym Attendance check-ins ({data?.attendance?.length || 0})
                  </Typography>
                  <Box sx={{ border: '1px solid #e6e6e6', borderRadius: '8px', maxHeight: '250px', overflowY: 'auto' }}>
                    <List disablePadding>
                      {data?.attendance && data.attendance.map((log: any, idx: number) => {
                        const date = new Date(log.checkInTime);
                        return (
                          <ListItem key={log._id} sx={{ borderBottom: idx < data.attendance.length - 1 ? '1px solid #f2f2f2' : 'none', py: 1.5, px: 2 }}>
                            <ListItemText
                              primary={
                                <Typography sx={{ fontWeight: 700, color: '#1a1a1a', fontSize: '13px' }}>
                                  {date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                                </Typography>
                              }
                              secondary={
                                <Typography sx={{ fontSize: '11px', fontWeight: 600, color: 'text.secondary' }}>
                                  {date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                </Typography>
                              }
                            />
                          </ListItem>
                        );
                      })}
                      {(!data?.attendance || data.attendance.length === 0) && (
                        <Typography variant="body2" color="text.secondary" sx={{ p: 3, textAlign: 'center', fontStyle: 'italic' }}>
                          No check-in logs found.
                        </Typography>
                      )}
                    </List>
                  </Box>
                </Grid>
              </Grid>
            )}

            {/* Tab 2: Active Program */}
            {tabVal === 1 && (
              <Box>
                {data?.activeProgram ? (
                  <Box>
                    <Box sx={{ mb: 3, p: 2, border: '1px solid #e6e6e6', borderLeft: '4px solid #fdf313', borderRadius: '8px' }}>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#1a1a1a' }}>
                        Routine Blueprint: {data.activeProgram.programName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Assigned: {new Date(data.activeProgram.assignedAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {data.activeProgram.days.map((day: any, dIdx: number) => (
                        <Box key={dIdx} sx={{ border: '1px solid #e6e6e6', borderRadius: '8px', overflow: 'hidden' }}>
                          <Box sx={{ p: 1.5, backgroundColor: '#f9f9f9', borderBottom: '1px solid #e6e6e6' }}>
                            <Typography sx={{ fontWeight: 800, fontSize: '13px', color: '#1a1a1a' }}>{day.dayName}</Typography>
                          </Box>
                          <Box sx={{ p: 2 }}>
                            <Grid container spacing={2}>
                              {day.exercises.map((ex: any, eIdx: number) => (
                                <Grid size={{ xs: 12, sm: 6 }} key={eIdx}>
                                  <Box sx={{ p: 1.5, border: '1px solid #f2f2f2', borderRadius: '6px', backgroundColor: '#fafafa' }}>
                                    <Typography sx={{ fontWeight: 700, fontSize: '13px', color: '#1a1a1a', mb: 0.5 }}>{ex.exerciseName}</Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                                      {ex.sets} Sets | {ex.reps} Reps
                                    </Typography>
                                    {ex.notes && (
                                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, fontStyle: 'italic' }}>
                                        Notes: {ex.notes}
                                      </Typography>
                                    )}
                                  </Box>
                                </Grid>
                              ))}
                            </Grid>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ p: 6, border: '1px solid #e6e6e6', borderLeft: '4px solid #fdf313', borderRadius: '8px', textAlign: 'center' }}>
                    <Typography sx={{ fontWeight: 800, color: '#1a1a1a' }}>No Prescribed Workout Blueprint</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Navigate to the main list and select a routine template.
                    </Typography>
                  </Box>
                )}
              </Box>
            )}

            {/* Tab 3: Progress History */}
            {tabVal === 2 && (
              <Box>
                {data?.progressHistory && data.progressHistory.length > 0 ? (
                  <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e6e6e6', borderRadius: '8px' }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ backgroundColor: '#f9f9f9' }}>
                          <TableCell sx={{ fontWeight: 800 }}>Date</TableCell>
                          <TableCell sx={{ fontWeight: 800 }}>Weight (kg)</TableCell>
                          <TableCell sx={{ fontWeight: 800 }}>Body Fat %</TableCell>
                          <TableCell sx={{ fontWeight: 800 }}>Chest (cm)</TableCell>
                          <TableCell sx={{ fontWeight: 800 }}>Waist (cm)</TableCell>
                          <TableCell sx={{ fontWeight: 800 }}>Arms (cm)</TableCell>
                          <TableCell sx={{ fontWeight: 800 }}>Thighs (cm)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.progressHistory.map((h: any) => (
                          <TableRow key={h._id}>
                            <TableCell sx={{ fontWeight: 600 }}>{new Date(h.recordedAt).toLocaleDateString()}</TableCell>
                            <TableCell>{h.weight}</TableCell>
                            <TableCell>{h.bodyFat}%</TableCell>
                            <TableCell>{h.chest}</TableCell>
                            <TableCell>{h.waist}</TableCell>
                            <TableCell>{h.arms}</TableCell>
                            <TableCell>{h.thighs}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Box sx={{ p: 6, border: '1px solid #e6e6e6', borderLeft: '4px solid #fdf313', borderRadius: '8px', textAlign: 'center' }}>
                    <Typography sx={{ fontWeight: 800, color: '#1a1a1a' }}>No Historical Measurement Logs</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Navigate to the "Log Metrics" tab to record this member's starting weight and body parameters.
                    </Typography>
                  </Box>
                )}
              </Box>
            )}

            {/* Tab 4: Log Metrics */}
            {tabVal === 3 && (
              <Box component="form" onSubmit={handleSubmit}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1a1a1a', mb: 3 }}>
                  Record Periodic Body Anthropometrics
                </Typography>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid size={{ xs: 6, sm: 4 }}>
                    <TextField label="Weight (kg)" required fullWidth size="small" type="number" slotProps={{ htmlInput: { step: 0.1 } }} value={weight} onChange={(e) => setWeight(e.target.value)} />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 4 }}>
                    <TextField label="Body Fat %" required fullWidth size="small" type="number" slotProps={{ htmlInput: { step: 0.1 } }} value={bodyFat} onChange={(e) => setBodyFat(e.target.value)} />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 4 }}>
                    <TextField label="Chest (cm)" required fullWidth size="small" type="number" slotProps={{ htmlInput: { step: 0.1 } }} value={chest} onChange={(e) => setChest(e.target.value)} />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 4 }}>
                    <TextField label="Waist (cm)" required fullWidth size="small" type="number" slotProps={{ htmlInput: { step: 0.1 } }} value={waist} onChange={(e) => setWaist(e.target.value)} />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 4 }}>
                    <TextField label="Arms (cm)" required fullWidth size="small" type="number" slotProps={{ htmlInput: { step: 0.1 } }} value={arms} onChange={(e) => setArms(e.target.value)} />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 4 }}>
                    <TextField label="Thighs (cm)" required fullWidth size="small" type="number" slotProps={{ htmlInput: { step: 0.1 } }} value={thighs} onChange={(e) => setThighs(e.target.value)} />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField label="Notes / Comments" fullWidth multiline rows={2} size="small" value={notes} onChange={(e) => setNotes(e.target.value)} />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={logProgressMutation.loading}
                  sx={{
                    py: 1.2,
                    px: 4,
                    backgroundColor: '#1a1a1a',
                    color: '#ffffff',
                    fontWeight: 700,
                    textTransform: 'none',
                    borderRadius: '6px',
                    '&:hover': { backgroundColor: '#000000' }
                  }}
                >
                  {logProgressMutation.loading ? 'Recording...' : 'Commit Measurements'}
                </Button>
              </Box>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
