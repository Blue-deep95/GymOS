import React, { useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Button, Dialog, DialogTitle, DialogContent, TextField, Grid } from '@mui/material';
import { useFetch, useMutation } from '../../hooks/useApi';
import { useToast } from '../../context/ToastContext';

export const TrainersList: React.FC = () => {
  const { showToast } = useToast();
  const { data, loading, error, refetch } = useFetch('/api/owner/trainers');
  const addTrainerMutation = useMutation('/api/owner/trainers', 'POST');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [availability, setAvailability] = useState('');

  const trainers = data?.trainers || [];

  const handleOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setFullName('');
    setEmail('');
    setPassword('');
    setPhone('');
    setSpecialization('');
    setAvailability('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      showToast('Name, email, and password are required to create a trainer account.', 'error');
      return;
    }

    try {
      await addTrainerMutation.execute({
        fullName,
        email,
        password,
        phone,
        specialization,
        availability
      });
      showToast('New trainer account registered successfully', 'success');
      refetch();
      handleClose();
    } catch (err: any) {
      showToast(err.message || 'Failed to add new trainer profile', 'error');
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
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
            Trainer Registry
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Overview of training staff specialists, availability windows, and member allocations.
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={handleOpen}
          sx={{
            py: 1.2,
            px: 3,
            backgroundColor: '#1a1a1a',
            color: '#ffffff',
            fontWeight: 700,
            textTransform: 'none',
            borderRadius: '6px',
            '&:hover': { backgroundColor: '#000000' }
          }}
        >
          + Add New Trainer
        </Button>
      </Box>

      {error && (
        <Box sx={{ mb: 3 }}>
          <Typography color="error" variant="body2" sx={{ fontWeight: 600 }}>
            {error}
          </Typography>
        </Box>
      )}

      {/* Registry Table */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e6e6e6', borderRadius: '8px', backgroundColor: '#ffffff' }}>
        <Table aria-label="trainers registry table">
          <TableHead sx={{ backgroundColor: '#f2f2f2' }}>
            <TableRow sx={{ borderBottom: '1px solid #e6e6e6' }}>
              <TableCell sx={{ fontWeight: 700, color: '#1a1a1a' }}>Trainer Name</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1a1a1a' }}>Core Specialization</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: '#1a1a1a' }}>Client Load</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: '#1a1a1a' }}>Load Indicator</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1a1a1a' }}>Active Availability</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trainers.map((trainer: any) => (
              <TableRow
                key={trainer._id}
                sx={{
                  borderBottom: '1px solid #e6e6e6',
                  '&:hover': { backgroundColor: '#f2f2f2' }
                }}
              >
                <TableCell component="th" scope="row" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                  {trainer.fullName}
                </TableCell>
                <TableCell sx={{ color: '#757575' }}>{trainer.specialization}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                  {trainer.clientCount} members
                </TableCell>
                <TableCell align="right">
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
                <TableCell sx={{ color: '#757575' }}>{trainer.availability}</TableCell>
              </TableRow>
            ))}
            {trainers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6, color: '#949494' }}>
                  {loading ? 'Compiling trainer registry...' : 'No trainers registered.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Register Trainer Dialog Form */}
      <Dialog open={dialogOpen} onClose={handleClose} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: '12px', p: 1 } } }}>
        <DialogTitle sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 850, borderBottom: '1px solid #e6e6e6', pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Add Training Specialist
          <Button onClick={handleClose} variant="text" sx={{ color: '#949494', minWidth: 0, p: 0.5 }}>
            ✕
          </Button>
        </DialogTitle>
        <DialogContent sx={{ mt: 3 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <TextField label="Trainer Full Name" required fullWidth size="small" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField label="Email Address" required fullWidth size="small" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField label="Access Password" required fullWidth size="small" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Phone Number" fullWidth size="small" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Core Specialization" fullWidth size="small" placeholder="Strength, Powerlifting, Cardio..." value={specialization} onChange={(e) => setSpecialization(e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField label="Weekly Availability Hours" fullWidth size="small" placeholder="Mon - Fri (AM/PM), Tue - Sat (PM)..." value={availability} onChange={(e) => setAvailability(e.target.value)} />
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
              <Button onClick={handleClose} variant="outlined" sx={{ borderRadius: '6px', textTransform: 'none', fontWeight: 600, borderColor: '#e6e6e6', color: '#1a1a1a' }}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={addTrainerMutation.loading} sx={{ borderRadius: '6px', textTransform: 'none', fontWeight: 700, backgroundColor: '#1a1a1a', color: '#ffffff', '&:hover': { backgroundColor: '#000000' } }}>
                {addTrainerMutation.loading ? 'Creating...' : 'Create Trainer Profile'}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};
export default TrainersList;
