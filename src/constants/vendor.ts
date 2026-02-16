/**
 * @module constants/vendor
 * @description Application constants for the Vendor Management Portal.
 * Centralized configuration values used across components.
 */

import type { BusinessType, Product, VendorAction } from '../types/vendor';

/**
 * Available business type options for vendor classification.
 * Used in select dropdowns throughout the application.
 */
export const BUSINESS_TYPES: readonly BusinessType[] = [
  'Manufacturer',
  'Distributor',
  'Wholesaler',
  'Retailer',
  'Service Provider',
] as const;

/**
 * Available product categories that vendors can offer.
 * Used in multi-select components.
 */
export const PRODUCTS: readonly Product[] = [
  'Electronics',
  'Apparel',
  'Groceries',
  'Software',
  'Other',
] as const;

/**
 * Action options displayed in the main action selector.
 * Each action maps to a different view/form in the application.
 */
export const VENDOR_ACTIONS: readonly { value: VendorAction; label: string }[] = [
  { value: 'onboard', label: 'Onboard New Vendor' },
  { value: 'update', label: 'Update Existing Vendor' },
  { value: 'view', label: 'View All Vendors' },
  { value: 'delete', label: 'Delete Vendor' },
] as const;

/**
 * Slider configuration for years in business.
 */
export const YEARS_IN_BUSINESS = {
  MIN: 0,
  MAX: 50,
  DEFAULT: 5,
  STEP: 1,
} as const;

/**
 * Default form values for a new vendor entry.
 */
export const DEFAULT_FORM_VALUES = {
  companyName: '',
  businessType: '' as const,
  products: [] as Product[],
  yearsInBusiness: YEARS_IN_BUSINESS.DEFAULT,
  onboardingDate: new Date().toISOString().split('T')[0],
  additionalInfo: '',
};

/**
 * Column headers mapping between form fields and Google Sheets columns.
 */
export const SHEET_COLUMNS = {
  COMPANY_NAME: 'CompanyName',
  BUSINESS_TYPE: 'BusinessType',
  PRODUCTS: 'Products',
  YEARS_IN_BUSINESS: 'YearsInBusiness',
  ONBOARDING_DATE: 'OnboardingDate',
  ADDITIONAL_INFO: 'AdditionalInfo',
} as const;

