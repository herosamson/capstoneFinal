import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ userRole, allowedRoles, children }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    // Store the last visited path in localStorage
    localStorage.setItem('lastVisitedPath', location.pathname);

    // Simulate delay to ensure userRole is loaded
    const timeout = setTimeout(() => setLoading(false), 100); 
    return () => clearTimeout(timeout);
  }, [location]);

  // Wait until loading is complete
  if (loading) return null;

  // If user is not logged in, redirect to login page
  if (!userRole) {
    return <Navigate to="/login" />;
  }

  // If user role is not allowed, redirect to the home page
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  // Render children if role is authorized
  return children;
};

export default ProtectedRoute;
