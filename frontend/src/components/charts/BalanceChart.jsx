import React from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import "./ChartStyles.css";

const BalanceChart = ({ balanceData, labels }) => {
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Balance",
        data: balanceData,
        backgroundColor: "#17a2b8",
      },
    ],
  };

  return (
    <div className="chart-container">
      <h5>Balance Overview</h5>
      <Bar data={data} />
    </div>
  );
};

export default BalanceChart;
