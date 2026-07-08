import React from 'react';
import { Box, Typography, Container, Grid, Card, CardContent } from '@mui/material';

export const Contact: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 10 }}>
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h3"
          sx={{
            fontFamily: "'Suisse Intl', 'Manrope', sans-serif",
            fontWeight: 900,
            color: '#1a1a1a',
            letterSpacing: '-2px',
            textTransform: 'uppercase'
          }}
        >
          Contact Strength Lab
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Get in touch with the GymOS Headquarters.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Address Card */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={0} sx={{ border: '1px solid #e6e6e6', borderRadius: '8px', height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: 'uppercase', color: 'text.secondary', mb: 2 }}>
                Physical Location
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#1a1a1a', mb: 1 }}>
                GymOS Laboratory
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                Sector 3, HSR Layout,<br />
                Bengaluru, Karnataka 560102,<br />
                India
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Contact Info Card */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={0} sx={{ border: '1px solid #e6e6e6', borderRadius: '8px', height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: 'uppercase', color: 'text.secondary', mb: 2 }}>
                Communication Channels
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 700, textTransform: 'uppercase' }}>
                  Phone Support
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 800, color: '#1a1a1a' }}>
                  +91 99999 88888
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 700, textTransform: 'uppercase' }}>
                  Email Support
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 800, color: '#1a1a1a' }}>
                  support@gymos.com
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Operating Hours Card */}
        <Grid size={{ xs: 12 }}>
          <Card elevation={0} sx={{ border: '1px solid #e6e6e6', borderRadius: '8px', borderLeft: '4px solid #fdf313' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: 'uppercase', color: 'text.secondary', mb: 2 }}>
                Open Hours
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">Monday - Saturday</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 800 }}>5:00 AM - 10:00 PM IST</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">Sunday</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 800 }}>Closed</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};
export default Contact;
