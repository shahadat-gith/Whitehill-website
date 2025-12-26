import React from "react";
import PdfPreview from "./PdfPreview";
import "./DocumentPreviewModal.css";

const DocumentPreviewModal = ({
  isOpen,
  onClose,
  fileUrl,
  fileType, // "pdf" | "image"
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
          {fileType === "pdf" ? (
            <PdfPreview url={fileUrl} />
          ) : (
            <img
              src={fileUrl}
              alt="Document Preview"
              className="doc-modal-image"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentPreviewModal;
