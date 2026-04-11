import { useState } from "react";
import api from "../../configs/axios";
import toast from "react-hot-toast";
import "./ImageUploadModal.css";

const ImageUploadModal = ({ isOpen, onClose, projectId }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  if (!isOpen) return null;

  /* ================= FILE HANDLING ================= */
  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setFiles([...e.dataTransfer.files]);
  };

  const removeFile = (index) => {
    const updated = [...files];
    updated.splice(index, 1);
    setFiles(updated);
  };

  /* ================= UPLOAD ================= */
  const handleUpload = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("projectId", projectId);
      files.forEach((file) => formData.append("images", file));

      const { data } = await api.post(
        "/api/admin/project/images/upload",
        formData
      );

      if (data.success) {
        toast.success("Images uploaded successfully");
        onClose(true);
      } else {
        toast.error(data.message || "Upload failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="pr-modal-overlay" onClick={() => onClose(false)}>
      <div
        className="pr-modal-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <form className="pr-modal-content" onSubmit={handleUpload}>
          
          {/* HEADER */}
          <div className="pr-modal-header">
            <div>
              <h5>Upload Project Images</h5>
              <span className="pr-subtitle">
                Add multiple images for this project
              </span>
            </div>

            <button
              type="button"
              className="pr-modal-close"
              onClick={() => onClose(false)}
            >
              ×
            </button>
          </div>

          {/* BODY */}
          <div className="pr-modal-body">

            {/* DROP ZONE */}
            <div
              className="pr-dropzone"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <i className="fa-solid fa-cloud-arrow-up"></i>
              <p>Drag & drop images here</p>
              <span>or</span>

              <input
                type="file"
                multiple
                onChange={handleFileChange}
              />

              <button type="button" className="btn btn-secondary">
                Browse Files
              </button>
            </div>

            {/* FILE PREVIEW */}
            {files.length > 0 && (
              <div className="pr-preview-grid">
                {files.map((file, index) => (
                  <div key={index} className="pr-preview-card">
                    <img
                      src={URL.createObjectURL(file)}
                      alt="preview"
                    />
                    <button
                      type="button"
                      className="pr-remove-btn"
                      onClick={() => removeFile(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div className="pr-modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              disabled={uploading}
              onClick={() => onClose(false)}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  Uploading...
                </>
              ) : (
                `Upload ${files.length || ""} Images`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ImageUploadModal;