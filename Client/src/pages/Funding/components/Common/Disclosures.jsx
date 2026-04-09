import React from 'react';
import './styles/Disclosures.css';

const Disclosures = ({ formData, updateFormData }) => {
  const disclosureFields = [
    { key: 'hasExistingLoans', label: 'Do you have any existing loans?' },
    { key: 'hasDefaultedBefore', label: 'Have you defaulted on any loans before?' },
    { key: 'hasLegalCases', label: 'Are there any legal cases against you or your business?' },
    { key: 'hasCriminalRecord', label: 'Do you have any criminal record?' },
    { key: 'politicallyExposed', label: 'Are you a politically exposed person?' }
  ];

  return (
    <div className="ds-container">
      <h2 className="ds-title">Disclosures</h2>
      <p className="ds-subtitle">
        Please answer these questions honestly. False information may result in rejection of your application.
      </p>

      <div className="ds-fields">
        {disclosureFields.map((field) => (
          <div key={field.key} className="ds-field">
            <label className="ds-label">
              {field.label}
              <span className="ds-required">*</span>
            </label>
            <div className="ds-radio-group">
              <label className="ds-radio-label">
                <input
                  type="radio"
                  name={field.key}
                  value="true"
                  checked={formData.disclosures[field.key] === true}
                  onChange={(e) => updateFormData(`disclosures.${field.key}`, e.target.value === 'true')}
                  required
                />
                <span className="ds-radio-text">Yes</span>
              </label>
              <label className="ds-radio-label">
                <input
                  type="radio"
                  name={field.key}
                  value="false"
                  checked={formData.disclosures[field.key] === false}
                  onChange={(e) => updateFormData(`disclosures.${field.key}`, e.target.value === 'true')}
                  required
                />
                <span className="ds-radio-text">No</span>
              </label>
            </div>
          </div>
        ))}

        <div className="ds-field ds-field--full">
          <label className="ds-label">
            Additional Details (optional)
          </label>
          <textarea
            className="ds-textarea"
            placeholder="Provide any additional information related to the above disclosures"
            value={formData.disclosures.details}
            onChange={(e) => updateFormData('disclosures.details', e.target.value)}
            rows="3"
          />
        </div>
      </div>
    </div>
  );
};

export default Disclosures;