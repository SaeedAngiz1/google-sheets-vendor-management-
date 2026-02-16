/**
 * @component App
 * @description Root application component for the Vendor Management Portal.
 *
 * Implements the main layout with action selection and renders the appropriate
 * view based on the selected action (Onboard, Update, View, Delete).
 *
 * Architecture:
 * - Uses `useVendors` hook for centralized state management
 * - Wraps content in `ErrorBoundary` for graceful error handling
 * - Displays global alerts from vendor operations
 * - Shows loading states during initial data fetch
 *
 */

import React, { useState, useCallback } from 'react';
import type { VendorAction } from './types/vendor';
import { useVendors } from './hooks/useVendors';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { ActionSelector } from './components/ActionSelector/ActionSelector';
import { VendorForm } from './components/VendorForm/VendorForm';
import { VendorTable } from './components/VendorTable/VendorTable';
import { VendorUpdate } from './components/VendorUpdate/VendorUpdate';
import { VendorDelete } from './components/VendorDelete/VendorDelete';
import { Alert, LoadingSpinner } from './components/ui';
import './App.css';

const App: React.FC = () => {
  const [currentAction, setCurrentAction] = useState<VendorAction>('onboard');

  const {
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
  } = useVendors();

  /** Handle action change and clear alerts */
  const handleActionChange = useCallback(
    (action: VendorAction) => {
      setCurrentAction(action);
      clearAlert();
    },
    [clearAlert]
  );

  /** Render the appropriate content based on current action */
  const renderContent = () => {
    switch (currentAction) {
      case 'onboard':
        return (
          <VendorForm
            vendors={vendors}
            isLoading={isLoading}
            onSubmit={addVendor}
          />
        );
      case 'update':
        return (
          <VendorUpdate
            vendors={vendors}
            isLoading={isLoading}
            onUpdate={updateVendor}
          />
        );
      case 'view':
        return (
          <VendorTable
            vendors={vendors}
            isLoading={isLoading}
          />
        );
      case 'delete':
        return (
          <VendorDelete
            vendors={vendors}
            isLoading={isLoading}
            onDelete={deleteVendor}
          />
        );
      default:
        return null;
    }
  };

  return (
    <ErrorBoundary>
      <div className="app">
        {/* Header */}
        <header className="app-header">
          <div className="app-header-content">
            <div className="app-logo" aria-hidden="true">📊</div>
            <div>
              <h1 className="app-title">Vendor Management Portal</h1>
              <p className="app-subtitle">
                Manage your vendor data with Google Sheets integration
              </p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="app-main">
          <div className="app-container">
            {/* Action Navigation */}
            <ActionSelector
              currentAction={currentAction}
              onActionChange={handleActionChange}
              disabled={isInitialLoading}
            />

            {/* Global Alerts */}
            {alert && (
              <Alert
                type={alert.type}
                message={alert.message}
                onDismiss={clearAlert}
                autoDismiss={5000}
              />
            )}

            {/* Error State */}
            {error && !isInitialLoading && (
              <div className="error-container">
                <Alert type="error" message={error} autoDismiss={0} />
                <button
                  className="btn btn--secondary"
                  onClick={refresh}
                  type="button"
                >
                  Retry Loading
                </button>
              </div>
            )}

            {/* Loading State */}
            {isInitialLoading ? (
              <LoadingSpinner
                size="large"
                message="Loading vendor data..."
              />
            ) : (
              /* Content Area */
              <ErrorBoundary
                fallback={
                  <div className="error-container">
                    <Alert
                      type="error"
                      message="Something went wrong displaying this section."
                      autoDismiss={0}
                    />
                    <button
                      className="btn btn--secondary"
                      onClick={() => setCurrentAction('view')}
                      type="button"
                    >
                      Go to View All
                    </button>
                  </div>
                }
              >
                <div className="content-area">
                  {renderContent()}
                </div>
              </ErrorBoundary>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="app-footer">
          <p>
            Vendor Management Portal — Built with React + TypeScript
          </p>
        </footer>
      </div>
    </ErrorBoundary>
  );
};

export default App;
