import React, { useState } from 'react';
import { Box, Typography, Container, Card, CardContent, Button, TextField, Grid, Divider } from '@mui/material';
import { useSearchParams, useNavigate } from 'react-router';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';

export const ConfirmPurchase: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { token, setAuthData } = useAuth();

  const planType = searchParams.get('planType') || '3 Months';
  const price = searchParams.get('price') || '$135';

  const [loading, setLoading] = useState(false);
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Calculate dates
  const startDate = new Date();
  const endDate = new Date();
  if (planType === '1 Month') endDate.setMonth(endDate.getMonth() + 1);
  else if (planType === '3 Months') endDate.setMonth(endDate.getMonth() + 3);
  else if (planType === '6 Months') endDate.setMonth(endDate.getMonth() + 6);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardName || !cardNumber) {
      showToast('Please fill in card details to verify purchase eligibility.', 'error');
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/member/purchase', { planType });
      showToast('Membership purchased successfully! Welcome to the lab.', 'success');
      
      // Update session token/role if user's role upgraded from user -> member
      setAuthData(token, 'member');

      navigate('/member/dashboard');
    } catch (err: any) {
      showToast(err.response?.data?.message || err.message || 'Failed to complete transaction', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box sx={{ mb: 5 }}>
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
          Confirm Package Acquisition
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Complete subscription details to activate your training locker.
        </Typography>
      </Box>

      <Card
        elevation={0}
        sx={{
          border: '1px solid #e6e6e6',
          borderLeft: '4px solid #fdf313',
          borderRadius: '8px',
          backgroundColor: '#ffffff',
          mb: 4
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 800 }}>
            Selected Plan
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#1a1a1a' }}>
              {planType} Membership
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#1a1a1a' }}>
              {price}
            </Typography>
          </Box>
          <Divider sx={{ my: 2, borderColor: '#e6e6e6' }} />
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, my: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">Activation Date</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>{startDate.toLocaleDateString()}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">Expiry Date</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>{endDate.toLocaleDateString()}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">Access Tier</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>Standard Laboratory Floor</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Card elevation={0} sx={{ border: '1px solid #e6e6e6', borderRadius: '8px', backgroundColor: '#ffffff' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 850, color: '#1a1a1a', mb: 3, textTransform: 'uppercase' }}>
            Dummy Payment Verification
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Name on Card"
                  required
                  fullWidth
                  size="small"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Dummy Card Number"
                  required
                  fullWidth
                  size="small"
                  placeholder="xxxx xxxx xxxx xxxx"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Expiry (MM/YY)"
                  required
                  fullWidth
                  size="small"
                  placeholder="MM/YY"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="CVV"
                  required
                  fullWidth
                  size="small"
                  type="password"
                  placeholder="xxx"
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value)}
                />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/plans')}
                sx={{
                  py: 1.5,
                  borderRadius: '6px',
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: '#e6e6e6',
                  color: '#1a1a1a',
                  '&:hover': { borderColor: '#1a1a1a' }
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  py: 1.5,
                  borderRadius: '6px',
                  textTransform: 'none',
                  fontWeight: 700,
                  backgroundColor: '#1a1a1a',
                  color: '#ffffff',
                  '&:hover': { backgroundColor: '#000000' }
                }}
              >
                {loading ? 'Processing...' : 'Confirm Acquisition'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};
export default ConfirmPurchase;
