import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const BUDGET_URL = `${API_BASE}/budgets`;

const BudgetPage = ({ onDataChange }) => {
  const { user } = useContext(AuthContext);

  const [type, setType] = useState("");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [budgets, setBudgets] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchBudgets = async () => {
    if (!user?.token) return;
    setLoading(true);
    try {
      const res = await fetch(BUDGET_URL, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setBudgets(data);
        onDataChange?.(data);
      } else {
        setMessage(`❌ ${data.message || "Failed to fetch budgets"}`);
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setMessage("❌ Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) fetchBudgets();
  }, [user?.token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!type || !amount || !user?.token) return;

    setLoading(true);
    const payload = { budgetType: type, amount: Number(amount), notes };

    try {
      const url = editingId ? `${BUDGET_URL}/${editingId}` : BUDGET_URL;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Request failed");

      setMessage(editingId ? "✅ Budget updated successfully" : "✅ Budget added successfully");
      setEditingId(null);
      setType("");
      setAmount("");
      setNotes("");

      await fetchBudgets();
    } catch (err) {
      console.error("❌ Save error:", err);
      setMessage("❌ Failed to save budget");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!user?.token) return;
    if (!window.confirm("Are you sure you want to delete this budget?")) return;

    setLoading(true);
    try {
      const res = await fetch(`${BUDGET_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Delete failed");

      setMessage("✅ Budget deleted successfully");
      await fetchBudgets();
    } catch (err) {
      console.error("❌ Delete error:", err);
      setMessage("❌ Failed to delete budget");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (b) => {
    setEditingId(b._id);
    setType(b.type || "");
    setAmount(b.amount || "");
    setNotes(b.notes || "");
    setMessage("✏️ Editing budget...");
  };

  const formatKES = (num) => `KES ${Number(num || 0).toLocaleString()}`;

  const internalStyles = `
    .budget-card { border-radius: 12px; box-shadow: 0 6px 12px rgba(0,0,0,0.08); background-color: #fff; }
    .btn-edit:hover, .btn-delete:hover { transform: scale(1.05); transition: 0.2s; }
    .table thead th { background-color: #198754; color: #fff; }
    .table-striped tbody tr:nth-of-type(odd) { background-color: #f8f9fa; }
    .table-hover tbody tr:hover { background-color: #e6f4ea; }
    .table td, .table th { vertical-align: middle; }
    .alert { text-align: center; font-weight: 500; }
    h2, h4 { font-weight: 600; }
  `;

  return (
    <div className="container my-5">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
      <style>{internalStyles}</style>

      <h2 className="text-center mb-4">Budget Management</h2>

      <form className="card p-4 mb-4 budget-card" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Budget Type</label>
          <input type="text" className="form-control" value={type} onChange={(e) => setType(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Amount (KES)</label>
          <input type="number" className="form-control" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Notes</label>
          <textarea className="form-control" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>

        <button className={`btn ${editingId ? "btn-warning" : "btn-success"} w-100`} type="submit" disabled={loading}>
          {loading ? "⏳ Saving..." : editingId ? "Update Budget" : "Add Budget"}
        </button>
        {message && <p className="mt-2 text-center">{message}</p>}
      </form>

      {budgets.length > 0 ? (
        <div className="card p-3 budget-card">
          <h4>My Budgets</h4>
          <div className="table-responsive rounded shadow-sm">
            <table className="table table-striped table-hover mb-0">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Amount (KES)</th>
                  <th>Notes</th>
                  <th>Date & Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {budgets.map((b) => (
                  <tr key={b._id}>
                    <td>{b.type || "-"}</td>
                    <td>{formatKES(b.amount)}</td>
                    <td>{b.notes || "-"}</td>
                    <td>{new Date(b.createdAt).toLocaleString()}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-warning me-2 btn-edit" onClick={() => handleEdit(b)} disabled={loading}>Edit</button>
                      <button className="btn btn-sm btn-outline-danger btn-delete" onClick={() => handleDelete(b._id)} disabled={loading}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        !loading && <p className="text-center mt-3 text-muted">No budgets found yet.</p>
      )}

      {loading && <p className="text-center mt-3">Loading...</p>}
    </div>
  );
};

export default BudgetPage;
