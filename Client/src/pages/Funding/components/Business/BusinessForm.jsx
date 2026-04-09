import React, { useState } from 'react';
import './BusinessForm.css';

const BusinessForm = ({ formData, updateFormData }) => {
  const [newAsset, setNewAsset] = useState({ name: '', value: '' });
  const [newLiability, setNewLiability] = useState({ type: '', amount: '' });

  const handleAddAsset = () => {
    if (newAsset.name && newAsset.value) {
      const currentAssets = formData.business.assets || [];
      updateFormData('business.assets', [...currentAssets, { ...newAsset }]);
      setNewAsset({ name: '', value: '' });
    }
  };

  const handleAddLiability = () => {
    if (newLiability.type && newLiability.amount) {
      const currentLiabilities = formData.business.liabilities || [];
      updateFormData('business.liabilities', [...currentLiabilities, { ...newLiability }]);
      setNewLiability({ type: '', amount: '' });
    }
  };

  const removeAsset = (index) => {
    const currentAssets = formData.business.assets || [];
    updateFormData('business.assets', currentAssets.filter((_, i) => i !== index));
  };

  const removeLiability = (index) => {
    const currentLiabilities = formData.business.liabilities || [];
    updateFormData('business.liabilities', currentLiabilities.filter((_, i) => i !== index));
  };

  return (
    <div className="bf-container">
      <h2 className="bf-title">Business Information</h2>

      <div className="bf-grid">
        <div className="bf-field">
          <label className="bf-label">
            Business Name
            <span className="bf-required">*</span>
          </label>
          <input
            type="text"
            className="bf-input"
            placeholder="Enter your business name"
            value={formData.business.name || ''}
            onChange={(e) => updateFormData('business.name', e.target.value)}
            required
          />
        </div>

        <div className="bf-field">
          <label className="bf-label">
            Business Type
          </label>
          <select
            className="bf-select"
            value={formData.business.type || ''}
            onChange={(e) => updateFormData('business.type', e.target.value)}
          >
            <option value="">Select type</option>
            <option value="sole_proprietorship">Sole Proprietorship</option>
            <option value="partnership">Partnership</option>
            <option value="llp">LLP</option>
            <option value="private_limited">Private Limited</option>
            <option value="public_limited">Public Limited</option>
          </select>
        </div>

        <div className="bf-field">
          <label className="bf-label">
            Industry
          </label>
          <input
            type="text"
            className="bf-input"
            placeholder="e.g., Retail, Manufacturing, Services"
            value={formData.business.industry || ''}
            onChange={(e) => updateFormData('business.industry', e.target.value)}
          />
        </div>

        <div className="bf-field">
          <label className="bf-label">
            Years in Operation
          </label>
          <input
            type="number"
            className="bf-input"
            placeholder="Number of years"
            value={formData.business.yearsInOperation || ''}
            onChange={(e) => updateFormData('business.yearsInOperation', e.target.value)}
            min="0"
          />
        </div>

        <div className="bf-field">
          <label className="bf-label">
            Registration Number
          </label>
          <input
            type="text"
            className="bf-input"
            placeholder="Business registration number"
            value={formData.business.registrationNumber || ''}
            onChange={(e) => updateFormData('business.registrationNumber', e.target.value)}
          />
        </div>

        <div className="bf-field">
          <label className="bf-label">
            GST Number
          </label>
          <input
            type="text"
            className="bf-input"
            placeholder="GST number"
            value={formData.business.gstNumber || ''}
            onChange={(e) => updateFormData('business.gstNumber', e.target.value)}
          />
        </div>

        <div className="bf-field">
          <label className="bf-label">
            Monthly Revenue (₹)
          </label>
          <input
            type="number"
            className="bf-input"
            placeholder="Monthly revenue"
            value={formData.business.monthlyRevenue || ''}
            onChange={(e) => updateFormData('business.monthlyRevenue', e.target.value)}
            min="0"
          />
        </div>

        <div className="bf-field">
          <label className="bf-label">
            Monthly Profit (₹)
          </label>
          <input
            type="number"
            className="bf-input"
            placeholder="Monthly profit"
            value={formData.business.monthlyProfit || ''}
            onChange={(e) => updateFormData('business.monthlyProfit', e.target.value)}
          />
        </div>

        <div className="bf-field">
          <label className="bf-label">
            Number of Employees
          </label>
          <input
            type="number"
            className="bf-input"
            placeholder="Total employees"
            value={formData.business.employees || ''}
            onChange={(e) => updateFormData('business.employees', e.target.value)}
            min="0"
          />
        </div>

        <div className="bf-field bf-field--full">
          <label className="bf-label">
            Assets (optional)
          </label>
          <div className="bf-asset-input">
            <input
              type="text"
              className="bf-input"
              placeholder="Asset name"
              value={newAsset.name}
              onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
            />
            <input
              type="number"
              className="bf-input"
              placeholder="Value (₹)"
              value={newAsset.value}
              onChange={(e) => setNewAsset({ ...newAsset, value: e.target.value })}
            />
            <button
              type="button"
              onClick={handleAddAsset}
              className="bf-add-btn"
              disabled={!newAsset.name || !newAsset.value}
            >
              Add Asset
            </button>
          </div>

          {formData.business.assets && formData.business.assets.length > 0 && (
            <div className="bf-asset-list">
              {formData.business.assets.map((asset, index) => (
                <div key={index} className="bf-asset-item">
                  <div className="bf-asset-info">
                    {asset.name} - ₹{asset.value}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAsset(index)}
                    className="bf-remove-btn"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bf-field bf-field--full">
          <label className="bf-label">
            Liabilities (optional)
          </label>
          <div className="bf-liability-input">
            <input
              type="text"
              className="bf-input"
              placeholder="Liability type"
              value={newLiability.type}
              onChange={(e) => setNewLiability({ ...newLiability, type: e.target.value })}
            />
            <input
              type="number"
              className="bf-input"
              placeholder="Amount (₹)"
              value={newLiability.amount}
              onChange={(e) => setNewLiability({ ...newLiability, amount: e.target.value })}
            />
            <button
              type="button"
              onClick={handleAddLiability}
              className="bf-add-btn"
              disabled={!newLiability.type || !newLiability.amount}
            >
              Add Liability
            </button>
          </div>

          {formData.business.liabilities && formData.business.liabilities.length > 0 && (
            <div className="bf-liability-list">
              {formData.business.liabilities.map((liability, index) => (
                <div key={index} className="bf-liability-item">
                  <div className="bf-liability-info">
                    {liability.type} - ₹{liability.amount}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLiability(index)}
                    className="bf-remove-btn"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bf-field bf-field--full">
          <label className="bf-label">
            Business Plan
          </label>
          <textarea
            className="bf-textarea"
            placeholder="Describe your business plan and future goals"
            value={formData.business.businessPlan || ''}
            onChange={(e) => updateFormData('business.businessPlan', e.target.value)}
            rows="4"
          />
        </div>

        <div className="bf-field bf-field--full">
          <label className="bf-label">
            Business Model
          </label>
          <textarea
            className="bf-textarea"
            placeholder="Describe your business model and revenue streams"
            value={formData.business.businessModel || ''}
            onChange={(e) => updateFormData('business.businessModel', e.target.value)}
            rows="3"
          />
        </div>

        <div className="bf-field bf-field--full">
          <label className="bf-label">
            Market Analysis
          </label>
          <textarea
            className="bf-textarea"
            placeholder="Market size, target customers, competition analysis"
            value={formData.business.marketAnalysis || ''}
            onChange={(e) => updateFormData('business.marketAnalysis', e.target.value)}
            rows="3"
          />
        </div>

        <div className="bf-field bf-field--full">
          <label className="bf-label">
            Competitive Landscape
          </label>
          <textarea
            className="bf-textarea"
            placeholder="Who are your main competitors and your competitive advantage"
            value={formData.business.competitiveLandscape || ''}
            onChange={(e) => updateFormData('business.competitiveLandscape', e.target.value)}
            rows="3"
          />
        </div>

        <div className="bf-field bf-field--full">
          <label className="bf-label">
            Growth Strategy
          </label>
          <textarea
            className="bf-textarea"
            placeholder="How do you plan to grow your business"
            value={formData.business.growthStrategy || ''}
            onChange={(e) => updateFormData('business.growthStrategy', e.target.value)}
            rows="3"
          />
        </div>
      </div>
    </div>
  );
};

export default BusinessForm;