// src/Utils/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAppContext } from "../Context/AppContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAppContext();

  if (loading) return null; 

  // If not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
