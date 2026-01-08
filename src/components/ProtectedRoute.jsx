import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ user, requiredRole, userRole, children }) {
  // If no user, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If userRole is required but not loaded yet, show loading
  if (requiredRole && userRole === null) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="spinner"></div>
    </div>;
  }

  // If role doesn't match, redirect to appropriate dashboard
  if (requiredRole && userRole !== requiredRole) {
    const redirectPath = userRole === 'admin' ? '/admin' : '/student';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}

export default ProtectedRoute;
