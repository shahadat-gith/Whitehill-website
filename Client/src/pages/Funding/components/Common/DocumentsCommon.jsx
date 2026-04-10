import React from 'react';
import { DOCUMENT_FIELDS } from '../../constants/documentFields';
import './styles/DocumentsCommon.css';

const DocumentsCommon = ({ files, errors, handleFileChange }) => {
  const renderFileInput = (field) => {
    const fieldFiles = files[field.name];
    const fieldErrors = errors[field.name];

    return (
      <div key={field.name} className="dc-field">
        <label className="dc-label">
          {field.label}
          {!field.required && <span className="dc-optional">(optional)</span>}
          <span className="dc-required">*</span>
        </label>

        <div className="dc-input-group">
          <input
            type="file"
            className="dc-file-input"
            accept={field.accept}
            onChange={(e) => handleFileChange(field.name, e.target.files, field)}
            multiple={field.multiple}
            required={field.required}
          />
          <div className="dc-file-info">
            <span className="dc-file-types">Accepted: {field.accept.replace(/\./g, '').toUpperCase()}</span>
            <span className="dc-file-size">Max size: {field.maxSize / (1024 * 1024)}MB</span>
          </div>
        </div>

        {field.description && (
          <p className="dc-description">{field.description}</p>
        )}

        {fieldErrors && fieldErrors.length > 0 && (
          <div className="dc-errors">
            {fieldErrors.map((error, index) => (
              <p key={index} className="dc-error">{error}</p>
            ))}
          </div>
        )}

        {fieldFiles && (
          <div className="dc-file-list">
            {Array.isArray(fieldFiles) ? (
              fieldFiles.map((file, index) => (
                <div key={index} className="dc-file-item">
                  <span className="dc-file-name">{file.name}</span>
                  <span className="dc-file-size">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
              ))
            ) : (
              <div className="dc-file-item">
                <span className="dc-file-name">{fieldFiles.name}</span>
                <span className="dc-file-size">({(fieldFiles.size / 1024 / 1024).toFixed(2)} MB)</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="dc-container">
      <h2 className="dc-title">Basic Documents</h2>
      <p className="dc-subtitle">
        Please upload the following documents. All files must be under 10MB.
      </p>

      <div className="dc-fields">
        {DOCUMENT_FIELDS.common.map(renderFileInput)}
      </div>
    </div>
  );
};

export default DocumentsCommon;