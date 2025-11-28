// src/components/layout/ProtectedRoute.jsx
import React, { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";

const ProtectedRoute = ({ children }) => {
  const { user, login } = useContext(AuthContext);

  // ✅ Restore user from localStorage if page reloads
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser && !user) {
      login(JSON.parse(savedUser));
    }
  }, [user, login]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
