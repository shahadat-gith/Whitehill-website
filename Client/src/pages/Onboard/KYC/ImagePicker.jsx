import React, { useRef } from "react";

const ImagePicker = ({ label, file, onChange, onClear }) => {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  return (
    <div className="kyc-form-group">
      <label className="kyc-label">{label}</label>

      {/* Gallery input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={onChange}
      />

      {/* Camera input */}
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

        {/* 👇 camera button (hidden on desktop via CSS) */}
        <button
          type="button"
          className="kyc-btn-secondary kyc-btn-camera"
          onClick={() => cameraInputRef.current.click()}
        >
          <i className="fas fa-camera"></i> Use Camera
        </button>

        {file && (
          <button
            type="button"
            className="kyc-btn-clear"
            onClick={onClear}
            title="Remove image"
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
