import React, { useRef } from "react";
import "./ImagePicker.css"

const ImagePicker = ({ label, file, onChange, onClear }) => {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  return (
    <div className="kyc-form-group">
      <label className="kyc-label">{label}</label>

      {/* Hidden Gallery Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={onChange}
      />

      {/* Hidden Camera Input */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={onChange}
      />

      <div className="kyc-upload-actions">
        <button
          type="button"
          className="kyc-btn-secondary"
          onClick={() => fileInputRef.current.click()}
        >
          <i className="fas fa-folder-open"></i> Choose File
        </button>

        <button
          type="button"
          className="kyc-btn-secondary"
          onClick={() => cameraInputRef.current.click()}
        >
          <i className="fas fa-camera"></i> Use Camera
        </button>

        {file && (
          <button
            type="button"
            className="kyc-btn-clear"
            onClick={onClear}
          >
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>

      {file && (
        <p className="kyc-file-name">
          <i className="fas fa-check-circle"></i> {file.name}
        </p>
      )}
    </div>
  );
};

export default ImagePicker;
