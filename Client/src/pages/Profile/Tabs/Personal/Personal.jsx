import React from "react";
import "./Personal.css"
const Personal = ({ user }) => {
  return (
    <div className="prf-tab-content">
      <div className="prf-section-header">
        <h2>Personal Information</h2>
      </div>

      <div className="prf-form-grid">
        <div className="prf-form-group">
          <label>Full Name</label>
          <p className="prf-value">{user?.fullName || "-"}</p>
        </div>

        <div className="prf-form-group">
          <label>Email Address</label>
          <p className="prf-value">{user?.email || "-"}</p>
        </div>

        <div className="prf-form-group">
          <label>Phone Number</label>
          <p className="prf-value">{user?.phone || "-"}</p>
        </div>
      </div>
    </div>
  );
};

export default Personal;
