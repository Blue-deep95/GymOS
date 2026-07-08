import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Card, CardContent, Button, Divider, Alert, CircularProgress } from '@mui/material';
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
  const price = searchParams.get('price') || '₹3,500';

  // Read callback variables returned by Razorpay Payment Link redirect
  const razorpayPaymentId = searchParams.get('razorpay_payment_id');
  const paymentLinkStatus = searchParams.get('razorpay_payment_link_status');

  const [loading, setLoading] = useState(false);
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [isSimulatedMode, setIsSimulatedMode] = useState(false);
  const [simulatedOrderDetails, setSimulatedOrderDetails] = useState<any>(null);

  // Calculate dates
  const startDate = new Date();
  const endDate = new Date();
  if (planType === '1 Month') endDate.setMonth(endDate.getMonth() + 1);
  else if (planType === '3 Months') endDate.setMonth(endDate.getMonth() + 3);
  else if (planType === '6 Months') endDate.setMonth(endDate.getMonth() + 6);

  // 1. Check on mount: If redirected back from Razorpay, verify payment status
  useEffect(() => {
    const verifyPayment = async () => {
      if (razorpayPaymentId && paymentLinkStatus === 'paid') {
        setVerifyingPayment(true);
        try {
          const res = await api.post('/api/member/purchase/verify', {
            razorpay_payment_id: razorpayPaymentId,
            planType
          });
          showToast(res.data.message || 'Payment verified successfully!', 'success');
          setAuthData(token, 'member');
          navigate('/member/dashboard');
        } catch (err: any) {
          const errMsg = err.response?.data?.message || 'Verification failed';
          showToast(errMsg, 'error');
        } finally {
          setVerifyingPayment(false);
        }
      }
    };
    verifyPayment();
  }, [razorpayPaymentId, paymentLinkStatus, navigate, planType, token, setAuthData, showToast]);

  // 2. Initiate transaction: Request Payment Link from backend
  const handleProceedToPayment = async () => {
    setLoading(true);
    try {
      const res = await api.post('/api/member/purchase/order', { planType });
      const { paymentLinkUrl, paymentLinkId, simulated } = res.data;

      if (simulated) {
        setIsSimulatedMode(true);
        setSimulatedOrderDetails({ orderId: paymentLinkId, planType });
        return;
      }

      if (paymentLinkUrl) {
        // Redirect browser directly to Razorpay's secure hosted payment page!
        window.location.href = paymentLinkUrl;
      } else {
        showToast('Checkout link not returned by server.', 'error');
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || 'Error generating payment session';
      showToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  // 3. Simulated checkout validation (Offline/Mock)
  const handleSimulatedSuccess = async () => {
    if (!simulatedOrderDetails) return;
    setLoading(true);
    try {
      const verifyRes = await api.post('/api/member/purchase/verify', {
        razorpay_payment_id: `pay_mock_${Date.now()}`,
        planType
      });
      showToast(verifyRes.data.message || 'Simulated transaction successful!', 'success');
      setAuthData(token, 'member');
      navigate('/member/dashboard');
    } catch (err: any) {
      showToast('Simulated verification failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (verifyingPayment) {
    return (
      <Container maxWidth="sm" sx={{ py: 12, textAlign: 'center' }}>
        <Card elevation={0} sx={{ border: '1px solid #e6e6e6', borderRadius: '8px', p: 6 }}>
          <CircularProgress color="inherit" sx={{ mb: 3 }} />
          <Typography variant="h5" sx={{ fontWeight: 900, mb: 1, textTransform: 'uppercase' }}>
            Verifying Transaction
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please wait while we confirm your payment status with Razorpay. Do not close or refresh this page.
          </Typography>
        </Card>
      </Container>
    );
  }

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
          Secure transaction powered by Razorpay hosted checkout page.
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

      {/* Payment Interface Render Block */}
      <Card elevation={0} sx={{ border: '1px solid #e6e6e6', borderRadius: '8px', backgroundColor: '#ffffff' }}>
        <CardContent sx={{ p: 4 }}>
          {!isSimulatedMode ? (
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 850, color: '#1a1a1a', mb: 3, textTransform: 'uppercase' }}>
                Hosted Payment Checkout
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Upon clicking pay, you will be redirected to Razorpay's secure payment page. After paying, you will automatically return here to complete activation.
              </Typography>

              <Box sx={{ display: 'flex', gap: 2 }}>
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
                  onClick={handleProceedToPayment}
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
                  {loading ? 'Generating Link...' : 'Pay Now'}
                </Button>
              </Box>
            </Box>
          ) : (
            <Box>
              <Alert severity="info" sx={{ mb: 3 }}>
                Running in <strong>Simulated Sandbox Fallback Mode</strong>. Credentials are mocked.
              </Alert>
              <Typography variant="subtitle2" sx={{ fontWeight: 850, color: '#1a1a1a', mb: 2, textTransform: 'uppercase' }}>
                Simulate Transaction Success
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Since the payment client is offline/simulated, click below to verify a mock payment signature and activate your standard membership plan.
              </Typography>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => setIsSimulatedMode(false)}
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
                  Back
                </Button>
                <Button
                  onClick={handleSimulatedSuccess}
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    borderRadius: '6px',
                    textTransform: 'none',
                    fontWeight: 700,
                    backgroundColor: '#fdf313',
                    color: '#1a1a1a',
                    '&:hover': { backgroundColor: '#e2d910' }
                  }}
                >
                  {loading ? 'Verifying...' : 'Simulate Success'}
                </Button>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};
export default ConfirmPurchase;
