import React from "react";
import "./Personal.css";
import ProfileUpdateModal from "../../Modals/ProfileUpdateModal/ProfileUpdateModal";
import { useState } from "react";

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

      <div className="ps-tab-content">
        <div className="ps-section-header">
          <h2>Personal Information</h2>
          <button class="btn-edit" onClick={() => setShowModal(true)}>
            <i class="fa-solid fa-pen-to-square"></i>
            Edit
          </button>
        </div>

        <div className="ps-form-grid">
          <div className="ps-form-group">
            <label>Full Name</label>
            <p className="ps-value">{user?.fullName || "-"}</p>
          </div>

          <div className="ps-form-group">
            <label>Email Address</label>
            <p className="ps-value">{user?.email || "-"}</p>
          </div>

          <div className="ps-form-group">
            <label>Phone Number</label>
            <p className="ps-value">{user?.phone || "-"}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Personal;
