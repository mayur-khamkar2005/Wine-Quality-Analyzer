import { useLayoutEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import AnimatedBackdrop from '../components/common/AnimatedBackdrop.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useTheme } from '../hooks/useTheme.js';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';

const AuthLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { theme, isDark } = useTheme();

  useLayoutEffect(() => {
    if (typeof document === 'undefined') {
      return undefined;
    }

    document.documentElement.dataset.theme = 'light';
    document.documentElement.style.colorScheme = 'light';

    return () => {
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
    };
  }, [isDark, theme]);

  if (isLoading) {
    return <LoadingSpinner fullScreen label="Preparing authentication" />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

return (
  <div className="min-h-screen bg-white text-black flex flex-col">

    {/* Background */}
    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white via-gray-100 to-white" />

    {/* Hero Section */}
    <section className="flex items-center justify-center px-6 py-20">
      <div className="max-w-2xl text-center">

        <span className="text-sm text-gray-500 tracking-wide uppercase">
          Wine Intelligence Platform
        </span>

        <h1 className="mt-4 text-3xl md:text-5xl font-semibold leading-tight text-black">
          Analyze wine chemistry, predict quality, and monitor performance at
          scale.
        </h1>

      </div>
    </section>

    {/* Panel Section */}
    <section className="flex justify-center px-6 pb-20">
      <div className="w-full max-w-md bg-white text-black rounded-xl shadow-md p-6 border border-gray-200">
        <Outlet />
      </div>
    </section>

  </div>
);
};

export default AuthLayout;
