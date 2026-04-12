import React, { useState, useRef } from "react";
import api from "../../configs/axios";
import toast from "react-hot-toast";
import "./ExtraDocumentUploadModal.css";

const ExtraDocumentUploadModal = ({ fundingId, requestId, onClose, onSuccess }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) return toast.error("Please select files");

    const formData = new FormData();
    formData.append("fundingId", fundingId);
    formData.append("requestId", requestId);
    files.forEach((file) => formData.append("files", file));

    try {
      setLoading(true);
      const { data } = await api.post("/api/funding/upload-request-documents", formData);

      if (data.success) {
        toast.success("Documents uploaded successfully.");
        onSuccess();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edum-overlay">
      <div className="edum-container">
        <div className="edum-header">
          <div className="edum-title-group">
            <div className="edum-icon">
              <i className="fas fa-file-shield"></i>
            </div>
            <div>
              <h3>Secure Upload</h3>
              <p>Requested compliance documents</p>
            </div>
          </div>
          <button className="edum-close" onClick={onClose} disabled={loading}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="edum-form">
          <div className="edum-upload-zone" onClick={() => !loading && fileInputRef.current.click()}>
            <input 
              type="file" 
              multiple 
              onChange={handleChange} 
              ref={fileInputRef} 
              style={{ display: "none" }} 
            />
            <i className="fas fa-cloud-arrow-up"></i>
            <p>{files.length > 0 ? `${files.length} files selected` : "Click to select or drag documents here"}</p>
            <span>Supports PDF, JPG, PNG (Max 10MB per file)</span>
          </div>

          {files.length > 0 && (
            <div className="edum-file-list">
              {files.map((file, idx) => (
                <div key={idx} className="edum-file-item">
                  <i className="far fa-file-lines"></i>
                  <span>{file.name}</span>
                </div>
              ))}
            </div>
          )}

          <div className="edum-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <i className="fas fa-circle-notch fa-spin"></i> Processing...
                </>
              ) : (
                "Complete Upload"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExtraDocumentUploadModal;