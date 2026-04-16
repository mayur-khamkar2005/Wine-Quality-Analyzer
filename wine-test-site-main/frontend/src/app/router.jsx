import { Suspense, lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import ProtectedRoute from '../components/common/ProtectedRoute.jsx';
import AppLayout from '../layouts/AppLayout.jsx';
import AuthLayout from '../layouts/AuthLayout.jsx';

const AdminPage = lazy(() => import('../pages/admin/AdminPage.jsx'));
const WineAnalyzerPage = lazy(
  () => import('../pages/analyzer/WineAnalyzerPage.jsx'),
);
const LoginPage = lazy(() => import('../pages/auth/LoginPage.jsx'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage.jsx'));
const DashboardPage = lazy(
  () => import('../pages/dashboard/DashboardPage.jsx'),
);
const HistoryPage = lazy(() => import('../pages/history/HistoryPage.jsx'));

const RouteFallback = () => <LoadingSpinner fullScreen label="Loading page" />;

const AppRouter = () => (
  <BrowserRouter>
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/analyzer" element={<WineAnalyzerPage />} />
            <Route path="/history" element={<HistoryPage />} />

            <Route element={<ProtectedRoute roles={['admin']} />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default AppRouter;
