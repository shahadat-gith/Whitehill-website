import React from 'react'
import { formatDate } from '../utility'

function Bank({userData}) {
    return (
        <div className="prf-tab-content">
            <div className="prf-section-header">
                <h2>Bank Account Details</h2>
            </div>

            <div className="prf-bank-info">
                <div className="prf-info-card">
                    <div className="prf-info-label">Account Holder Name</div>
                    <div className="prf-info-value">{userData.bankDetails.accountHolderName}</div>
                </div>
                <div className="prf-info-card">
                    <div className="prf-info-label">Account Number</div>
                    <div className="prf-info-value">••••••{userData.bankDetails.accountNumber.slice(-4)}</div>
                </div>
                <div className="prf-info-card">
                    <div className="prf-info-label">IFSC Code</div>
                    <div className="prf-info-value">{userData.bankDetails.ifsc}</div>
                </div>
                <div className="prf-info-card">
                    <div className="prf-info-label">Bank Name</div>
                    <div className="prf-info-value">{userData.bankDetails.bankName}</div>
                </div>
                <div className="prf-info-card prf-full-width">
                    <div className="prf-info-label">Branch</div>
                    <div className="prf-info-value">{userData.bankDetails.branch}</div>
                </div>
            </div>

            <div className="prf-payout-info">
                <h3>Payout Information</h3>
                <div className="prf-payout-card">
                    <p>Next payout scheduled for</p>
                    <p className="prf-payout-date">
                        <i className="fas fa-calendar-alt"></i> {formatDate(userData.nextPayoutDate)}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Bank