import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const rolesStr = localStorage.getItem("roles");
  const roles = rolesStr ? JSON.parse(rolesStr) : [];

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has ROLE_ADMIN
  const isAdmin = roles.includes("ROLE_ADMIN");

  if (!isAdmin) {
    // If not admin, redirect to home
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
