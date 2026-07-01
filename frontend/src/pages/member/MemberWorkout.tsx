import React from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Grid, Card, CardContent } from '@mui/material';
import { useFetch } from '../../hooks/useApi';

export const MemberWorkout: React.FC = () => {
  const { data, loading, error } = useFetch('/api/member/dashboard');

  if (loading) {
    return <Typography sx={{ p: 4, fontWeight: 600 }}>Loading workout routines...</Typography>;
  }

  if (error) {
    return <Typography color="error" sx={{ p: 4, fontWeight: 600 }}>{error}</Typography>;
  }

  const { activeProgram, member } = data || {};

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
          My Workout Plan
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Current training routine prescribed by your strength coach.
        </Typography>
      </Box>

      {activeProgram ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ mb: 2, p: 3, border: '1px solid #e6e6e6', borderRadius: '8px', borderLeft: '4px solid #fdf313', backgroundColor: '#ffffff' }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#1a1a1a' }}>
              Active Blueprint: {activeProgram.programName}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Assigned: {new Date(activeProgram.assignedAt).toLocaleDateString()}
            </Typography>
          </Box>

          {activeProgram.days.map((day: any, dIdx: number) => (
            <Accordion key={dIdx} elevation={0} defaultExpanded={dIdx === 0} sx={{ border: '1px solid #e6e6e6', borderRadius: '8px', '&::before': { display: 'none' } }}>
              <AccordionSummary
                expandIcon={
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                }
                sx={{ backgroundColor: '#f9f9f9', borderRadius: '8px', py: 1 }}
              >
                <Typography sx={{ fontWeight: 800, fontSize: '15px', color: '#1a1a1a' }}>
                  {day.dayName}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 3, backgroundColor: '#ffffff' }}>
                <Grid container spacing={3}>
                  {day.exercises.map((ex: any, eIdx: number) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={eIdx}>
                      <Card elevation={0} sx={{ border: '1px solid #e6e6e6', borderRadius: '8px', backgroundColor: '#fdfdfd', height: '100%' }}>
                        <CardContent sx={{ p: 2.5 }}>
                          <Typography variant="body1" sx={{ fontWeight: 800, color: '#1a1a1a', mb: 1 }}>
                            {ex.exerciseName}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <Box>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Sets</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 700 }}>{ex.sets}</Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Repetitions</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 700 }}>{ex.reps}</Typography>
                            </Box>
                          </Box>
                          {ex.notes && (
                            <Box sx={{ mt: 1.5, p: 1.5, borderRadius: '4px', backgroundColor: '#f2f2f2', borderLeft: '3px solid #1a1a1a' }}>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 600 }}>Coach Notes</Typography>
                              <Typography variant="caption" sx={{ color: '#1a1a1a', fontStyle: 'italic' }}>
                                {ex.notes}
                              </Typography>
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                  {(!day.exercises || day.exercises.length === 0) && (
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        No exercises prescribed for this day.
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      ) : (
        <Card elevation={0} sx={{ border: '1px solid #e6e6e6', borderLeft: '4px solid #fdf313', borderRadius: '8px', p: 4, textAlign: 'center' }}>
          <CardContent>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#1a1a1a', mb: 2 }}>
              No Workout Program Prescribed
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {member?.assignedTrainer
                ? `Contact your strength coach, ${member.assignedTrainer.fullName}, to request a routine assignment.`
                : 'You currently have no strength coach assigned. Contact receptionist to be matched with a coach and build your performance program.'}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};
