/**
 * @component VendorUpdate
 * @description Form component for updating an existing vendor's details.
 * Allows selection of an existing vendor, pre-fills the form with current data,
 * and submits the updated information.
 *
 * @example
 * ```tsx
 * <VendorUpdate
 *   vendors={existingVendors}
 *   isLoading={isUpdating}
 *   onUpdate={handleUpdateVendor}
 * />
 * ```
 */

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import type { Vendor, VendorFormData, BusinessType, Product, AlertMessage } from '../../types/vendor';
import {
  BUSINESS_TYPES,
  PRODUCTS,
  YEARS_IN_BUSINESS,
} from '../../constants/vendor';
import {
  validateMandatoryFields,
  formDataToVendor,
  vendorToFormData,
} from '../../utils/validation';
import { TextInput, Select, MultiSelect, Slider, DatePicker, TextArea, Button, Alert } from '../ui';

export interface VendorUpdateProps {
  /** Existing vendors to select from */
  vendors: Vendor[];
  /** Whether an update is in progress */
  isLoading: boolean;
  /** Callback when vendor update is submitted */
  onUpdate: (originalName: string, vendor: Vendor) => Promise<boolean>;
  /** Additional CSS class names */
  className?: string;
}

export const VendorUpdate: React.FC<VendorUpdateProps> = ({
  vendors,
  isLoading,
  onUpdate,
  className = '',
}) => {
  const [selectedVendor, setSelectedVendor] = useState<string>('');
  const [formData, setFormData] = useState<VendorFormData | null>(null);
  const [formAlert, setFormAlert] = useState<AlertMessage | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  /** List of vendor names for the selector */
  const vendorNames = useMemo(
    () => vendors.map((v) => v.CompanyName),
    [vendors]
  );

  /** Load selected vendor data into the form */
  useEffect(() => {
    if (selectedVendor) {
      const vendor = vendors.find((v) => v.CompanyName === selectedVendor);
      if (vendor) {
        setFormData(vendorToFormData(vendor));
        setFieldErrors({});
        setFormAlert(null);
      }
    } else {
      setFormData(null);
    }
  }, [selectedVendor, vendors]);

  /** Update a single field in the form data */
  const updateField = useCallback(
    <K extends keyof VendorFormData>(field: K, value: VendorFormData[K]) => {
      setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));
      if (fieldErrors[field]) {
        setFieldErrors((prev) => {
          const next = { ...prev };
          delete next[field];
          return next;
        });
      }
    },
    [fieldErrors]
  );

  /** Handle form submission */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData || !selectedVendor) return;

      setFormAlert(null);
      setFieldErrors({});

      // Validate
      const validation = validateMandatoryFields(formData);
      if (!validation.isValid) {
        setFormAlert({
          type: 'warning',
          message: 'Please fill in all mandatory fields.',
        });
        const errors: Record<string, string> = {};
        if (!formData.companyName.trim()) errors.companyName = 'Company Name is required';
        if (!formData.businessType) errors.businessType = 'Business Type is required';
        setFieldErrors(errors);
        return;
      }

      const vendor = formDataToVendor(formData);
      const success = await onUpdate(selectedVendor, vendor);

      if (success) {
        setSelectedVendor('');
        setFormData(null);
      }
    },
    [formData, selectedVendor, onUpdate]
  );

  return (
    <div className={`vendor-update-container ${className}`} role="tabpanel" id="panel-update">
      <div className="section-header">
        <h2 className="section-title">Update Existing Vendor</h2>
        <p className="section-description">
          Select a vendor to update their details.
        </p>
      </div>

      {formAlert && (
        <Alert
          type={formAlert.type}
          message={formAlert.message}
          onDismiss={() => setFormAlert(null)}
          autoDismiss={0}
        />
      )}

      <Select
        label="Select a Vendor to Update"
        value={selectedVendor}
        onChange={setSelectedVendor}
        options={vendorNames}
        placeholder="Choose a vendor..."
        disabled={isLoading}
      />

      {formData && (
        <form onSubmit={handleSubmit} className="vendor-form" noValidate>
          <div className="form-grid">
            <TextInput
              label="Company Name"
              value={formData.companyName}
              onChange={(value) => updateField('companyName', value)}
              placeholder="Enter company name..."
              required
              disabled={isLoading}
              error={fieldErrors.companyName}
            />

            <Select
              label="Business Type"
              value={formData.businessType}
              onChange={(value) => updateField('businessType', value as BusinessType)}
              options={BUSINESS_TYPES}
              placeholder="Select a business type..."
              required
              disabled={isLoading}
              error={fieldErrors.businessType}
            />
          </div>

          <MultiSelect
            label="Products Offered"
            value={formData.products}
            onChange={(value) => updateField('products', value as Product[])}
            options={PRODUCTS}
            disabled={isLoading}
          />

          <Slider
            label="Years in Business"
            value={formData.yearsInBusiness}
            onChange={(value) => updateField('yearsInBusiness', value)}
            min={YEARS_IN_BUSINESS.MIN}
            max={YEARS_IN_BUSINESS.MAX}
            step={YEARS_IN_BUSINESS.STEP}
            unit="years"
            disabled={isLoading}
          />

          <DatePicker
            label="Onboarding Date"
            value={formData.onboardingDate}
            onChange={(value) => updateField('onboardingDate', value)}
            required
            disabled={isLoading}
          />

          <TextArea
            label="Additional Notes"
            value={formData.additionalInfo}
            onChange={(value) => updateField('additionalInfo', value)}
            placeholder="Enter any additional information..."
            maxLength={500}
            disabled={isLoading}
          />

          <div className="form-actions">
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              fullWidth
            >
              Update Vendor Details
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setSelectedVendor('');
                setFormData(null);
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      {!formData && vendors.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon" aria-hidden="true">📭</div>
          <h3 className="empty-state-title">No vendors to update</h3>
          <p className="empty-state-message">
            Start by onboarding your first vendor.
          </p>
        </div>
      )}
    </div>
  );
};

VendorUpdate.displayName = 'VendorUpdate';

