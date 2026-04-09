import React from 'react';
import { DOCUMENT_FIELDS } from '../../constants/documentFields';
import './PropertyDocuments.css';

const PropertyDocuments = ({ files, errors, handleFileChange }) => {
  const renderFileInput = (field) => {
    const fieldFiles = files[field.name];
    const fieldErrors = errors[field.name];

    return (
      <div key={field.name} className="pd-field">
        <label className="pd-label">
          {field.label}
          {!field.required && <span className="pd-optional">(optional)</span>}
          <span className="pd-required">*</span>
        </label>

        <div className="pd-input-group">
          <input
            type="file"
            className="pd-file-input"
            accept={field.accept}
            onChange={(e) => handleFileChange(field.name, e.target.files, field)}
            multiple={field.multiple}
            required={field.required}
          />
          <div className="pd-file-info">
            <span className="pd-file-types">Accepted: {field.accept.replace(/\./g, '').toUpperCase()}</span>
            <span className="pd-file-size">Max size: {field.maxSize / (1024 * 1024)}MB</span>
          </div>
        </div>

        {field.description && (
          <p className="pd-description">{field.description}</p>
        )}

        {fieldErrors && fieldErrors.length > 0 && (
          <div className="pd-errors">
            {fieldErrors.map((error, index) => (
              <p key={index} className="pd-error">{error}</p>
            ))}
          </div>
        )}

        {fieldFiles && (
          <div className="pd-file-list">
            {Array.isArray(fieldFiles) ? (
              fieldFiles.map((file, index) => (
                <div key={index} className="pd-file-item">
                  <span className="pd-file-name">{file.name}</span>
                  <span className="pd-file-size">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
              ))
            ) : (
              <div className="pd-file-item">
                <span className="pd-file-name">{fieldFiles.name}</span>
                <span className="pd-file-size">({(fieldFiles.size / 1024 / 1024).toFixed(2)} MB)</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="pd-container">
      <h2 className="pd-title">Property Documents</h2>
      <p className="pd-subtitle">
        Please upload the following property-specific documents. All files must be under 10MB.
      </p>

      <div className="pd-fields">
        {DOCUMENT_FIELDS.property.map(renderFileInput)}
      </div>
    </div>
  );
};

export default PropertyDocuments;