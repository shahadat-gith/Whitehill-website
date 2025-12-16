import React from 'react'
import { formatDate, getStatusColor } from '../utility'

const KycDetails = ({userData}) => {
    return (
        <div className="prf-tab-content">
            <div className="prf-section-header">
                <h2>KYC Details</h2>
                <span className={`prf-badge ${getStatusColor(userData.kyc.status)}`}>
                    {userData.kyc.status}
                </span>
            </div>

            <div className="prf-kyc-info">
                <div className="prf-info-card">
                    <div className="prf-info-label">PAN Number</div>
                    <div className="prf-info-value">{userData.kyc.panNumber}</div>
                </div>
                <div className="prf-info-card">
                    <div className="prf-info-label">Address Proof Type</div>
                    <div className="prf-info-value">{userData.kyc.addressProofType}</div>
                </div>
                <div className="prf-info-card">
                    <div className="prf-info-label">Aadhaar Verification</div>
                    <div className="prf-info-value">
                        {userData.kyc.aadhaarVerified ? (
                            <span className="prf-status-verified">
                                <i className="fas fa-check-circle"></i> Verified
                            </span>
                        ) : (
                            <span className="prf-status-pending">
                                <i className="fas fa-exclamation-circle"></i> Pending
                            </span>
                        )}
                    </div>
                </div>
                <div className="prf-info-card">
                    <div className="prf-info-label">Verified Date</div>
                    <div className="prf-info-value">
                        {userData.kyc.verifiedAt ? formatDate(userData.kyc.verifiedAt) : 'Not verified'}
                    </div>
                </div>
            </div>

            <div className="prf-document-section">
                <h3>Uploaded Documents</h3>
                <div className="prf-document-list">
                    <div className="prf-document-item">
                        <div className="prf-document-icon">
                            <i className="fas fa-file-alt"></i>
                        </div>
                        <div className="prf-document-info">
                            <p className="prf-document-name">PAN Card</p>
                            <p className="prf-document-status">Uploaded & Verified</p>
                        </div>
                        <button className="prf-btn-view">
                            <i className="fas fa-eye"></i> View
                        </button>
                    </div>
                    <div className="prf-document-item">
                        <div className="prf-document-icon">
                            <i className="fas fa-file-alt"></i>
                        </div>
                        <div className="prf-document-info">
                            <p className="prf-document-name">Aadhaar Card</p>
                            <p className="prf-document-status">Uploaded & Verified</p>
                        </div>
                        <button className="prf-btn-view">
                            <i className="fas fa-eye"></i> View
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default KycDetails