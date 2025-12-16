import React from 'react'

const Security = ({userData, setUserData}) => {
    return (
        <div className="prf-tab-content">
            <div className="prf-section-header">
                <h2>Security Settings</h2>
            </div>

            <div className="prf-security-section">
                <div className="prf-security-item">
                    <div className="prf-security-info">
                        <h3>Password</h3>
                        <p>Last changed 3 months ago</p>
                    </div>
                    <button className="prf-btn-secondary">Change Password</button>
                </div>

                <div className="prf-security-item">
                    <div className="prf-security-info">
                        <h3>Two-Factor Authentication</h3>
                        <p>{userData.mfaEnabled ? 'Enabled' : 'Not enabled'}</p>
                    </div>
                    <label className="prf-toggle-switch">
                        <input
                            type="checkbox"
                            checked={userData.mfaEnabled}
                            onChange={(e) => setUserData(prev => ({ ...prev, mfaEnabled: e.target.checked }))}
                        />
                        <span className="prf-toggle-slider"></span>
                    </label>
                </div>

                <div className="prf-security-item">
                    <div className="prf-security-info">
                        <h3>Account Verification</h3>
                        <p>{userData.isVerified ? 'Verified' : 'Not verified'}</p>
                    </div>
                    {userData.isVerified && (
                        <span className="prf-status-verified">
                            <i className="fas fa-check-circle"></i> Verified
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Security