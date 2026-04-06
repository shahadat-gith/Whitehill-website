import React, { useState } from "react";
import "./Personal.css";
import ProfileUpdateModal from "../../Modals/ProfileUpdateModal/ProfileUpdateModal";

const Personal = ({ user }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {showModal && (
        <ProfileUpdateModal
          type="basic"
          onClose={() => setShowModal(false)}
        />
      )}

      <div className="ps-tab-container">
        <div className="ps-section-header">
          <div className="ps-header-left">
            <h2>Personal Information</h2>
            <p className="ps-section-subtitle">Manage your account details and contact information</p>
          </div>
          <button className="ps-btn-edit" onClick={() => setShowModal(true)}>
            <i className="fa-solid fa-pen-to-square"></i>
            Edit Details
          </button>
        </div>

        <div className="ps-details-grid">
          <div className="ps-info-card">
            <div className="ps-info-icon">
              <i className="fa-solid fa-user"></i>
            </div>
            <div className="ps-info-content">
              <label>Full Name</label>
              <p className="ps-value">{user?.fullName || "Not Provided"}</p>
            </div>
          </div>

          <div className="ps-info-card">
            <div className="ps-info-icon">
              <i className="fa-solid fa-envelope"></i>
            </div>
            <div className="ps-info-content">
              <label>Email Address</label>
              <div className="ps-value-group">
                <p className="ps-value">{user?.email || "Not Provided"}</p>
                {user?.email && <i className="fa-solid fa-check-circle"></i>}
              </div>
            </div>
          </div>

          <div className="ps-info-card">
            <div className="ps-info-icon">
              <i className="fa-solid fa-phone"></i>
            </div>
            <div className="ps-info-content">
              <label>Phone Number</label>
              <p className="ps-value">{user?.phone || "Add Phone Number"}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Personal;