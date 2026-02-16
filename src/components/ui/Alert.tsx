/**
 * @component Alert
 * @description Reusable alert/notification component for displaying feedback messages.
 * Supports different severity levels and auto-dismiss functionality.
 *
 * @example
 * ```tsx
 * <Alert
 *   type="success"
 *   message="Vendor successfully created!"
 *   onDismiss={() => setAlert(null)}
 *   autoDismiss={5000}
 * />
 * ```
 */

import React, { useEffect, useCallback } from 'react';
import type { AlertType } from '../../types/vendor';

export interface AlertProps {
  /** Alert severity type */
  type: AlertType;
  /** Alert message text */
  message: string;
  /** Callback when alert is dismissed */
  onDismiss?: () => void;
  /** Auto-dismiss after specified milliseconds (0 = no auto-dismiss) */
  autoDismiss?: number;
  /** Additional CSS class names */
  className?: string;
}

const ALERT_ICONS: Record<AlertType, string> = {
  success: '✓',
  warning: '⚠',
  error: '✕',
  info: 'ℹ',
};

export const Alert: React.FC<AlertProps> = ({
  type,
  message,
  onDismiss,
  autoDismiss = 5000,
  className = '',
}) => {
  const handleDismiss = useCallback(() => {
    onDismiss?.();
  }, [onDismiss]);

  useEffect(() => {
    if (autoDismiss > 0 && onDismiss) {
      const timer = setTimeout(handleDismiss, autoDismiss);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, handleDismiss, onDismiss]);

  return (
    <div
      className={`alert alert--${type} ${className}`}
      role="alert"
      aria-live="polite"
    >
      <span className="alert-icon" aria-hidden="true">
        {ALERT_ICONS[type]}
      </span>
      <p className="alert-message">{message}</p>
      {onDismiss && (
        <button
          className="alert-dismiss"
          onClick={handleDismiss}
          aria-label="Dismiss alert"
          type="button"
        >
          ×
        </button>
      )}
    </div>
  );
};

Alert.displayName = 'Alert';

