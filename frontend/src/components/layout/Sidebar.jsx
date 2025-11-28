import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    logout();
    navigate("/login");
  };

  if (!user) return null;

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Internal CSS
  const internalStyles = `
    .sidebar-gradient {
      background: linear-gradient(135deg, #e3f2fd, #bbdefb);
    }
    .sidebar-link:hover {
      transform: translateX(5px);
      box-shadow: 0 3px 8px rgba(0,0,0,0.1);
    }
    .profile-btn {
      display: flex;
      align-items: center;
      padding: 0.8rem 1rem;
      text-decoration: none;
      color: #37474f;
      font-weight: 500;
      border-radius: 8px;
      margin-bottom: 0.5rem;
      background-color: rgba(255, 255, 255, 0.65);
      backdrop-filter: blur(4px);
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      transition: 0.3s;
    }
    .profile-btn.active {
      color: #0d47a1;
      font-weight: 600;
      background-color: rgba(13,110,253,0.15);
    }
    .profile-btn:hover {
      transform: translateX(5px);
      box-shadow: 0 3px 8px rgba(0,0,0,0.1);
    }
  `;

  const sidebarStyle = {
    width: isOpen ? "250px" : "0",
    minHeight: "100vh",
    backgroundColor: "transparent",
    borderRight: "1px solid #cfe2ff",
    boxShadow: "2px 0 18px rgba(0,0,0,0.15)",
    paddingTop: "1rem",
    transition: "0.3s",
    overflowX: "hidden",
  };

  const ulStyle = {
    listStyle: "none",
    padding: "0.5rem",
  };

  const linkStyle = ({ isActive }) => ({
    display: "block",
    padding: "0.8rem 1rem",
    textDecoration: "none",
    color: isActive ? "#0d47a1" : "#37474f",
    fontWeight: isActive ? "600" : "500",
    borderRadius: "8px",
    marginBottom: "0.5rem",
    backgroundColor: isActive ? "rgba(13,110,253,0.15)" : "rgba(255, 255, 255, 0.65)",
    backdropFilter: "blur(4px)",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    transition: "0.3s",
  });

  return (
    <div style={{ display: "flex", alignItems: "flex-start" }}>
      {/* Internal injected CSS */}
      <style>{internalStyles}</style>

      {/* Toggle button */}
      <button
        className="btn btn-sm btn-primary m-2"
        onClick={toggleSidebar}
        style={{
          zIndex: 1000,
          width: "35px",
          height: "35px",
          padding: "0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          borderRadius: "8px",
        }}
      >
        {isOpen ? (
          <span style={{ fontSize: "18px", fontWeight: "bold" }}>×</span>
        ) : (
          <span style={{ fontSize: "18px", fontWeight: "bold" }}>☰</span>
        )}
      </button>

      {/* Sidebar */}
      <div className="sidebar-gradient" style={sidebarStyle}>
        <ul style={ulStyle}>
          {/* Other links */}
          <li>
            <NavLink to="/" style={linkStyle} className="sidebar-link">
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/income" style={linkStyle} className="sidebar-link">
              Income
            </NavLink>
          </li>
          <li>
            <NavLink to="/expenses" style={linkStyle} className="sidebar-link">
              Expenses
            </NavLink>
          </li>
          <li>
            <NavLink to="/budget" style={linkStyle} className="sidebar-link">
              Budget
            </NavLink>
          </li>
          <li>
            <NavLink to="/savings" style={linkStyle} className="sidebar-link">
              Savings & Investments
            </NavLink>
          </li>
          <li>
            <NavLink to="/reports" style={linkStyle} className="sidebar-link">
              Reports
            </NavLink>
          </li>

          {/* Profile button moved after Reports */}
          <li>
            <NavLink
              to="/profile"
              className={({ isActive }) => `profile-btn ${isActive ? "active" : ""}`}
            >
              <span>Profile</span>
            </NavLink>
          </li>

          {/* Logout */}
          <li>
            <button
              onClick={handleLogout}
              style={{
                ...linkStyle({ isActive: false }),
                color: "red",
                border: "none",
                background: "rgba(255, 255, 255, 0.65)",
                width: "100%",
                textAlign: "left",
                cursor: "pointer",
              }}
              className="sidebar-link"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
