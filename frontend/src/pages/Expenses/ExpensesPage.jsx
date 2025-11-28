import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const EXPENSES_URL = `${API_BASE}/expenses`;

const ExpensesPage = () => {
  const { user, refreshDashboardData } = useContext(AuthContext);

  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Fetch expenses
  const fetchExpenses = async () => {
    if (!user?.token) return;
    setLoading(true);
    try {
      const res = await fetch(EXPENSES_URL, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setExpenses(data);
      } else {
        setMessage(data?.message || "❌ Failed to fetch expenses");
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setMessage("❌ Unable to fetch expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) fetchExpenses();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [user?.token]);

  // Add or update expense
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !amount || !type || !user?.token) return;

    setLoading(true);
    const payload = { description: description.trim(), amount: Number(amount), type: type.trim() };

    try {
      const url = editingId ? `${EXPENSES_URL}/${editingId}` : EXPENSES_URL;
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

      setMessage(editingId ? "✅ Expense updated successfully" : "✅ Expense added successfully");
      setEditingId(null);

      setAmount("");
      setDescription("");
      setType("");

      await fetchExpenses();
      refreshDashboardData?.();
    } catch (err) {
      console.error("❌ Save error:", err);
      setMessage("❌ Failed to save expense");
    } finally {
      setLoading(false);
    }
  };

  // Delete expense
  const handleDelete = async (id) => {
    if (!user?.token) return;
    if (!window.confirm("Are you sure you want to delete this expense?")) return;

    setLoading(true);
    try {
      const res = await fetch(`${EXPENSES_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Delete failed");

      setMessage("✅ Expense deleted successfully");
      await fetchExpenses();
      refreshDashboardData?.();
    } catch (err) {
      console.error("❌ Delete error:", err);
      setMessage("❌ Failed to delete expense");
    } finally {
      setLoading(false);
    }
  };

  // Edit expense
  const handleEdit = (expense) => {
    setEditingId(expense._id);
    setAmount(expense.amount);
    setDescription(expense.description);
    setType(expense.type);
    setMessage("✏️ Editing expense...");
  };

  const formatKES = (num) => `KES ${Number(num || 0).toLocaleString()}`;

  const internalStyles = `
    .expense-card { border-radius: 12px; box-shadow: 0 6px 12px rgba(0,0,0,0.08); background-color: #fff; }
    .expense-btn:hover, .edit-btn:hover, .delete-btn:hover { transform: scale(1.03); transition: 0.2s; }
    .table thead th { background-color: #0d6efd; color: #fff; }
    .table-striped tbody tr:nth-of-type(odd) { background-color: #f1f3f5; }
    .table-hover tbody tr:hover { background-color: #e9f5ff; }
    .table th, .table td { vertical-align: middle; }
    .time-display { text-align: right; font-style: italic; margin-bottom: 0.5rem; }
    .alert { text-align: center; font-weight: 500; }
  `;

  return (
    <div className="container my-5">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
      <style>{internalStyles}</style>

      <h2 className="text-center mb-3">Expense Management</h2>
      <p className="time-display">Current Time: {currentTime.toLocaleString()}</p>
      {message && <div className="alert alert-info">{message}</div>}

      {/* Form */}
      <form className="card p-4 mb-4 expense-card" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <input
            type="text"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Amount (KES)</label>
          <input
            type="number"
            className="form-control"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Type</label>
          <select
            className="form-select"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="">Select Type</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Bills">Bills</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <button
          className={`btn w-100 ${editingId ? "btn-warning" : "btn-primary"}`}
          type="submit"
          disabled={loading}
        >
          {editingId ? "Update Expense" : "Add Expense"}
        </button>
      </form>

      {/* Table */}
      {expenses.length > 0 ? (
        <div className="card p-3 expense-card">
          <h4 className="mb-3">My Expenses</h4>
          <div className="table-responsive rounded shadow-sm">
            <table className="table table-striped table-hover mb-0">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Type</th>
                  <th>Amount (KES)</th>
                  <th>Date & Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
                  <tr key={exp._id}>
                    <td>{exp.description}</td>
                    <td>{exp.type}</td>
                    <td>{formatKES(exp.amount)}</td>
                    <td>{new Date(exp.createdAt).toLocaleString()}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2 edit-btn"
                        onClick={() => handleEdit(exp)}
                        disabled={loading}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger delete-btn"
                        onClick={() => handleDelete(exp._id)}
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        !loading && <p className="text-center mt-3 text-muted">No expenses found yet.</p>
      )}
    </div>
  );
};

export default ExpensesPage;
