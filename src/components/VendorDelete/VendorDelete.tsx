/**
 * @component VendorDelete
 * @description Component for deleting an existing vendor from the system.
 * Includes a confirmation step to prevent accidental deletions.
 *
 * Features:
 * - Vendor selection dropdown
 * - Preview of vendor details before deletion
 * - Confirmation dialog
 * - Loading state during deletion
 *
 * @example
 * ```tsx
 * <VendorDelete
 *   vendors={existingVendors}
 *   isLoading={isDeleting}
 *   onDelete={handleDeleteVendor}
 * />
 * ```
 */

import React, { useState, useCallback, useMemo } from 'react';
import type { Vendor, AlertMessage } from '../../types/vendor';
import { Select, Button, Alert } from '../ui';

export interface VendorDeleteProps {
  /** Existing vendors to select from */
  vendors: Vendor[];
  /** Whether a deletion is in progress */
  isLoading: boolean;
  /** Callback when vendor deletion is confirmed */
  onDelete: (companyName: string) => Promise<boolean>;
  /** Additional CSS class names */
  className?: string;
}

export const VendorDelete: React.FC<VendorDeleteProps> = ({
  vendors,
  isLoading,
  onDelete,
  className = '',
}) => {
  const [selectedVendor, setSelectedVendor] = useState<string>('');
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [formAlert, setFormAlert] = useState<AlertMessage | null>(null);

  /** List of vendor names for the selector */
  const vendorNames = useMemo(
    () => vendors.map((v) => v.CompanyName),
    [vendors]
  );

  /** Get the full vendor details for the selected vendor */
  const vendorDetails = useMemo(
    () => vendors.find((v) => v.CompanyName === selectedVendor),
    [vendors, selectedVendor]
  );

  /** Handle deletion request */
  const handleDeleteRequest = useCallback(() => {
    if (!selectedVendor) {
      setFormAlert({
        type: 'warning',
        message: 'Please select a vendor to delete.',
      });
      return;
    }
    setShowConfirm(true);
    setFormAlert(null);
  }, [selectedVendor]);

  /** Confirm and execute deletion */
  const handleConfirmDelete = useCallback(async () => {
    if (!selectedVendor) return;

    const success = await onDelete(selectedVendor);

    if (success) {
      setSelectedVendor('');
      setShowConfirm(false);
    }
  }, [selectedVendor, onDelete]);

  /** Cancel deletion */
  const handleCancelDelete = useCallback(() => {
    setShowConfirm(false);
  }, []);

  return (
    <div className={`vendor-delete-container ${className}`} role="tabpanel" id="panel-delete">
      <div className="section-header">
        <h2 className="section-title">Delete Vendor</h2>
        <p className="section-description">
          Select a vendor to permanently remove from the system.
        </p>
      </div>

      {formAlert && (
        <Alert
          type={formAlert.type}
          message={formAlert.message}
          onDismiss={() => setFormAlert(null)}
        />
      )}

      <Select
        label="Select a Vendor to Delete"
        value={selectedVendor}
        onChange={(value) => {
          setSelectedVendor(value);
          setShowConfirm(false);
          setFormAlert(null);
        }}
        options={vendorNames}
        placeholder="Choose a vendor..."
        disabled={isLoading}
      />

      {/* Vendor Preview Card */}
      {vendorDetails && !showConfirm && (
        <div className="vendor-preview-card">
          <h3 className="preview-title">Vendor Details</h3>
          <div className="preview-grid">
            <div className="preview-item">
              <span className="preview-label">Company</span>
              <span className="preview-value">{vendorDetails.CompanyName}</span>
            </div>
            <div className="preview-item">
              <span className="preview-label">Business Type</span>
              <span className="preview-value">{vendorDetails.BusinessType}</span>
            </div>
            <div className="preview-item">
              <span className="preview-label">Products</span>
              <span className="preview-value">{vendorDetails.Products || '—'}</span>
            </div>
            <div className="preview-item">
              <span className="preview-label">Years in Business</span>
              <span className="preview-value">{vendorDetails.YearsInBusiness}</span>
            </div>
            <div className="preview-item">
              <span className="preview-label">Onboarding Date</span>
              <span className="preview-value">{vendorDetails.OnboardingDate}</span>
            </div>
            {vendorDetails.AdditionalInfo && (
              <div className="preview-item preview-item--full">
                <span className="preview-label">Notes</span>
                <span className="preview-value">{vendorDetails.AdditionalInfo}</span>
              </div>
            )}
          </div>

          <Button
            variant="danger"
            onClick={handleDeleteRequest}
            disabled={isLoading}
            fullWidth
          >
            Delete This Vendor
          </Button>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirm && vendorDetails && (
        <div className="confirm-dialog" role="alertdialog" aria-labelledby="confirm-title">
          <div className="confirm-icon" aria-hidden="true">⚠️</div>
          <h3 id="confirm-title" className="confirm-title">
            Confirm Deletion
          </h3>
          <p className="confirm-message">
            Are you sure you want to permanently delete{' '}
            <strong>{vendorDetails.CompanyName}</strong>? This action cannot be undone.
          </p>
          <div className="confirm-actions">
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              isLoading={isLoading}
            >
              Yes, Delete Vendor
            </Button>
            <Button
              variant="secondary"
              onClick={handleCancelDelete}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {vendors.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon" aria-hidden="true">📭</div>
          <h3 className="empty-state-title">No vendors to delete</h3>
          <p className="empty-state-message">
            There are no vendors in the system.
          </p>
        </div>
      )}
    </div>
  );
};

VendorDelete.displayName = 'VendorDelete';

