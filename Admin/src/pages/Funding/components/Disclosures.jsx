import React from "react";
import "./Disclosures.css";

const Disclosures = ({ funding }) => {
  if (!funding) return null;

  return (
    <div className="dc-card">
      <div className="dc-card-title">
        <i className="fa-solid fa-square-check"></i>
        <h3>Disclosures</h3>
      </div>

      <div className="dc-disclosures">
        <div className="dc-disclosure-item">
          <span className="dc-disclosure-label">Has Existing Loans</span>
          <span className={`dc-disclosure-value ${funding.disclosures?.hasExistingLoans ? "yes" : "no"}`}>
            {funding.disclosures?.hasExistingLoans ? "✓ Yes" : funding.disclosures?.hasExistingLoans === false ? "✗ No" : "N/A"}
          </span>
        </div>

        <div className="dc-disclosure-item">
          <span className="dc-disclosure-label">Has Defaulted Before</span>
          <span className={`dc-disclosure-value ${funding.disclosures?.hasDefaultedBefore ? "yes" : "no"}`}>
            {funding.disclosures?.hasDefaultedBefore ? "✓ Yes" : funding.disclosures?.hasDefaultedBefore === false ? "✗ No" : "N/A"}
          </span>
        </div>

        <div className="dc-disclosure-item">
          <span className="dc-disclosure-label">Has Legal Cases</span>
          <span className={`dc-disclosure-value ${funding.disclosures?.hasLegalCases ? "yes" : "no"}`}>
            {funding.disclosures?.hasLegalCases ? "✓ Yes" : funding.disclosures?.hasLegalCases === false ? "✗ No" : "N/A"}
          </span>
        </div>

        <div className="dc-disclosure-item">
          <span className="dc-disclosure-label">Has Criminal Record</span>
          <span className={`dc-disclosure-value ${funding.disclosures?.hasCriminalRecord ? "yes" : "no"}`}>
            {funding.disclosures?.hasCriminalRecord ? "✓ Yes" : funding.disclosures?.hasCriminalRecord === false ? "✗ No" : "N/A"}
          </span>
        </div>

        <div className="dc-disclosure-item">
          <span className="dc-disclosure-label">Politically Exposed</span>
          <span className={`dc-disclosure-value ${funding.disclosures?.politicallyExposed ? "yes" : "no"}`}>
            {funding.disclosures?.politicallyExposed ? "✓ Yes" : funding.disclosures?.politicallyExposed === false ? "✗ No" : "N/A"}
          </span>
        </div>

        {funding.disclosures?.details && (
          <div className="dc-disclosure-item">
            <span className="dc-disclosure-label">Additional Details</span>
            <p className="dc-info-value">{funding.disclosures.details}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Disclosures;