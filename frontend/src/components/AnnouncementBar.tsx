import { Box, Link } from '@mui/material';

export const AnnouncementBar = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'electricYellow.main',
        color: 'electricYellow.contrastText',
        height: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 3,
        zIndex: 1300,
        borderTop: '1px solid #000000',
      }}
    >
      <Link
        href="#plans"
        sx={{
          color: 'inherit',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          fontFamily: "'Manrope', sans-serif",
          fontWeight: 600,
          fontSize: '14px',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          '&:hover': {
            opacity: 0.8,
          },
        }}
      >
        Introducing gymOS: A premier strength and conditioning lab. Book a complimentary training session today →
      </Link>
    </Box>
  );
};
