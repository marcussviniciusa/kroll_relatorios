import React, { createContext, useContext, useState, useCallback } from 'react';
import Notification from '../components/common/Notification';
import { getUserFriendlyErrorMessage } from '../utils/errorHandler';

// Create notification context
const NotificationContext = createContext();

/**
 * Provider component for notification system
 * 
 * @param {Object} props Component props
 * @param {React.ReactNode} props.children Child components
 */
export const NotificationProvider = ({ children }) => {
  // State for notification
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info',
    autoHideDuration: 6000
  });

  // Close notification
  const closeNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, open: false }));
  }, []);

  // Show success notification
  const showSuccess = useCallback((message, duration = 6000) => {
    setNotification({
      open: true,
      message,
      severity: 'success',
      autoHideDuration: duration
    });
  }, []);

  // Show error notification
  const showError = useCallback((error, duration = 8000) => {
    const message = typeof error === 'string' 
      ? error 
      : getUserFriendlyErrorMessage(error);
    
    setNotification({
      open: true,
      message,
      severity: 'error',
      autoHideDuration: duration
    });
  }, []);

  // Show info notification
  const showInfo = useCallback((message, duration = 5000) => {
    setNotification({
      open: true,
      message,
      severity: 'info',
      autoHideDuration: duration
    });
  }, []);

  // Show warning notification
  const showWarning = useCallback((message, duration = 7000) => {
    setNotification({
      open: true,
      message,
      severity: 'warning',
      autoHideDuration: duration
    });
  }, []);

  // Context value
  const value = {
    showSuccess,
    showError,
    showInfo,
    showWarning
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={closeNotification}
        autoHideDuration={notification.autoHideDuration}
      />
    </NotificationContext.Provider>
  );
};

/**
 * Hook to use notification context
 * @returns {Object} Notification methods
 */
export const useNotification = () => {
  const context = useContext(NotificationContext);
  
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  
  return context;
};

export default NotificationContext;
