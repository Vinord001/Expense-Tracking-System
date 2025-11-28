import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  const navStyle = {
    marginBottom: "20px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    logout();
    window.location.href = "/login"; // redirect
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-primary px-4"
      style={navStyle}
    >
      <a className="navbar-brand fw-bold fs-4" href="/">
        Expense Tracker
      </a>
      <div className="ms-auto d-flex align-items-center">
        {user ? (
          <>
            <Link
              to="/profile"
              className="btn btn-outline-light btn-sm me-3 shadow-sm"
              style={{ transition: "0.2s", fontWeight: "500" }}
            >
              Profile
            </Link>
            <span className="text-light me-3 fw-medium">
              Hello, {user.name}
            </span>
            <button
              className="btn btn-outline-light btn-sm shadow-sm"
              onClick={handleLogout}
              style={{ transition: "0.2s", fontWeight: "500" }}
            >
              Logout
            </button>
          </>
        ) : (
          <a className="btn btn-outline-light btn-sm shadow-sm" href="/login">
            Login
          </a>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
