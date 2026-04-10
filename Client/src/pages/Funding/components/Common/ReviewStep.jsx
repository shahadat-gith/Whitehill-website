import "./styles/ReviewStep.css"

const ReviewStep = ({ formData, files }) => {
  const renderValue = (value) => {
    if (Array.isArray(value)) return value.length ? value.join(', ') : 'None';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'object' && value !== null) return JSON.stringify(value, null, 2);
    return value || 'None';
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'Not specified';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatType = (type) => {
    switch (type) {
      case 'startup': return 'Startup';
      case 'business': return 'Business';
      case 'property': return 'Property';
      default: return 'Not selected';
    }
  };

  return (
    <div className="review-step">
      <div className="review-header">
        <h2 className="review-title">Review Your Funding Application</h2>
        <p className="review-subtitle">
          Please review all the information below before submitting your application.
          You can go back to previous steps to make changes if needed.
        </p>
      </div>

      {/* Funding Details Section */}
      <div className="review-section">
        <h3 className="section-title">Funding Details</h3>
        <div className="review-grid">
          <div className="review-field">
            <label className="field-label">Funding Type</label>
            <span className="field-value">{formatType(formData.type)}</span>
          </div>
          <div className="review-field">
            <label className="field-label">Requested Amount</label>
            <span className="field-value">{formatCurrency(formData.fundDetails?.amount)}</span>
          </div>
          <div className="review-field">
            <label className="field-label">Tenure Period</label>
            <span className="field-value">
              {formData.fundDetails?.tenureMonths ? `${formData.fundDetails.tenureMonths} months` : 'Not specified'}
            </span>
          </div>
          <div className="review-field review-field--full">
            <label className="field-label">Purpose of Funding</label>
            <span className="field-value">{formData.fundDetails?.purpose || 'Not specified'}</span>
          </div>
        </div>
      </div>

      {/* Type-Specific Details */}
      {formData.type === 'startup' && formData.startup && (
        <div className="review-section">
          <h3 className="section-title">Startup Information</h3>
          <div className="review-grid">
            <div className="review-field">
              <label className="field-label">Startup Name</label>
              <span className="field-value">{formData.startup.name || 'Not specified'}</span>
            </div>
            <div className="review-field">
              <label className="field-label">Industry/Sector</label>
              <span className="field-value">{formData.startup.sector || 'Not specified'}</span>
            </div>
            <div className="review-field">
              <label className="field-label">Stage</label>
              <span className="field-value">{formData.startup.stage || 'Not specified'}</span>
            </div>
            <div className="review-field">
              <label className="field-label">Foundation Year</label>
              <span className="field-value">{formData.startup.foundationYear || 'Not specified'}</span>
            </div>
            <div className="review-field">
              <label className="field-label">Team Size</label>
              <span className="field-value">{formData.startup.teamSize || 'Not specified'}</span>
            </div>
            <div className="review-field review-field--full">
              <label className="field-label">Description</label>
              <span className="field-value">{formData.startup.description || 'Not specified'}</span>
            </div>
            {formData.startup.traction && (
              <>
                <div className="review-field">
                  <label className="field-label">Current Users/Customers</label>
                  <span className="field-value">{formData.startup.traction.users || 'Not specified'}</span>
                </div>
                <div className="review-field">
                  <label className="field-label">Monthly Revenue</label>
                  <span className="field-value">{formatCurrency(formData.startup.traction.revenue)}</span>
                </div>
                <div className="review-field">
                  <label className="field-label">Growth Rate</label>
                  <span className="field-value">
                    {formData.startup.traction.growthRate ? `${formData.startup.traction.growthRate}%` : 'Not specified'}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {formData.type === 'business' && formData.business && (
        <div className="review-section">
          <h3 className="section-title">Business Information</h3>
          <div className="review-grid">
            <div className="review-field">
              <label className="field-label">Business Name</label>
              <span className="field-value">{formData.business.name || 'Not specified'}</span>
            </div>
            <div className="review-field">
              <label className="field-label">Business Type</label>
              <span className="field-value">{formData.business.type || 'Not specified'}</span>
            </div>
            <div className="review-field">
              <label className="field-label">Industry</label>
              <span className="field-value">{formData.business.industry || 'Not specified'}</span>
            </div>
            <div className="review-field">
              <label className="field-label">Years in Operation</label>
              <span className="field-value">{formData.business.yearsInOperation || 'Not specified'}</span>
            </div>
            <div className="review-field">
              <label className="field-label">Monthly Revenue</label>
              <span className="field-value">{formatCurrency(formData.business.monthlyRevenue)}</span>
            </div>
            <div className="review-field">
              <label className="field-label">Monthly Profit</label>
              <span className="field-value">{formatCurrency(formData.business.monthlyProfit)}</span>
            </div>
            <div className="review-field">
              <label className="field-label">Number of Employees</label>
              <span className="field-value">{formData.business.employees || 'Not specified'}</span>
            </div>
          </div>
        </div>
      )}

      {formData.type === 'property' && formData.property && (
        <div className="review-section">
          <h3 className="section-title">Property Information</h3>
          <div className="review-grid">
            <div className="review-field">
              <label className="field-label">Property Type</label>
              <span className="field-value">{formData.property.type || 'Not specified'}</span>
            </div>
            <div className="review-field">
              <label className="field-label">Sub-Type</label>
              <span className="field-value">{formData.property.subType || 'Not specified'}</span>
            </div>
            <div className="review-field">
              <label className="field-label">Property Value</label>
              <span className="field-value">{formatCurrency(formData.property.value)}</span>
            </div>
            <div className="review-field">
              <label className="field-label">Property Age</label>
              <span className="field-value">
                {formData.property.propertyAge ? `${formData.property.propertyAge} years` : 'Not specified'}
              </span>
            </div>
            {formData.property.location && (
              <>
                <div className="review-field review-field--full">
                  <label className="field-label">Address</label>
                  <span className="field-value">
                    {formData.property.location.address || 'Not specified'}, {formData.property.location.city || ''}, {formData.property.location.state || ''} - {formData.property.location.pincode || ''}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Disclosures Section */}
      <div className="review-section">
        <h3 className="section-title">Disclosures</h3>
        <div className="review-grid">
          <div className="review-field">
            <label className="field-label">Existing Loans</label>
            <span className="field-value">{renderValue(formData.disclosures?.hasExistingLoans)}</span>
          </div>
          <div className="review-field">
            <label className="field-label">Previous Defaults</label>
            <span className="field-value">{renderValue(formData.disclosures?.hasDefaultedBefore)}</span>
          </div>
          <div className="review-field">
            <label className="field-label">Legal Cases</label>
            <span className="field-value">{renderValue(formData.disclosures?.hasLegalCases)}</span>
          </div>
          <div className="review-field">
            <label className="field-label">Criminal Record</label>
            <span className="field-value">{renderValue(formData.disclosures?.hasCriminalRecord)}</span>
          </div>
          <div className="review-field">
            <label className="field-label">Politically Exposed</label>
            <span className="field-value">{renderValue(formData.disclosures?.politicallyExposed)}</span>
          </div>
          {formData.disclosures?.details && (
            <div className="review-field review-field--full">
              <label className="field-label">Additional Details</label>
              <span className="field-value">{formData.disclosures.details}</span>
            </div>
          )}
        </div>
      </div>

      {/* Risk Factors Section */}
      <div className="review-section">
        <h3 className="section-title">Risk Factors</h3>
        {formData.riskFactors && formData.riskFactors.length > 0 ? (
          <ul className="risk-list">
            {formData.riskFactors.map((risk, index) => (
              <li key={index} className="risk-item">{risk}</li>
            ))}
          </ul>
        ) : (
          <p className="no-data">No risk factors specified</p>
        )}
      </div>

      {/* Consent Section */}
      <div className="review-section">
        <h3 className="section-title">Consent & Agreements</h3>
        <div className="review-grid">
          <div className="review-field">
            <label className="field-label">Terms & Conditions</label>
            <span className="field-value">{renderValue(formData.consent?.agreedToTerms)}</span>
          </div>
          <div className="review-field">
            <label className="field-label">Privacy Policy</label>
            <span className="field-value">{renderValue(formData.consent?.agreedToPrivacyPolicy)}</span>
          </div>
          <div className="review-field">
            <label className="field-label">Credit Check Consent</label>
            <span className="field-value">{renderValue(formData.consent?.agreedToCreditCheck)}</span>
          </div>
        </div>
      </div>

      {/* Documents Section */}
      <div className="review-section">
        <h3 className="section-title">Uploaded Documents</h3>
        {Object.keys(files || {}).length > 0 ? (
          <div className="documents-list">
            {Object.entries(files).map(([fieldName, fileData]) => {
              if (!fileData) return null;
              const displayName = fieldName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

              if (Array.isArray(fileData)) {
                return (
                  <div key={fieldName} className="document-group">
                    <h4 className="document-group-title">{displayName}</h4>
                    <ul className="document-items">
                      {fileData.map((file, index) => (
                        <li key={index} className="document-item">{file.name}</li>
                      ))}
                    </ul>
                  </div>
                );
              } else {
                return (
                  <div key={fieldName} className="document-item">
                    <span className="document-label">{displayName}:</span>
                    <span className="document-name">{fileData.name}</span>
                  </div>
                );
              }
            })}
          </div>
        ) : (
          <p className="no-data">No documents uploaded</p>
        )}
      </div>

      {/* Submit Notice */}
      <div className="submit-notice">
        <div className="notice-icon">⚠️</div>
        <div className="notice-content">
          <h4>Important Notice</h4>
          <p>
            By submitting this application, you confirm that all information provided is accurate and complete.
            Our team will review your application and contact you within 3-5 business days.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;