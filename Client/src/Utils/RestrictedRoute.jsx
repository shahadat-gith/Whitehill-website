// src/Utils/RestrictedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAppContext } from "../Context/AppContext";

const RestrictedRoute = ({ children }) => {
  const { user, loading } = useAppContext();

  if (loading) return null;

  // If already logged in → redirect home
  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RestrictedRoute;
