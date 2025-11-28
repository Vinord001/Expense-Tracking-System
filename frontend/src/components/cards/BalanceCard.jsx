// frontend/src/components/cards/BalanceCard.jsx
import React from "react";
import "./CardStyles.css";

const BalanceCard = ({ balance }) => {
  const balanceStyle = {
    color: balance >= 0 ? "green" : "red",
    fontWeight: "bold",
  };

  return (
    <div className="card bg-light mb-3" style={{ maxWidth: "18rem" }}>
      <div className="card-header">Balance</div>
      <div className="card-body">
        <h5 className="card-title" style={balanceStyle}>
          ${balance.toLocaleString()}
        </h5>
        <p className="card-text">Remaining balance this month</p>
      </div>
    </div>
  );
};

export default BalanceCard;
