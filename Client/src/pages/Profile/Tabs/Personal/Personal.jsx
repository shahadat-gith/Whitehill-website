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

      <div className="ps-container">
        <div className="ps-header">
          <div className="ps-header-left">
            <h2 className="ps-title">Personal Information</h2>
            <p className="ps-subtitle">Securely manage your identity and contact details</p>
          </div>
          
          {/* Using Global Secondary Button */}
          <button className="btn btn-secondary" onClick={() => setShowModal(true)}>
            <i className="fa-solid fa-pen-to-square"></i>
            Edit Profile
          </button>
        </div>

        <div className="ps-grid">
          {/* Full Name */}
          <div className="ps-card">
            <div className="ps-card-icon">
              <i className="fa-solid fa-user-tie"></i>
            </div>
            <div className="ps-card-info">
              <label className="ps-label">Legal Full Name</label>
              <p className="ps-value">{user?.fullName || "Not Provided"}</p>
            </div>
          </div>

          {/* Email */}
          <div className="ps-card">
            <div className="ps-card-icon">
              <i className="fa-solid fa-envelope-open-text"></i>
            </div>
            <div className="ps-card-info">
              <label className="ps-label">Verified Email</label>
              <div className="ps-value-wrapper">
                <p className="ps-value">{user?.email || "Not Provided"}</p>
                {user?.email && <i className="fa-solid fa-circle-check ps-verified"></i>}
              </div>
            </div>
          </div>

          {/* Phone */}
          <div className="ps-card">
            <div className="ps-card-icon">
              <i className="fa-solid fa-mobile-screen-button"></i>
            </div>
            <div className="ps-card-info">
              <label className="ps-label">Mobile Number</label>
              <p className="ps-value">{user?.phone || "Add Phone Number"}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Personal;