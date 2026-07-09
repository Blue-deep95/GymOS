import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, TextField, InputAdornment, List, ListItem, ListItemText, ListItemSecondaryAction, Button, Card, CardContent, Alert, Grid } from '@mui/material';
import { useFetch, useMutation } from '../../hooks/useApi';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface CheckInLog {
  name: string;
  time: string;
  status: 'success' | 'error';
  message: string;
}

export const CheckInDesk: React.FC = () => {
  const { data: membersData, refetch } = useFetch('/api/receptionist/members');
  const [search, setSearch] = useState('');
  const [log, setLog] = useState<CheckInLog[]>([]);
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string; details?: any } | null>(null);
  
  const checkInMutation = useMutation('/api/receptionist/attendance/check-in', 'POST');
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const lastScanTimeRef = useRef<number>(0);

  const members = membersData?.members || [];

  const filteredMembers = search.trim() === '' ? [] : members.filter((member: any) =>
    member.fullName.toLowerCase().includes(search.toLowerCase()) ||
    member.email.toLowerCase().includes(search.toLowerCase())
  );

  // Handle direct manual check-in
  const handleManualCheckIn = async (member: any) => {
    try {
      await checkInMutation.execute({ memberId: member._id });
      const newEntry = {
        name: member.fullName,
        time: new Date().toLocaleTimeString(),
        status: 'success' as const,
        message: 'Checked in manually'
      };
      setLog(prev => [newEntry, ...prev]);
      setScanResult({
        success: true,
        message: `Manual check-in successful for ${member.fullName}`,
        details: {
          fullName: member.fullName,
          email: member.email,
          assignedTrainerName: member.assignedTrainer?.fullName || 'Unassigned',
          planType: member.currentMembership?.planType || 'None'
        }
      });
      setSearch('');
      refetch();
    } catch (err: any) {
      const newEntry = {
        name: member.fullName,
        time: new Date().toLocaleTimeString(),
        status: 'error' as const,
        message: err.message || 'Already checked in today'
      };
      setLog(prev => [newEntry, ...prev]);
      setScanResult({
        success: false,
        message: err.message || 'Check-in failed'
      });
      setSearch('');
    }
  };

  // Handle scanned QR check-in token
  const handleQrCheckIn = async (token: string) => {
    try {
      const res = await checkInMutation.execute({ token });
      const memberInfo = res?.member || {};
      const newEntry = {
        name: memberInfo.fullName || 'Scanned Member',
        time: new Date().toLocaleTimeString(),
        status: 'success' as const,
        message: 'Checked in via QR Code'
      };
      setLog(prev => [newEntry, ...prev]);
      setScanResult({
        success: true,
        message: `Access Granted: Welcome back, ${memberInfo.fullName}!`,
        details: memberInfo
      });
      refetch();
    } catch (err: any) {
      const newEntry = {
        name: 'Check-in Attempt',
        time: new Date().toLocaleTimeString(),
        status: 'error' as const,
        message: err.message || 'Token verification failed'
      };
      setLog(prev => [newEntry, ...prev]);
      setScanResult({
        success: false,
        message: err.message || 'Verification failed. Try scanning a refreshed code.'
      });
    }
  };

  useEffect(() => {
    // Initialize HTML5 QR Code Scanner
    const scanner = new Html5QrcodeScanner(
      'qr-reader-container',
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true
      },
      false
    );

    scanner.render(
      (decodedText) => {
        // Handle successful scan
        if (decodedText) {
          const now = Date.now();
          if (now - lastScanTimeRef.current < 2000) {
            // Drop scan frames during throttle cooldown
            return;
          }
          lastScanTimeRef.current = now;
          handleQrCheckIn(decodedText);
        }
      },
      () => {
        // Verbose scan failures can be ignored to avoid spamming console
      }
    );

    scannerRef.current = scanner;

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => {
          console.warn('Failed to clear scanner during unmount:', err);
        });
      }
    };
  }, []);

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
          Scan dynamic member QR codes or lookup members manually to log check-in attendance.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Left Column: Live Webcam Scanner */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={0} sx={{ border: '1px solid #e6e6e6', borderRadius: '8px', backgroundColor: '#ffffff' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, color: '#1a1a1a', mb: 3 }}>
                📷 Live QR Scanner
              </Typography>
              
              <Box
                id="qr-reader-container"
                sx={{
                  width: '100%',
                  '& #html5-qrcode-button-camera-start, & #html5-qrcode-button-camera-stop': {
                    backgroundColor: '#1a1a1a',
                    color: '#ffffff',
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    marginTop: '10px',
                    '&:hover': { backgroundColor: '#000000' }
                  },
                  '& #html5-qrcode-anchor-scan-type-change': {
                    color: '#1a1a1a',
                    fontWeight: 700,
                    textDecoration: 'underline'
                  }
                }}
              />

              {scanResult && (
                <Box sx={{ mt: 4 }}>
                  <Alert
                    severity={scanResult.success ? 'success' : 'error'}
                    sx={{
                      borderRadius: '8px',
                      backgroundColor: scanResult.success ? 'rgba(46, 125, 50, 0.05)' : 'rgba(211, 47, 47, 0.05)',
                      border: `1px solid ${scanResult.success ? '#2e7d32' : '#d32f2f'}`
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      {scanResult.message}
                    </Typography>
                    {scanResult.success && scanResult.details && (
                      <Box sx={{ mt: 1.5 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          Plan: <strong>{scanResult.details.planType}</strong>
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          Trainer: <strong>{scanResult.details.assignedTrainerName}</strong>
                        </Typography>
                      </Box>
                    )}
                  </Alert>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column: Manual Lookup & Logs */}
        <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Manual Member Lookup Card */}
          <Card elevation={0} sx={{ border: '1px solid #e6e6e6', borderRadius: '8px', backgroundColor: '#ffffff' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, color: '#1a1a1a', mb: 3 }}>
                🔍 Manual Member Override
              </Typography>
              <TextField
                placeholder="Search member name or email to override..."
                variant="outlined"
                fullWidth
                size="small"
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

              {/* Search Result Dropdown List */}
              {search.trim() !== '' && (
                <List sx={{ border: '1px solid #e6e6e6', borderRadius: '8px', overflow: 'hidden', p: 0 }}>
                  {filteredMembers.map((member: any) => (
                    <ListItem
                      key={member._id}
                      sx={{
                        borderBottom: '1px solid #e6e6e6',
                        '&:last-child': { borderBottom: 'none' },
                        '&:hover': { backgroundColor: '#f2f2f2' },
                        py: 1.5
                      }}
                    >
                      <ListItemText
                        primary={<Typography sx={{ fontWeight: 600, color: '#1a1a1a' }}>{member.fullName}</Typography>}
                        secondary={<Typography variant="caption" color="text.secondary">{member.email}</Typography>}
                      />
                      <ListItemSecondaryAction>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleManualCheckIn(member)}
                          sx={{
                            backgroundColor: '#1a1a1a',
                            color: '#ffffff',
                            fontWeight: 700,
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
            </CardContent>
          </Card>

          {/* Session Logs Card */}
          <Card elevation={0} sx={{ border: '1px solid #e6e6e6', borderRadius: '8px', backgroundColor: '#ffffff', flexGrow: 1 }}>
            <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Typography variant="h6" sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, color: '#1a1a1a', mb: 3 }}>
                Live Attendance Feed
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto', maxH: '250px' }}>
                {log.map((entry, idx) => (
                  <Alert
                    key={idx}
                    severity={entry.status === 'success' ? 'success' : 'error'}
                    variant="outlined"
                    sx={{
                      borderRadius: '8px',
                      fontFamily: "'Manrope', sans-serif",
                      borderColor: entry.status === 'success' ? '#e6e6e6' : '#d32f2f',
                      backgroundColor: entry.status === 'success' ? 'transparent' : 'rgba(211, 47, 47, 0.02)',
                      '& .MuiAlert-icon': {
                        color: entry.status === 'success' ? '#1a1a1a' : '#d32f2f'
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
export default CheckInDesk;
