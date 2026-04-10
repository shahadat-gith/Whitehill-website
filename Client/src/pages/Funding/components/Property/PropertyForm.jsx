import React, { useState } from 'react';
import './PropertyForm.css';

const PropertyForm = ({ formData, updateFormData }) => {
  const [inputValue, setInputValue] = useState(
    (formData.property.legal?.approvals || []).join(', ')
  );

  const handleApprovalChange = (e) => {
    const rawValue = e.target.value;

    // 1. Update the local UI state immediately so typing feels natural
    setInputValue(rawValue);

    // 2. Convert to array for formData
    // We split by comma but DON'T filter yet, so the user can type a comma
    const arrayValue = rawValue.split(',').map(s => s.trim());

    // 3. Update your global/parent state
    updateFormData('property.legal.approvals', arrayValue);
  };

  const handleBlur = () => {
    // Clean up the data (remove empty strings) only when the user finishes typing
    const cleanedArray = (formData.property.legal?.approvals || [])
      .filter(val => val !== "");

    updateFormData('property.legal.approvals', cleanedArray);
    setInputValue(cleanedArray.join(', '));
  };



  return (
    <div className="pf-container">
      <h2 className="pf-title">Property Information</h2>

      <div className="pf-grid">
        <div className="pf-field">
          <label className="pf-label">
            Property Type
            <span className="pf-required">*</span>
          </label>
          <select
            className="pf-select"
            value={formData.property.type || ''}
            onChange={(e) => updateFormData('property.type', e.target.value)}
            required
          >
            <option value="">Select property type</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="land">Land</option>
          </select>
        </div>

        <div className="pf-field">
          <label className="pf-label">
            Sub-Type
            <span className="pf-required">*</span>
          </label>
          <select
            className="pf-select"
            value={formData.property.subType || ''}
            onChange={(e) => updateFormData('property.subType', e.target.value)}
            required
          >
            <option value="">Select sub-type</option>
            {formData.property.type === 'residential' && (
              <>
                <option value="apartment">Apartment</option>
                <option value="independent_house">Independent House</option>
                <option value="villa">Villa</option>
              </>
            )}
            {formData.property.type === 'commercial' && (
              <>
                <option value="office">Office</option>
                <option value="shop">Shop</option>
                <option value="warehouse">Warehouse</option>
              </>
            )}
            {formData.property.type === 'land' && (
              <>
                <option value="plot">Plot</option>
                <option value="agricultural_land">Agricultural Land</option>
              </>
            )}
          </select>
        </div>

        <div className="pf-field">
          <label className="pf-label">
            Property Value (₹)
          </label>
          <input
            type="number"
            className="pf-input"
            placeholder="Enter property value"
            value={formData.property.value || ''}
            onChange={(e) => updateFormData('property.value', e.target.value)}
            min="0"
          />
        </div>

        <div className="pf-field pf-field--full">
          <label className="pf-label">
            Address
          </label>
          <input
            type="text"
            className="pf-input"
            placeholder="Street address"
            value={formData.property.location?.address || ''}
            onChange={(e) => updateFormData('property.location.address', e.target.value)}
          />
        </div>

        <div className="pf-field">
          <label className="pf-label">
            City
          </label>
          <input
            type="text"
            className="pf-input"
            placeholder="City name"
            value={formData.property.location?.city || ''}
            onChange={(e) => updateFormData('property.location.city', e.target.value)}
          />
        </div>

        <div className="pf-field">
          <label className="pf-label">
            State
          </label>
          <input
            type="text"
            className="pf-input"
            placeholder="State name"
            value={formData.property.location?.state || ''}
            onChange={(e) => updateFormData('property.location.state', e.target.value)}
          />
        </div>

        <div className="pf-field">
          <label className="pf-label">
            Pincode
          </label>
          <input
            type="text"
            className="pf-input"
            placeholder="Pincode"
            value={formData.property.location?.pincode || ''}
            onChange={(e) => updateFormData('property.location.pincode', e.target.value)}
            pattern="[0-9]{6}"
            maxLength="6"
          />
        </div>

        {formData.property.type !== 'land' && (
          <>
            <div className="pf-field">
              <label className="pf-label">
                Built-up Area (sq ft)
              </label>
              <input
                type="number"
                className="pf-input"
                placeholder="Built-up area"
                value={formData.property.builtUpArea || ''}
                onChange={(e) => updateFormData('property.builtUpArea', e.target.value)}
                min="0"
              />
            </div>

            <div className="pf-field">
              <label className="pf-label">
                Carpet Area (sq ft)
              </label>
              <input
                type="number"
                className="pf-input"
                placeholder="Carpet area"
                value={formData.property.carpetArea || ''}
                onChange={(e) => updateFormData('property.carpetArea', e.target.value)}
                min="0"
              />
            </div>
          </>
        )}

        {formData.property.type === 'land' && (
          <div className="pf-field">
            <label className="pf-label">
              Land Area (sq ft)
            </label>
            <input
              type="number"
              className="pf-input"
              placeholder="Land area"
              value={formData.property.landArea || ''}
              onChange={(e) => updateFormData('property.landArea', e.target.value)}
              min="0"
            />
          </div>
        )}

        <div className="pf-field">
          <label className="pf-label">
            Property Age (years)
          </label>
          <input
            type="number"
            className="pf-input"
            placeholder="Age of property"
            value={formData.property.propertyAge || ''}
            onChange={(e) => updateFormData('property.propertyAge', e.target.value)}
            min="0"
          />
        </div>

        <div className="pf-field">
          <label className="pf-label">
            Builder/Developer (optional)
          </label>
          <input
            type="text"
            className="pf-input"
            placeholder="Builder or developer name"
            value={formData.property.builder || ''}
            onChange={(e) => updateFormData('property.builder', e.target.value)}
          />
        </div>

        {formData.property.type === 'land' && (
          <div className="pf-field">
            <label className="pf-label">
              Land Type
            </label>
            <select
              className="pf-select"
              value={formData.property.landType || ''}
              onChange={(e) => updateFormData('property.landType', e.target.value)}
            >
              <option value="">Select land type</option>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="industrial">Industrial</option>
              <option value="agricultural">Agricultural</option>
            </select>
          </div>
        )}

        <div className="pf-field">
          <label className="pf-label">
            Ownership Type
          </label>
          <select
            className="pf-select"
            value={formData.property.ownershipType || ''}
            onChange={(e) => updateFormData('property.ownershipType', e.target.value)}
          >
            <option value="">Select ownership type</option>
            <option value="freehold">Freehold</option>
            <option value="leasehold">Leasehold</option>
            <option value="cooperative">Cooperative</option>
          </select>
        </div>

        <div className="pf-field pf-field--full">
          <label className="pf-label">
            Legal Information
          </label>
          <div className="pf-legal-grid">
            <label className="pf-checkbox-label">
              <input
                type="checkbox"
                checked={formData.property.legal?.isDisputed || false}
                onChange={(e) => updateFormData('property.legal.isDisputed', e.target.checked)}
              />
              <span className="pf-checkbox-text">Property is under dispute</span>
            </label>

            <label className="pf-checkbox-label">
              <input
                type="checkbox"
                checked={formData.property.legal?.titleClear || false}
                onChange={(e) => updateFormData('property.legal.titleClear', e.target.checked)}
              />
              <span className="pf-checkbox-text">Title is clear</span>
            </label>
          </div>
        </div>

        <div className="pf-field pf-field--full">
          <label className="pf-label">Approvals (optional)</label>
          <input
            type="text"
            className="pf-input"
            placeholder="List any approvals (e.g., RERA, municipal)"
            // Use the local string state for the value
            value={inputValue}
            onChange={handleApprovalChange}
            onBlur={handleBlur}
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyForm;