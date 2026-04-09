import React from "react";
import { Navigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

const GuestRoute = ({ children }) => {
  const { user, loading } = useAppContext();

  if (loading) return null; // or loader

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default GuestRoute;