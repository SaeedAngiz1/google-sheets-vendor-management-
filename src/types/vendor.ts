/**
 * @module types/vendor
 * @description TypeScript interfaces and types for the Vendor Management Portal.
 * These types define the shape of vendor data throughout the application.
 */

/** Business type categories for vendor classification */
export type BusinessType =
  | 'Manufacturer'
  | 'Distributor'
  | 'Wholesaler'
  | 'Retailer'
  | 'Service Provider';

/** Product categories offered by vendors */
export type Product =
  | 'Electronics'
  | 'Apparel'
  | 'Groceries'
  | 'Software'
  | 'Other';

/**
 * Core vendor data interface representing a single vendor record.
 * Maps directly to the Google Sheets columns.
 */
export interface Vendor {
  /** Unique company name identifier */
  CompanyName: string;
  /** Type/category of the business */
  BusinessType: BusinessType;
  /** Comma-separated list of products offered */
  Products: string;
  /** Number of years the vendor has been in business */
  YearsInBusiness: number;
  /** Date when the vendor was onboarded (ISO format YYYY-MM-DD) */
  OnboardingDate: string;
  /** Any additional notes or information */
  AdditionalInfo: string;
}

/**
 * Form data interface used for vendor form inputs.
 * Products is an array here (before serialization to comma-separated string).
 */
export interface VendorFormData {
  companyName: string;
  businessType: BusinessType | '';
  products: Product[];
  yearsInBusiness: number;
  onboardingDate: string;
  additionalInfo: string;
}

/**
 * Available CRUD actions in the application.
 */
export type VendorAction =
  | 'onboard'
  | 'update'
  | 'view'
  | 'delete';

/**
 * Alert severity levels for user feedback.
 */
export type AlertType = 'success' | 'warning' | 'error' | 'info';

/**
 * Alert message structure.
 */
export interface AlertMessage {
  type: AlertType;
  message: string;
}

/**
 * Props for vendor-related components that need access to vendor data.
 */
export interface VendorDataProps {
  /** List of existing vendors */
  vendors: Vendor[];
  /** Whether data is currently loading */
  isLoading: boolean;
  /** Error message if data fetch failed */
  error: string | null;
  /** Callback to refresh vendor data */
  onRefresh: () => void;
}

/**
 * Google Sheets connection configuration.
 */
export interface GoogleSheetsConfig {
  /** Google Sheets API key */
  apiKey: string;
  /** The spreadsheet ID from the Google Sheets URL */
  spreadsheetId: string;
  /** The name of the worksheet/tab */
  worksheetName: string;
}

/**
 * Response shape from Google Sheets API operations.
 */
export interface SheetsApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

