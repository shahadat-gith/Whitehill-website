import React from "react";
import "./Business.css";
import { formatCurrency } from "../../../utils/utility";

const Business = ({ funding }) => {
  if (!funding || funding.type !== "business") return null;

  return (
    <div className="bu-card">
      <div className="bu-card-title">
        <i className="fa-solid fa-briefcase"></i>
        <h3>Business Information</h3>
      </div>

      <div className="bu-info-item">
        <label>Business Name</label>
        <p className="bu-info-value">{funding.business?.name || "N/A"}</p>
      </div>

      <div className="bu-info-row">
        <div className="bu-info-item">
          <label>Business Type</label>
          <p className="bu-info-value">{funding.business?.type || "N/A"}</p>
        </div>
        <div className="bu-info-item">
          <label>Industry</label>
          <p className="bu-info-value">{funding.business?.industry || "N/A"}</p>
        </div>
      </div>

      <div className="bu-info-row">
        <div className="bu-info-item">
          <label>Years in Operation</label>
          <p className="bu-info-value">{funding.business?.yearsInOperation || "N/A"}</p>
        </div>
        <div className="bu-info-item">
          <label>Employees</label>
          <p className="bu-info-value">{funding.business?.employees || "N/A"}</p>
        </div>
      </div>

      <div className="bu-info-row">
        <div className="bu-info-item">
          <label>GST Number</label>
          <p className="bu-info-value bu-mono">
            {funding.business?.gstNumber || "N/A"}
          </p>
        </div>
        <div className="bu-info-item">
          <label>Registration Number</label>
          <p className="bu-info-value bu-mono">
            {funding.business?.registrationNumber || "N/A"}
          </p>
        </div>
      </div>

      <div className="bu-info-row">
        <div className="bu-info-item">
          <label>Monthly Revenue</label>
          <p className="bu-info-value bu-revenue">
            {funding.business?.monthlyRevenue 
              ? formatCurrency(funding.business.monthlyRevenue) 
              : "N/A"}
          </p>
        </div>
        <div className="bu-info-item">
          <label>Monthly Profit</label>
          <p className="bu-info-value bu-profit">
            {funding.business?.monthlyProfit 
              ? formatCurrency(funding.business.monthlyProfit) 
              : "N/A"}
          </p>
        </div>
      </div>

      <div className="bu-info-item">
        <label>Business Plan</label>
        <p className="bu-info-value">{funding.business?.businessPlan || "N/A"}</p>
      </div>

      <div className="bu-info-item">
        <label>Market Analysis</label>
        <p className="bu-info-value">{funding.business?.marketAnalysis || "N/A"}</p>
      </div>

      <div className="bu-info-item" style={{ marginBottom: 0 }}>
        <label>Growth Strategy</label>
        <p className="bu-info-value">{funding.business?.growthStrategy || "N/A"}</p>
      </div>
    </div>
  );
};

export default Business;