import React, { useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, TextField, InputAdornment, Button } from '@mui/material';
import { useFetch, useMutation } from '../../hooks/useApi';
import { useToast } from '../../context/ToastContext';
import { MembershipHistoryConsole } from '../../components/MembershipHistoryConsole';
export const MembersList: React.FC = () => {
  const { showToast } = useToast();
  const { data, loading, error, refetch } = useFetch('/api/owner/members');
  const [search, setSearch] = useState('');
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyMemberId, setHistoryMemberId] = useState<string | null>(null);
  const [historyMemberName, setHistoryMemberName] = useState('');

  const handleOpenHistory = (memberId: string, memberName: string) => {
    setHistoryMemberId(memberId);
    setHistoryMemberName(memberName);
    setHistoryOpen(true);
  };

  const freezeMutation = useMutation('', 'POST');

  const handleFreeze = async (memberId: string) => {
    try {
      const url = `/api/receptionist/members/${memberId}/freeze`;
      await freezeMutation.execute(null, { url });
      showToast('Membership status toggled successfully', 'success');
      refetch();
    } catch (err: any) {
      showToast(err.message || 'Failed to toggle freeze state', 'error');
    }
  };

  const members = data?.members || [];

  const filteredMembers = members.filter((member: any) => 
    member.fullName.toLowerCase().includes(search.toLowerCase()) ||
    member.email.toLowerCase().includes(search.toLowerCase()) ||
    (member.assignedTrainer?.fullName || 'None').toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return { bg: '#1a1a1a', text: '#ffffff' }; // High-contrast dark active status
      case 'Frozen':
        return { bg: '#f2ede9', text: '#1a1a1a' }; // Warm neutral cream stone
      case 'Expired':
        return { bg: '#fdf313', text: '#1a1a1a' }; // Electric yellow highlight warning
      default:
        return { bg: '#f2f2f2', text: '#949494' }; // Muted grey
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
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
            Member Directory
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Search and manage member accounts, subscription states, and trainer assignments.
          </Typography>
        </Box>
      </Box>

      {error && (
        <Box sx={{ mb: 3 }}>
          <Typography color="error" variant="body2" sx={{ fontWeight: 600 }}>
            {error}
          </Typography>
        </Box>
      )}

      {/* Filter Toolbar */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
        <TextField
          placeholder="Filter by name, email, or trainer..."
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
        <Table aria-label="members directory table">
          <TableHead sx={{ backgroundColor: '#f2f2f2' }}>
            <TableRow sx={{ borderBottom: '1px solid #e6e6e6' }}>
              <TableCell sx={{ fontWeight: 700, color: '#1a1a1a' }}>Full Name</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1a1a1a' }}>Email Address</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1a1a1a' }}>Phone Number</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1a1a1a' }}>Subscription</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1a1a1a' }}>Assigned Coach</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1a1a1a' }}>Primary Focus</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMembers.map((member: any) => {
              const status = member.currentMembership?.status || 'No Package';
              const statusColors = getStatusColor(status);
              return (
                <TableRow
                  key={member._id}
                  sx={{
                    borderBottom: '1px solid #e6e6e6',
                    '&:hover': { backgroundColor: '#f2f2f2' }
                  }}
                >
                  <TableCell component="th" scope="row">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                      <Typography sx={{ fontWeight: 600, color: '#1a1a1a' }}>{member.fullName}</Typography>
                      <Button
                        size="small"
                        onClick={() => handleOpenHistory(member._id, member.fullName)}
                        sx={{
                          p: 0,
                          fontSize: '11px',
                          textTransform: 'none',
                          fontWeight: 700,
                          color: '#757575',
                          minWidth: 'auto',
                          '&:hover': { color: '#1a1a1a', backgroundColor: 'transparent', textDecoration: 'underline' }
                        }}
                      >
                        📜 History
                      </Button>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: '#757575' }}>{member.email}</TableCell>
                  <TableCell sx={{ color: '#757575' }}>{member.phone || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip
                      label={status}
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
                    {member.currentMembership && (
                      <Button
                        size="small"
                        onClick={() => handleFreeze(member._id)}
                        sx={{
                          display: 'block',
                          mt: 1,
                          p: 0,
                          fontSize: '11px',
                          textTransform: 'none',
                          fontWeight: 700,
                          color: '#1a1a1a',
                          '&:hover': { textDecoration: 'underline', backgroundColor: 'transparent' }
                        }}
                      >
                        {status === 'Frozen' ? '❄️ Unfreeze' : '❄️ Freeze Plan'}
                      </Button>
                    )}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                    {member.assignedTrainer?.fullName || 'None'}
                  </TableCell>
                  <TableCell sx={{ color: '#757575' }}>{member.fitnessGoals || 'None'}</TableCell>
                </TableRow>
              );
            })}
            {filteredMembers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6, color: '#949494' }}>
                  {loading ? 'Fetching member directory...' : 'No members match the query parameters.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <MembershipHistoryConsole
        memberId={historyMemberId}
        memberName={historyMemberName}
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
      />
    </Box>
  );
};
export default MembersList;
