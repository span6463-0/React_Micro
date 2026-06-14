import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedLayout from './components/ProtectedLayout';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load remote micro-frontends
const LandingPage = React.lazy(() => import('landingPage/App'));
const Dashboard = React.lazy(() => import('dashboard/App'));
const ItemManagement = React.lazy(() => import('itemManagement/App'));

const App = () => {
  return (
    <Layout>
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public routes — no sidebar */}
            <Route path="/*" element={<LandingPage />} />

            {/* Protected routes — persistent sidebar from Shell */}
            <Route
              path="/dashboard/*"
              element={
                <ProtectedLayout>
                  <Dashboard />
                </ProtectedLayout>
              }
            />
            <Route
              path="/items/*"
              element={
                <ProtectedLayout>
                  <ItemManagement />
                </ProtectedLayout>
              }
            />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Layout>
  );
};

export default App;
