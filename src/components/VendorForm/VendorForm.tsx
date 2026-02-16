/**
 * @component VendorForm
 * @description Form component for onboarding a new vendor. Includes all form fields
 * matching the Google Sheets columns with validation and duplicate checking.
 *
 * Features:
 * - Text input for company name (required)
 * - Select dropdown for business type (required)
 * - Multi-select chips for products
 * - Slider for years in business
 * - Date picker for onboarding date
 * - Text area for additional notes
 * - Validation with error messages
 * - Duplicate vendor name checking
 *
 * @example
 * ```tsx
 * <VendorForm
 *   vendors={existingVendors}
 *   isLoading={isSubmitting}
 *   onSubmit={handleAddVendor}
 * />
 * ```
 */

import React, { useState, useCallback } from 'react';
import type { Vendor, VendorFormData, BusinessType, Product } from '../../types/vendor';
import {
  BUSINESS_TYPES,
  PRODUCTS,
  YEARS_IN_BUSINESS,
  DEFAULT_FORM_VALUES,
} from '../../constants/vendor';
import {
  validateMandatoryFields,
  isDuplicateVendor,
  formDataToVendor,
} from '../../utils/validation';
import { TextInput, Select, MultiSelect, Slider, DatePicker, TextArea, Button, Alert } from '../ui';
import type { AlertMessage } from '../../types/vendor';

export interface VendorFormProps {
  /** Existing vendors for duplicate checking */
  vendors: Vendor[];
  /** Whether a submission is in progress */
  isLoading: boolean;
  /** Callback when the form is submitted with valid data */
  onSubmit: (vendor: Vendor) => Promise<boolean>;
  /** Additional CSS class names */
  className?: string;
}

export const VendorForm: React.FC<VendorFormProps> = ({
  vendors,
  isLoading,
  onSubmit,
  className = '',
}) => {
  const [formData, setFormData] = useState<VendorFormData>({ ...DEFAULT_FORM_VALUES });
  const [formAlert, setFormAlert] = useState<AlertMessage | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  /** Update a single field in the form data */
  const updateField = useCallback(
    <K extends keyof VendorFormData>(field: K, value: VendorFormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear field error when user edits
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

  /** Reset the form to default values */
  const resetForm = useCallback(() => {
    setFormData({ ...DEFAULT_FORM_VALUES });
    setFieldErrors({});
    setFormAlert(null);
  }, []);

  /** Handle form submission */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setFormAlert(null);
      setFieldErrors({});

      // Validate mandatory fields
      const validation = validateMandatoryFields(formData);
      if (!validation.isValid) {
        setFormAlert({
          type: 'warning',
          message: 'Please fill in all mandatory fields.',
        });

        // Map errors to field-level
        const errors: Record<string, string> = {};
        if (!formData.companyName.trim()) errors.companyName = 'Company Name is required';
        if (!formData.businessType) errors.businessType = 'Business Type is required';
        setFieldErrors(errors);
        return;
      }

      // Check for duplicate company name
      if (isDuplicateVendor(formData.companyName, vendors)) {
        setFormAlert({
          type: 'warning',
          message: 'A vendor with this company name already exists.',
        });
        setFieldErrors({ companyName: 'This company name already exists' });
        return;
      }

      // Convert form data to vendor format and submit
      const vendor = formDataToVendor(formData);
      const success = await onSubmit(vendor);

      if (success) {
        resetForm();
      }
    },
    [formData, vendors, onSubmit, resetForm]
  );

  return (
    <div className={`vendor-form-container ${className}`} role="tabpanel" id="panel-onboard">
      <div className="section-header">
        <h2 className="section-title">Onboard New Vendor</h2>
        <p className="section-description">
          Enter the details of the new vendor below. Fields marked with * are required.
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
          placeholder="Enter any additional information about the vendor..."
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
            Submit Vendor Details
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={resetForm}
            disabled={isLoading}
          >
            Reset Form
          </Button>
        </div>
      </form>
    </div>
  );
};

VendorForm.displayName = 'VendorForm';

