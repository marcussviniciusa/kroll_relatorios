import React, { useState, useEffect, forwardRef } from 'react';
import { Snackbar, Alert as MuiAlert } from '@mui/material';

// Alert component with forwardRef for Snackbar
const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

/**
 * Notification component for displaying success, error, warning, and info messages
 * 
 * @param {Object} props Component props
 * @param {string} props.message Message to display
 * @param {string} props.severity Severity level: 'success', 'error', 'warning', 'info'
 * @param {boolean} props.open Whether the notification is open
 * @param {function} props.onClose Function to call when notification is closed
 * @param {number} props.autoHideDuration Duration in ms before auto-hiding (default: 6000)
 * @param {Object} props.anchorOrigin Position of the notification
 */
const Notification = ({
  message,
  severity = 'info',
  open,
  onClose,
  autoHideDuration = 6000,
  anchorOrigin = { vertical: 'top', horizontal: 'right' }
}) => {
  // Local state for open status
  const [isOpen, setIsOpen] = useState(false);

  // Update local state when prop changes
  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  // Handle close event
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    
    setIsOpen(false);
    
    if (onClose) {
      onClose();
    }
  };

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={anchorOrigin}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
