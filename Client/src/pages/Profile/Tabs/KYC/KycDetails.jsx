import React, { useState } from "react";
import { formatDate } from "../../../../Utils/utility";
import DocumentPreviewModal from "../../Modals/DocumentPreviewModal/DocumentPreviewModal";
import KycModal from "../../Modals/KycModal/KycModal";
import "./KycDetails.css";

const KycDetails = ({ user }) => {
  const kyc = user?.kyc;

  /* ================= PREVIEW MODAL ================= */
  const [preview, setPreview] = useState({ open: false, url: "" });

  /* ================= KYC UPDATE MODAL ================= */
  const [showKycModal, setShowKycModal] = useState(false);

  const openPreview = (url) => setPreview({ open: true, url });
  const closePreview = () => setPreview({ open: false, url: "" });

  /* ================= NO KYC SUBMITTED ================= */
  if (!kyc) {
    return (
      <div className="kd-container">
        <div className="kd-header">
          <h2 className="kd-title">KYC Verification</h2>
          <span className="kd-badge kd-pending">Action Required</span>
        </div>

        <div className="kd-empty">
          <div className="kd-empty-icon">
            <i className="fas fa-id-card-clip"></i>
          </div>
          <h3>Verify Your Identity</h3>
          <p>Please submit your KYC details to unlock full investment capabilities.</p>
          <button className="btn btn-primary" onClick={() => setShowKycModal(true)}>
            Start Verification
          </button>
        </div>

        {showKycModal && (
          <KycModal user={user} onClose={() => setShowKycModal(false)} />
        )}
      </div>
    );
  }

  /* ================= MAIN VIEW ================= */
  return (
    <div className="kd-container">
      <div className="kd-header">
        <h2 className="kd-title">KYC Details</h2>
        <div className="kd-status-wrap">
          {kyc.status === "verified" ? (
            <span className="kd-badge kd-success"><i className="fas fa-check-circle"></i> Fully Verified</span>
          ) : kyc.status === "rejected" ? (
            <span className="kd-badge kd-error"><i className="fas fa-circle-exclamation"></i> Verification Rejected</span>
          ) : (
            <span className="kd-badge kd-warning"><i className="fas fa-clock-rotate-left"></i> Under Review</span>
          )}
        </div>
      </div>

      {/* ================= DATA GRID ================= */}
      <div className="kd-info-grid">
        <div className="kd-info-card">
          <label className="kd-label">PAN Identifier</label>
          <div className="kd-value">{kyc.pan?.panNumber || "—"}</div>
        </div>

        <div className="kd-info-card">
          <label className="kd-label">Document Number</label>
          <div className="kd-value">
            {kyc.aadhar?.aadharNumber ? `XXXX-XXXX-${kyc.aadhar.aadharNumber.slice(-4)}` : "—"}
          </div>
        </div>

        <div className="kd-info-card">
          <label className="kd-label">Submission Date</label>
          <div className="kd-value">{formatDate(kyc.createdAt || new Date())}</div>
        </div>

        <div className="kd-info-card">
          <label className="kd-label">Verification Date</label>
          <div className="kd-value">
            {kyc.verifiedAt ? formatDate(kyc.verifiedAt) : "Awaiting Review"}
          </div>
        </div>
      </div>

      {/* ================= DOCUMENTS ================= */}
      <div className="kd-doc-section">
        <h3 className="kd-section-title">Verified Documents</h3>

        <div className="kd-doc-list">
          {/* PAN CARD */}
          {kyc.pan?.frontImageUrl?.url && (
            <div className="kd-doc-item">
              <div className="kd-doc-meta">
                <div className="kd-doc-icon"><i className="fas fa-file-invoice"></i></div>
                <div>
                  <p className="kd-doc-name">PAN Card</p>
                  <p className="kd-doc-type">Primary Proof</p>
                </div>
              </div>
              <button className="btn btn-secondary" onClick={() => openPreview(kyc.pan.frontImageUrl.url)}>
                <i className="fas fa-eye"></i> View
              </button>
            </div>
          )}

          {/* SECONDARY DOC */}
          {kyc.aadhar?.frontImageUrl?.url && (
            <div className="kd-doc-item">
              <div className="kd-doc-meta">
                <div className="kd-doc-icon"><i className="fas fa-id-card"></i></div>
                <div>
                  <p className="kd-doc-name">Identity Document</p>
                  <p className="kd-doc-type">Address Proof</p>
                </div>
              </div>
              <div className="kd-btn-group">
                <button className="btn btn-secondary" onClick={() => openPreview(kyc.aadhar.frontImageUrl.url)}>
                  Front
                </button>
                <button className="btn btn-secondary" onClick={() => openPreview(kyc.aadhar.backImageUrl.url)}>
                  Back
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= RE-SUBMIT ACTION ================= */}
      {kyc.status === "rejected" && (
        <div className="kd-action-box">
          <div className="kd-alert-error">
            <i className="fas fa-circle-info"></i>
            Your verification was declined. Please check your document clarity and resubmit.
          </div>
          <button className="btn btn-primary" onClick={() => setShowKycModal(true)}>
            Resubmit Documents
          </button>
        </div>
      )}

      {/* MODALS */}
      <DocumentPreviewModal
        isOpen={preview.open}
        onClose={closePreview}
        fileUrl={preview.url}
        fileType="image"
      />

      {showKycModal && (
        <KycModal user={user} onClose={() => setShowKycModal(false)} />
      )}
    </div>
  );
};

export default KycDetails;