import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../hooks/useAuth';

const ProtectedRoute: React.FC = () => {
  const { isLoading, isAuthenticated } = useUser();

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;