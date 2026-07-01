import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Card, CardContent, Grid, IconButton, Divider, Paper } from '@mui/material';
import { useFetch, useMutation } from '../../hooks/useApi';
import { useToast } from '../../context/ToastContext';

interface ExerciseInput {
  exerciseName: string;
  sets: number;
  reps: string;
  notes: string;
}

interface DayInput {
  dayName: string;
  exercises: ExerciseInput[];
}

export const WorkoutTemplates: React.FC = () => {
  const { showToast } = useToast();
  const { data, error, refetch } = useFetch('/api/trainer/templates');
  const createTemplateMutation = useMutation('/api/trainer/templates', 'POST');
  const deleteTemplateMutation = useMutation('', 'DELETE');

  const templates = data?.templates || [];

  // Form State
  const [templateName, setTemplateName] = useState('');
  const [description, setDescription] = useState('');
  const [days, setDays] = useState<DayInput[]>([
    { dayName: 'Day 1 - Push', exercises: [{ exerciseName: 'Bench Press', sets: 3, reps: '8-12', notes: 'Flat barbell' }] }
  ]);

  const handleAddDay = () => {
    setDays([...days, { dayName: `Day ${days.length + 1}`, exercises: [] }]);
  };

  const handleRemoveDay = (dayIdx: number) => {
    setDays(days.filter((_, idx) => idx !== dayIdx));
  };

  const handleAddExercise = (dayIdx: number) => {
    const updatedDays = [...days];
    updatedDays[dayIdx].exercises.push({ exerciseName: '', sets: 3, reps: '10', notes: '' });
    setDays(updatedDays);
  };

  const handleRemoveExercise = (dayIdx: number, exIdx: number) => {
    const updatedDays = [...days];
    updatedDays[dayIdx].exercises = updatedDays[dayIdx].exercises.filter((_, idx) => idx !== exIdx);
    setDays(updatedDays);
  };

  const handleExerciseChange = (dayIdx: number, exIdx: number, field: keyof ExerciseInput, val: any) => {
    const updatedDays = [...days];
    updatedDays[dayIdx].exercises[exIdx] = {
      ...updatedDays[dayIdx].exercises[exIdx],
      [field]: val
    };
    setDays(updatedDays);
  };

  const handleDayNameChange = (dayIdx: number, val: string) => {
    const updatedDays = [...days];
    updatedDays[dayIdx].dayName = val;
    setDays(updatedDays);
  };

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateName.trim()) {
      showToast('Template name is required', 'warning');
      return;
    }

    try {
      await createTemplateMutation.execute({
        name: templateName,
        description,
        days
      });
      showToast('Workout blueprint created successfully', 'success');
      // Clear form
      setTemplateName('');
      setDescription('');
      setDays([{ dayName: 'Day 1 - Push', exercises: [{ exerciseName: 'Bench Press', sets: 3, reps: '8-12', notes: 'Flat barbell' }] }]);
      refetch();
    } catch (err: any) {
      showToast(err.message || 'Failed to create template', 'error');
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    try {
      const url = `/api/trainer/templates/${id}`;
      await deleteTemplateMutation.execute(null, { url });
      showToast('Workout blueprint deleted successfully', 'success');
      refetch();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete template', 'error');
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
          Template Blueprint Lab
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Create and catalog reusable workout templates for direct client assignments.
        </Typography>
      </Box>

      {error && (
        <Box sx={{ mb: 3 }}>
          <Typography color="error" variant="body2" sx={{ fontWeight: 600 }}>
            {error}
          </Typography>
        </Box>
      )}

      <Grid container spacing={4}>
        {/* Left Side: Creator Form */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card elevation={0} sx={{ border: '1px solid #e6e6e6', borderRadius: '8px', backgroundColor: '#ffffff' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, color: '#1a1a1a', mb: 3 }}>
                Design Workout Blueprint
              </Typography>
              
              <Box component="form" onSubmit={handleCreateTemplate} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  label="Blueprint Name"
                  placeholder="e.g. 3-Day Push Pull Legs"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      '&.Mui-focused fieldset': { borderColor: '#1a1a1a', borderWidth: '1px' }
                    }
                  }}
                />
                
                <TextField
                  label="Description"
                  placeholder="Target demographic, training focus, intensity, etc."
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={2}
                  size="small"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      '&.Mui-focused fieldset': { borderColor: '#1a1a1a', borderWidth: '1px' }
                    }
                  }}
                />

                <Divider sx={{ borderColor: '#e6e6e6', my: 1 }} />

                {/* Days Configurator */}
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1a1a1a' }}>
                      Training Days ({days.length})
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleAddDay}
                      sx={{
                        borderColor: '#e6e6e6',
                        color: '#1a1a1a',
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': { borderColor: '#1a1a1a', backgroundColor: '#f2f2f2' }
                      }}
                    >
                      + Add Day
                    </Button>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {days.map((day, dayIdx) => (
                      <Paper key={dayIdx} elevation={0} sx={{ border: '1px solid #e6e6e6', borderRadius: '8px', p: 2.5, backgroundColor: '#fdfdfd' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2 }}>
                          <TextField
                            placeholder="Day Name (e.g. Day 1 - Push)"
                            variant="standard"
                            value={day.dayName}
                            onChange={(e) => handleDayNameChange(dayIdx, e.target.value)}
                            sx={{
                              flexGrow: 1,
                              '& .MuiInput-underline:after': { borderBottomColor: '#1a1a1a' },
                              '& input': { fontWeight: 700, color: '#1a1a1a' }
                            }}
                          />
                          <IconButton size="small" onClick={() => handleRemoveDay(dayIdx)} color="error" disabled={days.length <= 1}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </IconButton>
                        </Box>

                        {/* Exercises List inside Day */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
                          {day.exercises.map((ex, exIdx) => (
                            <Box key={exIdx} sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center', borderBottom: '1px dashed #e6e6e6', pb: 2 }}>
                              <TextField
                                placeholder="Exercise Name"
                                variant="outlined"
                                size="small"
                                value={ex.exerciseName}
                                onChange={(e) => handleExerciseChange(dayIdx, exIdx, 'exerciseName', e.target.value)}
                                sx={{ flexGrow: 2, minWidth: '150px', '& .MuiOutlinedInput-root': { borderRadius: '6px' } }}
                              />
                              <TextField
                                placeholder="Sets"
                                type="number"
                                variant="outlined"
                                size="small"
                                value={ex.sets}
                                onChange={(e) => handleExerciseChange(dayIdx, exIdx, 'sets', parseInt(e.target.value) || 0)}
                                sx={{ width: '70px', '& .MuiOutlinedInput-root': { borderRadius: '6px' } }}
                              />
                              <TextField
                                placeholder="Reps"
                                variant="outlined"
                                size="small"
                                value={ex.reps}
                                onChange={(e) => handleExerciseChange(dayIdx, exIdx, 'reps', e.target.value)}
                                sx={{ width: '80px', '& .MuiOutlinedInput-root': { borderRadius: '6px' } }}
                              />
                              <TextField
                                placeholder="Notes"
                                variant="outlined"
                                size="small"
                                value={ex.notes}
                                onChange={(e) => handleExerciseChange(dayIdx, exIdx, 'notes', e.target.value)}
                                sx={{ flexGrow: 1, minWidth: '120px', '& .MuiOutlinedInput-root': { borderRadius: '6px' } }}
                              />
                              <IconButton size="small" onClick={() => handleRemoveExercise(dayIdx, exIdx)} color="error">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <line x1="18" y1="6" x2="6" y2="18" />
                                  <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                              </IconButton>
                            </Box>
                          ))}
                        </Box>

                        <Button
                          variant="text"
                          size="small"
                          onClick={() => handleAddExercise(dayIdx)}
                          sx={{ color: '#757575', textTransform: 'none', fontWeight: 600, '&:hover': { color: '#1a1a1a' } }}
                        >
                          + Add Exercise
                        </Button>
                      </Paper>
                    ))}
                  </Box>
                </Box>

                <Button
                  variant="contained"
                  type="submit"
                  sx={{
                    backgroundColor: '#1a1a1a',
                    color: '#ffffff',
                    fontWeight: 600,
                    textTransform: 'none',
                    py: 1.2,
                    borderRadius: '8px',
                    '&:hover': { backgroundColor: '#000000' }
                  }}
                >
                  Create Blueprint
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Side: Blueprints List */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card elevation={0} sx={{ border: '1px solid #e6e6e6', borderRadius: '8px', backgroundColor: '#ffffff', height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, color: '#1a1a1a', mb: 3 }}>
                Active Blueprints Catalog
              </Typography>
              
              <Box sx={{ p: 0 }}>
                {templates.map((template: any) => (
                  <Box key={template._id} sx={{ mb: 2, border: '1px solid #e6e6e6', borderRadius: '8px', p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Box>
                        <Typography sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                          {template.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {template.description || 'No description provided'}
                        </Typography>
                      </Box>
                      <IconButton size="small" onClick={() => handleDeleteTemplate(template._id)} color="error">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </IconButton>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, fontWeight: 600 }}>
                      Contains: {template.days?.length || 0} Training Days
                    </Typography>
                  </Box>
                ))}
                {templates.length === 0 && (
                  <Box sx={{ py: 6, textAlign: 'center', color: '#949494' }}>
                    No reusable templates built yet. Prescribe templates by building them above.
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
