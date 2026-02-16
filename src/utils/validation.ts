/**
 * @module utils/validation
 * @description Validation utilities for vendor form data.
 * Provides reusable validation functions with descriptive error messages.
 */

import type { Vendor, VendorFormData } from '../types/vendor';

/**
 * Validation result returned by validation functions.
 */
export interface ValidationResult {
  /** Whether the validation passed */
  isValid: boolean;
  /** Error messages (empty array if valid) */
  errors: string[];
}

/**
 * Validates that all mandatory fields in the vendor form are filled.
 *
 * @param formData - The form data to validate
 * @returns ValidationResult with any validation errors
 *
 * @example
 * ```tsx
 * const result = validateMandatoryFields(formData);
 * if (!result.isValid) {
 *   setErrors(result.errors);
 * }
 * ```
 */
export function validateMandatoryFields(formData: VendorFormData): ValidationResult {
  const errors: string[] = [];

  if (!formData.companyName.trim()) {
    errors.push('Company Name is required.');
  }

  if (!formData.businessType) {
    errors.push('Business Type is required.');
  }

  if (!formData.onboardingDate) {
    errors.push('Onboarding Date is required.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Checks if a vendor with the given company name already exists.
 *
 * @param companyName - The company name to check
 * @param existingVendors - Array of existing vendor records
 * @returns true if a duplicate exists, false otherwise
 *
 * @example
 * ```tsx
 * if (isDuplicateVendor('Acme Corp', vendors)) {
 *   showWarning('Vendor already exists');
 * }
 * ```
 */
export function isDuplicateVendor(
  companyName: string,
  existingVendors: Vendor[]
): boolean {
  return existingVendors.some(
    (vendor) =>
      vendor.CompanyName.toLowerCase().trim() ===
      companyName.toLowerCase().trim()
  );
}

/**
 * Converts VendorFormData to a Vendor object suitable for the spreadsheet.
 *
 * @param formData - The form data to convert
 * @returns A Vendor object with properly formatted fields
 */
export function formDataToVendor(formData: VendorFormData): Vendor {
  return {
    CompanyName: formData.companyName.trim(),
    BusinessType: formData.businessType as Vendor['BusinessType'],
    Products: formData.products.join(', '),
    YearsInBusiness: formData.yearsInBusiness,
    OnboardingDate: formData.onboardingDate,
    AdditionalInfo: formData.additionalInfo.trim(),
  };
}

/**
 * Converts a Vendor object back to VendorFormData for editing.
 *
 * @param vendor - The vendor record to convert
 * @returns VendorFormData suitable for form inputs
 */
export function vendorToFormData(vendor: Vendor): VendorFormData {
  return {
    companyName: vendor.CompanyName,
    businessType: vendor.BusinessType,
    products: vendor.Products
      ? (vendor.Products.split(', ').filter(Boolean) as VendorFormData['products'])
      : [],
    yearsInBusiness: vendor.YearsInBusiness,
    onboardingDate: vendor.OnboardingDate,
    additionalInfo: vendor.AdditionalInfo || '',
  };
}

