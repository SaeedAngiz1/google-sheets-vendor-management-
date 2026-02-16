/**
 * @component Slider
 * @description Reusable range slider component with label and current value display.
 *
 * @example
 * ```tsx
 * <Slider
 *   label="Years in Business"
 *   value={years}
 *   onChange={setYears}
 *   min={0}
 *   max={50}
 *   step={1}
 * />
 * ```
 */

import React from 'react';

export interface SliderProps {
  /** Slider label text */
  label: string;
  /** Current slider value */
  value: number;
  /** Change handler receiving the new numeric value */
  onChange: (value: number) => void;
  /** Minimum slider value */
  min?: number;
  /** Maximum slider value */
  max?: number;
  /** Step increment */
  step?: number;
  /** Whether the slider is disabled */
  disabled?: boolean;
  /** Unit text to display after the value (e.g., "years") */
  unit?: string;
  /** Unique identifier */
  id?: string;
  /** Additional CSS class names */
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  unit = '',
  id,
  className = '',
}) => {
  const sliderId = id || `slider-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={`form-field ${className}`}>
      <div className="slider-header">
        <label htmlFor={sliderId} className="form-label">
          {label}
        </label>
        <span className="slider-value">
          {value}
          {unit && ` ${unit}`}
        </span>
      </div>
      <input
        id={sliderId}
        type="range"
        className="form-slider"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={`${value}${unit ? ` ${unit}` : ''}`}
      />
      <div className="slider-range">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

Slider.displayName = 'Slider';

