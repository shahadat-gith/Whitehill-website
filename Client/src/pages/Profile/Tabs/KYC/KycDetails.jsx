import React, { useState } from "react";
import { formatDate, getStatusColor } from "../../../../Utils/utility";
import DocumentPreviewModal from "../../Modals/DocumentPreviewModal/DocumentPreviewModal";
import KycModal from "../../Modals/KycModal/KycModal";
import "./KycDetails.css";

const KycDetails = ({ user }) => {
  const kyc = user?.kyc;

  /* ================= PREVIEW MODAL ================= */
  const [preview, setPreview] = useState({
    open: false,
    url: "",
  });

  /* ================= KYC UPDATE MODAL ================= */
  const [showKycModal, setShowKycModal] = useState(false);

  const openPreview = (url) => {
    setPreview({ open: true, url });
  };

  const closePreview = () => {
    setPreview({ open: false, url: "" });
  };

  /* ================= NO KYC SUBMITTED ================= */
  if (!kyc) {
    return (
      <div className="kd-tab-content">
        <div className="kd-section-header">
          <h2>KYC Details</h2>
          <span className="kd-badge kd-badge-pending">Not Submitted</span>
        </div>

        <div className="kd-empty-state">
          <p>You have not submitted your KYC details yet.</p>
          <button
            className="kd-btn-primary"
            onClick={() => setShowKycModal(true)}
          >
            Submit KYC
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
    <div className="kd-tab-content">
      <div className="kd-section-header">
        <h2>KYC Details</h2>
        <span className={`kd-badge ${getStatusColor(kyc.status)}`}>
          {kyc.status}
        </span>
      </div>

      {/* ================= BASIC INFO ================= */}
      <div className="kd-kyc-info">
        <div className="kd-info-card">
          <div className="kd-info-label">PAN Number</div>
          <div className="kd-info-value">
            {kyc.pan?.panNumber || "-"}
          </div>
        </div>

        <div className="kd-info-card">
          <div className="kd-info-label">Aadhaar Number</div>
          <div className="kd-info-value">
            {kyc.aadhar?.aadharNumber || "-"}
          </div>
        </div>

        <div className="kd-info-card">
          <div className="kd-info-label">Verification Status</div>
          <div className="kd-info-value">
            {kyc.status === "verified" ? (
              <span className="kd-status-verified">
                <i className="fas fa-check-circle"></i> Verified
              </span>
            ) : kyc.status === "rejected" ? (
              <span className="kd-status-rejected">
                <i className="fas fa-times-circle"></i> Rejected
              </span>
            ) : (
              <span className="kd-status-pending">
                <i className="fas fa-clock"></i> Pending
              </span>
            )}
          </div>
        </div>

        <div className="kd-info-card">
          <div className="kd-info-label">Verified Date</div>
          <div className="kd-info-value">
            {kyc.verifiedAt ? formatDate(kyc.verifiedAt) : "Not verified"}
          </div>
        </div>
      </div>

      {/* ================= DOCUMENTS ================= */}
      <div className="kd-document-section">
        <h3>Uploaded Documents</h3>

        <div className="kd-document-list">
          {/* PAN FRONT IMAGE */}
          {kyc.pan?.frontImageUrl?.url && (
            <div className="kd-document-item">
              <div className="kd-document-icon">
                <i className="fas fa-id-card"></i>
              </div>
              <div className="kd-document-info">
                <p className="kd-document-name">PAN Card</p>
                <p className="kd-document-status">Front Image</p>
              </div>
              <button
                className="kd-btn-view"
                onClick={() =>
                  openPreview(kyc.pan.frontImageUrl.url)
                }
              >
                <i className="fas fa-eye"></i> View
              </button>
            </div>
          )}

          {/* AADHAAR FRONT & BACK */}
          {kyc.aadhar?.frontImageUrl?.url &&
            kyc.aadhar?.backImageUrl?.url && (
              <div className="kd-document-item">
                <div className="kd-document-icon">
                  <i className="fas fa-id-card"></i>
                </div>
                <div className="kd-document-info">
                  <p className="kd-document-name">Aadhaar Card</p>
                  <p className="kd-document-status">
                    Front & Back Images
                  </p>
                </div>
                <div className="kd-document-actions">
                  <button
                    className="kd-btn-view"
                    onClick={() =>
                      openPreview(kyc.aadhar.frontImageUrl.url)
                    }
                  >
                    Front
                  </button>
                  <button
                    className="kd-btn-view"
                    onClick={() =>
                      openPreview(kyc.aadhar.backImageUrl.url)
                    }
                  >
                    Back
                  </button>
                </div>
              </div>
            )}
        </div>
      </div>

      {/* ================= ACTION ================= */}
      {kyc.status === "Rejected" && (
        <div className="kd-form-actions">
          <button
            className="kd-btn-primary"
            onClick={() => setShowKycModal(true)}
          >
            Re-submit KYC
          </button>
        </div>
      )}

      {/* ================= PREVIEW MODAL ================= */}
      <DocumentPreviewModal
        isOpen={preview.open}
        onClose={closePreview}
        fileUrl={preview.url}
        fileType="image"
      />

      {/* ================= UPDATE KYC MODAL ================= */}
      {showKycModal && (
        <KycModal user={user} onClose={() => setShowKycModal(false)} />
      )}
    </div>
  );
};

export default KycDetails;
