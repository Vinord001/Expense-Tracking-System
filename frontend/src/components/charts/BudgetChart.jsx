import React from "react";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import "./ChartStyles.css";

const BudgetChart = ({ budgetData, labels }) => {
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Budget",
        data: budgetData,
        backgroundColor: ["#007bff", "#28a745", "#ffc107", "#dc3545"],
      },
    ],
  };

  return (
    <div className="chart-container">
      <h5>Budget Overview</h5>
      <Doughnut data={data} />
    </div>
  );
};

export default BudgetChart;
