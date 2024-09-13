import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <></>;
  }
  if (isAuthenticated) {
    return <Navigate to={`/${user?.username.toLowerCase()}`} />;
  }

  return children;
};

export default ProtectedRoute;

