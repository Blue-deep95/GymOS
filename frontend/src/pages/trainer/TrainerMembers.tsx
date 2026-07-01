import React, { useState } from 'react';
import { Box, Typography, Select, MenuItem, FormControl, TextField, InputAdornment, Accordion, AccordionSummary, AccordionDetails, Chip, Grid, Paper } from '@mui/material';
import { useFetch, useMutation } from '../../hooks/useApi';

export const TrainerMembers: React.FC = () => {
  const { data: membersData, loading: membersLoading, error: membersError, refetch } = useFetch('/api/trainer/members');
  const { data: templatesData } = useFetch('/api/trainer/templates');
  const [search, setSearch] = useState('');

  const assignProgramMutation = useMutation('', 'POST');
  const removeProgramMutation = useMutation('', 'DELETE');

  const members = membersData?.members || [];
  const templates = templatesData?.templates || [];

  const filteredMembers = members.filter((m: any) =>
    m.fullName.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAssignTemplate = async (memberId: string, templateId: string) => {
    try {
      const url = `/api/trainer/members/${memberId}/assign-program`;
      await assignProgramMutation.execute({ templateId }, { url });
      refetch();
    } catch (err) {
      alert('Failed to assign workout program');
    }
  };

  const handleRemoveProgram = async (memberId: string) => {
    if (!confirm("Are you sure you want to remove this member's prescribed plan?")) return;
    try {
      const url = `/api/trainer/members/${memberId}/assign-program`;
      await removeProgramMutation.execute(null, { url });
      refetch();
    } catch (err) {
      alert('Failed to remove workout program');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return { bg: '#1a1a1a', text: '#ffffff' };
      case 'Frozen':
        return { bg: '#f2ede9', text: '#1a1a1a' };
      case 'Expired':
        return { bg: '#fdf313', text: '#1a1a1a' };
      default:
        return { bg: '#f2f2f2', text: '#949494' };
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 5 }}>
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
          Athletes Roster
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Manage your assigned gym members and prescribe active training templates.
        </Typography>
      </Box>

      {membersError && (
        <Box sx={{ mb: 3 }}>
          <Typography color="error" variant="body2" sx={{ fontWeight: 600 }}>
            {membersError}
          </Typography>
        </Box>
      )}

      {/* Toolbar */}
      <Box sx={{ mb: 4 }}>
        <TextField
          placeholder="Search member name or email..."
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            width: '320px',
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
      </Box>

      {/* Roster list */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {filteredMembers.map((member: any) => {
          const statusColors = getStatusColor(member.currentMembership?.status || 'Inactive');
          return (
            <Paper
              key={member._id}
              elevation={0}
              sx={{
                border: '1px solid #e6e6e6',
                borderRadius: '8px',
                p: 3,
                backgroundColor: '#ffffff'
              }}
            >
              {/* Header section of each member */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    {member.fullName}
                    <Chip
                      label={member.currentMembership?.status || 'No Package'}
                      size="small"
                      sx={{
                        backgroundColor: statusColors.bg,
                        color: statusColors.text,
                        fontWeight: 700,
                        borderRadius: '4px',
                        fontSize: '11px'
                      }}
                    />
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Email: {member.email} | Phone: {member.phone || 'N/A'}
                  </Typography>
                </Box>

                {/* Dropdown to assign template */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#949494', textTransform: 'uppercase' }}>
                    Prescribe Plan:
                  </Typography>
                  <FormControl size="small" sx={{ minWidth: 200 }}>
                    <Select
                      value=""
                      displayEmpty
                      onChange={(e) => handleAssignTemplate(member._id, e.target.value)}
                      sx={{
                        borderRadius: '8px',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e6e6e6' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#1a1a1a' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1a1a1a', borderWidth: '1px' }
                      }}
                    >
                      <MenuItem value="" disabled>Select Template...</MenuItem>
                      {templates.map((t: any) => (
                        <MenuItem key={t._id} value={t._id}>
                          {t.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              {/* Active Program details */}
              {member.activeProgram ? (
                <Accordion elevation={0} sx={{ border: '1px solid #e6e6e6', borderRadius: '8px', '&::before': { display: 'none' } }}>
                  <AccordionSummary
                    expandIcon={
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    }
                    sx={{ backgroundColor: '#f9f9f9', borderRadius: '8px' }}
                  >
                    <Typography sx={{ fontWeight: 700, fontSize: '14px', color: '#1a1a1a' }}>
                      Active Program: {member.activeProgram.programName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 2, alignSelf: 'center' }}>
                      (Assigned: {new Date(member.activeProgram.assignedAt).toLocaleDateString()})
                    </Typography>
                    <Typography
                      component="span"
                      variant="caption"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveProgram(member._id);
                      }}
                      sx={{
                        ml: 'auto',
                        fontWeight: 700,
                        mr: 1,
                        fontSize: '12px',
                        cursor: 'pointer',
                        userSelect: 'none',
                        '&:hover': {
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      Remove Plan
                    </Typography>
                  </AccordionSummary>
                  <AccordionSummary sx={{ display: 'none' }} />
                  <AccordionDetails sx={{ p: 0 }}>
                    {member.activeProgram.days.map((day: any, dIdx: number) => (
                      <Box key={dIdx} sx={{ p: 2.5, borderBottom: '1px solid #e6e6e6', '&:last-child': { borderBottom: 'none' } }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1a1a1a', mb: 1 }}>
                          {day.dayName}
                        </Typography>
                        <Grid container spacing={2}>
                          {day.exercises.map((ex: any, eIdx: number) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={eIdx}>
                              <Box sx={{ border: '1px solid #e6e6e6', borderRadius: '6px', p: 1.5, backgroundColor: '#ffffff' }}>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                                  {ex.exerciseName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                  Sets: {ex.sets} | Reps: {ex.reps}
                                </Typography>
                                {ex.notes && (
                                  <Typography variant="caption" sx={{ display: 'block', mt: 0.5, fontStyle: 'italic', color: '#949494' }}>
                                    Notes: {ex.notes}
                                  </Typography>
                                )}
                              </Box>
                            </Grid>
                          ))}
                          {day.exercises.length === 0 && (
                            <Typography variant="caption" color="text.secondary" sx={{ pl: 2 }}>
                              No exercises specified.
                            </Typography>
                          )}
                        </Grid>
                      </Box>
                    ))}
                  </AccordionDetails>
                </Accordion>
              ) : (
                <Box sx={{ p: 2, border: '1px dashed #e6e6e6', borderRadius: '8px', textAlign: 'center', backgroundColor: '#fcfcfc' }}>
                  <Typography variant="body2" color="text.secondary">
                    No training program currently prescribed.
                  </Typography>
                </Box>
              )}
            </Paper>
          );
        })}

        {filteredMembers.length === 0 && (
          <Box sx={{ p: 6, textAlign: 'center', border: '1px solid #e6e6e6', borderRadius: '8px', backgroundColor: '#ffffff' }}>
            <Typography variant="body2" color="text.secondary">
              {membersLoading ? 'Fetching athlete data roster...' : 'No athletes currently assigned to you.'}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};
