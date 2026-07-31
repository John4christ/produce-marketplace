import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import { Button } from './Button';

export const ErrorState = ({
  title = 'Failed to load produce',
  message = 'We encountered a temporary connection error. Please try again.',
  onRetry
}) => {
  return (
    <div className="error-state">
      <div className="error-state-icon">
        <FiAlertCircle />
      </div>
      <h3 className="error-state-title">{title}</h3>
      <p className="error-state-msg">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};
