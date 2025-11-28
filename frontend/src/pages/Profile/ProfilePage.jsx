import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import { AuthContext } from "../../context/AuthContext.jsx";

const Profile = () => {
  const { user, refreshUser, getToken } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    occupation: "",
    avatar: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  // Correct token retrieval
  const token = getToken();

  useEffect(() => {
    if (!token) {
      setMessage({ text: "You are not logged in", type: "error" });
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data) setProfile(res.data);
      } catch (err) {
        console.error("Fetch profile error:", err.response || err);
        setMessage({ text: "Failed to load profile", type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleUpdate = async () => {
    if (!token) {
      setMessage({ text: "You are not logged in", type: "error" });
      return;
    }

    setUpdating(true);
    try {
      const res = await axios.put(
        "http://localhost:5000/api/profile",
        profile,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Persist updated profile globally
      await refreshUser();

      // Set profile state locally from backend response
      if (res.data?.user) setProfile(res.data.user);

      setMessage({ text: "Profile updated successfully", type: "success" });

    } catch (err) {
      console.error("Update profile error:", err.response || err);
      const errMsg = err.response?.data?.message || "Failed to update profile";
      setMessage({ text: errMsg, type: "error" });
    } finally {
      setUpdating(false);
    }
  };

  // Avatar upload preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () =>
      setProfile((prev) => ({ ...prev, avatar: reader.result }));

    reader.readAsDataURL(file);
  };

  if (loading) return <p className="text-center mt-5">Loading profile...</p>;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f2f2f7",
        fontFamily: "Arial, sans-serif",
        padding: "20px",
      }}
    >
      <div
        className="card shadow"
        style={{
          maxWidth: "550px",
          width: "100%",
          padding: "30px",
          borderRadius: "15px",
          backgroundColor: "#ffffff",
        }}
      >
        <div className="card-body text-center">

          <div className="mb-3">
            <img
              src={profile.avatar || "https://via.placeholder.com/120"}
              alt="Profile Avatar"
              className="rounded-circle mb-3"
              style={{
                width: "120px",
                height: "120px",
                objectFit: "cover",
                border: "3px solid #0d6efd"
              }}
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="form-control form-control-sm"
            />
          </div>

          <h3 className="mb-4">My Profile</h3>

          <div className="mb-3 text-start">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control mb-2"
              value={profile.name}
              onChange={(e) =>
                setProfile({ ...profile, name: e.target.value })
              }
            />

            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control mb-2"
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
            />

            <label className="form-label">Phone</label>
            <input
              type="text"
              className="form-control mb-2"
              value={profile.phone}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
            />

            <label className="form-label">Occupation</label>
            <input
              type="text"
              className="form-control"
              value={profile.occupation}
              onChange={(e) =>
                setProfile({ ...profile, occupation: e.target.value })
              }
            />
          </div>

          <button
            className="btn btn-primary w-100 mb-2"
            onClick={handleUpdate}
            disabled={updating}
            style={{ padding: "10px" }}
          >
            {updating ? "Updating..." : "Update Profile"}
          </button>

          <button
            className="btn btn-outline-secondary w-100"
            onClick={() => navigate("/")}
            style={{ padding: "10px" }}
          >
            Go to Dashboard
          </button>

          {message.text && (
            <p
              className={`mt-3 text-center ${
                message.type === "success"
                  ? "text-success"
                  : "text-danger"
              }`}
            >
              {message.text}
            </p>
          )}

        </div>
      </div>
    </div>
  );
};

export default Profile;
