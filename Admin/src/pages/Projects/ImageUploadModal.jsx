import { useState } from "react";
import api from "../../configs/axios";
import toast from "react-hot-toast";

const ImageUploadModal = ({ isOpen, onClose, projectId }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

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
    <div className="pr-modal-overlay">
      <div className="pr-modal-dialog">
        <div className="pr-modal-content">
          <form onSubmit={handleUpload}>
            <div className="pr-modal-header">
              <h5>Upload Project Images</h5>
              <button
                type="button"
                className="pr-modal-close"
                onClick={() => onClose(false)}
              >
                ×
              </button>
            </div>

            <div className="pr-modal-body">
              <label className="pr-label">Select Images</label>
              <input
                type="file"
                multiple
                className="pr-input pr-file-input"
                onChange={handleFileChange}
              />
            </div>

            <div className="pr-modal-footer">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    <span>Uploading...</span>
                  </>
                ) : (
                  "Upload"
                )}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                disabled={uploading}
                onClick={() => onClose(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadModal;
