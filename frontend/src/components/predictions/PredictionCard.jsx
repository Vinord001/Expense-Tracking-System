import React from "react";
import "./PredictionStyles.css";

const PredictionCard = ({ title, value }) => {
  return (
    <div className="prediction-card">
      <h5>{title}</h5>
      <div className="prediction-value">{value}</div>
    </div>
  );
};

export default PredictionCard;
