import React, { useEffect, useMemo, useState } from "react";
import api from "../../configs/axios";
import toast from "react-hot-toast";
import "./QueryModal.css";

const QueryModal = ({ isOpen, onClose, query }) => {
  const [reply, setReply] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const q = useMemo(() => query || {}, [query]);
  const hasReply = Boolean(String(q?.reply || "").trim());

  useEffect(() => {
    if (isOpen) setReply(String(q?.reply || ""));
  }, [isOpen, q?._id, q?.reply]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = reply.trim();
    if (!text) return toast.error("Please write a reply");

    try {
      setSubmitting(true);
      const { data } = await api.put("/api/admin/query/reply", {
        queryId: q._id,
        reply: text,
      });

      if (data?.success) {
        toast.success("Reply sent successfully");
        onClose(true); 
      } else {
        toast.error(data?.message || "Failed to send reply");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={() => !submitting && onClose(false)}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Reply to {q.name}</h3>
          <button 
            type="button" 
            className="modal-close" 
            onClick={() => onClose(false)} 
            disabled={submitting}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="modal-body">
          <div className="info-section">
            <span className="info-label">Original Message</span>
            <div className="message-box">{q?.message || "-"}</div>
          </div>

          <form className="modal-form" onSubmit={handleSubmit}>
            <div className="info-section">
              <label className="info-label" htmlFor="reply-text">Your Reply</label>
              <textarea
                id="reply-text"
                className="modal-textarea"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type your response to the investor..."
                disabled={submitting}
              />
            </div>

            {hasReply && (
              <p className="overwrite-warning">
                <i className="fa-solid fa-circle-exclamation"></i>
                This query already has a reply. Submitting will overwrite it.
              </p>
            )}

            <div className="modal-footer">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => onClose(false)}
                disabled={submitting}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn-submit"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-paper-plane"></i>
                    <span>Send Reply</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QueryModal;