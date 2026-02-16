/**
 * @component TextInput
 * @description Reusable text input component with label, validation, and accessibility support.
 *
 * @example
 * ```tsx
 * <TextInput
 *   label="Company Name"
 *   value={name}
 *   onChange={setName}
 *   required
 *   placeholder="Enter company name..."
 * />
 * ```
 */

import React from 'react';

export interface TextInputProps {
  /** Input label text */
  label: string;
  /** Current input value */
  value: string;
  /** Change handler receiving the new string value */
  onChange: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Error message to display below the input */
  error?: string;
  /** Unique identifier for the input */
  id?: string;
  /** Additional CSS class names */
  className?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  onChange,
  placeholder = '',
  required = false,
  disabled = false,
  error,
  id,
  className = '',
}) => {
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={`form-field ${className}`}>
      <label htmlFor={inputId} className="form-label">
        {label}
        {required && <span className="required-marker">*</span>}
      </label>
      <input
        id={inputId}
        type="text"
        className={`form-input ${error ? 'form-input--error' : ''}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
      />
      {error && (
        <p id={`${inputId}-error`} className="form-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

TextInput.displayName = 'TextInput';

