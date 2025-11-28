import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Signup = () => {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signup({ name, email, password });
      navigate("/dashboard"); // ✅ redirect after signup
    } catch (err) {
      setError(err.message || "Signup failed");
    }
  };

  return (
    <div>
      {/* Internal CSS styling */}
      <style>
        {`
          body {
            margin: 0;
            font-family: Arial, sans-serif;
          }
          .signup-page {
            display: flex;
            min-height: 100vh;
            box-shadow: inset 0 0 0 1000px rgba(0,0,0,0.1); /* subtle page shade */
          }
          .signup-image {
            flex: 1;
            background-image: url('https://sp-ao.shortpixel.ai/client/to_webp,q_glossy,ret_img,w_1024/https://theincmagazine.com/wp-content/uploads/2022/10/The-importance-of-effective-financial-management-in-todays-businesses-1024x570.jpg');
            background-size: cover;
            background-position: center;
            filter: brightness(0.85);
          }
          .signup-form-container {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            background: rgba(255, 255, 255, 0.9);
          }
          .signup-card {
            padding: 3rem;
            border-radius: 15px;
            box-shadow: 0 8px 20px rgba(0,0,0,0.3);
            width: 100%;
            max-width: 400px;
          }
          .signup-card h2 {
            text-align: center;
            font-size: 2.5rem;
            font-weight: bold;
            color: #28a745; /* green for signup */
            text-shadow: 1px 1px 3px rgba(0,0,0,0.3);
          }
        `}
      </style>

      <div className="signup-page">
        {/* Left side image */}
        <div className="signup-image"></div>

        {/* Right side signup form */}
        <div className="signup-form-container">
          <div className="card signup-card">
            <h2 className="mb-4">Signup</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label>Name:</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ borderRadius: "5px" }}
                  required
                />
              </div>
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

              <button type="submit" className="btn btn-success w-100">Signup</button>
            </form>

            <p className="text-center mt-3">
              Already have an account?{" "}
              <Link to="/login" className="text-decoration-none fw-bold">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
