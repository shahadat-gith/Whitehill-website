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
  const [status, setStatus] = useState(currentStatus);
  const [cancelReason, setCancelReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isCancelled = useMemo(
    () => status === "cancelled",
    [status]
  );

  useEffect(() => {
    if (!isOpen) return;
    setStatus(currentStatus);
    setCancelReason("");
  }, [isOpen, currentStatus]);

  /* ESC close */
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose(false);
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, []);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!investmentId) return toast.error("Investment ID missing");

    if (isCancelled && !cancelReason.trim()) {
      return toast.error("Cancellation reason required");
    }

    try {
      setSubmitting(true);

      const payload = {
        investmentId,
        status,
        ...(isCancelled && { cancelReason: cancelReason.trim() }),
      };

      const { data } = await api.post(
        "/api/admin/investment/update-status",
        payload
      );

      if (data.success) {
        toast.success("Status updated");
        onClose(true);
      } else {
        toast.error(data.message || "Failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setSubmitting(false);
    }
  };

  const STATUS_OPTIONS = [
    { key: "pending", label: "Pending" },
    { key: "confirmed", label: "Confirmed" },
    { key: "completed", label: "Completed" },
    { key: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="sum-overlay" onClick={() => onClose(false)}>
      <div className="sum-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="sum-card">

          {/* HEADER */}
          <div className="sum-header">
            <div>
              <h5>Update Investment Status</h5>
              <p className="sum-subtitle">
                ID: <span className="sum-mono">{investmentId}</span>
              </p>
            </div>

            <button className="sum-close" onClick={() => onClose(false)}>
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="sum-body">

              {/* STATUS SELECTOR 🔥 */}
              <div className="sum-status-grid">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    className={`sum-status-btn ${status === opt.key ? "active" : ""} ${opt.key}`}
                    onClick={() => setStatus(opt.key)}
                    disabled={submitting}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* CANCEL REASON */}
              {isCancelled && (
                <div className="sum-field danger">
                  <label>Cancellation Reason</label>
                  <textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Explain why this investment is cancelled..."
                    disabled={submitting}
                  />
                </div>
              )}

              {/* INFO */}
              <div className="sum-info">
                <i className="fa-solid fa-envelope"></i>
                <span>
                  User will be notified via email ({email})
                </span>
              </div>
            </div>

            {/* FOOTER */}
            <div className="sum-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => onClose(false)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className={`btn ${isCancelled ? "btn-secondary" : "btn-primary"}`}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    Updating...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-floppy-disk"></i>
                    Update Status
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