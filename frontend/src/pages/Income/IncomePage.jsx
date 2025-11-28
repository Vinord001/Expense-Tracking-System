import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const INCOMES_URL = `${API_BASE}/incomes`;

const IncomePage = ({ onDataChange }) => {
  const { user, refreshDashboardData } = useContext(AuthContext);

  const [incomes, setIncomes] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Salary");
  const [amount, setAmount] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const safeJson = async (res) => {
    try {
      return await res.json();
    } catch {
      return { message: "Invalid server response" };
    }
  };

  const fetchIncomes = async () => {
    if (!user?.token) return;
    setLoading(true);
    try {
      const res = await fetch(INCOMES_URL, { headers: { Authorization: `Bearer ${user.token}` } });
      const data = await safeJson(res);
      if (res.ok) {
        setIncomes(Array.isArray(data) ? data : []);
        onDataChange?.(data);
      } else {
        setMessage(data.message || "Failed to fetch incomes");
      }
    } catch (err) {
      console.error("Fetch incomes error:", err);
      setMessage("Unable to fetch incomes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (user?.token) fetchIncomes(); }, [user?.token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !amount) return;
    setLoading(true);
    const payload = { source: title.trim(), category: category.trim(), amount: Number(amount) };
    try {
      const url = editingId ? `${INCOMES_URL}/${editingId}` : INCOMES_URL;
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
        body: JSON.stringify(payload),
      });
      const data = await safeJson(res);
      if (!res.ok) throw new Error(data.message);
      setMessage(editingId ? "✅ Income updated successfully" : "✅ Income added successfully");
      setEditingId(null);
      setTitle("");
      setCategory("Salary");
      setAmount("");
      await fetchIncomes();
      refreshDashboardData?.();
    } catch (err) {
      console.error("Save income error:", err);
      setMessage("❌ Failed to save income");
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this income?")) return;
    setLoading(true);
    try {
      const res = await fetch(`${INCOMES_URL}/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${user.token}` } });
      const data = await safeJson(res);
      if (!res.ok) throw new Error(data.message);
      setMessage("✅ Income deleted successfully");
      await fetchIncomes();
      refreshDashboardData?.();
    } catch (err) {
      console.error("Delete error:", err);
      setMessage("❌ Failed to delete income");
    } finally { setLoading(false); }
  };

  const handleEdit = (income) => {
    setEditingId(income._id);
    setTitle(income.source);
    setCategory(income.category);
    setAmount(income.amount);
    setMessage("✏️ Editing income...");
  };

  useEffect(() => {
    if (message) {
      const t = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(t);
    }
  }, [message]);

  const formatKES = (num) => `KES ${Number(num).toLocaleString()}`;

  const internalStyles = `
    .card { border-radius: 12px; box-shadow: 0 6px 12px rgba(0,0,0,0.08); }
    .table thead th { background-color: #0d6efd; color: #fff; }
    .table-striped tbody tr:nth-of-type(odd) { background-color: #f1f3f5; }
    .table-hover tbody tr:hover { background-color: #e9f5ff; }
    .message { text-align: center; font-weight: 500; margin-top: 0.5rem; }
    .form-card { background-color: #ffffff; padding: 2rem; margin-bottom: 2rem; }
    @media (max-width: 767px) { .form-card { padding: 1rem; } }
  `;

  return (
    <div className="container my-5">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
      <style>{internalStyles}</style>

      <h2 className="text-center mb-4">Income Management</h2>

      {/* Form */}
      <form className="form-card card" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Source</label>
          <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Category</label>
          <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>Salary</option>
            <option>Business</option>
            <option>Investments</option>
            <option>Other</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Amount (KES)</label>
          <input type="number" className="form-control" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        </div>

        <button className={`btn w-100 ${editingId ? "btn-warning" : "btn-success"}`} disabled={loading}>
          {editingId ? "Update Income" : "Add Income"}
        </button>

        {message && <p className="message">{message}</p>}
      </form>

      {/* Table */}
      {incomes.length > 0 ? (
        <div className="card p-3 shadow-sm">
          <h4 className="mb-3">My Incomes</h4>
          <div className="table-responsive rounded shadow-sm">
            <table className="table table-striped table-hover mb-0">
              <thead>
                <tr>
                  <th>Source</th>
                  <th>Category</th>
                  <th>Amount (KES)</th>
                  <th>Date & Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {incomes.map((i) => (
                  <tr key={i._id}>
                    <td>{i.source}</td>
                    <td>{i.category}</td>
                    <td>{formatKES(i.amount)}</td>
                    <td>{new Date(i.createdAt).toLocaleString()}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-warning me-2" onClick={() => handleEdit(i)} disabled={loading}>Edit</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(i._id)} disabled={loading}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        !loading && <p className="text-center mt-3 text-muted">No incomes found yet.</p>
      )}
    </div>
  );
};

export default IncomePage;
