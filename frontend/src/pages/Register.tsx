import { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Container, Grid, Link as MuiLink, Alert } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api';

export const Register = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [fitnessGoals, setFitnessGoals] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');

  const [sendLoading, setSendLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [demoOtp, setDemoOtp] = useState('');

  const navigate = useNavigate();
  const { setAuthData } = useAuth();
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

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast('Please enter your email address', 'warning');
      return;
    }
    setSendLoading(true);
    try {
      const res = await api.post('/api/otp/send', { email });
      showToast(res.data.message || 'Verification code sent!', 'success');
      if (res.data?.otp) {
        setDemoOtp(res.data.otp);
      }
      setStep(2);
      setTimer(60); // 60s cooldown for resends
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to send OTP';
      showToast(errMsg, 'error');
    } finally {
      setSendLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      showToast('Please enter the 6-digit code', 'warning');
      return;
    }
    setVerifyLoading(true);
    try {
      const res = await api.post('/api/otp/verify', { email, otp });
      showToast(res.data.message || 'Email verified successfully!', 'success');
      setStep(3);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || 'OTP verification failed';
      showToast(errMsg, 'error');
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !password || !phone || !emergencyContact) {
      showToast('Please fill in all required profile details', 'warning');
      return;
    }
    setRegisterLoading(true);
    try {
      const response = await api.post('/api/auth/register', {
        fullName,
        email,
        password,
        phone,
        emergencyContact,
        fitnessGoals,
        medicalNotes,
      });
      if (response && response.data?.accessToken) {
        setAuthData(response.data.accessToken, response.data.user.role);
        showToast('Registration successful! Welcome to gymOS.', 'success');
        navigate('/');
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || 'Registration failed';
      showToast(errMsg, 'error');
    } finally {
      setRegisterLoading(false);
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
          size={{ xs: 0, md: 5 }}
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
          size={{ xs: 12, md: 7 }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: { xs: 3, md: 8 },
            py: 6,
          }}
        >
          <Container maxWidth="sm" sx={{ px: 0 }}>
            {/* Header / Logo for mobile view */}
            <Box sx={{ mb: 4 }}>
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
                Register
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '15px' }}>
                Join the Strength Lab. Verify your email to activate your profile.
              </Typography>
            </Box>

            {/* STEP 1: Enter Email */}
            {step === 1 && (
              <Box component="form" onSubmit={handleSendOtp} noValidate>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
                  <TextField
                    label="Email Address"
                    type="email"
                    fullWidth
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter email to receive code"
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
                  {sendLoading ? 'Sending Code...' : 'Send Verification Code'}
                </Button>
              </Box>
            )}

            {/* STEP 2: Enter Verification Code */}
            {step === 2 && (
              <Box component="form" onSubmit={handleVerifyOtp} noValidate>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    We've emailed a verification code to <strong>{email}</strong>. Please check your inbox.
                  </Typography>

                  {demoOtp && (
                    <Alert severity="warning" sx={{ mb: 3, fontWeight: 700 }}>
                      [DEMO MODE] For test purposes, your verification code is: {demoOtp}
                    </Alert>
                  )}
                  <TextField
                    label="6-Digit Verification Code"
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
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={verifyLoading}
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
                  {verifyLoading ? 'Verifying Code...' : 'Verify & Continue'}
                </Button>

                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Button
                    onClick={handleSendOtp}
                    disabled={timer > 0 || sendLoading}
                    sx={{ color: '#1a1a1a', fontWeight: 700, textTransform: 'none' }}
                  >
                    {timer > 0 ? `Resend Code in ${timer}s` : 'Resend Code'}
                  </Button>
                </Box>
              </Box>
            )}

            {/* STEP 3: Complete Account Setup */}
            {step === 3 && (
              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Typography variant="subtitle2" sx={{ color: 'success.main', fontWeight: 800, mb: 3 }}>
                  ✓ Email verified. Please fill in your profile settings.
                </Typography>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Full Name"
                      type="text"
                      fullWidth
                      variant="outlined"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Email Address"
                      type="email"
                      fullWidth
                      disabled
                      variant="outlined"
                      value={email}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Password"
                      type="password"
                      fullWidth
                      variant="outlined"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Phone Number"
                      type="tel"
                      fullWidth
                      variant="outlined"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="Emergency Contact Info"
                      type="text"
                      fullWidth
                      variant="outlined"
                      value={emergencyContact}
                      onChange={(e) => setEmergencyContact(e.target.value)}
                      placeholder="Name, relationship, and phone number"
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="Fitness & Strength Goals"
                      type="text"
                      fullWidth
                      variant="outlined"
                      value={fitnessGoals}
                      onChange={(e) => setFitnessGoals(e.target.value)}
                      placeholder="e.g. increase deadlift max, improve metabolic conditioning"
                      multiline
                      rows={2}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="Medical Clearances & Notes (Optional)"
                      type="text"
                      fullWidth
                      variant="outlined"
                      value={medicalNotes}
                      onChange={(e) => setMedicalNotes(e.target.value)}
                      placeholder="List any injuries, cardiac warnings, or training constraints"
                      multiline
                      rows={2}
                    />
                  </Grid>
                </Grid>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={registerLoading}
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
                  {registerLoading ? 'Completing Registration...' : 'Submit Profile & Log In'}
                </Button>
              </Box>
            )}

            {/* Footer Links */}
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
                Already have an account? Sign In →
              </MuiLink>
              <MuiLink
                component={RouterLink}
                to="/"
                sx={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '14px',
                  color: 'text.secondary',
                  textDecoration: 'none',
                  '&:hover': { color: 'text.primary' },
                }}
              >
                Back to home
              </MuiLink>
            </Box>
          </Container>
        </Grid>
      </Grid>
    </Box>
  );
};
export default Register;
