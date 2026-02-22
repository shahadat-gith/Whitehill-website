import React from "react";
import { useNavigate } from "react-router-dom";
import "./Styles/SellPropertyCongratulations.css";

const SellPropertyCongratulations = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    sessionStorage.removeItem("sellPropertyInstructionsAccepted");
    sessionStorage.removeItem("sellPropertyRequestDraft");
    sessionStorage.removeItem("sellPropertyFinalReview");
    navigate("/", { replace: true });
  };

  return (
    <div className="spc-page">
      <div className="spc-container">
        <div className="spc-icon">
          <i className="fas fa-check"></i>
        </div>

        <h2 className="spc-title">Congratulations!</h2>

        <p className="spc-text">
          Your Application has been submitted successfully.
          Our team will review it and get back to you shortly.
        </p>

        <button className="spc-btn" type="button" onClick={handleGoHome}>
          <i className="fas fa-home"></i> Back to Home
        </button>
      </div>
    </div>
  );
};

export default SellPropertyCongratulations;