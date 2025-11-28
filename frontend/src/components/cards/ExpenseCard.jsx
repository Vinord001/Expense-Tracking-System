// frontend/src/components/cards/ExpenseCard.jsx
import React from "react";
import "./CardStyles.css";

const ExpenseCard = ({ expense }) => {
  return (
    <div className="card text-white bg-danger mb-3" style={{ maxWidth: "18rem" }}>
      <div className="card-header">Expenses</div>
      <div className="card-body">
        <h5 className="card-title">${expense.toLocaleString()}</h5>
        <p className="card-text">Total expenses this month</p>
      </div>
    </div>
  );
};

export default ExpenseCard;
