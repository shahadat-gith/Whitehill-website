import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FUND_TYPES = [
  { value: "startup", icon: "fa-rocket", label: "Startup" },
  { value: "businessVenture", icon: "fa-chart-line", label: "Business Venture" },
  { value: "property", icon: "fa-building", label: "Property / Land" },
];

const FundModal = ({ isLoggedIn, setIsModalOpen, handleFundSelection }) => {
  const navigate = useNavigate();

  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [selectedType, setSelectedType] = useState(null); 

  /* =========================
     HANDLE CARD CLICK
  ========================= */
  const handleCardClick = (type) => {
    if (!isLoggedIn) {
      setSelectedType(type);
      setShowAuthPrompt(true);
      return;
    }

    handleFundSelection(type);
  };

  /* =========================
     HANDLE LOGIN REDIRECT
  ========================= */
  const handleLoginRedirect = () => {
    if (!selectedType) return;

    const redirectUrl = `/funding?type=${selectedType}`;

    setIsModalOpen(false); // ✅ close modal

    navigate(
      `/auth?redirect=${encodeURIComponent(redirectUrl)}`
    );
  };

  return (
    <div
      className="fmodal-overlay"
      onClick={() => setIsModalOpen(false)}
    >
      <div
        className="fmodal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE */}
        <button
          className="fmodal-close"
          onClick={() => setIsModalOpen(false)}
        >
          &times;
        </button>

        {!showAuthPrompt ? (
          <>
            {/* HEADER */}
            <div className="fmodal-header">
              <h2 className="fmodal-title">Fund your vision</h2>
              <p className="fmodal-sub">
                Select the category that best describes your request.
              </p>
            </div>

            {/* OPTIONS */}
            <div className="fmodal-options">
              {FUND_TYPES.map(({ value, icon, label }) => (
                <button
                  key={value}
                  className="fmodal-card"
                  onClick={() => handleCardClick(value)}
                >
                  <span className="fmodal-icon">
                    <i className={`fas ${icon}`} />
                  </span>

                  <span className="fmodal-card-label">
                    {label}
                  </span>

                  <i className="fas fa-arrow-right fmodal-arrow" />
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="fmodal-auth">
            <div className="fmodal-auth-icon">
              <i className="fas fa-lock" />
            </div>

            <h2 className="fmodal-title">Login required</h2>

            <p className="fmodal-sub">
              You need to be logged in to apply for funding. It only
              takes a minute to get started.
            </p>

            <button
              className="btn btn-primary fmodal-login-btn"
              onClick={handleLoginRedirect}
            >
              Okay! Login
            </button>

            <button
              className="fmodal-back-link"
              onClick={() => setShowAuthPrompt(false)}
            >
              ← Back to options
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FundModal;