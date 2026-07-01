import React, { useState } from 'react';
import { Box, Typography, TextField, InputAdornment, List, ListItem, ListItemText, ListItemSecondaryAction, Button, Card, CardContent, Alert } from '@mui/material';
import { useFetch, useMutation } from '../../hooks/useApi';

export const CheckInDesk: React.FC = () => {
  const { data: membersData } = useFetch('/api/receptionist/members');
  const [search, setSearch] = useState('');
  const [log, setLog] = useState<Array<{ name: string; time: string; status: 'success' | 'error'; message: string }>>([]);
  const checkInMutation = useMutation('/api/receptionist/attendance/check-in', 'POST');

  const members = membersData?.members || [];

  const filteredMembers = search.trim() === '' ? [] : members.filter((member: any) =>
    member.fullName.toLowerCase().includes(search.toLowerCase()) ||
    member.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleCheckIn = async (member: any) => {
    try {
      await checkInMutation.execute({ memberId: member._id });
      const newEntry = {
        name: member.fullName,
        time: new Date().toLocaleTimeString(),
        status: 'success' as const,
        message: 'Checked in successfully'
      };
      setLog(prev => [newEntry, ...prev]);
      setSearch('');
    } catch (err: any) {
      const newEntry = {
        name: member.fullName,
        time: new Date().toLocaleTimeString(),
        status: 'error' as const,
        message: err.message || 'Already checked in today'
      };
      setLog(prev => [newEntry, ...prev]);
      setSearch('');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
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
          Check-In Desk
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Scan or search member accounts to log daily attendance. Duplicates are blocked.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Left Side: Check-in Search */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card elevation={0} sx={{ border: '1px solid #e6e6e6', borderRadius: '8px', backgroundColor: '#ffffff', minHeight: '300px' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, color: '#1a1a1a', mb: 3 }}>
                Search Member Account
              </Typography>
              <TextField
                placeholder="Type member name or email to search..."
                variant="outlined"
                fullWidth
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{
                  mb: 3,
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

              {/* Search Results */}
              {search.trim() !== '' && (
                <List sx={{ border: '1px solid #e6e6e6', borderRadius: '8px', overflow: 'hidden', p: 0 }}>
                  {filteredMembers.map((member: any) => (
                    <ListItem
                      key={member._id}
                      sx={{
                        borderBottom: '1px solid #e6e6e6',
                        '&:last-child': { borderBottom: 'none' },
                        '&:hover': { backgroundColor: '#f2f2f2' },
                        py: 2
                      }}
                    >
                      <ListItemText
                        primary={<Typography sx={{ fontWeight: 600, color: '#1a1a1a' }}>{member.fullName}</Typography>}
                        secondary={<Typography variant="caption" color="text.secondary">{member.email}</Typography>}
                      />
                      <ListItemSecondaryAction>
                        <Button
                          variant="contained"
                          onClick={() => handleCheckIn(member)}
                          sx={{
                            backgroundColor: '#1a1a1a',
                            color: '#ffffff',
                            fontWeight: 600,
                            textTransform: 'none',
                            borderRadius: '4px',
                            '&:hover': { backgroundColor: '#000000' }
                          }}
                        >
                          Check In
                        </Button>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                  {filteredMembers.length === 0 && (
                    <ListItem sx={{ py: 3, justify: 'center' }}>
                      <Typography variant="body2" color="text.secondary">No matching members found.</Typography>
                    </ListItem>
                  )}
                </List>
              )}

              {search.trim() === '' && (
                <Box sx={{ py: 6, textAlign: 'center', border: '1px dashed #e6e6e6', borderRadius: '8px' }}>
                  <Typography variant="body2" color="text.secondary">
                    Search result entries will appear here.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Right Side: Live Log Feed */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card elevation={0} sx={{ border: '1px solid #e6e6e6', borderRadius: '8px', backgroundColor: '#ffffff', height: '100%' }}>
            <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Typography variant="h6" sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, color: '#1a1a1a', mb: 3 }}>
                Live Attendance Feed
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1, overflowY: 'auto', maxH: '350px' }}>
                {log.map((entry, idx) => (
                  <Alert
                    key={idx}
                    severity={entry.status === 'success' ? 'success' : 'error'}
                    variant="outlined"
                    sx={{
                      borderRadius: '8px',
                      fontFamily: "'Manrope', sans-serif",
                      borderColor: entry.status === 'success' ? '#e6e6e6' : '#fdf313',
                      backgroundColor: entry.status === 'success' ? 'transparent' : '#fdf31310',
                      '& .MuiAlert-icon': {
                        color: entry.status === 'success' ? '#1a1a1a' : '#fdf313'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                        {entry.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        {entry.time}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {entry.message}
                    </Typography>
                  </Alert>
                ))}
                {log.length === 0 && (
                  <Box sx={{ py: 6, textAlign: 'center', color: '#949494', my: 'auto' }}>
                    No check-ins logged during this active desk session.
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

// Add standard imports helper (Grid)
import { Grid } from '@mui/material';
