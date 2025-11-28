import React from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import "./ChartStyles.css";

const IncomeExpenseChart = ({ incomeData, expenseData, labels }) => {
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Income",
        data: incomeData,
        borderColor: "green",
        backgroundColor: "rgba(0, 128, 0, 0.2)",
        tension: 0.4,
      },
      {
        label: "Expense",
        data: expenseData,
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.2)",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="chart-container">
      <h5>Income vs Expense</h5>
      <Line data={data} />
    </div>
  );
};

export default IncomeExpenseChart;
