import React from 'react';
import { DOCUMENT_FIELDS } from '../../constants/documentFields';
import './StartupDocuments.css';

const StartupDocuments = ({ files, errors, handleFileChange }) => {
  const renderFileInput = (field) => {
    const fieldFiles = files[field.name];
    const fieldErrors = errors[field.name];

    return (
      <div key={field.name} className="sd-field">
        <label className="sd-label">
          {field.label}
          {!field.required && <span className="sd-optional">(optional)</span>}
          <span className="sd-required">*</span>
        </label>

        <div className="sd-input-group">
          <input
            type="file"
            className="sd-file-input"
            accept={field.accept}
            onChange={(e) => handleFileChange(field.name, e.target.files, field)}
            multiple={field.multiple}
            required={field.required}
          />
          <div className="sd-file-info">
            <span className="sd-file-types">Accepted: {field.accept.replace(/\./g, '').toUpperCase()}</span>
            <span className="sd-file-size">Max size: {field.maxSize / (1024 * 1024)}MB</span>
          </div>
        </div>

        {field.description && (
          <p className="sd-description">{field.description}</p>
        )}

        {fieldErrors && fieldErrors.length > 0 && (
          <div className="sd-errors">
            {fieldErrors.map((error, index) => (
              <p key={index} className="sd-error">{error}</p>
            ))}
          </div>
        )}

        {fieldFiles && (
          <div className="sd-file-list">
            {Array.isArray(fieldFiles) ? (
              fieldFiles.map((file, index) => (
                <div key={index} className="sd-file-item">
                  <span className="sd-file-name">{file.name}</span>
                  <span className="sd-file-size">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
              ))
            ) : (
              <div className="sd-file-item">
                <span className="sd-file-name">{fieldFiles.name}</span>
                <span className="sd-file-size">({(fieldFiles.size / 1024 / 1024).toFixed(2)} MB)</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="sd-container">
      <h2 className="sd-title">Startup Documents</h2>
      <p className="sd-subtitle">
        Please upload the following startup-specific documents. All files must be under 10MB.
      </p>

      <div className="sd-fields">
        {DOCUMENT_FIELDS.startup.map(renderFileInput)}
      </div>
    </div>
  );
};

export default StartupDocuments;