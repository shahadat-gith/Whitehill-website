import React, { useState } from 'react';
import './StartupForm.css';

const StartupForm = ({ formData, updateFormData, addToArray, removeFromArray }) => {
  const [newFounder, setNewFounder] = useState({ name: '', role: '', experience: '', linkedin: '' });
  const [newPreviousFunding, setNewPreviousFunding] = useState({ investor: '', amount: '', year: '' });
  const [newCompetitor, setNewCompetitor] = useState('');
  const [newRisk, setNewRisk] = useState('');

  const handleAddFounder = () => {
    if (newFounder.name && newFounder.role) {
      addToArray('startup.founders', { ...newFounder });
      setNewFounder({ name: '', role: '', experience: '', linkedin: '' });
    }
  };

  const handleAddPreviousFunding = () => {
    if (newPreviousFunding.investor && newPreviousFunding.amount) {
      addToArray('startup.previousFunding', { ...newPreviousFunding });
      setNewPreviousFunding({ investor: '', amount: '', year: '' });
    }
  };

  const handleAddCompetitor = () => {
    if (newCompetitor.trim()) {
      addToArray('startup.competitors', newCompetitor.trim());
      setNewCompetitor('');
    }
  };

  const handleAddRisk = () => {
    if (newRisk.trim()) {
      addToArray('startup.risks', newRisk.trim());
      setNewRisk('');
    }
  };

  return (
    <div className="sf-container">
      <h2 className="sf-title">Startup Information</h2>

      <div className="sf-grid">
        <div className="sf-field">
          <label className="sf-label">
            Startup Name
            <span className="sf-required">*</span>
          </label>
          <input
            type="text"
            className="sf-input"
            placeholder="Enter your startup name"
            value={formData.startup.name || ''}
            onChange={(e) => updateFormData('startup.name', e.target.value)}
            required
          />
        </div>

        <div className="sf-field">
          <label className="sf-label">
            Sector/Industry
          </label>
          <input
            type="text"
            className="sf-input"
            placeholder="e.g., FinTech, HealthTech, EdTech"
            value={formData.startup.sector || ''}
            onChange={(e) => updateFormData('startup.sector', e.target.value)}
          />
        </div>

        <div className="sf-field sf-field--full">
          <label className="sf-label">
            Description
          </label>
          <textarea
            className="sf-textarea"
            placeholder="Describe your startup, its mission, and what problem it solves"
            value={formData.startup.description || ''}
            onChange={(e) => updateFormData('startup.description', e.target.value)}
            rows="4"
          />
        </div>

        <div className="sf-field">
          <label className="sf-label">
            Stage
          </label>
          <select
            className="sf-select"
            value={formData.startup.stage || ''}
            onChange={(e) => updateFormData('startup.stage', e.target.value)}
          >
            <option value="">Select stage</option>
            <option value="idea">Idea</option>
            <option value="mvp">MVP</option>
            <option value="growth">Growth</option>
            <option value="scaling">Scaling</option>
          </select>
        </div>

        <div className="sf-field">
          <label className="sf-label">
            Foundation Year
          </label>
          <input
            type="number"
            className="sf-input"
            placeholder="e.g., 2020"
            value={formData.startup.foundationYear || ''}
            onChange={(e) => updateFormData('startup.foundationYear', e.target.value)}
            min="1900"
            max={new Date().getFullYear()}
          />
        </div>

        <div className="sf-field">
          <label className="sf-label">
            Team Size
          </label>
          <input
            type="number"
            className="sf-input"
            placeholder="Number of employees"
            value={formData.startup.teamSize || ''}
            onChange={(e) => updateFormData('startup.teamSize', e.target.value)}
            min="1"
          />
        </div>

        <div className="sf-field sf-field--full">
          <label className="sf-label">
            Founders
          </label>
          <div className="sf-founder-input">
            <input
              type="text"
              className="sf-input"
              placeholder="Founder name"
              value={newFounder.name}
              onChange={(e) => setNewFounder({ ...newFounder, name: e.target.value })}
            />
            <input
              type="text"
              className="sf-input"
              placeholder="Role (e.g., CEO, CTO)"
              value={newFounder.role}
              onChange={(e) => setNewFounder({ ...newFounder, role: e.target.value })}
            />
            <input
              type="text"
              className="sf-input"
              placeholder="Experience (optional)"
              value={newFounder.experience}
              onChange={(e) => setNewFounder({ ...newFounder, experience: e.target.value })}
            />
            <input
              type="url"
              className="sf-input"
              placeholder="LinkedIn URL (optional)"
              value={newFounder.linkedin}
              onChange={(e) => setNewFounder({ ...newFounder, linkedin: e.target.value })}
            />
            <button
              type="button"
              onClick={handleAddFounder}
              className="sf-add-btn"
              disabled={!newFounder.name || !newFounder.role}
            >
              Add Founder
            </button>
          </div>

          {formData.startup.founders && formData.startup.founders.length > 0 && (
            <div className="sf-founder-list">
              {formData.startup.founders.map((founder, index) => (
                <div key={index} className="sf-founder-item">
                  <div className="sf-founder-info">
                    <strong>{founder.name}</strong> - {founder.role}
                    {founder.experience && <span> ({founder.experience})</span>}
                    {founder.linkedin && <a href={founder.linkedin} target="_blank" rel="noopener noreferrer"> LinkedIn</a>}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromArray('startup.founders', index)}
                    className="sf-remove-btn"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="sf-field sf-field--full">
          <label className="sf-label">
            Business Model
          </label>
          <textarea
            className="sf-textarea"
            placeholder="Describe your business model and revenue streams"
            value={formData.startup.businessModel || ''}
            onChange={(e) => updateFormData('startup.businessModel', e.target.value)}
            rows="3"
          />
        </div>

        <div className="sf-field sf-field--full">
          <label className="sf-label">
            Traction
          </label>
          <div className="sf-traction-grid">
            <input
              type="number"
              className="sf-input"
              placeholder="Users/Customers"
              value={formData.startup.traction?.users || ''}
              onChange={(e) => updateFormData('startup.traction.users', e.target.value)}
            />
            <input
              type="number"
              className="sf-input"
              placeholder="Revenue (₹)"
              value={formData.startup.traction?.revenue || ''}
              onChange={(e) => updateFormData('startup.traction.revenue', e.target.value)}
            />
            <input
              type="number"
              className="sf-input"
              placeholder="Growth Rate (%)"
              value={formData.startup.traction?.growthRate || ''}
              onChange={(e) => updateFormData('startup.traction.growthRate', e.target.value)}
              step="0.1"
            />
          </div>
        </div>

        <div className="sf-field sf-field--full">
          <label className="sf-label">
            Previous Funding (optional)
          </label>
          <div className="sf-funding-input">
            <input
              type="text"
              className="sf-input"
              placeholder="Investor name"
              value={newPreviousFunding.investor}
              onChange={(e) => setNewPreviousFunding({ ...newPreviousFunding, investor: e.target.value })}
            />
            <input
              type="number"
              className="sf-input"
              placeholder="Amount (₹)"
              value={newPreviousFunding.amount}
              onChange={(e) => setNewPreviousFunding({ ...newPreviousFunding, amount: e.target.value })}
            />
            <input
              type="number"
              className="sf-input"
              placeholder="Year"
              value={newPreviousFunding.year}
              onChange={(e) => setNewPreviousFunding({ ...newPreviousFunding, year: e.target.value })}
              min="1900"
              max={new Date().getFullYear()}
            />
            <button
              type="button"
              onClick={handleAddPreviousFunding}
              className="sf-add-btn"
              disabled={!newPreviousFunding.investor || !newPreviousFunding.amount}
            >
              Add Funding
            </button>
          </div>

          {formData.startup.previousFunding && formData.startup.previousFunding.length > 0 && (
            <div className="sf-funding-list">
              {formData.startup.previousFunding.map((funding, index) => (
                <div key={index} className="sf-funding-item">
                  <div className="sf-funding-info">
                    {funding.investor} - ₹{funding.amount} ({funding.year})
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromArray('startup.previousFunding', index)}
                    className="sf-remove-btn"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="sf-field sf-field--full">
          <label className="sf-label">
            Fund Usage Breakdown (%)
          </label>
          <div className="sf-usage-grid">
            <div className="sf-usage-field">
              <label className="sf-usage-label">Product</label>
              <input
                type="number"
                className="sf-input"
                placeholder="0"
                value={formData.startup.fundUsage?.product || ''}
                onChange={(e) => updateFormData('startup.fundUsage.product', e.target.value)}
                min="0"
                max="100"
              />
            </div>
            <div className="sf-usage-field">
              <label className="sf-usage-label">Marketing</label>
              <input
                type="number"
                className="sf-input"
                placeholder="0"
                value={formData.startup.fundUsage?.marketing || ''}
                onChange={(e) => updateFormData('startup.fundUsage.marketing', e.target.value)}
                min="0"
                max="100"
              />
            </div>
            <div className="sf-usage-field">
              <label className="sf-usage-label">Hiring</label>
              <input
                type="number"
                className="sf-input"
                placeholder="0"
                value={formData.startup.fundUsage?.hiring || ''}
                onChange={(e) => updateFormData('startup.fundUsage.hiring', e.target.value)}
                min="0"
                max="100"
              />
            </div>
            <div className="sf-usage-field">
              <label className="sf-usage-label">Operations</label>
              <input
                type="number"
                className="sf-input"
                placeholder="0"
                value={formData.startup.fundUsage?.operations || ''}
                onChange={(e) => updateFormData('startup.fundUsage.operations', e.target.value)}
                min="0"
                max="100"
              />
            </div>
          </div>
        </div>

        <div className="sf-field sf-field--full">
          <label className="sf-label">
            Competitors (optional)
          </label>
          <div className="sf-input-group">
            <input
              type="text"
              className="sf-input"
              placeholder="Enter competitor name"
              value={newCompetitor}
              onChange={(e) => setNewCompetitor(e.target.value)}
            />
            <button
              type="button"
              onClick={handleAddCompetitor}
              className="sf-add-btn"
              disabled={!newCompetitor.trim()}
            >
              Add Competitor
            </button>
          </div>

          {formData.startup.competitors && formData.startup.competitors.length > 0 && (
            <div className="sf-list">
              {formData.startup.competitors.map((competitor, index) => (
                <div key={index} className="sf-list-item">
                  <span>{competitor}</span>
                  <button
                    type="button"
                    onClick={() => removeFromArray('startup.competitors', index)}
                    className="sf-remove-btn"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="sf-field sf-field--full">
          <label className="sf-label">
            Risks (optional)
          </label>
          <div className="sf-input-group">
            <input
              type="text"
              className="sf-input"
              placeholder="Enter potential risk"
              value={newRisk}
              onChange={(e) => setNewRisk(e.target.value)}
            />
            <button
              type="button"
              onClick={handleAddRisk}
              className="sf-add-btn"
              disabled={!newRisk.trim()}
            >
              Add Risk
            </button>
          </div>

          {formData.startup.risks && formData.startup.risks.length > 0 && (
            <div className="sf-list">
              {formData.startup.risks.map((risk, index) => (
                <div key={index} className="sf-list-item">
                  <span>{risk}</span>
                  <button
                    type="button"
                    onClick={() => removeFromArray('startup.risks', index)}
                    className="sf-remove-btn"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="sf-field">
          <label className="sf-label">
            Website (optional)
          </label>
          <input
            type="url"
            className="sf-input"
            placeholder="https://yourstartup.com"
            value={formData.startup.website || ''}
            onChange={(e) => updateFormData('startup.website', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default StartupForm;