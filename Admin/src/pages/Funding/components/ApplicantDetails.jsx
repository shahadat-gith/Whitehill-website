import React from "react";
import "./ApplicantDetails.css";

const ApplicantDetails = ({ user }) => {
  if (!user) return null;

  return (
    <div className="ad-card">
      <div className="ad-card-title">
        <i className="fa-solid fa-user-tie"></i>
        <h3>Applicant Information</h3>
      </div>

      <div className="ad-user-profile">
        <img 
          src={user?.image?.url || "/user.png"} 
          alt={user.fullName || "Applicant"} 
          className="ad-user-avatar" 
        />
        
        <div className="ad-user-info">
          <div className="ad-user-name">
            {user.fullName || "Unnamed Applicant"}
          </div>
          <div className="ad-user-phone">
            <i className="fa-solid fa-phone" style={{ fontSize: '10px', marginRight: '6px' }}></i>
            {user.phone || "No contact number"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantDetails;