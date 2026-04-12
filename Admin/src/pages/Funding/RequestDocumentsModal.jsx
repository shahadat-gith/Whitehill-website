import React, { useState } from "react";
import api from "../../configs/axios";
import toast from "react-hot-toast";
import "./RequestDocumentsModal.css";

const RequestDocumentsModal = ({ fundingId, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      toast.error("Please enter a message");
      return;
    }

    try {
      setLoading(true);

      const { data: res } = await api.post(
        "/api/admin/funding/request-documents",
        {
          fundingId,
          message: trimmedMessage, // ✅ cleaned input
        }
      );

      if (res.success) {
        toast.success("Document request sent successfully!");
        onSuccess();
      } else {
        toast.error(res.message || "Failed to send request");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rdm-overlay">
      <div className="rdm-modal">
        {/* Header */}
        <div className="rdm-header">
          <h3>
            <i className="fa-solid fa-file-upload"></i>
            Request Additional Documents
          </h3>
          <button
            className="rdm-close"
            onClick={onClose}
            disabled={loading}
            aria-label="Close modal"
          >
            <i className="fa-solid fa-times"></i>
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="rdm-form">
          <div className="rdm-form-group">
            <label htmlFor="message">
              Message to Applicant <span className="rdm-required">*</span>
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Specify what documents or information you need..."
              rows="6"
              disabled={loading}
              required
            />
            <small>
              This message will be sent to the applicant explaining what documents are needed.
            </small>
          </div>

          {/* Footer */}
          <div className="rdm-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-send"></i>
                  <span>Send Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestDocumentsModal;