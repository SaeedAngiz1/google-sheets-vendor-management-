/**
 * @module hooks/useVendors
 * @description Custom React hook for managing vendor data state and operations.
 *
 * Encapsulates all vendor CRUD operations, loading states, and error handling.
 * Automatically fetches vendor data on mount and provides methods to
 * create, update, and delete vendors.
 *
 * @example
 * ```tsx
 * function VendorPage() {
 *   const {
 *     vendors,
 *     isLoading,
 *     error,
 *     addVendor,
 *     updateVendor,
 *     deleteVendor,
 *     refresh,
 *   } = useVendors();
 *
 *   if (isLoading) return <LoadingSpinner />;
 *   if (error) return <Alert type="error" message={error} />;
 *
 *   return <VendorTable vendors={vendors} />;
 * }
 * ```
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Vendor, AlertMessage } from '../types/vendor';
import { createVendorService, type VendorDataService } from '../services/googleSheetsService';

interface UseVendorsReturn {
  /** Array of vendor records */
  vendors: Vendor[];
  /** Whether an operation is in progress */
  isLoading: boolean;
  /** Whether the initial fetch is happening */
  isInitialLoading: boolean;
  /** Current error message, if any */
  error: string | null;
  /** Current alert/notification message */
  alert: AlertMessage | null;
  /** Add a new vendor */
  addVendor: (vendor: Vendor) => Promise<boolean>;
  /** Update an existing vendor */
  updateVendor: (originalName: string, vendor: Vendor) => Promise<boolean>;
  /** Delete a vendor by company name */
  deleteVendor: (companyName: string) => Promise<boolean>;
  /** Refresh vendor data from the source */
  refresh: () => Promise<void>;
  /** Clear the current alert message */
  clearAlert: () => void;
  /** Set a custom alert message */
  setAlert: (alert: AlertMessage | null) => void;
}

/**
 * Custom hook for managing vendor data with full CRUD operations.
 *
 * Features:
 * - Automatic data fetching on mount
 * - Loading states for initial load and operations
 * - Error handling with descriptive messages
 * - Alert system for user feedback
 * - Memoized service instance
 *
 * @param customService - Optional custom service implementation (useful for testing)
 * @returns Object containing vendor data, states, and CRUD methods
 */
export function useVendors(customService?: VendorDataService): UseVendorsReturn {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [alert, setAlert] = useState<AlertMessage | null>(null);

  /** Memoized service instance to prevent unnecessary re-creation */
  const service = useMemo<VendorDataService>(
    () => customService || createVendorService(),
    [customService]
  );

  /**
   * Clears the current alert after a timeout.
   */
  const clearAlert = useCallback(() => {
    setAlert(null);
  }, []);

  /**
   * Fetches all vendor data from the service.
   */
  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const result = await service.fetchVendors();

    if (result.success && result.data) {
      setVendors(result.data);
    } else {
      setError(result.error || 'Failed to fetch vendor data');
    }

    setIsLoading(false);
    setIsInitialLoading(false);
  }, [service]);

  /**
   * Adds a new vendor and refreshes the list.
   */
  const addVendor = useCallback(
    async (vendor: Vendor): Promise<boolean> => {
      setIsLoading(true);
      setAlert(null);

      const result = await service.addVendor(vendor);

      if (result.success) {
        setAlert({ type: 'success', message: 'Vendor details successfully submitted!' });
        await refresh();
        return true;
      } else {
        setAlert({
          type: 'error',
          message: result.error || 'Failed to add vendor',
        });
        setIsLoading(false);
        return false;
      }
    },
    [service, refresh]
  );

  /**
   * Updates an existing vendor and refreshes the list.
   */
  const updateVendor = useCallback(
    async (originalName: string, vendor: Vendor): Promise<boolean> => {
      setIsLoading(true);
      setAlert(null);

      const result = await service.updateVendor(originalName, vendor);

      if (result.success) {
        setAlert({ type: 'success', message: 'Vendor details successfully updated!' });
        await refresh();
        return true;
      } else {
        setAlert({
          type: 'error',
          message: result.error || 'Failed to update vendor',
        });
        setIsLoading(false);
        return false;
      }
    },
    [service, refresh]
  );

  /**
   * Deletes a vendor and refreshes the list.
   */
  const deleteVendor = useCallback(
    async (companyName: string): Promise<boolean> => {
      setIsLoading(true);
      setAlert(null);

      const result = await service.deleteVendor(companyName);

      if (result.success) {
        setAlert({ type: 'success', message: 'Vendor successfully deleted!' });
        await refresh();
        return true;
      } else {
        setAlert({
          type: 'error',
          message: result.error || 'Failed to delete vendor',
        });
        setIsLoading(false);
        return false;
      }
    },
    [service, refresh]
  );

  // Fetch vendors on mount
  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    vendors,
    isLoading,
    isInitialLoading,
    error,
    alert,
    addVendor,
    updateVendor,
    deleteVendor,
    refresh,
    clearAlert,
    setAlert,
  };
}

