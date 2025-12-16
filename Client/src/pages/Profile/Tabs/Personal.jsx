import React, { useState } from 'react'
import { formatDate } from "../utility"

const Personal = ({ userData }) => {
    const [isEditing, setIsEditing] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="prf-tab-content">
            <div className="prf-section-header">
                <h2>Personal Information</h2>
                <button className="prf-btn-edit" onClick={() => setIsEditing(!isEditing)}>
                    <i className="fas fa-edit"></i> {isEditing ? 'Cancel' : 'Edit'}
                </button>
            </div>

            <div className="prf-form-grid">
                <div className="prf-form-group">
                    <label>Full Name</label>
                    <input type="text" name="fullName" value={userData.fullName} onChange={handleInputChange} disabled={!isEditing} />
                </div>
                <div className="prf-form-group">
                    <label>Email Address</label>
                    <input type="email" name="email" value={userData.email} onChange={handleInputChange} disabled={!isEditing} />
                </div>
                <div className="prf-form-group">
                    <label>Phone Number</label>
                    <input type="tel" name="phone" value={userData.phone} onChange={handleInputChange} disabled={!isEditing} />
                </div>
                <div className="prf-form-group">
                    <label>Last Login</label>
                    <input type="text" value={formatDate(userData.lastLogin)} disabled />
                </div>
            </div>

            {isEditing && (
                <div className="prf-form-actions">
                    <button className="prf-btn-primary">Save Changes</button>
                </div>
            )}
        </div>
    )
}

export default Personal