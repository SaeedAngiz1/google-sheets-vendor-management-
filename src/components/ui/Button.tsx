/**
 * @component Button
 * @description Reusable button component with multiple variants and states.
 *
 * @example
 * ```tsx
 * <Button variant="primary" onClick={handleSubmit} isLoading={isSubmitting}>
 *   Submit Vendor Details
 * </Button>
 *
 * <Button variant="danger" onClick={handleDelete}>
 *   Delete Vendor
 * </Button>
 * ```
 */

import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

export interface ButtonProps {
  /** Button content */
  children: React.ReactNode;
  /** Click handler */
  onClick?: () => void;
  /** Visual style variant */
  variant?: ButtonVariant;
  /** HTML button type */
  type?: 'button' | 'submit' | 'reset';
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Whether to show a loading spinner */
  isLoading?: boolean;
  /** Whether the button should take full width */
  fullWidth?: boolean;
  /** Additional CSS class names */
  className?: string;
  /** Accessible label for icon-only buttons */
  'aria-label'?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  type = 'button',
  disabled = false,
  isLoading = false,
  fullWidth = false,
  className = '',
  'aria-label': ariaLabel,
}) => {
  return (
    <button
      type={type}
      className={`btn btn--${variant} ${fullWidth ? 'btn--full-width' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled || isLoading}
      aria-label={ariaLabel}
      aria-busy={isLoading}
    >
      {isLoading ? (
        <span className="btn-loading">
          <span className="btn-spinner" aria-hidden="true" />
          <span>Processing...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};

Button.displayName = 'Button';

