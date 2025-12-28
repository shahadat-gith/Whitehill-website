import React from "react";
import "./Personal.css"
import ProfileUpdateModal from "../../Modals/ProfileUpdateModal/ProfileUpdateModal";
import { useState } from "react";
const Personal = ({ user }) => {

  const [showModal, setShowModal] = useState(false)

  return (
    <>
    {showModal && <ProfileUpdateModal type="basic" onClose={()=> setShowModal(false)}/>}
    <div className="prf-tab-content">
      <div className="prf-section-header">
        <h2>Personal Information</h2>
        <button class="btn-edit" onClick={()=> setShowModal(true)}>
          <i class="fa-solid fa-pen-to-square"></i>
          Edit
        </button>

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
    </>
  );
};

export default Personal;
