import React from "react";
import "./RiskFactors.css";

const RiskFactors = ({ funding }) => {
  if (!funding) return null;

  const hasRisks = funding.riskFactors && funding.riskFactors.length > 0;

  return (
    <div className="rf-card">
      <div className="rf-card-title">
        <i className="fa-solid fa-triangle-exclamation"></i>
        <h3>Risk Factors</h3>
      </div>

      {hasRisks ? (
        <ul className="rf-risk-list">
          {funding.riskFactors.map((risk, idx) => (
            <li key={idx}>
              {risk}
            </li>
          ))}
        </ul>
      ) : (
        <p className="rf-info-value">No significant risk factors identified.</p>
      )}
    </div>
  );
};

export default RiskFactors;