import React from 'react'

const Preferences = ({userData, setUserData}) => {

    const handleNestedChange = (parent, field, value) => {
        setUserData(prev => ({
            ...prev,
            [parent]: { ...prev[parent], [field]: value }
        }));
    };

    return (
        <div className="prf-tab-content">
            <div className="prf-section-header">
                <h2>Notification Preferences</h2>
            </div>

            <div className="prf-preferences-section">
                <div className="prf-preference-item">
                    <div className="prf-preference-info">
                        <h3>Email Notifications</h3>
                        <p>Receive updates via email</p>
                    </div>
                    <label className="prf-toggle-switch">
                        <input
                            type="checkbox"
                            checked={userData.notificationPrefs.email}
                            onChange={(e) => handleNestedChange('notificationPrefs', 'email', e.target.checked)}
                        />
                        <span className="prf-toggle-slider"></span>
                    </label>
                </div>

                <div className="prf-preference-item">
                    <div className="prf-preference-info">
                        <h3>SMS Notifications</h3>
                        <p>Receive updates via SMS</p>
                    </div>
                    <label className="prf-toggle-switch">
                        <input
                            type="checkbox"
                            checked={userData.notificationPrefs.sms}
                            onChange={(e) => handleNestedChange('notificationPrefs', 'sms', e.target.checked)}
                        />
                        <span className="prf-toggle-slider"></span>
                    </label>
                </div>

                <div className="prf-preference-item">
                    <div className="prf-preference-info">
                        <h3>WhatsApp Notifications</h3>
                        <p>Receive updates via WhatsApp</p>
                    </div>
                    <label className="prf-toggle-switch">
                        <input
                            type="checkbox"
                            checked={userData.notificationPrefs.whatsapp}
                            onChange={(e) => handleNestedChange('notificationPrefs', 'whatsapp', e.target.checked)}
                        />
                        <span className="prf-toggle-slider"></span>
                    </label>
                </div>
            </div>

            <div className="prf-danger-zone">
                <div className="prf-danger-item">
                    <div>
                        <h4>Delete Account</h4>
                        <p>Permanently delete your account and all associated data</p>
                    </div>
                    <button className="prf-btn-danger">
                        <i className="fas fa-trash-alt"></i> Delete Account
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Preferences