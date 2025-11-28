import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Restore user after refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const BASE_URL = "http://localhost:5000/api/auth";

  // LOGIN
  const login = async (credentials) => {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();

    if (response.ok) {
      const userWithToken = { ...data.user, token: data.token };
      setUser(userWithToken);
      localStorage.setItem("user", JSON.stringify(userWithToken));
      return userWithToken;
    } else {
      throw new Error(data.message || "Login failed");
    }
  };

  // SIGNUP
  const signup = async (userData) => {
    const response = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const data = await response.json();

    if (response.ok) {
      const userWithToken = { ...data.user, token: data.token };
      setUser(userWithToken);
      localStorage.setItem("user", JSON.stringify(userWithToken));
      return userWithToken;
    } else {
      throw new Error(data.message || "Signup failed");
    }
  };

  // LOGOUT
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // Helper to get token
  const getToken = () => user?.token || null;

  // ⭐ NEW: Refresh user from backend to persist updated profile
  const refreshUser = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) return;

      const data = await res.json();
      const updatedUser = { ...data, token };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      console.error("Failed to refresh user:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, getToken, login, signup, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
