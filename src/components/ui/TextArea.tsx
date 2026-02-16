/**
 * @component TextArea
 * @description Reusable textarea component with label and character count support.
 *
 * @example
 * ```tsx
 * <TextArea
 *   label="Additional Notes"
 *   value={notes}
 *   onChange={setNotes}
 *   placeholder="Enter any additional information..."
 *   maxLength={500}
 * />
 * ```
 */

import React from 'react';

export interface TextAreaProps {
  /** TextArea label text */
  label: string;
  /** Current textarea value */
  value: string;
  /** Change handler receiving the new string value */
  onChange: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Whether the textarea is disabled */
  disabled?: boolean;
  /** Number of visible text rows */
  rows?: number;
  /** Maximum character count */
  maxLength?: number;
  /** Error message to display */
  error?: string;
  /** Unique identifier */
  id?: string;
  /** Additional CSS class names */
  className?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  value,
  onChange,
  placeholder = '',
  required = false,
  disabled = false,
  rows = 4,
  maxLength,
  error,
  id,
  className = '',
}) => {
  const textareaId = id || `textarea-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={`form-field ${className}`}>
      <label htmlFor={textareaId} className="form-label">
        {label}
        {required && <span className="required-marker">*</span>}
      </label>
      <textarea
        id={textareaId}
        className={`form-input form-textarea ${error ? 'form-input--error' : ''}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${textareaId}-error` : undefined}
      />
      <div className="textarea-footer">
        {error && (
          <p id={`${textareaId}-error`} className="form-error" role="alert">
            {error}
          </p>
        )}
        {maxLength && (
          <span className="char-count">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
};

TextArea.displayName = 'TextArea';

