import React from 'react';
import './styles/FundDetails.css';

const FundDetails = ({ formData, updateFormData }) => {
  return (
    <div className="fd-container">
      <h2 className="fd-title">Funding Details</h2>
      <div className="fd-grid">
        <div className="fd-field">
          <label className="fd-label">
            Funding Amount (₹)
            <span className="fd-required">*</span>
          </label>
          <input
            type="number"
            className="fd-input"
            placeholder="Enter funding amount"
            value={formData.fundDetails.amount}
            onChange={(e) => updateFormData('fundDetails.amount', e.target.value)}
            min="10000"
            step="1000"
            required
          />
        </div>

        <div className="fd-field">
          <label className="fd-label">
            Tenure (Months)
            <span className="fd-required">*</span>
          </label>
          <input
            type="number"
            className="fd-input"
            placeholder="Enter tenure in months"
            value={formData.fundDetails.tenureMonths}
            onChange={(e) => updateFormData('fundDetails.tenureMonths', e.target.value)}
            min="1"
            max="120"
            required
          />
        </div>

        <div className="fd-field fd-field--full">
          <label className="fd-label">
            Purpose of Funding
            <span className="fd-required">*</span>
          </label>
          <textarea
            className="fd-textarea"
            placeholder="Describe how you plan to use the funding"
            value={formData.fundDetails.purpose}
            onChange={(e) => updateFormData('fundDetails.purpose', e.target.value)}
            rows="4"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default FundDetails;