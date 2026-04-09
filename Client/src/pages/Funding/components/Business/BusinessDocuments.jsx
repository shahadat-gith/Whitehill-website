import React from 'react';
import { DOCUMENT_FIELDS } from '../../constants/documentFields';
import './BusinessDocuments.css';

const BusinessDocuments = ({ files, errors, handleFileChange }) => {
  const renderFileInput = (field) => {
    const fieldFiles = files[field.name];
    const fieldErrors = errors[field.name];

    return (
      <div key={field.name} className="bd-field">
        <label className="bd-label">
          {field.label}
          {!field.required && <span className="bd-optional">(optional)</span>}
          <span className="bd-required">*</span>
        </label>

        <div className="bd-input-group">
          <input
            type="file"
            className="bd-file-input"
            accept={field.accept}
            onChange={(e) => handleFileChange(field.name, e.target.files, field)}
            multiple={field.multiple}
            required={field.required}
          />
          <div className="bd-file-info">
            <span className="bd-file-types">Accepted: {field.accept.replace(/\./g, '').toUpperCase()}</span>
            <span className="bd-file-size">Max size: {field.maxSize / (1024 * 1024)}MB</span>
          </div>
        </div>

        {field.description && (
          <p className="bd-description">{field.description}</p>
        )}

        {fieldErrors && fieldErrors.length > 0 && (
          <div className="bd-errors">
            {fieldErrors.map((error, index) => (
              <p key={index} className="bd-error">{error}</p>
            ))}
          </div>
        )}

        {fieldFiles && (
          <div className="bd-file-list">
            {Array.isArray(fieldFiles) ? (
              fieldFiles.map((file, index) => (
                <div key={index} className="bd-file-item">
                  <span className="bd-file-name">{file.name}</span>
                  <span className="bd-file-size">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
              ))
            ) : (
              <div className="bd-file-item">
                <span className="bd-file-name">{fieldFiles.name}</span>
                <span className="bd-file-size">({(fieldFiles.size / 1024 / 1024).toFixed(2)} MB)</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bd-container">
      <h2 className="bd-title">Business Documents</h2>
      <p className="bd-subtitle">
        Please upload the following business-specific documents. All files must be under 10MB.
      </p>

      <div className="bd-fields">
        {DOCUMENT_FIELDS.business.map(renderFileInput)}
      </div>
    </div>
  );
};

export default BusinessDocuments;