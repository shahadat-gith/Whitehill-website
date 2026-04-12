import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../configs/axios";
import toast from "react-hot-toast";
import "./ApproveFunding.css";
import { formatCurrency, formatDate } from "../../utils/utility";
import RequestDocumentsModal from "./RequestDocumentsModal";

const ApproveFunding = () => {
  const { fundingId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [data, setData] = useState(null);
  const [showRequestDocumentsModal, setShowRequestDocumentsModal] = useState(false);

  const [approvalData, setApprovalData] = useState({
    approvedAmount: "",
    interestRate: "",
    notes: "",
  });

  const [rejectionData, setRejectionData] = useState({
    rejectionReason: "",
    notes: "",
  });

  const fetchDetails = useCallback(async () => {
    try {
      setLoading(true);
      const { data: res } = await api.get(`/api/admin/funding/${fundingId}`);
      if (res.success) setData(res.data);
      else toast.error(res.message || "Failed to load funding details");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [fundingId]);

  useEffect(() => {
    if (fundingId) fetchDetails();
  }, [fundingId, fetchDetails]);

  // ✅ UPDATED
  const handleApprove = async () => {
    if (approvalData.approvedAmount === "" || approvalData.interestRate === "") {
      return toast.error("Please fill in approved amount and interest rate");
    }

    try {
      setVerifying(true);

      const { data: res } = await api.post(`/api/admin/funding/verify`, {
        fundingId,
        status: "approved", // ✅ FIXED
        approvedAmount: Number(approvalData.approvedAmount),
        interestRate: Number(approvalData.interestRate),
        notes: approvalData.notes,
      });

      if (res.success) {
        toast.success("Funding approved successfully");
        navigate("/funding");
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setVerifying(false);
    }
  };

  // ✅ UPDATED
  const handleReject = async () => {
    if (!rejectionData.rejectionReason.trim()) {
      return toast.error("Please provide a rejection reason");
    }

    try {
      setVerifying(true);

      const { data: res } = await api.post(`/api/admin/funding/verify`, {
        fundingId,
        status: "rejected", // ✅ FIXED
        rejectionReason: rejectionData.rejectionReason,
        notes: rejectionData.notes,
      });

      if (res.success) {
        toast.success("Funding rejected");
        navigate("/funding");
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setVerifying(false);
    }
  };

  if (loading)
    return (
      <div className="af-loading">
        <i className="fa-solid fa-spinner fa-spin"></i>
      </div>
    );

  if (!data) return null;

  return (
    <div className="af-container">
      <header className="af-header">
        <button className="btn-ghost" onClick={() => navigate(-1)}>
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <div className="af-header-title">
          <h2>Review Funding Request</h2>
          <span>ID: {fundingId}</span>
        </div>
      </header>

      <div className="af-grid-single">
        <div className="af-approval-container">
          <section className="af-card">
            <div className="af-card-title">
              <i className="fa-solid fa-circle-info"></i>
              <h3>Request Summary</h3>
            </div>

            <div className="af-status-info">
              <div className="af-info-item">
                <label>Current Status </label>
                <span className={`af-status af-status-${data.status}`}>
                  {data.status?.replace("_", " ").toUpperCase()}
                </span>
              </div>

              <div className="af-info-item">
                <label>Requested Amount</label>
                <p className="af-amount">
                  {formatCurrency(data.fundDetails?.amount)}
                </p>
              </div>
            </div>
          </section>

          {data.status === "under_review" && (
            <section className="af-card">
              <div className="af-card-title">
                <i className="fa-solid fa-shield-check"></i>
                <h3>Verification Actions</h3>
              </div>

              <div className="af-approval-section">
                {/* APPROVE */}
                <div className="af-approve-form">
                  <h4>
                    <i className="fa-solid fa-circle-check"></i> Approve Request
                  </h4>

                  <div className="af-form-group">
                    <label>Approved Amount (INR)</label>
                    <input
                      type="number"
                      value={approvalData.approvedAmount}
                      onChange={(e) =>
                        setApprovalData({
                          ...approvalData,
                          approvedAmount: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="af-form-group">
                    <label>Interest Rate (% p.a.)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={approvalData.interestRate}
                      onChange={(e) =>
                        setApprovalData({
                          ...approvalData,
                          interestRate: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="af-form-group">
                    <label>Internal Notes</label>
                    <textarea
                      value={approvalData.notes}
                      onChange={(e) =>
                        setApprovalData({
                          ...approvalData,
                          notes: e.target.value,
                        })
                      }
                    />
                  </div>

                  <button
                    className="btn btn-primary btn-block"
                    onClick={handleApprove}
                    disabled={verifying}
                  >
                    {verifying ? "Processing..." : "Confirm Approval"}
                  </button>
                </div>

                {/* REJECT */}
                <div className="af-reject-form">
                  <h4>
                    <i className="fa-solid fa-circle-xmark"></i> Reject Request
                  </h4>

                  <div className="af-form-group">
                    <label>Rejection Reason</label>
                    <textarea
                      value={rejectionData.rejectionReason}
                      onChange={(e) =>
                        setRejectionData({
                          ...rejectionData,
                          rejectionReason: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="af-form-group">
                    <label>Private Notes</label>
                    <textarea
                      value={rejectionData.notes}
                      onChange={(e) =>
                        setRejectionData({
                          ...rejectionData,
                          notes: e.target.value,
                        })
                      }
                    />
                  </div>

                  <button
                    className="btn btn-danger btn-block"
                    onClick={handleReject}
                    disabled={verifying}
                  >
                    {verifying ? "Processing..." : "Confirm Rejection"}
                  </button>
                </div>
              </div>

              <div className="af-utility-actions">
                <button
                  className="btn btn-secondary btn-block"
                  onClick={() => setShowRequestDocumentsModal(true)}
                >
                  <i className="fa-solid fa-file-export"></i> Request Additional
                  Documents
                </button>
              </div>
            </section>
          )}
        </div>

        <div className="af-documents-container">
          {data.verification?.extraRequests?.length > 0 && (
            <div className="af-card">
              <div className="af-card-title">
                <i className="fa-solid fa-clock-rotate-left"></i>
                <h3>Document Requests</h3>
              </div>

              <div className="af-requests-list">
                {data.verification.extraRequests.map((req, i) => (
                  <div key={req._id || i} className="af-request-item">
                    <div className="af-request-header">
                      <span className={`af-request-badge af-request-badge-${req.status}`}>
                        {req.status === "pending" ? "Pending" : "Submitted"}
                      </span>
                      <span className="af-request-date">
                        {formatDate(req.requestedAt)}
                      </span>
                    </div>
                    <p className="af-request-message">{req.message}</p>
                    {req.status === "submitted" && req.files && req.files.length > 0 && (
                      <div className="af-request-files">
                        <h5>Uploaded Documents:</h5>
                        <div className="af-files-list">
                          {req.files.map((file, fileIndex) => (
                            <div key={fileIndex} className="af-file-item">
                              <i className="fa-solid fa-file"></i>
                              <a
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="af-file-link"
                              >
                                {file.originalName || `Document ${fileIndex + 1}`}
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="af-card">
            <div className="af-card-title">
              <i className="fa-solid fa-list-ul"></i>
              <h3>Audit Trail</h3>
            </div>

            <div className="af-timeline">
              <div className="af-timeline-item">
                <div className="af-timeline-dot"></div>
                <div className="af-timeline-title">
                  Application Created
                </div>
                <div className="af-timeline-date">
                  {formatDate(data.createdAt)}
                </div>
              </div>

              {data.verification?.reviewedAt && (
                <div className="af-timeline-item">
                  <div className="af-timeline-dot"></div>
                  <div className="af-timeline-title">
                    Last Review Update
                  </div>
                  <div className="af-timeline-date">
                    {formatDate(data.verification.reviewedAt)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showRequestDocumentsModal && (
        <RequestDocumentsModal
          fundingId={fundingId}
          onClose={() => setShowRequestDocumentsModal(false)}
          onSuccess={() => {
            setShowRequestDocumentsModal(false);
            fetchDetails();
          }}
        />
      )}
    </div>
  );
};

export default ApproveFunding;