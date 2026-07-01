import React, { useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Select, MenuItem, FormControl, TextField, InputAdornment } from '@mui/material';
import { useFetch, useMutation } from '../../hooks/useApi';
import { useToast } from '../../context/ToastContext';

export const RecepMembers: React.FC = () => {
  const { showToast } = useToast();
  const { data: membersData, loading: membersLoading, error: membersError, refetch } = useFetch('/api/receptionist/members');
  const { data: trainersData } = useFetch('/api/receptionist/trainers');
  const [search, setSearch] = useState('');

  const assignMembershipMutation = useMutation('', 'POST');
  const assignTrainerMutation = useMutation('', 'PATCH');

  const members = membersData?.members || [];
  const trainers = trainersData?.trainers || [];

  const filteredMembers = members.filter((member: any) =>
    member.fullName.toLowerCase().includes(search.toLowerCase()) ||
    member.email.toLowerCase().includes(search.toLowerCase())
  );

  const handlePlanChange = async (memberId: string, planType: string) => {
    try {
      // Modify URL dynamically for the mutation
      const url = `/api/receptionist/members/${memberId}/membership`;
      await assignMembershipMutation.execute({ planType }, { url });
      showToast('Membership plan assigned successfully', 'success');
      refetch();
    } catch (err: any) {
      showToast(err.message || 'Failed to assign membership', 'error');
    }
  };

  const handleTrainerChange = async (memberId: string, trainerId: string) => {
    try {
      const url = `/api/receptionist/members/${memberId}/assign-trainer`;
      await assignTrainerMutation.execute({ trainerId: trainerId || null }, { url });
      showToast(trainerId ? 'Trainer assigned successfully' : 'Trainer unassigned successfully', 'success');
      refetch();
    } catch (err: any) {
      showToast(err.message || 'Failed to assign trainer', 'error');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return { bg: '#1a1a1a', text: '#ffffff' };
      case 'Frozen':
        return { bg: '#f2ede9', text: '#1a1a1a' };
      case 'Expired':
        return { bg: '#fdf313', text: '#1a1a1a' };
      default:
        return { bg: '#f2f2f2', text: '#949494' };
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
          Member Registrations
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Assign subscription packages and match members with training coaches.
        </Typography>
      </Box>

      {membersError && (
        <Box sx={{ mb: 3 }}>
          <Typography color="error" variant="body2" sx={{ fontWeight: 600 }}>
            {membersError}
          </Typography>
        </Box>
      )}

      {/* Filter Toolbar */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
        <TextField
          placeholder="Search member name or email..."
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            width: '320px',
            backgroundColor: '#ffffff',
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              borderColor: '#e6e6e6',
              '&:hover fieldset': { borderColor: '#1a1a1a' },
              '&.Mui-focused fieldset': { borderColor: '#1a1a1a', borderWidth: '1px' }
            }
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>/</Typography>
                </InputAdornment>
              ),
            }
          }}
        />
      </Box>

      {/* Directory Table */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e6e6e6', borderRadius: '8px', backgroundColor: '#ffffff' }}>
        <Table aria-label="receptionist members table">
          <TableHead sx={{ backgroundColor: '#f2f2f2' }}>
            <TableRow sx={{ borderBottom: '1px solid #e6e6e6' }}>
              <TableCell sx={{ fontWeight: 700, color: '#1a1a1a' }}>Member Details</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1a1a1a' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1a1a1a' }}>Assigned Membership</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1a1a1a' }}>Assigned Coach</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMembers.map((member: any) => {
              const statusColors = getStatusColor(member.currentMembership?.status || 'Inactive');
              return (
                <TableRow
                  key={member._id}
                  sx={{
                    borderBottom: '1px solid #e6e6e6',
                    '&:hover': { backgroundColor: '#f2f2f2' }
                  }}
                >
                  <TableCell component="th" scope="row">
                    <Typography sx={{ fontWeight: 600, color: '#1a1a1a' }}>{member.fullName}</Typography>
                    <Typography variant="caption" color="text.secondary">{member.email}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={member.currentMembership?.status || 'No Package'}
                      size="small"
                      sx={{
                        backgroundColor: statusColors.bg,
                        color: statusColors.text,
                        fontWeight: 700,
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontFamily: "'Manrope', sans-serif"
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <FormControl size="small" sx={{ minWidth: 160 }}>
                      <Select
                        value={member.currentMembership?.planType || ''}
                        displayEmpty
                        onChange={(e) => handlePlanChange(member._id, e.target.value)}
                        sx={{
                          borderRadius: '8px',
                          '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e6e6e6' },
                          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#1a1a1a' },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1a1a1a', borderWidth: '1px' }
                        }}
                      >
                        <MenuItem value="" disabled>Select Plan</MenuItem>
                        <MenuItem value="1 Month">1 Month package</MenuItem>
                        <MenuItem value="3 Months">3 Months package</MenuItem>
                        <MenuItem value="6 Months">6 Months package</MenuItem>
                      </Select>
                    </FormControl>
                    {member.currentMembership && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                        Ends: {new Date(member.currentMembership.endDate).toLocaleDateString()}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <FormControl size="small" sx={{ minWidth: 180 }}>
                      <Select
                        value={member.assignedTrainer?._id || member.assignedTrainer || ''}
                        displayEmpty
                        onChange={(e) => handleTrainerChange(member._id, e.target.value)}
                        sx={{
                          borderRadius: '8px',
                          '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e6e6e6' },
                          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#1a1a1a' },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1a1a1a', borderWidth: '1px' }
                        }}
                      >
                        <MenuItem value="">Unassigned</MenuItem>
                        {trainers.map((t: any) => (
                          <MenuItem key={t._id} value={t._id}>
                            {t.fullName} ({t.specialization})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>
              );
            })}
            {filteredMembers.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 6, color: '#949494' }}>
                  {membersLoading ? 'Loading members list...' : 'No members registered yet.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
