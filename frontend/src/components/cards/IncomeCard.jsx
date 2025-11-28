// frontend/src/components/cards/IncomeCard.jsx
import React from "react";
import "./CardStyles.css"; // External CSS for cards

const IncomeCard = ({ income }) => {
  return (
    <div className="card text-white bg-success mb-3" style={{ maxWidth: "18rem" }}>
      <div className="card-header">Income</div>
      <div className="card-body">
        <h5 className="card-title">${income.toLocaleString()}</h5>
        <p className="card-text">Total income this month</p>
      </div>
    </div>
  );
};

export default IncomeCard;
