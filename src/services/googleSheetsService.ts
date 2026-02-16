/**
 * @module services/googleSheetsService
 * @description Service abstraction layer for Google Sheets API operations.
 *
 * Provides a clean interface for CRUD operations on Google Sheets data.
 * Supports both a real Google Sheets API integration and a localStorage-based
 * mock for development/demo purposes.
 *
 * ## Setup for Google Sheets API:
 * 1. Create a Google Cloud project and enable the Google Sheets API
 * 2. Create an API key or OAuth2 credentials
 * 3. Share your spreadsheet with the service account email
 * 4. Set the environment variables in `.env`
 *
 * @example
 * ```ts
 * const service = createGoogleSheetsService({
 *   apiKey: 'your-api-key',
 *   spreadsheetId: 'your-spreadsheet-id',
 *   worksheetName: 'Vendors',
 * });
 *
 * const vendors = await service.fetchVendors();
 * await service.addVendor(newVendor);
 * ```
 */

import type { Vendor, GoogleSheetsConfig, SheetsApiResponse } from '../types/vendor';

/**
 * Interface defining the vendor data service contract.
 * All implementations (real API, mock, etc.) must conform to this interface.
 */
export interface VendorDataService {
  /** Fetch all vendors from the data source */
  fetchVendors(): Promise<SheetsApiResponse<Vendor[]>>;
  /** Add a new vendor to the data source */
  addVendor(vendor: Vendor): Promise<SheetsApiResponse<Vendor>>;
  /** Update an existing vendor by company name */
  updateVendor(originalName: string, vendor: Vendor): Promise<SheetsApiResponse<Vendor>>;
  /** Delete a vendor by company name */
  deleteVendor(companyName: string): Promise<SheetsApiResponse<void>>;
}

// ─── Google Sheets API Implementation ─────────────────────────────────────────

const SHEETS_API_BASE = 'https://sheets.googleapis.com/v4/spreadsheets';

/**
 * Creates a Google Sheets API service instance.
 *
 * @param config - Google Sheets connection configuration
 * @returns VendorDataService implementation using the Google Sheets API
 */
export function createGoogleSheetsService(config: GoogleSheetsConfig): VendorDataService {
  const { apiKey, spreadsheetId, worksheetName } = config;

  async function fetchVendors(): Promise<SheetsApiResponse<Vendor[]>> {
    try {
      const url = `${SHEETS_API_BASE}/${spreadsheetId}/values/${worksheetName}?key=${apiKey}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Google Sheets API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const rows: string[][] = data.values || [];

      if (rows.length <= 1) {
        return { success: true, data: [] };
      }

      const headers = rows[0];
      const vendors: Vendor[] = rows.slice(1).map((row) => {
        const vendor: Record<string, string | number> = {};
        headers.forEach((header, index) => {
          vendor[header] = row[index] || '';
        });
        // Parse YearsInBusiness as number
        vendor.YearsInBusiness = Number(vendor.YearsInBusiness) || 0;
        return vendor as unknown as Vendor;
      });

      return { success: true, data: vendors };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch vendors',
      };
    }
  }

  async function addVendor(vendor: Vendor): Promise<SheetsApiResponse<Vendor>> {
    try {
      const url = `${SHEETS_API_BASE}/${spreadsheetId}/values/${worksheetName}:append?valueInputOption=USER_ENTERED&key=${apiKey}`;
      const values = [
        [
          vendor.CompanyName,
          vendor.BusinessType,
          vendor.Products,
          vendor.YearsInBusiness,
          vendor.OnboardingDate,
          vendor.AdditionalInfo,
        ],
      ];

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ values }),
      });

      if (!response.ok) {
        throw new Error(`Failed to add vendor: ${response.statusText}`);
      }

      return { success: true, data: vendor };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add vendor',
      };
    }
  }

  async function updateVendor(
    originalName: string,
    vendor: Vendor
  ): Promise<SheetsApiResponse<Vendor>> {
    try {
      // Fetch all data, find the row, update it
      const allData = await fetchVendors();
      if (!allData.success || !allData.data) {
        throw new Error('Failed to fetch existing data for update');
      }

      const rowIndex = allData.data.findIndex(
        (v) => v.CompanyName === originalName
      );

      if (rowIndex === -1) {
        throw new Error(`Vendor "${originalName}" not found`);
      }

      // Google Sheets rows are 1-indexed, +1 for header row
      const sheetRow = rowIndex + 2;
      const range = `${worksheetName}!A${sheetRow}:F${sheetRow}`;
      const url = `${SHEETS_API_BASE}/${spreadsheetId}/values/${range}?valueInputOption=USER_ENTERED&key=${apiKey}`;

      const values = [
        [
          vendor.CompanyName,
          vendor.BusinessType,
          vendor.Products,
          vendor.YearsInBusiness,
          vendor.OnboardingDate,
          vendor.AdditionalInfo,
        ],
      ];

      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ values }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update vendor: ${response.statusText}`);
      }

      return { success: true, data: vendor };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update vendor',
      };
    }
  }

  async function deleteVendor(companyName: string): Promise<SheetsApiResponse<void>> {
    try {
      // For deletion, we need to clear the row and shift data
      // This requires the batchUpdate API with deleteDimension
      const allData = await fetchVendors();
      if (!allData.success || !allData.data) {
        throw new Error('Failed to fetch existing data for deletion');
      }

      const rowIndex = allData.data.findIndex(
        (v) => v.CompanyName === companyName
      );

      if (rowIndex === -1) {
        throw new Error(`Vendor "${companyName}" not found`);
      }

      // Rewrite entire sheet without the deleted row
      const updatedVendors = allData.data.filter(
        (v) => v.CompanyName !== companyName
      );

      const headers = [
        'CompanyName',
        'BusinessType',
        'Products',
        'YearsInBusiness',
        'OnboardingDate',
        'AdditionalInfo',
      ];

      const values = [
        headers,
        ...updatedVendors.map((v) => [
          v.CompanyName,
          v.BusinessType,
          v.Products,
          v.YearsInBusiness,
          v.OnboardingDate,
          v.AdditionalInfo,
        ]),
      ];

      const range = `${worksheetName}`;
      const url = `${SHEETS_API_BASE}/${spreadsheetId}/values/${range}?valueInputOption=USER_ENTERED&key=${apiKey}`;

      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ values }),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete vendor: ${response.statusText}`);
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete vendor',
      };
    }
  }

  return { fetchVendors, addVendor, updateVendor, deleteVendor };
}

// ─── LocalStorage Mock Implementation (for Development / Demo) ────────────────

const STORAGE_KEY = 'vendor-management-data';

/** Sample seed data for development */
const SEED_DATA: Vendor[] = [
  {
    CompanyName: 'Acme Electronics',
    BusinessType: 'Manufacturer',
    Products: 'Electronics, Software',
    YearsInBusiness: 15,
    OnboardingDate: '2024-01-15',
    AdditionalInfo: 'Primary electronics supplier',
  },
  {
    CompanyName: 'Global Distributors Inc.',
    BusinessType: 'Distributor',
    Products: 'Electronics, Apparel, Groceries',
    YearsInBusiness: 25,
    OnboardingDate: '2023-06-20',
    AdditionalInfo: 'International distribution network',
  },
  {
    CompanyName: 'FreshMart Wholesale',
    BusinessType: 'Wholesaler',
    Products: 'Groceries',
    YearsInBusiness: 8,
    OnboardingDate: '2024-03-10',
    AdditionalInfo: 'Organic and fresh produce specialist',
  },
  {
    CompanyName: 'TechSoft Solutions',
    BusinessType: 'Service Provider',
    Products: 'Software',
    YearsInBusiness: 5,
    OnboardingDate: '2024-07-01',
    AdditionalInfo: 'Cloud-based SaaS solutions',
  },
  {
    CompanyName: 'StyleHub Retail',
    BusinessType: 'Retailer',
    Products: 'Apparel, Other',
    YearsInBusiness: 12,
    OnboardingDate: '2023-11-30',
    AdditionalInfo: 'Premium fashion retail chain',
  },
];

/**
 * Helper to simulate network latency for realistic dev experience.
 */
function simulateDelay(ms: number = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Gets vendors from localStorage, seeding with sample data if empty.
 */
function getStoredVendors(): Vendor[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [...SEED_DATA];
    }
  }
  // Seed initial data
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
  return [...SEED_DATA];
}

/**
 * Saves vendors to localStorage.
 */
function saveVendors(vendors: Vendor[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vendors));
}

/**
 * Creates a localStorage-based mock service for development and demos.
 * This behaves identically to the Google Sheets service but stores data locally.
 *
 * @returns VendorDataService implementation using localStorage
 *
 * @example
 * ```ts
 * const service = createLocalStorageService();
 * const vendors = await service.fetchVendors();
 * ```
 */
export function createLocalStorageService(): VendorDataService {
  async function fetchVendors(): Promise<SheetsApiResponse<Vendor[]>> {
    await simulateDelay(300);
    try {
      const vendors = getStoredVendors();
      return { success: true, data: vendors };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch vendors',
      };
    }
  }

  async function addVendor(vendor: Vendor): Promise<SheetsApiResponse<Vendor>> {
    await simulateDelay(500);
    try {
      const vendors = getStoredVendors();
      vendors.push(vendor);
      saveVendors(vendors);
      return { success: true, data: vendor };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add vendor',
      };
    }
  }

  async function updateVendor(
    originalName: string,
    vendor: Vendor
  ): Promise<SheetsApiResponse<Vendor>> {
    await simulateDelay(500);
    try {
      const vendors = getStoredVendors();
      const index = vendors.findIndex((v) => v.CompanyName === originalName);
      if (index === -1) {
        return { success: false, error: `Vendor "${originalName}" not found` };
      }
      vendors[index] = vendor;
      saveVendors(vendors);
      return { success: true, data: vendor };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update vendor',
      };
    }
  }

  async function deleteVendor(companyName: string): Promise<SheetsApiResponse<void>> {
    await simulateDelay(500);
    try {
      const vendors = getStoredVendors();
      const filtered = vendors.filter((v) => v.CompanyName !== companyName);
      if (filtered.length === vendors.length) {
        return { success: false, error: `Vendor "${companyName}" not found` };
      }
      saveVendors(filtered);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete vendor',
      };
    }
  }

  return { fetchVendors, addVendor, updateVendor, deleteVendor };
}

// ─── Factory ──────────────────────────────────────────────────────────────────

/**
 * Factory function to create the appropriate data service based on environment.
 * Uses Google Sheets API if credentials are configured, falls back to localStorage.
 *
 * @returns Configured VendorDataService instance
 */
export function createVendorService(): VendorDataService {
  const apiKey = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
  const spreadsheetId = import.meta.env.VITE_GOOGLE_SHEETS_SPREADSHEET_ID;
  const worksheetName = import.meta.env.VITE_GOOGLE_SHEETS_WORKSHEET || 'Vendors';

  if (apiKey && spreadsheetId) {
    console.info('🔗 Using Google Sheets API service');
    return createGoogleSheetsService({ apiKey, spreadsheetId, worksheetName });
  }

  console.info('📦 Using localStorage mock service (set VITE_GOOGLE_SHEETS_* env vars to use Google Sheets)');
  return createLocalStorageService();
}

