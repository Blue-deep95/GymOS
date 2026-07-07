import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Card, CardContent, Grid, Divider } from '@mui/material';
import { useFetch, useMutation } from '../../hooks/useApi';
import { useToast } from '../../context/ToastContext';

export const MemberProfile: React.FC = () => {
  const { data: dashboardData, loading: fetchLoading, refetch } = useFetch('/api/member/dashboard');
  const profileMutation = useMutation('/api/member/profile', 'PUT');
  const { showToast } = useToast();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [fitnessGoals, setFitnessGoals] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');

  // Populate state once data is fetched
  useEffect(() => {
    if (dashboardData?.member) {
      const { member } = dashboardData;
      setFullName(member.fullName || '');
      setPhone(member.phone || '');
      setEmergencyContact(member.emergencyContact || '');
      setFitnessGoals(member.fitnessGoals || '');
      setMedicalNotes(member.medicalNotes || '');
    }
  }, [dashboardData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !emergencyContact) {
      showToast('Please fill in all required profile settings.', 'warning');
      return;
    }

    try {
      await profileMutation.execute({
        fullName,
        phone,
        emergencyContact,
        fitnessGoals,
        medicalNotes
      });
      showToast('Profile settings updated successfully!', 'success');
      refetch();
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to update profile settings';
      showToast(errMsg, 'error');
    }
  };

  if (fetchLoading && !dashboardData) {
    return (
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          Loading profile details...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
      <Box sx={{ mb: 4 }}>
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
          Profile Settings
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          View or update your personal parameters, contact information, and medical notes.
        </Typography>
      </Box>

      <Card elevation={0} sx={{ border: '1px solid #e6e6e6', borderRadius: '8px', backgroundColor: '#ffffff' }}>
        <CardContent sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1a1a1a', mb: 3, textTransform: 'uppercase' }}>
              Personal Credentials
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
                  value={dashboardData?.member?.email || ''}
                  slotProps={{
                    input: { readOnly: true }
                  }}
                  helperText="Contact system owner to alter registered login email"
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
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Emergency Contact Info"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  required
                  placeholder="Name, relation, and phone number"
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 4, borderColor: '#e6e6e6' }} />

            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1a1a1a', mb: 3, textTransform: 'uppercase' }}>
              Laboratory Record Notes
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Fitness & Strength Goals"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={fitnessGoals}
                  onChange={(e) => setFitnessGoals(e.target.value)}
                  multiline
                  rows={3}
                  placeholder="Tell your coach what you want to achieve..."
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Medical Clearances & Injuries"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={medicalNotes}
                  onChange={(e) => setMedicalNotes(e.target.value)}
                  multiline
                  rows={3}
                  placeholder="Detail any cardiac history, chronic joint pains, or training constraints..."
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              variant="contained"
              disabled={profileMutation.loading}
              sx={{
                py: 1.5,
                px: 4,
                fontSize: '15px',
                fontWeight: 700,
                backgroundColor: '#1a1a1a',
                color: '#ffffff',
                textTransform: 'none',
                borderRadius: '4px',
                '&:hover': { backgroundColor: '#000000' }
              }}
            >
              {profileMutation.loading ? 'Saving Changes...' : 'Save Profile Settings'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
export default MemberProfile;
