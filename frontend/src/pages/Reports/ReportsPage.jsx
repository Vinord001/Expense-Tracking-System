import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ReportsPage = () => {
  const { user, refreshDashboardData } = useContext(AuthContext);

  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [savings, setSavings] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 1-12

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const fetchJSON = async (url, token) => {
    try {
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const text = await res.text();
      try { return Array.isArray(JSON.parse(text)) ? JSON.parse(text) : []; } 
      catch { console.error("❌ Invalid JSON from", url, ":", text); return []; }
    } catch (err) { console.error("❌ Fetch error for", url, ":", err); return []; }
  };

  const fetchData = async () => {
    if (!user?.token) return;

    const [incData, expData, budData, savData] = await Promise.all([
      fetchJSON(`${API_BASE}/incomes`, user.token),
      fetchJSON(`${API_BASE}/expenses`, user.token),
      fetchJSON(`${API_BASE}/budgets`, user.token),
      fetchJSON(`${API_BASE}/savings`, user.token),
    ]);

    // Filter by selected month
    const filterByMonth = (items) =>
      items.filter(i => {
        if (!i.createdAt) return false;
        const d = new Date(i.createdAt);
        return d.getMonth() + 1 === selectedMonth;
      });

    setIncomes(filterByMonth(incData));
    setExpenses(filterByMonth(expData));
    setBudgets(filterByMonth(budData));
    setSavings(filterByMonth(savData));
  };

  useEffect(() => { if (user?.token) fetchData(); }, [user?.token, refreshDashboardData, selectedMonth]);

  const totalIncome = incomes.reduce((a, i) => a + Number(i.amount || 0), 0);
  const totalExpenses = expenses.reduce((a, e) => a + Number(e.amount || 0), 0);
  const totalBudgets = budgets.reduce((a, b) => a + Number(b.amount ?? b.budgetAmount ?? 0), 0);
  const totalSavings = savings.reduce((a, s) => a + Number(s.amount ?? s.savingAmount ?? 0), 0);
  const balance = totalIncome - totalExpenses;

  const formatKES = (num) => `KES ${Number(num || 0).toLocaleString()}`;

  const chartData = {
    labels: ["Income", "Expenses", "Budgets", "Savings", "Balance"],
    datasets: [
      {
        label: "KES",
        data: [totalIncome, totalExpenses, totalBudgets, totalSavings, balance],
        backgroundColor: [
          "rgba(25, 135, 84, 0.8)",
          "rgba(220, 53, 69, 0.8)",
          "rgba(13, 110, 253, 0.8)",
          "rgba(13, 202, 240, 0.8)",
          "rgba(255, 193, 7, 0.8)"
        ],
        borderRadius: 10,
        barThickness: 35,
        borderSkipped: false,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Financial Overview", font: { size: 20 } },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 5000 } },
      x: { grid: { display: false } }
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById("report-tables")?.innerHTML;
    if (!printContent) return;

    try {
      const win = window.open("", "", "height=700,width=900");
      if (!win) return;
      win.document.write("<html><head><title>Reports</title>");
      win.document.write('<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">');
      win.document.write("</head><body>");
      win.document.write(printContent);
      win.document.write("</body></html>");
      win.document.close();
      win.print();
    } catch (err) { console.error("❌ Print failed:", err); }
  };

  const internalStyles = `
    .summary-card { border-radius: 16px; padding: 1.5rem; text-align: center; margin-bottom: 1rem; color: #fff; box-shadow: 0 8px 25px rgba(0,0,0,0.18); transition: transform 0.25s, box-shadow 0.25s; }
    .summary-card:hover { transform: translateY(-4px); box-shadow: 0 12px 28px rgba(0,0,0,0.25); }
    .card-income { background: linear-gradient(135deg, #198754, #28a745); }
    .card-expense { background: linear-gradient(135deg, #dc3545, #e55365); }
    .card-budget { background: linear-gradient(135deg, #0d6efd, #3d8bfd); }
    .card-savings { background: linear-gradient(135deg, #0dcaf0, #4dd0f1); color: #000; }
    .card-balance { background: linear-gradient(135deg, #ffc107, #ffca2c); color: #000; }
    .table-card { border-radius: 16px; box-shadow: 0 8px 25px rgba(0,0,0,0.12); padding: 1.5rem; margin-bottom: 2rem; background: #fff; transition: transform 0.25s, box-shadow 0.25s; }
    .table-card:hover { transform: translateY(-3px); box-shadow: 0 12px 30px rgba(0,0,0,0.18); }
    .table thead { background: linear-gradient(90deg, #0d6efd, #0a58ca); color: #fff; font-weight: 700; text-shadow: 0 1px 2px rgba(0,0,0,0.3); }
    .table tbody tr:hover { background-color: rgba(13, 110, 253, 0.12) !important; }
    .table-striped tbody tr:nth-of-type(odd) { background-color: #f6f9fc; }
    .table td, .table th { vertical-align: middle; padding: 0.85rem; font-size: 0.95rem; }
    .badge-type { font-size: 0.85rem; font-weight: 600; padding: 0.35em 0.7em; border-radius: 14px; background: #6c757d; color: #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.15); }
    .amount-cell { text-align: right; font-weight: 600; border-radius: 6px; padding: 0.35rem 0.6rem; transition: background 0.3s, color 0.3s; }
    .income-row { background: linear-gradient(90deg, rgba(25,135,84,0.05), transparent); }
    .expense-row { background: linear-gradient(90deg, rgba(220,53,69,0.05), transparent); }
    .budget-row { background: linear-gradient(90deg, rgba(13,110,253,0.05), transparent); }
    .savings-row { background: linear-gradient(90deg, rgba(13,202,240,0.05), transparent); }
    .btn-print { border-radius: 10px; padding: 0.55rem 1.2rem; font-weight: 600; transition: transform 0.2s; }
    .btn-print:hover { transform: scale(1.05); }
    h2, h5 { font-weight: 700; }
    .month-select { max-width: 180px; margin-bottom: 1.5rem; }
  `;

  const getBudgetType = (b) => b.type || b.category || b.title || b.budgetName || "-";

  const maxIncome = Math.max(...incomes.map(i => i.amount || 0), 1);
  const maxExpense = Math.max(...expenses.map(e => e.amount || 0), 1);
  const maxBudget = Math.max(...budgets.map(b => b.amount ?? b.budgetAmount ?? 0), 1);
  const maxSavings = Math.max(...savings.map(s => s.amount ?? s.savingAmount ?? 0), 1);

  const getAmountStyle = (amount, type, maxAmount) => {
    if (!amount) return {};
    const percentage = Math.min(amount / maxAmount, 1);
    let baseColor;
    switch(type) {
      case "income": baseColor = [25,135,84]; break;
      case "expense": baseColor = [220,53,69]; break;
      case "budget": baseColor = [13,110,253]; break;
      case "savings": baseColor = [13,202,240]; break;
      default: baseColor = [108,117,125];
    }
    return { backgroundColor: `rgba(${baseColor[0]},${baseColor[1]},${baseColor[2]},${0.1 + 0.4*percentage})` };
  };

  return (
    <div className="container my-5">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
      <style>{internalStyles}</style>

      <h2 className="text-center mb-4">Reports</h2>

      {/* Month Selector */}
      <select className="form-select month-select" value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))}>
        <option value={1}>January</option>
        <option value={2}>February</option>
        <option value={3}>March</option>
        <option value={4}>April</option>
        <option value={5}>May</option>
        <option value={6}>June</option>
        <option value={7}>July</option>
        <option value={8}>August</option>
        <option value={9}>September</option>
        <option value={10}>October</option>
        <option value={11}>November</option>
        <option value={12}>December</option>
      </select>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-2"><div className="summary-card card-income"><h6>Total Income</h6><h5>{formatKES(totalIncome)}</h5></div></div>
        <div className="col-md-2"><div className="summary-card card-expense"><h6>Total Expenses</h6><h5>{formatKES(totalExpenses)}</h5></div></div>
        <div className="col-md-2"><div className="summary-card card-budget"><h6>Total Budgets</h6><h5>{formatKES(totalBudgets)}</h5></div></div>
        <div className="col-md-2"><div className="summary-card card-savings"><h6>Total Savings</h6><h5>{formatKES(totalSavings)}</h5></div></div>
        <div className="col-md-2"><div className="summary-card card-balance"><h6>Balance</h6><h5>{formatKES(balance)}</h5></div></div>
      </div>

      {/* Bar Chart */}
      <div className="card p-3 mb-4">
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Print Button */}
      <button className="btn btn-primary mb-3 btn-print" onClick={handlePrint}>Print Reports</button>

      <div id="report-tables">

        {/* Income Table */}
        <div className="table-card">
          <h5>Income Details</h5>
          <div className="table-responsive">
            <table className="table table-striped table-hover mb-0">
              <thead><tr><th>Source</th><th className="text-end">Amount (KES)</th><th>Date & Time</th></tr></thead>
              <tbody>
                {incomes.length ? incomes.map(i => (
                  <tr key={i._id} className="income-row">
                    <td>{i.source || "-"}</td>
                    <td className="amount-cell" style={getAmountStyle(i.amount, "income", maxIncome)}>{formatKES(i.amount)}</td>
                    <td>{i.createdAt ? new Date(i.createdAt).toLocaleString() : "-"}</td>
                  </tr>
                )) : <tr><td colSpan="3" className="text-center">No income records found</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expense Table */}
        <div className="table-card">
          <h5>Expense Details</h5>
          <div className="table-responsive">
            <table className="table table-striped table-hover mb-0">
              <thead><tr><th>Description</th><th className="text-end">Amount (KES)</th><th>Date & Time</th></tr></thead>
              <tbody>
                {expenses.length ? expenses.map(e => (
                  <tr key={e._id} className="expense-row">
                    <td>{e.description || "-"}</td>
                    <td className="amount-cell" style={getAmountStyle(e.amount, "expense", maxExpense)}>{formatKES(e.amount)}</td>
                    <td>{e.createdAt ? new Date(e.createdAt).toLocaleString() : "-"}</td>
                  </tr>
                )) : <tr><td colSpan="3" className="text-center">No expense records found</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        {/* Budget Table */}
        <div className="table-card">
          <h5>Budget Details</h5>
          <div className="table-responsive">
            <table className="table table-striped table-hover mb-0">
              <thead><tr><th>Type</th><th className="text-end">Amount (KES)</th><th>Date & Time</th></tr></thead>
              <tbody>
                {budgets.length ? budgets.map(b => (
                  <tr key={b._id} className="budget-row">
                    <td><span className="badge-type">{getBudgetType(b)}</span></td>
                    <td className="amount-cell" style={getAmountStyle(b.amount ?? b.budgetAmount ?? 0, "budget", maxBudget)}>{formatKES(b.amount ?? b.budgetAmount ?? 0)}</td>
                    <td>{b.createdAt ? new Date(b.createdAt).toLocaleString() : "-"}</td>
                  </tr>
                )) : <tr><td colSpan="3" className="text-center">No budget records found</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        {/* Savings Table */}
        <div className="table-card">
          <h5>Savings & Investments Details</h5>
          <div className="table-responsive">
            <table className="table table-striped table-hover mb-0">
              <thead><tr><th>Type</th><th className="text-end">Amount (KES)</th><th>Date & Time</th></tr></thead>
              <tbody>
                {savings.length ? savings.map(s => (
                  <tr key={s._id} className="savings-row">
                    <td><span className="badge-type">{s.type || "-"}</span></td>
                    <td className="amount-cell" style={getAmountStyle(s.amount ?? s.savingAmount ?? 0, "savings", maxSavings)}>{formatKES(s.amount ?? s.savingAmount ?? 0)}</td>
                    <td>{s.createdAt ? new Date(s.createdAt).toLocaleString() : "-"}</td>
                  </tr>
                )) : <tr><td colSpan="3" className="text-center">No savings records found</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ReportsPage;
