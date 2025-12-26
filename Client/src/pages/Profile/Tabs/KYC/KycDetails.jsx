import React, { useState } from "react";
import { formatDate, getStatusColor } from "../../utility";
import DocumentPreviewModal from "../../Modals/DocumentPreviewModal/DocumentPreviewModal";
import KycModal from "../../Modals/KycModal/KycModal";
import "./KycDetails.css"

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
      <div className="prf-tab-content">
        <div className="prf-section-header">
          <h2>KYC Details</h2>
          <span className="prf-badge prf-badge-pending">Not Submitted</span>
        </div>

        <div className="prf-empty-state">
          <p>You have not submitted your KYC details yet.</p>
          <button
            className="prf-btn-primary"
            onClick={() => setShowKycModal(true)}
          >
            Submit KYC
          </button>
        </div>

        {showKycModal && (
          <KycModal
            user={user}
            onClose={() => setShowKycModal(false)}
          />
        )}
      </div>
    );
  }

  /* ================= MAIN VIEW ================= */
  return (
    <div className="prf-tab-content">
      <div className="prf-section-header">
        <h2>KYC Details</h2>
        <span className={`prf-badge ${getStatusColor(kyc.status)}`}>
          {kyc.status}
        </span>
      </div>

      {/* ================= BASIC INFO ================= */}
      <div className="prf-kyc-info">
        <div className="prf-info-card">
          <div className="prf-info-label">PAN Number</div>
          <div className="prf-info-value">
            {kyc.pan?.panNumber || "-"}
          </div>
        </div>

        <div className="prf-info-card">
          <div className="prf-info-label">Aadhaar Number</div>
          <div className="prf-info-value">
            {kyc.aadhar?.aadharNumber || "-"}
          </div>
        </div>

        <div className="prf-info-card">
          <div className="prf-info-label">Verification Status</div>
          <div className="prf-info-value">
            {kyc.status === "Verified" ? (
              <span className="prf-status-verified">
                <i className="fas fa-check-circle"></i> Verified
              </span>
            ) : kyc.status === "Rejected" ? (
              <span className="prf-status-rejected">
                <i className="fas fa-times-circle"></i> Rejected
              </span>
            ) : (
              <span className="prf-status-pending">
                <i className="fas fa-clock"></i> Pending
              </span>
            )}
          </div>
        </div>

        <div className="prf-info-card">
          <div className="prf-info-label">Verified Date</div>
          <div className="prf-info-value">
            {kyc.verifiedAt ? formatDate(kyc.verifiedAt) : "Not verified"}
          </div>
        </div>
      </div>

      {/* ================= DOCUMENTS ================= */}
      <div className="prf-document-section">
        <h3>Uploaded Documents</h3>

        <div className="prf-document-list">
          {/* PAN FRONT IMAGE */}
          {kyc.pan?.frontImageUrl?.url && (
            <div className="prf-document-item">
              <div className="prf-document-icon">
                <i className="fas fa-id-card"></i>
              </div>
              <div className="prf-document-info">
                <p className="prf-document-name">PAN Card</p>
                <p className="prf-document-status">Front Image</p>
              </div>
              <button
                className="prf-btn-view"
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
              <div className="prf-document-item">
                <div className="prf-document-icon">
                  <i className="fas fa-id-card"></i>
                </div>
                <div className="prf-document-info">
                  <p className="prf-document-name">Aadhaar Card</p>
                  <p className="prf-document-status">
                    Front & Back Images
                  </p>
                </div>
                <div className="prf-document-actions">
                  <button
                    className="prf-btn-view"
                    onClick={() =>
                      openPreview(kyc.aadhar.frontImageUrl.url)
                    }
                  >
                    Front
                  </button>
                  <button
                    className="prf-btn-view"
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
        <div className="prf-form-actions">
          <button
            className="prf-btn-primary"
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
        <KycModal
          user={user}
          onClose={() => setShowKycModal(false)}
        />
      )}
    </div>
  );
};

export default KycDetails;
