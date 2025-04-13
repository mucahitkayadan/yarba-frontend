import React from 'react';
import { Snackbar, Alert, AlertProps, SnackbarProps } from '@mui/material';

interface ToastProps {
  open: boolean;
  message: string;
  severity?: AlertProps['severity'];
  onClose: () => void;
  autoHideDuration?: number;
  anchorVertical?: 'top' | 'bottom';
}

export const Toast: React.FC<ToastProps> = ({
  open,
  message,
  severity = 'error',
  onClose,
  autoHideDuration = 6000,
  anchorVertical = 'bottom',
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: anchorVertical, horizontal: 'center' }}
      sx={{ 
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999
      }}
    >
      <Alert 
        onClose={onClose} 
        severity={severity}
        variant="filled"
        sx={{ 
          minWidth: '250px',
          width: 'auto',
          maxWidth: '80%',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
          mb: anchorVertical === 'bottom' ? 2 : 0,
          mt: anchorVertical === 'top' ? 2 : 0
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Toast; 