import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Context
import { AuthProvider, AuthContext } from "./context/AuthContext.jsx";

// Components
import Navbar from "./components/layout/Navbar.jsx";
import Sidebar from "./components/layout/Sidebar.jsx";
import AppRoutes from "./routes/AppRoutes.jsx"; // Your existing routes
// Optional fallback for unmatched routes
const NotFound = () => <h2 className="text-center mt-5">Page Not Found</h2>;

const AppContent = () => {
  const { user } = useContext(AuthContext);

  const appContainerStyle = {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
    display: "flex",
  };

  const mainContentStyle = {
    flexGrow: 1,
    padding: "20px",
  };

  return (
    <div style={appContainerStyle}>
      {user && <Sidebar />}

      <div style={mainContentStyle}>
        {user && <Navbar />}

        {/* Wrap AppRoutes inside Routes to prevent unmatched route errors */}
        <Routes>
          <Route path="/*" element={<AppRoutes />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
