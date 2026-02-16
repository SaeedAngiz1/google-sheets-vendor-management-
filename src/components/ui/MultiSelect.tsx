/**
 * @component MultiSelect
 * @description Reusable multi-select component allowing users to select multiple options.
 * Renders as a grid of toggleable chips/tags for a modern UX.
 *
 * @example
 * ```tsx
 * <MultiSelect
 *   label="Products Offered"
 *   value={selectedProducts}
 *   onChange={setSelectedProducts}
 *   options={PRODUCTS}
 * />
 * ```
 */

import React, { useCallback } from 'react';

export interface MultiSelectProps {
  /** Component label text */
  label: string;
  /** Array of currently selected values */
  value: string[];
  /** Change handler receiving updated array of selected values */
  onChange: (value: string[]) => void;
  /** Available options to select from */
  options: readonly string[];
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Additional CSS class names */
  className?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  value,
  onChange,
  options,
  disabled = false,
  className = '',
}) => {
  const toggleOption = useCallback(
    (option: string) => {
      if (disabled) return;
      const isSelected = value.includes(option);
      if (isSelected) {
        onChange(value.filter((v) => v !== option));
      } else {
        onChange([...value, option]);
      }
    },
    [value, onChange, disabled]
  );

  return (
    <div className={`form-field ${className}`}>
      <label className="form-label">{label}</label>
      <div className="multi-select-grid" role="group" aria-label={label}>
        {options.map((option) => {
          const isSelected = value.includes(option);
          return (
            <button
              key={option}
              type="button"
              className={`multi-select-chip ${isSelected ? 'multi-select-chip--selected' : ''}`}
              onClick={() => toggleOption(option)}
              disabled={disabled}
              aria-pressed={isSelected}
              role="checkbox"
              aria-checked={isSelected}
            >
              {isSelected && <span className="chip-check">✓</span>}
              {option}
            </button>
          );
        })}
      </div>
      {value.length > 0 && (
        <p className="form-hint">
          Selected: {value.join(', ')}
        </p>
      )}
    </div>
  );
};

MultiSelect.displayName = 'MultiSelect';

