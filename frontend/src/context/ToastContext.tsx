import React, { createContext, useContext, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import type { AlertColor } from '@mui/material';

interface ToastContextType {
  showToast: (message: string, severity?: AlertColor) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AlertColor>('info');

  const showToast = (msg: string, sev: AlertColor = 'info') => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  };

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{
            width: '100%',
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 600,
            borderRadius: '8px',
            backgroundColor: 
              severity === 'success' ? '#1a1a1a' : 
              severity === 'error' ? '#fdf313' : 
              severity === 'warning' ? '#fdf313' : 
              '#f2f2f2', 
            color: 
              severity === 'success' ? '#ffffff' : 
              severity === 'error' ? '#1a1a1a' : 
              severity === 'warning' ? '#1a1a1a' : 
              '#1a1a1a', 
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            '& .MuiAlert-icon': {
              color: 
                severity === 'success' ? '#ffffff' : 
                severity === 'error' ? '#1a1a1a' : 
                severity === 'warning' ? '#1a1a1a' : 
                '#1a1a1a'
            }
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
