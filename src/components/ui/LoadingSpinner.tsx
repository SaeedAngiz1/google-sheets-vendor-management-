/**
 * @component LoadingSpinner
 * @description Reusable loading indicator component with configurable size and message.
 *
 * @example
 * ```tsx
 * <LoadingSpinner />
 * <LoadingSpinner size="large" message="Loading vendor data..." />
 * ```
 */

import React from 'react';

export interface LoadingSpinnerProps {
  /** Size of the spinner */
  size?: 'small' | 'medium' | 'large';
  /** Optional loading message */
  message?: string;
  /** Additional CSS class names */
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  message,
  className = '',
}) => {
  return (
    <div
      className={`loading-container loading-container--${size} ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className={`loading-spinner loading-spinner--${size}`} aria-hidden="true">
        <div className="spinner-ring" />
      </div>
      {message && <p className="loading-message">{message}</p>}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

LoadingSpinner.displayName = 'LoadingSpinner';

