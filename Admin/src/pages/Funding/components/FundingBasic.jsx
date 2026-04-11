import React from "react";
import "./FundingBasic.css";
import { formatCurrency } from "../../../utils/utility";

const FundingBasic = ({ fundDetails, verification = {}, status }) => {
  if (!fundDetails) return null;

  return (
    <div className="fb-card">
      <div className="fb-card-title">
        <i className="fa-solid fa-money-bill"></i>
        <h3>Funding Details</h3>
      </div>

      <div className="fb-info-row">
        <div className="fb-info-item">
          <label>Amount Requested</label>
          <p className="fb-info-value fb-amount">
            {formatCurrency(fundDetails.amount)}
          </p>
        </div>

        {verification.approvedAmount && (
          <div className="fb-info-item">
            <label>Approved Amount</label>
            <p className="fb-info-value fb-amount fb-approved">
              {formatCurrency(verification.approvedAmount)}
            </p>
          </div>
        )}
      </div>

      <div className="fb-info-item">
        <label>Tenure</label>
        <p className="fb-info-value">
          {fundDetails.tenureMonths ? `${fundDetails.tenureMonths} months` : "N/A"}
        </p>
      </div>

      <div className="fb-info-item">
        <label>Purpose</label>
        <p className="fb-info-value">{fundDetails.purpose || "N/A"}</p>
      </div>

      {(verification.interestRate || status !== "under_review") && (
        <div className="fb-info-item">
          <label>Interest Rate</label>
          <p className="fb-info-value">
            {verification.interestRate ? `${verification.interestRate}% p.a.` : "N/A"}
          </p>
        </div>
      )}
    </div>
  );
};

export default FundingBasic;