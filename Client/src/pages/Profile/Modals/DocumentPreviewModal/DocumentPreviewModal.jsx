import React from "react";
import "./DocumentPreviewModal.css";

const DocumentPreviewModal = ({
  isOpen,
  onClose,
  fileUrl,
}) => {
  if (!isOpen) return null;

  return (
    <div className="doc-modal-overlay" onClick={onClose}>
      <div
        className="doc-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="doc-modal-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>

        <div className="doc-modal-body">
            <img
              src={fileUrl}
              alt="Document Preview"
              className="doc-modal-image"
            />
        </div>
      </div>
    </div>
  );
};

export default DocumentPreviewModal;
