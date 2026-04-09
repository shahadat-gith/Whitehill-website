import React, { useState } from 'react';
import './styles/RiskFactors.css';

const RiskFactors = ({ formData, addToArray, removeFromArray }) => {
  const [newRisk, setNewRisk] = useState('');

  const handleAddRisk = () => {
    if (newRisk.trim()) {
      addToArray('riskFactors', newRisk.trim());
      setNewRisk('');
    }
  };

  const handleRemoveRisk = (index) => {
    removeFromArray('riskFactors', index);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddRisk();
    }
  };

  return (
    <div className="rf-container">
      <h2 className="rf-title">Risk Factors</h2>
      <p className="rf-subtitle">
        List any potential risks that could affect your ability to repay the loan.
      </p>

      <div className="rf-input-group">
        <input
          type="text"
          className="rf-input"
          placeholder="Enter a risk factor (e.g., Market competition, Economic downturn)"
          value={newRisk}
          onChange={(e) => setNewRisk(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          type="button"
          onClick={handleAddRisk}
          className="rf-add-btn"
          disabled={!newRisk.trim()}
        >
          Add Risk
        </button>
      </div>

      {formData.riskFactors && formData.riskFactors.length > 0 && (
        <div className="rf-list">
          <h3 className="rf-list-title">Added Risk Factors:</h3>
          <ul className="rf-items">
            {formData.riskFactors.map((risk, index) => (
              <li key={index} className="rf-item">
                <span className="rf-item-text">{risk}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveRisk(index)}
                  className="rf-remove-btn"
                  title="Remove risk factor"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RiskFactors;