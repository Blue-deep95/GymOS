import { Box, Container, Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router';

export const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#ffffff',
        color: '#1a1a1a',
        py: 6,
        borderTop: '1px solid #e6e6e6',
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, md: 4 } }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: 4,
          }}
        >
          {/* Logo & Contact Info */}
          <Box>
            <Typography
              sx={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 900,
                fontSize: '24px',
                color: '#000000',
                letterSpacing: '-1px',
                mb: 1,
              }}
            >
              S/ gymOS
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '13px' }}>
              Sector 3, HSR Layout, Bengaluru, India &nbsp;|&nbsp; support@gymos.in &nbsp;|&nbsp; +91 99999 88888
            </Typography>
          </Box>

          {/* Quick Info Links (Plans & Contact) */}
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link
              component={RouterLink}
              to="/plans"
              sx={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '14px',
                fontWeight: 700,
                color: '#1a1a1a',
                textDecoration: 'none',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                '&:hover': { color: 'text.secondary' }
              }}
            >
              Plans & Features
            </Link>
            <Link
              component={RouterLink}
              to="/contact"
              sx={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '14px',
                fontWeight: 700,
                color: '#1a1a1a',
                textDecoration: 'none',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                '&:hover': { color: 'text.secondary' }
              }}
            >
              Contact Support
            </Link>
          </Box>
        </Box>

        <Box
          sx={{
            mt: 4,
            pt: 3,
            borderTop: '1px solid #f2f2f2',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontFamily: "'Inter', sans-serif",
              color: 'text.secondary',
              fontSize: '12px',
            }}
          >
            © {new Date().getFullYear()} gymOS Strength Lab. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};
export default Footer;
