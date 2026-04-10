import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../configs/axios";
import "./UserFundingRequests.css";

const UserFundingRequests = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [fundingRequests, setFundingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    if (userId) fetchFundingRequests();
  }, [userId]);

  const getStatusConfig = (status) => {
    const config = {
      under_review: { class: "status-pending", label: "Under Review", icon: "fa-clock" },
      approved: { class: "status-approved", label: "Approved", icon: "fa-circle-check" },
      rejected: { class: "status-rejected", label: "Rejected", icon: "fa-circle-xmark" },
    };
    return config[status] || config["under_review"];
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="ufr-loader-container">
        <div className="ufr-spinner"></div>
        <p>Syncing your financial requests...</p>
      </div>
    );
  }

  return (
    <div className="ufr-container">
      <header className="ufr-header">
        <div className="ufr-header-text">
          <h1 className="ufr-title">My Funding Dashboard</h1>
          <p className="ufr-subtitle">Monitor and manage your capital applications in real-time.</p>
        </div>
      </header>

      <main className="ufr-content">
        {error && (
          <div className="ufr-error-card">
            <i className="fas fa-exclamation-triangle"></i>
            <p>{error}</p>
          </div>
        )}

        {fundingRequests.length === 0 && !error ? (
          <div className="ufr-empty-state">
            <div className="ufr-empty-icon">
              <i className="fas fa-folder-open"></i>
            </div>
            <h2>No requests found</h2>
            <p>You haven't submitted any funding applications yet.</p>
            <button className="ufr-empty-btn" onClick={() => navigate("/funding?type=startup")}>
              Get Started
            </button>
          </div>
        ) : (
          <div className="ufr-grid">
            {fundingRequests.map((request) => {
              const status = getStatusConfig(request.status);
              return (
                <article key={request._id} className="ufr-card">
                  <div className="ufr-card-header">
                    <span className="ufr-date">
                      <i className="far fa-calendar-alt"></i> {formatDate(request.createdAt)}
                    </span>
                    <div className={`ufr-badge ${status.class}`}>
                      <i className={`fas ${status.icon}`}></i> {status.label}
                    </div>
                  </div>

                  <div className="ufr-card-body">
                    <div className="ufr-main-info">
                      <div className="ufr-info-group">
                        <label>Requested Capital</label>
                        <h3>{formatCurrency(request.amount)}</h3>
                      </div>
                      <div className="ufr-info-group">
                        <label>Tenure</label>
                        <p>{request.tenureMonths || request.tenure} Months</p>
                      </div>
                    </div>

                    <div className="ufr-purpose">
                      <label>Purpose</label>
                      <p>{request.purpose || "Business Expansion"}</p>
                    </div>

                    {/* Conditional Review Sections */}
                    {request.status === "approved" && request.adminReview && (
                      <div className="ufr-review-box approved">
                        <div className="review-header">
                          <i className="fas fa-file-invoice-dollar"></i> Approval Summary
                        </div>
                        <div className="review-grid">
                          <div className="review-item">
                            <span>Approved Amt</span>
                            <strong>{formatCurrency(request.adminReview.approvedAmount)}</strong>
                          </div>
                          <div className="review-item">
                            <span>Interest Rate</span>
                            <strong>{request.adminReview.interestRate}% p.a.</strong>
                          </div>
                        </div>
                        <button className="ufr-action-btn">
                          <i className="fas fa-download"></i> Download Agreement
                        </button>
                      </div>
                    )}

                    {request.status === "rejected" && (
                      <div className="ufr-review-box rejected">
                        <div className="review-header">
                          <i className="fas fa-circle-info"></i> Feedback
                        </div>
                        <p>{request.adminReview?.rejectionReason || "Incomplete documentation or eligibility criteria not met."}</p>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default UserFundingRequests;