import React, { useState, useEffect, useContext, useMemo } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { Chart } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [prediction, setPrediction] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const INCOME_URL = `${API_BASE}/incomes`;
  const EXPENSE_URL = `${API_BASE}/expenses`;
  const ML_PREDICT_URL =
    import.meta.env.VITE_ML_URL || "http://localhost:5001/predict";

  /* Fetch Data */
  const fetchData = async () => {
    if (!user?.token) return;

    try {
      setLoading(true);

      const [incomeRes, expenseRes] = await Promise.all([
        fetch(INCOME_URL, {
          headers: { Authorization: `Bearer ${user.token}` },
        }),
        fetch(EXPENSE_URL, {
          headers: { Authorization: `Bearer ${user.token}` },
        }),
      ]);

      const [incomeData, expenseData] = await Promise.all([
        incomeRes.json(),
        expenseRes.json(),
      ]);

      setIncomes(Array.isArray(incomeData) ? incomeData : []);
      setExpenses(Array.isArray(expenseData) ? expenseData : []);
    } catch (error) {
      console.error("❌ Error fetching dashboard data:", error);
      setIncomes([]);
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  /* Fetch on mount */
  useEffect(() => {
    if (user?.token) fetchData();
  }, []);

  /* Fetch when token changes */
  useEffect(() => {
    if (user?.token) fetchData();
  }, [user?.token]);

  /* Auto refresh */
  useEffect(() => {
    if (!user?.token) return;
    const interval = setInterval(() => fetchData(), 10000);
    return () => clearInterval(interval);
  }, [user?.token]);

  const totalIncome = useMemo(
    () => incomes.reduce((sum, i) => sum + Number(i.amount || 0), 0),
    [incomes]
  );
  const totalExpenses = useMemo(
    () => expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0),
    [expenses]
  );
  const balance = useMemo(
    () => totalIncome - totalExpenses,
    [totalIncome, totalExpenses]
  );

  /* Prediction */
  const runPrediction = async () => {
    setLoading(true);
    setPrediction("");

    try {
      const payload = {
        incomes: incomes.map((i) => Number(i.amount || 0)),
        expenses: expenses.map((e) => Number(e.amount || 0)),
      };

      const res = await fetch(ML_PREDICT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await (async () => {
        try {
          return await res.json();
        } catch {
          return {};
        }
      })();

      if (!res.ok)
        throw new Error(
          data?.message || `Prediction failed (status ${res.status})`
        );

      const pi = Number(data.predictedIncome || 0);
      const pe = Number(data.predictedExpense || 0);
      const pb = Number(data.predictedBalance || pi - pe);

      const parts = [
        `Income: KES ${pi.toLocaleString()}`,
        `Expenses: KES ${pe.toLocaleString()}`,
        `Balance: KES ${pb.toLocaleString()}`,
      ];

      if (data.summary) {
        const s = data.summary;
        if (s.totalIncome !== undefined && s.totalExpense !== undefined) {
          parts.push(
            `(Summary — Income: KES ${Number(s.totalIncome).toLocaleString()}, Expense: KES ${Number(
              s.totalExpense
            ).toLocaleString()})`
          );
        }
      }

      setPrediction(parts.join(" | "));
    } catch (error) {
      console.error("❌ Prediction error:", error);
      setPrediction("❌ Failed to fetch prediction");
    } finally {
      setLoading(false);
    }
  };

  /* Chart Data */
  const chartData = useMemo(
    () => ({
      labels: ["Income", "Expenses"],
      datasets: [
        {
          label: "KES",
          data: [totalIncome, totalExpenses],
          backgroundColor: ["#0d6efd", "#dc3545"], // ✅ Income changed to blue (#0d6efd)
          hoverOffset: 4,
        },
      ],
    }),
    [totalIncome, totalExpenses]
  );

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
      tooltip: { enabled: true },
    },
  };

  /* Dashboard Styling Enhancements */
  const containerStyle = {
    padding: "2rem",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #e3f2fd, #f8f9fa)",
  };

  const internalStyles = `
    .card {
      border-radius: 18px !important;
      padding: 0.6rem;
      transition: transform .25s ease, box-shadow .25s ease;
    }
    .card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.18) !important;
    }
    .summary-card {
      box-shadow: 0 6px 14px rgba(0,0,0,0.12) !important;
      border: none !important;
    }
    .dashboard-title {
      font-weight: 700;
      color: #0d6efd;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
    }
    .prediction-section {
      margin-top: 2rem;
      padding: 1.5rem;
      border-radius: 20px;
      background-color: #ffffff;
      box-shadow: 0 8px 20px rgba(0,0,0,0.12);
    }
    .prediction-text {
      font-size: 1.1rem;
      font-weight: 500;
      color: #495057;
      text-align: center;
      background-color: #eaf4ff;
      padding: 1rem;
      border-radius: 12px;
      box-shadow: inset 0 0 6px rgba(0,0,0,0.05);
    }
    .details-table table {
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 5px 15px rgba(0,0,0,0.10);
    }
  `;

  return (
    <div style={containerStyle}>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <style>{internalStyles}</style>

      <h1 className="text-center mb-4 dashboard-title">Dashboard</h1>

      {/* Summary Cards */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-md-4">
          <div className="card text-white bg-primary h-100 summary-card">
            <div className="card-body text-center">
              <h5 className="card-title">Income</h5>
              <p className="card-text fs-3">KES {totalIncome.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card text-white bg-danger h-100 summary-card">
            <div className="card-body text-center">
              <h5 className="card-title">Expenses</h5>
              <p className="card-text fs-3">KES {totalExpenses.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card text-white bg-success h-100 summary-card">
            <div className="card-body text-center">
              <h5 className="card-title">Balance</h5>
              <p className="card-text fs-3">{balance.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="card p-3 mb-4 shadow-lg" style={{ height: "350px", borderRadius: "18px" }}>
        <h5 className="text-center mb-3">Income vs Expenses</h5>
        <Chart type="doughnut" data={chartData} options={chartOptions} />
      </div>

      {/* Prediction Section */}
      <div className="prediction-section">
        <div className="prediction-title text-center fw-bold text-primary mb-2">
          Prediction
        </div>

        <p className="prediction-text">
          {loading ? "⏳ Loading..." : prediction || "Your predicted income,expense and balance will appear here."}
        </p>

        <div className="d-flex flex-column flex-md-row justify-content-center gap-2 mt-3">
          <button
            className="btn btn-outline-primary"
            onClick={() => setShowDetails(!showDetails)}
            disabled={loading}
          >
            {showDetails ? "Hide Details" : "View Details"}
          </button>

          <button
            className="btn btn-outline-success"
            onClick={runPrediction}
            disabled={loading}
          >
            Run Prediction
          </button>
        </div>

        {showDetails && (
          <div className="details-table mt-4">
            <h6 className="text-center mt-3">Income</h6>
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Source</th>
                    <th>Amount (KES)</th>
                  </tr>
                </thead>
                <tbody>
                  {incomes.length ? (
                    incomes.map((i) => (
                      <tr key={i._id}>
                        <td>{i.title || i.source || "-"}</td>
                        <td>{Number(i.amount).toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="text-center">
                        No income records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <h6 className="text-center mt-4">Expenses</h6>
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Amount (KES)</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.length ? (
                    expenses.map((e) => (
                      <tr key={e._id}>
                        <td>{e.title || e.description || "-"}</td>
                        <td>{Number(e.amount).toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="text-center">
                        No expense records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
