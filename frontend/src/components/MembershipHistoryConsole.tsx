import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, CircularProgress } from '@mui/material';
import api from '../api';

interface FreezeEvent {
  frozenAt: string;
  unfrozenAt?: string;
  _id: string;
}

interface MembershipRecord {
  _id: string;
  planType: string;
  startDate: string;
  endDate: string;
  status: string;
  price?: number;
  totalFrozenDays?: number;
  freezeHistory?: FreezeEvent[];
}

interface MembershipHistoryConsoleProps {
  memberId: string | null;
  memberName: string;
  open: boolean;
  onClose: () => void;
}

export const MembershipHistoryConsole: React.FC<MembershipHistoryConsoleProps> = ({
  memberId,
  memberName,
  open,
  onClose
}) => {
  const [history, setHistory] = useState<MembershipRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && memberId) {
      const fetchHistory = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await api.get(`/api/receptionist/members/${memberId}/memberships`);
          if (response && response.data && response.data.history) {
            setHistory(response.data.history);
          }
        } catch (err: any) {
          setError(err.message || 'Failed to retrieve membership ledger');
        } finally {
          setLoading(false);
        }
      };
      fetchHistory();
    }
  }, [open, memberId]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontFamily: "'Suisse Intl', 'Manrope', sans-serif", fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.5px' }}>
        Membership Ledger: {memberName}
      </DialogTitle>
      <DialogContent dividers sx={{ p: 4 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress color="inherit" size={32} />
          </Box>
        ) : error ? (
          <Typography color="error" variant="body2">{error}</Typography>
        ) : history.length === 0 ? (
          <Typography variant="body2" color="text.secondary">No historical membership records registered for this member.</Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e6e6e6', borderRadius: '8px' }}>
              <Table aria-label="membership history table">
                <TableHead sx={{ backgroundColor: '#f2f2f2' }}>
                  <TableRow sx={{ borderBottom: '1px solid #1a1a1a' }}>
                    <TableCell sx={{ fontWeight: 700 }}>Package</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Price</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Start Date</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>End Date</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Days Frozen</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {history.map((record) => (
                    <TableRow key={record._id} sx={{ borderBottom: '1px solid #e6e6e6' }}>
                      <TableCell sx={{ fontWeight: 600 }}>{record.planType}</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>₹{record.price || 0}</TableCell>
                      <TableCell>{new Date(record.startDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(record.endDate).toLocaleDateString()}</TableCell>
                      <TableCell align="center">{record.totalFrozenDays || 0} days</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: 'inline-block',
                            px: 1,
                            py: 0.2,
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            backgroundColor:
                              record.status === 'Active'
                                ? '#1a1a1a'
                                : record.status === 'Frozen'
                                ? '#fdf313'
                                : '#f2f2f2',
                            color: record.status === 'Frozen' ? '#1a1a1a' : record.status === 'Active' ? '#ffffff' : '#949494'
                          }}
                        >
                          {record.status}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Freeze Logs Timeline */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, textTransform: 'uppercase', color: '#1a1a1a' }}>
                Freeze & Pauses Timeline logs
              </Typography>
              {history.some((h) => h.freezeHistory && h.freezeHistory.length > 0) ? (
                <Box sx={{ borderLeft: '2px solid #fdf313', pl: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {history.map((record) =>
                    (record.freezeHistory || []).map((f) => (
                      <Box key={f._id} sx={{ py: 0.5 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                          [{record.planType}] contract paused
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Frozen: {new Date(f.frozenAt).toLocaleString()}
                          {f.unfrozenAt
                            ? ` → Unfrozen: ${new Date(f.unfrozenAt).toLocaleString()}`
                            : ' (Currently Paused)'}
                        </Typography>
                      </Box>
                    ))
                  )}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">No contract pause actions logged for this member.</Typography>
              )}
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={onClose}
          sx={{
            color: '#1a1a1a',
            fontWeight: 700,
            textTransform: 'none',
            '&:hover': { backgroundColor: '#f2f2f2' }
          }}
        >
          Close Ledger
        </Button>
      </DialogActions>
    </Dialog>
  );
};
