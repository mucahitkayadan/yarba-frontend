import React, { useState } from 'react';
import { Button, Box, Typography } from '@mui/material';
import { Toast } from './Toast';

export const CenteredToast: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('This is a centered notification!');
  const [severity, setSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('error');
  const [position, setPosition] = useState<'top' | 'bottom'>('bottom');

  const handleShowSuccess = () => {
    setMessage('Success! This notification is centered at the bottom of the screen.');
    setSeverity('success');
    setPosition('bottom');
    setOpen(true);
  };

  const handleShowError = () => {
    setMessage('Error! This notification is centered at the bottom of the screen.');
    setSeverity('error');
    setPosition('bottom');
    setOpen(true);
  };
  
  const handleShowTopMessage = () => {
    setMessage('This notification is centered at the top of the screen.');
    setSeverity('info');
    setPosition('top');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6">Toast Position Demo</Typography>
      
      <Button variant="contained" color="success" onClick={handleShowSuccess}>
        Show Success Toast (Bottom)
      </Button>
      
      <Button variant="contained" color="error" onClick={handleShowError}>
        Show Error Toast (Bottom)
      </Button>
      
      <Button variant="contained" color="info" onClick={handleShowTopMessage}>
        Show Info Toast (Top)
      </Button>
      
      <Toast 
        open={open}
        message={message}
        severity={severity}
        onClose={handleClose}
        anchorVertical={position}
      />
    </Box>
  );
};

export default CenteredToast; 