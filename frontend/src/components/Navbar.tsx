import { useState } from 'react';
import { AppBar, Toolbar, Box, Typography, Button, Container, IconButton, Menu, MenuItem, Divider } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { token, role, setAuthData } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setAuthData(null, null);
    handleCloseMenu();
    navigate('/');
  };

  const menuItems = ['Features', 'Plans', 'About', 'Contact'];

  // Custom inline SVG icons matching feather icons
  const SignInIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" y1="12" x2="3" y2="12" />
    </svg>
  );

  const RegisterIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <line x1="20" y1="8" x2="20" y2="14" />
      <line x1="23" y1="11" x2="17" y2="11" />
    </svg>
  );

  const ProfileIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );

  const SignOutIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );

  // Determine dashboard redirect link based on role
  const getDashboardLink = () => {
    if (role === 'owner') return '/owner/dashboard';
    if (role === 'receptionist') return '/receptionist/dashboard';
    if (role === 'trainer') return '/trainer/dashboard';
    return '/';
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: '#ffffff',
        boxShadow: 'none',
        border: 'none',
        height: '84px',
        justifyContent: 'center',
        px: { xs: 2, md: 4 },
      }}
    >
      <Container maxWidth="lg" sx={{ px: 0 }}>
        <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          {/* Logo 'A/' - Custom logotype with forward slash terminal (Always Visible) */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              component={RouterLink}
              to="/"
              sx={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 900,
                fontSize: '28px',
                color: '#000000',
                letterSpacing: '-1.5px',
                userSelect: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                textDecoration: 'none'
              }}
            >
              A/
              <Box
                component="span"
                sx={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  fontSize: '14px',
                  color: 'text.secondary',
                  ml: 1.5,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                GymOS
              </Box>
            </Typography>
          </Box>

          {/* Navigation Links (Desktop only) */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 4,
            }}
          >
            {menuItems.map((item) => (
              <Button
                key={item}
                href={`#${item.toLowerCase()}`}
                variant="text"
                sx={{
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 500,
                  fontSize: '15px',
                  color: '#1a1a1a',
                  textTransform: 'none',
                  p: 0,
                  minWidth: 0,
                  '&:hover': {
                    color: 'text.secondary',
                    backgroundColor: 'transparent',
                  },
                }}
              >
                {item}
              </Button>
            ))}
          </Box>

          {/* Action Buttons (Desktop) & Hamburger Trigger (Mobile) */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {token ? (
              <>
                {/* Logged In Desktop State */}
                <Button
                  variant="outlined"
                  startIcon={ProfileIcon}
                  component={RouterLink}
                  to={getDashboardLink()}
                  sx={{
                    py: 1,
                    px: 2.5,
                    fontSize: '14px',
                    height: '42px',
                    display: { xs: 'none', md: 'inline-flex' },
                    '& .MuiButton-startIcon': {
                      mr: 1,
                      display: 'flex',
                      alignItems: 'center',
                    },
                  }}
                >
                  Control Lab
                </Button>
                <Button
                  variant="contained"
                  startIcon={SignOutIcon}
                  onClick={handleLogout}
                  sx={{
                    py: 1,
                    px: 2.5,
                    fontSize: '14px',
                    height: '42px',
                    display: { xs: 'none', md: 'inline-flex' },
                    '& .MuiButton-startIcon': {
                      mr: 1,
                      display: 'flex',
                      alignItems: 'center',
                    },
                  }}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                {/* Logged Out Desktop State */}
                <Button
                  variant="outlined"
                  startIcon={SignInIcon}
                  component={RouterLink}
                  to="/signin"
                  sx={{
                    py: 1,
                    px: 2.5,
                    fontSize: '14px',
                    height: '42px',
                    display: { xs: 'none', md: 'inline-flex' },
                    '& .MuiButton-startIcon': {
                      mr: 1,
                      display: 'flex',
                      alignItems: 'center',
                    },
                  }}
                >
                  Sign In
                </Button>
                <Button
                  variant="contained"
                  startIcon={RegisterIcon}
                  component={RouterLink}
                  to="/register"
                  sx={{
                    py: 1,
                    px: 2.5,
                    fontSize: '14px',
                    height: '42px',
                    display: { xs: 'none', md: 'inline-flex' },
                    '& .MuiButton-startIcon': {
                      mr: 1,
                      display: 'flex',
                      alignItems: 'center',
                    },
                  }}
                >
                  Register
                </Button>
              </>
            )}

            {/* Hamburger Button for mobile (Right Aligned) */}
            <IconButton
              onClick={handleOpenMenu}
              sx={{
                display: { xs: 'flex', md: 'none' },
                color: '#1a1a1a',
                p: 1,
                border: '1px solid #e6e6e6',
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: '#f2f2f2',
                },
              }}
              aria-label="menu"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12H21" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M3 6H21" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M3 18H21" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </IconButton>
          </Box>

          {/* Mobile Dropdown Menu Component */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
            keepMounted
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiPaper-root': {
                borderRadius: '8px',
                border: '1px solid #e6e6e6', // Hairline
                mt: 1,
                minWidth: '220px',
                backgroundColor: '#ffffff',
                boxShadow: 'none', // Enforce zero shadow policy
              },
            }}
          >
            {/* Standard Nav Items */}
            {menuItems.map((item) => (
              <MenuItem
                key={item}
                onClick={handleCloseMenu}
                component="a"
                href={`#${item.toLowerCase()}`}
                sx={{
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 500,
                  fontSize: '15px',
                  color: '#1a1a1a',
                  py: 1.5,
                  px: 3,
                  borderBottom: '1px solid #f2f2f2',
                  '&:last-child': {
                    borderBottom: 'none',
                  },
                  '&:hover': {
                    backgroundColor: '#f2f2f2', // Fog
                  },
                }}
              >
                {item}
              </MenuItem>
            ))}

            {/* Divider separating links and actions */}
            <Divider sx={{ my: 1, borderColor: '#e6e6e6' }} />

            {token ? (
              <>
                {/* Mobile Logged In Actions */}
                <MenuItem
                  onClick={handleCloseMenu}
                  component={RouterLink}
                  to={getDashboardLink()}
                  sx={{
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 600,
                    fontSize: '15px',
                    color: '#1a1a1a',
                    py: 1.5,
                    px: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    '&:hover': {
                      backgroundColor: '#f2f2f2',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', color: '#1a1a1a' }}>
                    {ProfileIcon}
                  </Box>
                  Control Lab
                </MenuItem>
                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 600,
                    fontSize: '15px',
                    color: '#1a1a1a',
                    py: 1.5,
                    px: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    '&:hover': {
                      backgroundColor: '#f2f2f2',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', color: '#1a1a1a' }}>
                    {SignOutIcon}
                  </Box>
                  Sign Out
                </MenuItem>
              </>
            ) : (
              <>
                {/* Mobile Logged Out Actions */}
                <MenuItem
                  onClick={handleCloseMenu}
                  component={RouterLink}
                  to="/signin"
                  sx={{
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 600,
                    fontSize: '15px',
                    color: '#1a1a1a',
                    py: 1.5,
                    px: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    '&:hover': {
                      backgroundColor: '#f2f2f2',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', color: '#1a1a1a' }}>
                    {SignInIcon}
                  </Box>
                  Sign In
                </MenuItem>
                <MenuItem
                  onClick={handleCloseMenu}
                  component={RouterLink}
                  to="/register"
                  sx={{
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 600,
                    fontSize: '15px',
                    color: '#1a1a1a',
                    py: 1.5,
                    px: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    '&:hover': {
                      backgroundColor: '#f2f2f2',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', color: '#1a1a1a' }}>
                    {RegisterIcon}
                  </Box>
                  Register
                </MenuItem>
              </>
            )}
          </Menu>

        </Toolbar>
      </Container>
    </AppBar>
  );
};
