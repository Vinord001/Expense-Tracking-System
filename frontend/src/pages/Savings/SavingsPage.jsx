import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const SAVINGS_URL = `${API_BASE}/savings`;

const SavingsPage = ({ onDataChange }) => {
  const { user, refreshDashboardData } = useContext(AuthContext);

  const [type, setType] = useState("");
  const [amount, setAmount] = useState("");
  const [editId, setEditId] = useState(null);
  const [savings, setSavings] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const parseJSON = (text) => {
    try { return JSON.parse(text); } 
    catch { console.error("❌ Invalid JSON response:", text); return null; }
  };

  const fetchSavings = async () => {
    if (!user?.token) return;
    setLoading(true);
    try {
      const res = await fetch(SAVINGS_URL, { headers: { Authorization: `Bearer ${user.token}` } });
      const text = await res.text();
      const data = parseJSON(text);

      if (!data) { setMessage("❌ Server returned invalid response"); setSavings([]); return; }
      if (!res.ok) throw new Error(data.message || "Failed to fetch savings");

      setSavings(Array.isArray(data) ? data : []);
      setMessage(data.length === 0 ? "⚠️ No savings found." : "");
      onDataChange?.(data);
    } catch (err) {
      console.error("❌ Error:", err);
      setMessage("❌ Failed to load savings");
    } finally { setLoading(false); }
  };

  useEffect(() => { if (user?.token) fetchSavings(); }, [user?.token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!type || amount === "") { setMessage("❌ Type and amount required"); return; }

    const method = editId ? "PUT" : "POST";
    const url = editId ? `${SAVINGS_URL}/${editId}` : SAVINGS_URL;

    setLoading(true);
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({ type, amount: Number(amount) }),
      });

      const text = await res.text();
      const data = parseJSON(text);
      if (!data) { setMessage("❌ Server returned invalid response"); return; }
      if (!res.ok) throw new Error(data.message || "Failed to save saving");

      setType(""); setAmount(""); setEditId(null);
      setMessage(editId ? "✅ Saving updated" : "✅ Saving added");
      await fetchSavings(); refreshDashboardData?.();
    } catch (err) { console.error("❌ Error:", err); setMessage("❌ Could not save saving"); }
    finally { setLoading(false); }
  };

  const startEdit = (s) => { setType(s.type); setAmount(s.amount); setEditId(s._id); };
  const cancelEdit = () => { setType(""); setAmount(""); setEditId(null); };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this saving?")) return;
    setLoading(true);
    try {
      const res = await fetch(`${SAVINGS_URL}/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${user.token}` } });
      const text = await res.text();
      const data = parseJSON(text);
      if (!data) { setMessage("❌ Server returned invalid response"); return; }
      if (!res.ok) throw new Error(data.message || "Failed to delete saving");

      setMessage("🗑️ Saving deleted"); await fetchSavings(); refreshDashboardData?.();
    } catch (err) { console.error("❌ Error:", err); setMessage("❌ Could not delete saving"); }
    finally { setLoading(false); }
  };

  const formatKES = (n) => `KES ${Number(n || 0).toLocaleString()}`;
  const totalSavings = savings.reduce((sum, s) => sum + Number(s.amount || 0), 0);
  const byType = savings.reduce((acc, s) => { acc[s.type] = (acc[s.type] || 0) + Number(s.amount || 0); return acc; }, {});

  const internalStyles = `
    .btn-delete:hover, .btn-add:hover, .btn-outline-primary:hover { transform: scale(1.05); transition: 0.2s; }
    .card-table th, .card-table td { vertical-align: middle; }
    .summary-card { background-color: #e9f7ef; border-radius: 12px; margin-bottom: 1rem; box-shadow: 0 4px 8px rgba(0,0,0,0.08); }
    .summary-card h4 { font-size: 1.8rem; color: #198754; font-weight: 700; }
    .table thead th { background-color: #198754; color: #fff; }
    .table-striped tbody tr:nth-of-type(odd) { background-color: #f8f9fa; }
    .table-hover tbody tr:hover { background-color: #d1f2dc; }
    .table-responsive { border-radius: 12px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.05); }
    h2, h4 { font-weight: 600; }
  `;

  return (
    <div className="container my-5">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
      <style>{internalStyles}</style>

      <h2 className="text-center mb-4">Savings & Investments</h2>

      {/* FORM */}
      <form className="card p-4 mb-4" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Type</label>
          <input type="text" className="form-control" value={type} onChange={(e) => setType(e.target.value)} placeholder="Emergency, Retirement, Investment" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Amount (KES)</label>
          <input type="number" className="form-control" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        </div>
        <button className="btn btn-info w-100 btn-add" type="submit" disabled={loading}>
          {loading ? "⏳ Processing..." : editId ? "Update Saving" : "Add Saving"}
        </button>
        {editId && <button type="button" className="btn btn-secondary w-100 mt-2" onClick={cancelEdit}>Cancel Edit</button>}
        {message && <p className="text-center mt-2">{message}</p>}
      </form>

      {/* SUMMARY */}
      {savings.length > 0 && (
        <>
          <div className="row mb-3">
            <div className="col-md-4">
              <div className="card p-3 summary-card text-center">
                <h5>Total Savings</h5>
                <h4>{formatKES(totalSavings)}</h4>
              </div>
            </div>

            <div className="col-md-8">
              <div className="card p-3 summary-card">
                <h5>Breakdown by Type</h5>
                <div className="table-responsive">
                  <table className="table table-sm table-striped mt-2 mb-0">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Total Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(byType).map(([t, a]) => (
                        <tr key={t}>
                          <td>{t}</td>
                          <td>{formatKES(a)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="card p-3">
            <h4>Recent Transactions</h4>
            <div className="table-responsive rounded mt-2">
              <table className="table table-striped table-hover card-table mb-0">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Amount (KES)</th>
                    <th>Date & Time</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {savings.map((s) => (
                    <tr key={s._id}>
                      <td>{s.type}</td>
                      <td>{formatKES(s.amount)}</td>
                      <td>{new Date(s.createdAt).toLocaleString()}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => startEdit(s)}>Edit</button>
                        <button className="btn btn-sm btn-outline-danger btn-delete" onClick={() => handleDelete(s._id)} disabled={loading}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {!loading && savings.length === 0 && <p className="text-center mt-3 text-muted">{message}</p>}
    </div>
  );
};

export default SavingsPage;
