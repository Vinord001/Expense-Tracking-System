import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login({ email, password });
      navigate("/dashboard"); // ✅ redirect after login
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div>
      {/* Internal styling */}
      <style>
        {`
          body {
            margin: 0;
            font-family: Arial, sans-serif;
          }
          .login-page {
            display: flex;
            min-height: 100vh;
            box-shadow: inset 0 0 0 1000px rgba(0,0,0,0.1); /* subtle shade over page */
          }
          .login-image {
            flex: 1;
            background-image: url('https://img.freepik.com/free-photo/finance-money-debt-credit-balance-concept_53876-133849.jpg?semt=ais_hybrid&w=740&q=80');
            background-size: cover;
            background-position: center;
            filter: brightness(0.85);
          }
          .login-form-container {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            background: rgba(255, 255, 255, 0.9);
          }
          .login-card {
            padding: 3rem;
            border-radius: 15px;
            box-shadow: 0 8px 20px rgba(0,0,0,0.3);
            width: 100%;
            max-width: 400px;
          }
          .login-card h2 {
            text-align: center;
            font-size: 2.5rem;
            font-weight: bold;
            color: #007bff;
            text-shadow: 1px 1px 3px rgba(0,0,0,0.3);
          }
        `}
      </style>

      <div className="login-page">
        {/* Left side image */}
        <div className="login-image"></div>

        {/* Right side login form */}
        <div className="login-form-container">
          <div className="card login-card">
            <h2 className="mb-4">Login</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label>Email:</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ borderRadius: "5px" }}
                  required
                />
              </div>

              <div className="mb-3">
                <label>Password:</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ borderRadius: "5px" }}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Login
              </button>
            </form>

            <p className="text-center mt-3">
              Don't have an account?{" "}
              <Link to="/signup" className="text-decoration-none fw-bold">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
