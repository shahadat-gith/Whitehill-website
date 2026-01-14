import React, { useEffect, useMemo, useState } from "react";
import api from "../../configs/axios";
import toast from "react-hot-toast";
import "./StatusUpdateModal.css";

const StatusUpdateModal = ({
  isOpen,
  onClose,
  investmentId,
  email,
  currentStatus = "pending",
}) => {
  const [status, setStatus] = useState(currentStatus || "pending");
  const [cancelReason, setCancelReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isCancelled = useMemo(
    () => String(status).toLowerCase() === "cancelled",
    [status]
  );

  useEffect(() => {
    if (!isOpen) return;
    setStatus(currentStatus || "pending");
    setCancelReason("");
  }, [isOpen, currentStatus]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!investmentId) {
      toast.error("Investment ID missing");
      return;
    }

    if (!status) {
      toast.error("Please select a status");
      return;
    }

    if (isCancelled && !cancelReason.trim()) {
      toast.error("Please provide a cancellation reason");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        investmentId,
        status,
      };

      if (isCancelled) payload.cancelReason = cancelReason.trim();

      const { data } = await api.post("/api/admin/investment/update-status", payload);

      if (data.success) {
        toast.success("Status updated successfully");
        onClose(true); // refresh parent
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="sum-overlay" role="dialog" aria-modal="true">
      <div className="sum-dialog">
        <div className="sum-card">
          <div className="sum-header">
            <div>
              <h5 className="sum-title">Update Investment Status</h5>
              <p className="sum-subtitle">
                Investment: <span className="sum-mono">{investmentId}</span>
              </p>
            </div>

            <button
              type="button"
              className="sum-close"
              onClick={() => onClose(false)}
              disabled={submitting}
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="sum-body">
              <div className="sum-field">
                <label className="sum-label">Status</label>
                <select
                  className="sum-input"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  disabled={submitting}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <div className="sum-hint">
                  Choose <b>Cancelled</b> only if you want to stop this investment.
                </div>
              </div>

              {isCancelled && (
                <div className="sum-field">
                  <label className="sum-label">Cancellation Reason</label>
                  <textarea
                    className="sum-input sum-textarea"
                    rows={4}
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Write the reason for cancellation..."
                    disabled={submitting}
                  />
                </div>
              )}

              <div className="sum-info">
                <i className="fa-solid fa-envelope"></i>
                <span> An email will be sent to the investor{" "}(<span className="sum-mono">{email}</span>) </span>
              </div>
            </div>

            <div className="sum-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => onClose(false)}
                disabled={submitting}
              >
                Cancel
              </button>

              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-floppy-disk"></i>
                    <span>Update Status</span>
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

export default StatusUpdateModal;
