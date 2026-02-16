/**
 * @component VendorTable
 * @description Displays all vendor data in a responsive, sortable table.
 * Includes search/filter functionality and empty state handling.
 *
 * Features:
 * - Responsive table with horizontal scroll on small screens
 * - Search/filter across all fields
 * - Sortable columns
 * - Empty state message
 * - Row count display
 *
 * @example
 * ```tsx
 * <VendorTable vendors={vendors} isLoading={isLoading} />
 * ```
 */

import React, { useState, useMemo } from 'react';
import type { Vendor } from '../../types/vendor';
import { SHEET_COLUMNS } from '../../constants/vendor';

export interface VendorTableProps {
  /** Array of vendor records to display */
  vendors: Vendor[];
  /** Whether data is currently loading */
  isLoading: boolean;
  /** Additional CSS class names */
  className?: string;
}

type SortField = keyof Vendor;
type SortDirection = 'asc' | 'desc';

/** Column configuration for the vendor table */
const TABLE_COLUMNS: { key: SortField; label: string; width?: string }[] = [
  { key: SHEET_COLUMNS.COMPANY_NAME as SortField, label: 'Company Name', width: '20%' },
  { key: SHEET_COLUMNS.BUSINESS_TYPE as SortField, label: 'Business Type', width: '15%' },
  { key: SHEET_COLUMNS.PRODUCTS as SortField, label: 'Products', width: '20%' },
  { key: SHEET_COLUMNS.YEARS_IN_BUSINESS as SortField, label: 'Years', width: '10%' },
  { key: SHEET_COLUMNS.ONBOARDING_DATE as SortField, label: 'Onboarding Date', width: '15%' },
  { key: SHEET_COLUMNS.ADDITIONAL_INFO as SortField, label: 'Notes', width: '20%' },
];

export const VendorTable: React.FC<VendorTableProps> = ({
  vendors,
  isLoading,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('CompanyName');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  /** Filter vendors based on search query */
  const filteredVendors = useMemo(() => {
    if (!searchQuery.trim()) return vendors;

    const query = searchQuery.toLowerCase().trim();
    return vendors.filter((vendor) =>
      Object.values(vendor).some((value) =>
        String(value).toLowerCase().includes(query)
      )
    );
  }, [vendors, searchQuery]);

  /** Sort filtered vendors */
  const sortedVendors = useMemo(() => {
    return [...filteredVendors].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }

      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      return sortDirection === 'asc'
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });
  }, [filteredVendors, sortField, sortDirection]);

  /** Handle column header click for sorting */
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  /** Get sort indicator for column headers */
  const getSortIndicator = (field: SortField): string => {
    if (sortField !== field) return '↕';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <div className={`vendor-table-container ${className}`} role="tabpanel" id="panel-view">
      <div className="section-header">
        <h2 className="section-title">All Vendors</h2>
        <p className="section-description">
          View and search through all registered vendors.
        </p>
      </div>

      {/* Search bar */}
      <div className="table-toolbar">
        <div className="search-box">
          <span className="search-icon" aria-hidden="true">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search vendors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search vendors"
          />
          {searchQuery && (
            <button
              className="search-clear"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              type="button"
            >
              ×
            </button>
          )}
        </div>
        <span className="table-count">
          {filteredVendors.length} of {vendors.length} vendor{vendors.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      {sortedVendors.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon" aria-hidden="true">📭</div>
          <h3 className="empty-state-title">
            {searchQuery ? 'No matching vendors found' : 'No vendors yet'}
          </h3>
          <p className="empty-state-message">
            {searchQuery
              ? 'Try adjusting your search query.'
              : 'Start by onboarding your first vendor.'}
          </p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="vendor-table" aria-label="Vendor data">
            <thead>
              <tr>
                {TABLE_COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    className="table-header"
                    style={{ width: col.width }}
                    onClick={() => handleSort(col.key)}
                    aria-sort={
                      sortField === col.key
                        ? sortDirection === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : 'none'
                    }
                    role="columnheader"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSort(col.key);
                      }
                    }}
                  >
                    <span className="table-header-content">
                      {col.label}
                      <span className="sort-indicator" aria-hidden="true">
                        {getSortIndicator(col.key)}
                      </span>
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedVendors.map((vendor, index) => (
                <tr key={`${vendor.CompanyName}-${index}`} className="table-row">
                  <td className="table-cell table-cell--name">{vendor.CompanyName}</td>
                  <td className="table-cell">
                    <span className="badge">{vendor.BusinessType}</span>
                  </td>
                  <td className="table-cell">
                    <div className="product-tags">
                      {vendor.Products.split(', ')
                        .filter(Boolean)
                        .map((product) => (
                          <span key={product} className="product-tag">
                            {product}
                          </span>
                        ))}
                    </div>
                  </td>
                  <td className="table-cell table-cell--center">
                    {vendor.YearsInBusiness}
                  </td>
                  <td className="table-cell">{vendor.OnboardingDate}</td>
                  <td className="table-cell table-cell--notes">
                    {vendor.AdditionalInfo || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isLoading && (
        <div className="table-loading-overlay">
          <div className="loading-spinner loading-spinner--small" />
        </div>
      )}
    </div>
  );
};

VendorTable.displayName = 'VendorTable';

