import { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Container, Grid, Link as MuiLink } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router';
import { useToast } from '../context/ToastContext';
import api from '../api';

export const ForgotPassword = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [sendLoading, setSendLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast('Please enter your registered email address', 'warning');
      return;
    }
    setSendLoading(true);
    try {
      const res = await api.post('/api/auth/forgot-password', { email });
      showToast(res.data.message || 'Reset code sent successfully!', 'success');
      setStep(2);
      setTimer(60);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to send recovery code';
      showToast(errMsg, 'error');
    } finally {
      setSendLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !newPassword || !confirmPassword) {
      showToast('Please fill in all recovery fields', 'warning');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    setResetLoading(true);
    try {
      const res = await api.post('/api/auth/reset-password', { email, otp, newPassword });
      showToast(res.data.message || 'Password reset successfully!', 'success');
      navigate('/signin');
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || 'Password reset failed';
      showToast(errMsg, 'error');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        backgroundColor: '#ffffff',
      }}
    >
      <Grid container>
        {/* Left Side: Editorial Branding / Image (Hidden on Mobile) */}
        <Grid
          size={{ xs: 0, md: 6 }}
          sx={{
            display: { xs: 'none', md: 'block' },
            position: 'relative',
            backgroundColor: '#f2f2f2',
            borderRight: '1px solid #e6e6e6',
          }}
        >
          <Box
            component="img"
            src="/gym_hero_cinematic.jpg"
            alt="gymOS Strength Lab"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'grayscale(100%) brightness(50%) contrast(105%)',
            }}
          />
          {/* Custom Overlay Logotype */}
          <Box
            sx={{
              position: 'absolute',
              top: '40px',
              left: '40px',
              color: '#ffffff',
              zIndex: 3,
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 900,
                fontSize: '32px',
                letterSpacing: '-1.5px',
              }}
            >
              S/ gymOS
            </Typography>
          </Box>
        </Grid>

        {/* Right Side: Form Content */}
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: { xs: 3, md: 8 },
            py: 6,
          }}
        >
          <Container maxWidth="xs" sx={{ px: 0 }}>
            {/* Header / Logo for mobile view */}
            <Box sx={{ mb: 6 }}>
              <MuiLink
                component={RouterLink}
                to="/"
                sx={{
                  display: { xs: 'inline-flex', md: 'none' },
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 900,
                  fontSize: '28px',
                  color: '#000000',
                  letterSpacing: '-1.5px',
                  mb: 4,
                  textDecoration: 'none',
                }}
              >
                S/ gymOS
              </MuiLink>
              
              <Typography
                variant="h2"
                sx={{
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  fontSize: '32px',
                  letterSpacing: '-0.02em',
                  mb: 1.5,
                }}
              >
                Reset Password
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '15px' }}>
                Recover your strength locker. Verifying identity via dynamic OTP.
              </Typography>
            </Box>

            {/* STEP 1: Enter Email */}
            {step === 1 && (
              <Box component="form" onSubmit={handleSendCode} noValidate>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
                  <TextField
                    label="Email Address"
                    type="email"
                    fullWidth
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter registered email"
                  />
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={sendLoading}
                  sx={{
                    py: 2,
                    fontSize: '16px',
                    fontWeight: 700,
                    backgroundColor: '#1a1a1a',
                    color: '#ffffff',
                    '&:hover': { backgroundColor: '#000000' },
                    mb: 4,
                  }}
                >
                  {sendLoading ? 'Requesting Code...' : 'Send Recovery Code'}
                </Button>
              </Box>
            )}

            {/* STEP 2: Enter Code & New Password */}
            {step === 2 && (
              <Box component="form" onSubmit={handleResetPassword} noValidate>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    Check your recovery inbox at <strong>{email}</strong> for your 6-digit verification code.
                  </Typography>
                  
                  <TextField
                    label="6-Digit Reset Code"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    slotProps={{
                      htmlInput: { maxLength: 6, style: { textAlign: 'center', letterSpacing: '4px', fontWeight: 800 } }
                    }}
                  />

                  <TextField
                    label="New Password"
                    type="password"
                    fullWidth
                    variant="outlined"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />

                  <TextField
                    label="Confirm New Password"
                    type="password"
                    fullWidth
                    variant="outlined"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={resetLoading}
                  sx={{
                    py: 2,
                    fontSize: '16px',
                    fontWeight: 700,
                    backgroundColor: '#1a1a1a',
                    color: '#ffffff',
                    '&:hover': { backgroundColor: '#000000' },
                    mb: 3,
                  }}
                >
                  {resetLoading ? 'Resetting Password...' : 'Verify & Reset Password'}
                </Button>

                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Button
                    onClick={handleSendCode}
                    disabled={timer > 0 || sendLoading}
                    sx={{ color: '#1a1a1a', fontWeight: 700, textTransform: 'none' }}
                  >
                    {timer > 0 ? `Resend Code in ${timer}s` : 'Resend Code'}
                  </Button>
                </Box>
              </Box>
            )}

            {/* Footer Navigation */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5 }}>
              <MuiLink
                component={RouterLink}
                to="/signin"
                sx={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '14px',
                  color: 'text.primary',
                  textDecoration: 'none',
                  fontWeight: 500,
                  '&:hover': { color: 'text.secondary' },
                }}
              >
                ← Back to Sign In
              </MuiLink>
            </Box>
          </Container>
        </Grid>
      </Grid>
    </Box>
  );
};
export default ForgotPassword;
