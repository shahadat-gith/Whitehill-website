import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FundModal.css";

const FUND_TYPES = [
  { value: "startup", icon: "fa-rocket", label: "Startup" },
  { value: "businessVenture", icon: "fa-chart-line", label: "Business Venture" },
  { value: "property", icon: "fa-building", label: "Property / Land" },
];

const FundModal = ({ isLoggedIn, setIsModalOpen, handleFundSelection }) => {
  const navigate = useNavigate();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  const handleCardClick = (type) => {
    if (!isLoggedIn) {
      setSelectedType(type);
      setShowAuthPrompt(true);
      return;
    }
    handleFundSelection(type);
  };

  const handleLoginRedirect = () => {
    if (!selectedType) return;
    const redirectUrl = `/funding?type=${selectedType}`;
    setIsModalOpen(false);
    navigate(`/auth?redirect=${encodeURIComponent(redirectUrl)}`);
  };

  return (
    <div className="fm-overlay" onClick={() => setIsModalOpen(false)}>
      <div className="fm-content" onClick={(e) => e.stopPropagation()}>
        {/* CLOSE BUTTON */}
        <button className="fm-close-btn" onClick={() => setIsModalOpen(false)}>
          <i className="fas fa-times"></i>
        </button>

        {!showAuthPrompt ? (
          <div className="fm-main-view">
            <header className="fm-header">
              <h2 className="fm-title">Fund your vision</h2>
              <p className="fm-subtitle">
                Select the category that best describes your capital request.
              </p>
            </header>

            <div className="fm-options-list">
              {FUND_TYPES.map(({ value, icon, label }) => (
                <button
                  key={value}
                  className="fm-option-card"
                  onClick={() => handleCardClick(value)}
                >
                  <div className="fm-option-icon">
                    <i className={`fas ${icon}`} />
                  </div>
                  <span className="fm-option-label">{label}</span>
                  <i className="fas fa-chevron-right fm-arrow" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="fm-auth-view">
            <div className="fm-auth-icon-wrapper">
              <i className="fas fa-user-shield" />
            </div>

            <h2 className="fm-title">Authentication required</h2>
            <p className="fm-subtitle">
              You need to be logged in to access the funding application.
              Your selected category will be saved.
            </p>

            <div className="fm-auth-actions">
              <button
                className="fm-btn-primary"
                onClick={handleLoginRedirect}
              >
                Proceed to Login
              </button>

              <button
                className="fm-btn-back"
                onClick={() => setShowAuthPrompt(false)}
              >
                <i className="fas fa-arrow-left"></i> Back to options
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FundModal;