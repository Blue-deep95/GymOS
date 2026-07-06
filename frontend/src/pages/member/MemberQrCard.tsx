import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, CircularProgress, LinearProgress, Button } from '@mui/material';
import api from '../../api';
import { useToast } from '../../context/ToastContext';

export const MemberQrCard: React.FC = () => {
  const { showToast } = useToast();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(25);

  const fetchToken = async () => {
    try {
      const res = await api.get('/api/member/check-in-token');
      if (res && res.data && res.data.token) {
        setToken(res.data.token);
        setTimeLeft(25);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to refresh check-in token', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchToken();
  }, []);

  useEffect(() => {
    if (loading || !token) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          fetchToken();
          return 25;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [token, loading]);

  return (
    <Box sx={{ maxWidth: '480px', mx: 'auto', py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography
          variant="h4"
          sx={{
            fontFamily: "'Suisse Intl', 'Manrope', sans-serif",
            fontWeight: 900,
            color: '#1a1a1a',
            letterSpacing: '-1.5px',
            textTransform: 'uppercase'
          }}
        >
          Check-In Card
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Present this dynamic card to the reception scanner to check in.
        </Typography>
      </Box>

      <Card
        elevation={0}
        sx={{
          border: '1px solid #1a1a1a',
          borderRadius: '12px',
          overflow: 'hidden',
          backgroundColor: '#ffffff',
          position: 'relative'
        }}
      >
        {/* Top Electric Yellow accent bar */}
        <Box sx={{ height: '8px', backgroundColor: '#fdf313' }} />

        <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          {loading ? (
            <Box sx={{ py: 8 }}>
              <CircularProgress color="inherit" size={40} />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontWeight: 700 }}>
                Generating secure token...
              </Typography>
            </Box>
          ) : token ? (
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* QR Image Container */}
              <Box
                sx={{
                  p: 2,
                  border: '2px solid #1a1a1a',
                  borderRadius: '12px',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  mb: 4
                }}
              >
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(token)}`}
                  alt="Check-in QR Code"
                  style={{ display: 'block', width: '220px', height: '220px' }}
                />
              </Box>

              {/* Countdown Tracker */}
              <Box sx={{ width: '100%', mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', color: '#757575' }}>
                    Dynamic Refresh Token
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#1a1a1a' }}>
                    Refreshes in {timeLeft}s
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(timeLeft / 25) * 100}
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

              <Typography variant="body2" sx={{ fontWeight: 700, color: '#949494', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Secure Access token
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', wordBreak: 'break-all', mt: 0.5, opacity: 0.7, fontFamily: 'monospace' }}>
                {token.slice(-32)}
              </Typography>

              <Button
                variant="outlined"
                onClick={fetchToken}
                sx={{
                  mt: 4,
                  borderColor: '#e6e6e6',
                  color: '#1a1a1a',
                  textTransform: 'none',
                  fontWeight: 800,
                  fontSize: '13px',
                  borderRadius: '8px',
                  px: 3,
                  py: 1,
                  '&:hover': { borderColor: '#1a1a1a', backgroundColor: '#f2f2f2' }
                }}
              >
                🔄 Refresh Code Now
              </Button>
            </Box>
          ) : (
            <Box sx={{ py: 6 }}>
              <Typography color="error" variant="body2" sx={{ fontWeight: 800 }}>
                Failed to generate check-in card.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
export default MemberQrCard;
