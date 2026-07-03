import React, { useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Divider, List, ListItem, Button } from '@mui/material';
import { useFetch } from '../../hooks/useApi';
import { MembershipHistoryConsole } from '../../components/MembershipHistoryConsole';

export const MemberDashboard: React.FC = () => {
  const [historyOpen, setHistoryOpen] = useState(false);
  const { data, loading, error } = useFetch('/api/member/dashboard');

  if (loading) {
    return <Typography sx={{ p: 4, fontWeight: 600 }}>Loading dashboard analytics...</Typography>;
  }

  if (error) {
    return <Typography color="error" sx={{ p: 4, fontWeight: 600 }}>{error}</Typography>;
  }

  const { member, daysRemaining, recommendedTrainers } = data || {};

  return (
    <Box>
      <Box sx={{ mb: 6 }}>
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
          Overview
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Welcome back, {member?.fullName || 'Athlete'}. Track your operating parameters and training schedule.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Left Column: Membership & Profile Info */}
        <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Membership Status Card */}
          <Card elevation={0} sx={{ border: '1px solid #e6e6e6', borderLeft: '4px solid #fdf313', borderRadius: '8px', backgroundColor: '#ffffff' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="caption" sx={{ textTransform: 'uppercase', color: '#949494', fontWeight: 700, letterSpacing: '1px' }}>
                Membership Access
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', my: 2 }}>
                <Typography variant="h3" sx={{ fontWeight: 900, color: '#1a1a1a', letterSpacing: '-1px' }}>
                  {member?.currentMembership ? `${member.currentMembership.planType} Plan` : 'No Active Membership'}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: daysRemaining <= 10 ? '#fdf313' : '#1a1a1a', backgroundColor: daysRemaining <= 10 ? '#1a1a1a' : 'transparent', px: daysRemaining <= 10 ? 1 : 0, borderRadius: '4px' }}>
                  {daysRemaining} Days Left
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              {member?.currentMembership ? (
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Start Date</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {new Date(member.currentMembership.startDate).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>End Date</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {new Date(member.currentMembership.endDate).toLocaleDateString()}
                    </Typography>
                  </Grid>
                </Grid>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Please contact the front desk receptionist to activate your access profile.
                </Typography>
              )}
              {member && (
                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => setHistoryOpen(true)}
                    sx={{
                      borderColor: '#e6e6e6',
                      color: '#1a1a1a',
                      textTransform: 'none',
                      fontWeight: 700,
                      borderRadius: '6px',
                      '&:hover': { borderColor: '#1a1a1a', backgroundColor: '#f2f2f2' }
                    }}
                  >
                    📜 View Membership Purchase Ledger
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Athletic Profile Card */}
          <Card elevation={0} sx={{ border: '1px solid #e6e6e6', borderRadius: '8px', backgroundColor: '#ffffff', p: 1 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#1a1a1a', mb: 3 }}>
                Athletic Profile Notes
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>Fitness Goals</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#1a1a1a', mt: 0.5 }}>
                    {member?.fitnessGoals || 'Not specified'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>Medical Warnings</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: member?.medicalNotes ? '#d32f2f' : '#1a1a1a', mt: 0.5 }}>
                    {member?.medicalNotes || 'No medical alerts registered'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>Emergency Contact</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#1a1a1a', mt: 0.5 }}>
                    {member?.emergencyContact || 'Not specified'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column: Coach Assignment or Recommendations */}
        <Grid size={{ xs: 12, md: 6 }}>
          {member?.assignedTrainer ? (
            /* Assigned Coach Card */
            <Card elevation={0} sx={{ border: '1px solid #e6e6e6', borderLeft: '4px solid #fdf313', borderRadius: '8px', backgroundColor: '#ffffff', height: '100%' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="caption" sx={{ textTransform: 'uppercase', color: '#949494', fontWeight: 700, letterSpacing: '1px' }}>
                  Assigned Strength Coach
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#1a1a1a', my: 2, letterSpacing: '-1px' }}>
                  {member.assignedTrainer.fullName}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                  Contact: {member.assignedTrainer.email}
                </Typography>
                <Divider sx={{ my: 3 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>Specialization</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#1a1a1a', mt: 0.5 }}>
                      {member.assignedTrainer.specialization || 'General Strength'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>Experience Level</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#1a1a1a', mt: 0.5 }}>
                      {member.assignedTrainer.experience || 'Experienced'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>Availability Schedule</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#1a1a1a', mt: 0.5 }}>
                      {member.assignedTrainer.availability || 'Full-Time availability'}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ) : (
            /* Recommendations Card */
            <Card elevation={0} sx={{ border: '1px solid #e6e6e6', borderRadius: '8px', backgroundColor: '#ffffff', height: '100%' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="caption" sx={{ textTransform: 'uppercase', color: '#949494', fontWeight: 700, letterSpacing: '1px' }}>
                  Coaching Recommendation
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 900, color: '#1a1a1a', mt: 2, mb: 1, letterSpacing: '-0.5px' }}>
                  No Trainer Prescribed Yet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                  Browse our available coaches. Contact receptionist to match with a coach.
                </Typography>
                
                <Divider sx={{ mb: 3 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1a1a1a', mb: 2 }}>
                  Featured Strength Coaches:
                </Typography>
                <List sx={{ p: 0 }}>
                  {recommendedTrainers && recommendedTrainers.map((trainer: any) => (
                    <ListItem key={trainer._id} sx={{ p: 2, mb: 2, border: '1px solid #e6e6e6', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography sx={{ fontWeight: 700, color: '#1a1a1a', fontSize: '14px' }}>
                          {trainer.fullName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {trainer.specialization || 'Strength & Conditioning'} ({trainer.experience || 'Experienced'})
                        </Typography>
                      </Box>
                    </ListItem>
                  ))}
                  {(!recommendedTrainers || recommendedTrainers.length === 0) && (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      No trainers currently available.
                    </Typography>
                  )}
                </List>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      <MembershipHistoryConsole
        memberId={member?._id || null}
        memberName={member?.fullName || ''}
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
      />
    </Box>
  );
};
