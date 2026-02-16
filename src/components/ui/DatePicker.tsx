/**
 * @component DatePicker
 * @description Reusable date picker component with label and validation support.
 *
 * @example
 * ```tsx
 * <DatePicker
 *   label="Onboarding Date"
 *   value={date}
 *   onChange={setDate}
 *   required
 * />
 * ```
 */

import React from 'react';

export interface DatePickerProps {
  /** Date picker label text */
  label: string;
  /** Current date value in YYYY-MM-DD format */
  value: string;
  /** Change handler receiving the new date string */
  onChange: (value: string) => void;
  /** Whether the field is required */
  required?: boolean;
  /** Whether the date picker is disabled */
  disabled?: boolean;
  /** Minimum selectable date */
  min?: string;
  /** Maximum selectable date */
  max?: string;
  /** Error message to display */
  error?: string;
  /** Unique identifier */
  id?: string;
  /** Additional CSS class names */
  className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  required = false,
  disabled = false,
  min,
  max,
  error,
  id,
  className = '',
}) => {
  const dateId = id || `date-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={`form-field ${className}`}>
      <label htmlFor={dateId} className="form-label">
        {label}
        {required && <span className="required-marker">*</span>}
      </label>
      <input
        id={dateId}
        type="date"
        className={`form-input ${error ? 'form-input--error' : ''}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
        min={min}
        max={max}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${dateId}-error` : undefined}
      />
      {error && (
        <p id={`${dateId}-error`} className="form-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

DatePicker.displayName = 'DatePicker';

