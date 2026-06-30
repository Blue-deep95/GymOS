import { Box } from '@mui/material';
import { AnnouncementBar } from '../components/AnnouncementBar';
import { Hero } from '../components/Hero';
import { Features } from '../components/Features';
import { Footer } from '../components/Footer';

export const LandingPage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        pb: '48px', // Prevent bottom fixed announcement bar from overlapping footer content
      }}
    >
      {/* Hero Section */}
      <Hero />

      {/* Features / Capabilities Ledger */}
      <Features />

      {/* Minimal Editorial Footer */}
      <Footer />

      {/* Sticky Bottom Announcement Accent */}
      <AnnouncementBar />
    </Box>
  );
};
