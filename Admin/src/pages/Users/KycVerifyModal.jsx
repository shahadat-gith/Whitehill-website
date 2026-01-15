import React, { useEffect, useMemo, useState } from "react";
import api from "../../configs/axios";
import toast from "react-hot-toast";
import "./KycVerifyModal.css";

const KycVerifyModal = ({ isOpen, onClose, userId, email, currentStatus }) => {
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("verified");
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setStatus("verified");
    setReason("");
  }, [isOpen]);

  const isReject = useMemo(() => String(status).toLowerCase() === "rejected", [status]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return toast.error("User ID missing");

    if (isReject && !reason.trim()) {
      return toast.error("Rejection reason is required");
    }

    try {
      setSubmitting(true);

      const { data } = await api.post("/api/admin/user/kyc/verify", {
        userId,
        status,
        rejectionReason: isReject ? reason.trim() : undefined,
      });

      if (data?.success) {
        toast.success(data.message || "KYC updated");
        onClose(true);
      } else {
        toast.error(data?.message || "Failed to update KYC");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update KYC");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="km-overlay" role="dialog" aria-modal="true">
      <div className="km-dialog">
        <div className="km-content">
          <div className="km-header">
            <div>
              <h5>KYC Verification</h5>
              <p className="km-sub">
                Current: <span className="km-pill">{String(currentStatus || "pending").toUpperCase()}</span>
              </p>
            </div>

            <button type="button" className="km-close" onClick={() => onClose(false)} disabled={submitting}>
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="km-body">
              <div className="km-grid">
                <div className="km-field">
                  <label>Action</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)} disabled={submitting}>
                    <option value="verified">Verify</option>
                    <option value="rejected">Reject</option>
                  </select>
                </div>

                <div className="km-field">
                  <label>User Email</label>
                  <input value={email || ""} disabled placeholder="No email available" />
                </div>

                {isReject ? (
                  <div className="km-field km-span-2">
                    <label>Rejection Reason</label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows={3}
                      placeholder="Write the reason for rejection..."
                      disabled={submitting}
                    />
                  </div>
                ) : (
                  <div className="km-note km-span-2">
                    <i className="fa-solid fa-circle-info"></i>
                    <span>
                      Verifying will mark the user’s KYC as <b>VERIFIED</b> and notify them via email.
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="km-footer">
              <button type="button" className="btn btn-secondary" onClick={() => onClose(false)} disabled={submitting}>
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
                    <i className="fa-solid fa-shield-halved"></i>
                    <span>Update KYC</span>
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

export default KycVerifyModal;
