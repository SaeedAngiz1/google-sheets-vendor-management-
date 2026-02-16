/**
 * @component ActionSelector
 * @description Navigation component that allows users to switch between different
 * vendor management actions (Create, Update, View, Delete).
 *
 * Renders as a set of styled tab-like buttons for clear navigation.
 *
 * @example
 * ```tsx
 * <ActionSelector
 *   currentAction={action}
 *   onActionChange={setAction}
 * />
 * ```
 */

import React from 'react';
import type { VendorAction } from '../../types/vendor';
import { VENDOR_ACTIONS } from '../../constants/vendor';

export interface ActionSelectorProps {
  /** Currently selected action */
  currentAction: VendorAction;
  /** Callback when a new action is selected */
  onActionChange: (action: VendorAction) => void;
  /** Whether the selector is disabled (e.g., during loading) */
  disabled?: boolean;
  /** Additional CSS class names */
  className?: string;
}

const ACTION_ICONS: Record<VendorAction, string> = {
  onboard: '➕',
  update: '✏️',
  view: '📋',
  delete: '🗑️',
};

export const ActionSelector: React.FC<ActionSelectorProps> = ({
  currentAction,
  onActionChange,
  disabled = false,
  className = '',
}) => {
  return (
    <nav className={`action-selector ${className}`} aria-label="Vendor actions">
      <div className="action-selector-tabs" role="tablist">
        {VENDOR_ACTIONS.map(({ value, label }) => (
          <button
            key={value}
            role="tab"
            type="button"
            className={`action-tab ${currentAction === value ? 'action-tab--active' : ''}`}
            onClick={() => onActionChange(value)}
            disabled={disabled}
            aria-selected={currentAction === value}
            aria-controls={`panel-${value}`}
          >
            <span className="action-tab-icon" aria-hidden="true">
              {ACTION_ICONS[value]}
            </span>
            <span className="action-tab-label">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

ActionSelector.displayName = 'ActionSelector';

