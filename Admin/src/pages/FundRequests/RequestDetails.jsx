import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./RequestDetails.css";
import api from "../../configs/axios";
import toast from "react-hot-toast";
import { formatCurrency } from "../../utils/utility";

const RequestDetails = () => {
  const { requestId } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [amountAlloted, setAmountAlloted] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const navigate = useNavigate();

  const fetchRequestDetails = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/api/admin/fund-requests/${requestId}`);
      if (data?.success) {
        setRequest(data.data);
        setAmountAlloted(data.data.amountAlloted?.toString() || "");
        setRejectionReason(data.data.rejectionReason || "");
      } else {
        toast.error("Failed to load request details");
        navigate("/fund-requests");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      navigate("/fund-requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (requestId) fetchRequestDetails();
  }, [requestId]);

  const handleStatusUpdate = async (status) => {
    if (status === "rejected" && !rejectionReason) {
      return toast.error("Please provide a rejection reason");
    }
    try {
      const updateData = { id: request._id, type: request.type, status, rejectionReason };
      const { data } = await api.post("/api/admin/fund-requests/update-status", updateData);
      if (data?.success) {
        toast.success(`Request ${status} successfully`);
        setRequest(prev => ({ ...prev, status, rejectionReason }));
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleFundAllocation = async () => {
    try {
      const updateData = { id: request._id, type: request.type, amountAlloted: parseFloat(amountAlloted) };
      const { data } = await api.post("/api/admin/fund-requests/update-status", updateData);
      if (data?.success) {
        toast.success("Funds allocated successfully");
        setRequest(prev => ({ ...prev, amountAlloted: parseFloat(amountAlloted) }));
      }
    } catch (error) {
      toast.error("Allocation failed");
    }
  };

  if (loading) return <div className="rd-container"><div className="rd-loading-state">Loading detailed information...</div></div>;
  if (!request) return <div className="rd-container">Request Not Found</div>;

  return (
    <div className="rd-container">
      <div className="rd-top-nav">
        <button className="rd-back-btn" onClick={() => navigate("/fund-requests")}>
          <i className="fas fa-arrow-left"></i> Back to Requests
        </button>
      </div>

      <div className="rd-layout">
        <div className="rd-main-content">
          {/* HEADER CARD */}
          <div className="rd-card">
            <div className="rd-card-header">
              <div>
                <span className={`rd-type-tag type-${request.type}`}>{request.type.replace('_', ' ')}</span>
                <h1 className="rd-title">{request.name || "Real Estate Project"}</h1>
                <p className="rd-subtitle">{request.requester?.fullName} • {request.requester?.email}</p>
              </div>
              <div className={`rd-status-pill status-${request.status}`}>{request.status}</div>
            </div>

            <div className="rd-stats-grid">
              <div className="rd-stat-box">
                <label>Amount Requested</label>
                <div className="rd-stat-value primary">{formatCurrency(request.amountRequested)}</div>
              </div>
              <div className="rd-stat-box">
                <label>Amount Allocated</label>
                <div className="rd-stat-value secondary">{formatCurrency(request.amountAlloted || 0)}</div>
              </div>
            </div>

            {/* CONDITIONAL SECTIONS BASED ON SCHEMA */}
            
            {/* 1. CORE DETAILS */}
            <div className="rd-info-section">
              <h3 className="rd-section-title">Core Information</h3>
              <div className="rd-details-list">
                <div className="rd-detail-row">
                  <span className="rd-label">Industry/Sector:</span>
                  <span className="rd-value">{request.industry || request.sector || "Real Estate"}</span>
                </div>
                {request.stage && (
                  <div className="rd-detail-row">
                    <span className="rd-label">Current Stage:</span>
                    <span className="rd-value" style={{textTransform: 'uppercase'}}>{request.stage}</span>
                  </div>
                )}
                {request.fundingType && (
                  <div className="rd-detail-row">
                    <span className="rd-label">Funding Type:</span>
                    <span className="rd-value">{request.fundingType}</span>
                  </div>
                )}
                {request.location && (
                  <div className="rd-detail-row">
                    <span className="rd-label">Location:</span>
                    <span className="rd-value">{request.location.city}, {request.location.state}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 2. DESCRIPTION */}
            <div className="rd-info-section">
              <h3 className="rd-section-title">Description & Business Model</h3>
              <p className="rd-description-text">{request.description}</p>
              {request.businessModel && typeof request.businessModel === 'object' && (
                <div className="rd-sub-details">
                  <p><strong>Problem:</strong> {request.businessModel.problemDescription}</p>
                  <p><strong>Solution:</strong> {request.businessModel.solutionDescription}</p>
                </div>
              )}
            </div>

            {/* 3. TEAM / PARTNERS */}
            {(request.foundingTeam?.length > 0 || request.businessPartners?.length > 0) && (
              <div className="rd-info-section">
                <h3 className="rd-section-title">Team & Stakeholders</h3>
                <table className="rd-mini-table">
                  <thead>
                    <tr><th>Name</th><th>Role</th><th>Stake/Share</th></tr>
                  </thead>
                  <tbody>
                    {(request.foundingTeam || request.businessPartners).map((member, i) => (
                      <tr key={i}>
                        <td>{member.name}</td>
                        <td>{member.role}</td>
                        <td>{member.equityStake || member.share}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* 4. DOCUMENTS SECTION */}
            {request.documents && (
              <div className="rd-info-section">
                <h3 className="rd-section-title">Attached Documents</h3>
                <div className="rd-doc-grid">
                  {Object.entries(request.documents).map(([key, doc]) => (
                    doc?.url && (
                      <a key={key} href={doc.url} target="_blank" rel="noreferrer" className="rd-doc-link">
                        <i className="fas fa-file-pdf"></i>
                        <span>{key.replace(/([A-Z])/g, ' $1')}</span>
                      </a>
                    )
                  ))}
                </div>
              </div>
            )}

            {/* 5. RISK DISCLOSURE */}
            {request.riskDisclosure && (
              <div className="rd-info-section">
                <h3 className="rd-section-title">Risk Disclosure</h3>
                <div className="rd-risk-container">
                  {Object.entries(request.riskDisclosure).map(([key, value]) => (
                    <div key={key} className="rd-risk-item">
                      <strong>{key.replace(/([A-Z])/g, ' $1')}:</strong> {value}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SIDEBAR ACTIONS */}
        <div className="rd-sidebar">
          <div className="rd-action-card">
            <h3>Management Actions</h3>
            
            {request.status === 'pending' && (
              <div className="rd-input-group">
                <label>Allocation Amount</label>
                <input 
                  type="number" 
                  className="rd-input" 
                  value={amountAlloted} 
                  onChange={(e) => setAmountAlloted(e.target.value)}
                />
                <button className="rd-btn-primary" onClick={handleFundAllocation}>Update Allocation</button>
              </div>
            )}

            <div className="rd-input-group" style={{marginTop: '20px'}}>
              <label>Rejection Reason (if applicable)</label>
              <textarea 
                className="rd-input" 
                value={rejectionReason} 
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Why is this being rejected?"
              />
            </div>

            <div className="rd-button-group">
              <button className="rd-btn-success" onClick={() => handleStatusUpdate('approved')}>Approve Request</button>
              <button className="rd-btn-danger" onClick={() => handleStatusUpdate('rejected')}>Reject Request</button>
            </div>
          </div>

          <div className="rd-action-card history">
            <h3>Internal Details</h3>
            <p><strong>Created:</strong> {new Date(request.createdAt).toLocaleString()}</p>
            <p><strong>Last Update:</strong> {new Date(request.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetails;