import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Context
import { AuthContext } from "../context/AuthContext.jsx";

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Pages
import Dashboard from "../pages/Dashboard/Dashboard.jsx";
import IncomePage from "../pages/Income/IncomePage.jsx";
import ExpensesPage from "../pages/Expenses/ExpensesPage.jsx";
import BudgetPage from "../pages/Budget/BudgetPage.jsx";
import SavingsPage from "../pages/Savings/SavingsPage.jsx";
import ReportsPage from "../pages/Reports/ReportsPage.jsx";
import Profile from "../pages/Profile/ProfilePage.jsx";
import Login from "../pages/Auth/Login.jsx";
import Signup from "../pages/Auth/Signup.jsx";

const AppRoutes = () => {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/signup"
        element={user ? <Navigate to="/" replace /> : <Signup />}
      />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/income"
        element={
          <ProtectedRoute>
            <IncomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/expenses"
        element={
          <ProtectedRoute>
            <ExpensesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/budget"
        element={
          <ProtectedRoute>
            <BudgetPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/savings"
        element={
          <ProtectedRoute>
            <SavingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <ReportsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"      // <-- Added Profile route
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
