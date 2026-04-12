import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../configs/axios";
import "./UserFundingRequests.css";
import ExtraDocumentUploadModal from "./ExtraDocumentUploadModal";
import { generateInvoicePDF } from "./generateInvoice";
import { formatCurrency,formatDate } from "../../Utils/utility";

const UserFundingRequests = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [fundingRequests, setFundingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [downloadingInvoice, setDownloadingInvoice] = useState(null);

  const fetchFundingRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/api/funding/user/${userId}`);
      setFundingRequests(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load funding requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchFundingRequests();
  }, [userId]);

  const handleDownloadInvoice = async (fundingId) => {
    try {
      setDownloadingInvoice(fundingId);
      const response = await api.get(`/api/funding/invoice/${fundingId}`);
      if (response.data.success) {
        await generateInvoicePDF(response.data.data);
      }
    } catch (error) {
      console.error("Invoice download failed:", error);
    } finally {
      setDownloadingInvoice(null);
    }
  };

  const getStatusConfig = (status) => {
    const config = {
      under_review: { class: "ufr-status-pending", label: "Under Review", icon: "fa-clock" },
      approved: { class: "ufr-status-approved", label: "Approved", icon: "fa-check-circle" },
      rejected: { class: "ufr-status-rejected", label: "Rejected", icon: "fa-times-circle" },
    };
    return config[status] || config["under_review"];
  };

  
  if (loading)
    return (
      <div className="ufr-loading-screen">
        <div className="ufr-loader"></div>
        <p>Loading funding status...</p>
      </div>
    );

  return (
    <div className="ufr-page">
      <div className="ufr-header-simple">
        <h1 className="ufr-title">Funding Dashboard</h1>
        <p className="ufr-subtitle">Monitor your funding lifecycle and active disbursements.</p>
      </div>

      <div className="ufr-list-container">
        {fundingRequests.length === 0 ? (
          <div className="ufr-empty-box">
            <i className="fas fa-folder-open"></i>
            <p>No active funding applications found.</p>
          </div>
        ) : (
          fundingRequests.map((request) => {
            const status = getStatusConfig(request.status);
            const isPaid = request.status === "approved" && request.payment;

            return (
              <div key={request._id} className="ufr-card">
                {/* Status Ribbon/Badge */}
                <div className={`ufr-card-status-bar ${status.class}`}>
                  <i className={`fas ${status.icon}`}></i> {status.label}
                </div>

                <div className="ufr-card-content">
                  <div className="ufr-data-grid">
                    {/* Key:Value Pairs */}
                    <div className="ufr-data-item">
                      <label>Submission Date</label>
                      <span className="ufr-date">{formatDate(request.createdAt)}</span>
                    </div>

                    <div className="ufr-data-item">
                      <label>Requested Amount</label>
                      <span className="ufr-amount">{formatCurrency(request.amount)}</span>
                    </div>

                    <div className="ufr-data-item">
                      <label>Reference ID</label>
                      <span className="ufr-ref-id">#{request._id.slice(-8).toUpperCase()}</span>
                    </div>
                  </div>

                  {/* Approved Stats Section */}
                  {request.status === "approved" && (
                    <div className="ufr-approval-panel">
                      <div className="ufr-approval-stat">
                        <label>Approved Principal</label>
                        <span className="ufr-approved-amt">{formatCurrency(request.approvedAmount)}</span>
                      </div>
                      <div className="ufr-approval-stat">
                        <label>Annual Interest</label>
                        <span className="ufr-interest">{request.interestRate}% APR</span>
                      </div>
                      <div className="ufr-approval-actions">
                        <button
                          className={`ufr-action-btn ${!isPaid ? "ufr-btn-disabled" : "ufr-btn-download"}`}
                          onClick={() => isPaid && handleDownloadInvoice(request._id)}
                          disabled={downloadingInvoice === request._id || !isPaid}
                          title={!isPaid ? "Processing Disbursement" : "Download Invoice"}
                        >
                          {downloadingInvoice === request._id ? (
                            <i className="fas fa-circle-notch fa-spin"></i>
                          ) : !isPaid ? (
                            <i className="fas fa-hourglass-half"></i>
                          ) : (
                            <i className="fas fa-file-invoice-dollar"></i>
                          )}
                          <span>{!isPaid ? "Settling Funds" : "Download Invoice"}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Review Mode Text */}
                  {request.status === "under_review" && !request.pendingRequests?.length && (
                    <div className="ufr-info-msg">
                      <i className="fas fa-shield-alt"></i>
                      <span>Your application is currently being verified by our compliance team.</span>
                    </div>
                  )}

                  {/* Expandable Alerts (Rejection/Document Requests) */}
                  {(request.pendingRequests?.length > 0 || request.status === "rejected") && (
                    <div className="ufr-alert-section">
                      {request.status === "rejected" && (
                        <div className="ufr-rejection-msg">
                          <i className="fas fa-exclamation-circle"></i>
                          <div>
                            <strong>Application Rejected:</strong> {request.rejectionReason}
                          </div>
                        </div>
                      )}

                      {request.pendingRequests?.map((req) => (
                        <div key={req._id} className="ufr-doc-alert">
                          <div className="ufr-doc-info">
                            <i className="fas fa-file-signature"></i>
                            <p><strong>Compliance Action:</strong> {req.message}</p>
                          </div>
                          <button
                            className="ufr-upload-btn"
                            onClick={() => {
                              setSelectedRequest({ fundingId: request._id, requestId: req._id });
                              setShowUploadModal(true);
                            }}
                          >
                            Upload Docs
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {showUploadModal && selectedRequest && (
        <ExtraDocumentUploadModal
          fundingId={selectedRequest.fundingId}
          requestId={selectedRequest.requestId}
          onClose={() => setShowUploadModal(false)}
          onSuccess={() => {
            setShowUploadModal(false);
            fetchFundingRequests();
          }}
        />
      )}
    </div>
  );
};

export default UserFundingRequests;