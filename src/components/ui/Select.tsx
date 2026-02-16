/**
 * @component Select
 * @description Reusable select/dropdown component with label and validation support.
 *
 * @example
 * ```tsx
 * <Select
 *   label="Business Type"
 *   value={businessType}
 *   onChange={setBusinessType}
 *   options={BUSINESS_TYPES}
 *   required
 *   placeholder="Select a business type..."
 * />
 * ```
 */

import React from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  /** Select label text */
  label: string;
  /** Currently selected value */
  value: string;
  /** Change handler receiving the new value */
  onChange: (value: string) => void;
  /** Available options - either strings or {value, label} objects */
  options: readonly string[] | readonly SelectOption[];
  /** Placeholder text when no option is selected */
  placeholder?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Whether the select is disabled */
  disabled?: boolean;
  /** Error message to display */
  error?: string;
  /** Unique identifier */
  id?: string;
  /** Additional CSS class names */
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select an option...',
  required = false,
  disabled = false,
  error,
  id,
  className = '',
}) => {
  const selectId = id || `select-${label.toLowerCase().replace(/\s+/g, '-')}`;

  const normalizedOptions: SelectOption[] = options.map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  return (
    <div className={`form-field ${className}`}>
      <label htmlFor={selectId} className="form-label">
        {label}
        {required && <span className="required-marker">*</span>}
      </label>
      <select
        id={selectId}
        className={`form-input form-select ${error ? 'form-input--error' : ''}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${selectId}-error` : undefined}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {normalizedOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${selectId}-error`} className="form-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

Select.displayName = 'Select';

