import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./Styles/SellPropertyInstructions.css";

const SellPropertyInstructions = () => {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  const handleContinue = () => {
    if (!agreed) {
      toast.error("You must accept the terms before proceeding.");
      return;
    }

    sessionStorage.setItem("sellPropertyInstructionsAccepted", "true");
    navigate("/sell-property/form");
  };

  return (
    <div className="spi-page">
      <div className="spi-layout">
        <div className="spi-column">
          <div className="spi-container">
            <div className="spi-form">
              <section className="spi-section">
                <h2 className="spi-title">Before you fill the application</h2>

                <p className="spi-subtext">
                  Please carefully review the instructions below. Accurate information
                  ensures faster approval and builds trust with potential buyers.
                </p>

                <div className="spi-highlight">
                  <strong>Important:</strong> Incorrect, misleading, or incomplete
                  information may result in rejection of your application.
                </div>

                <ul className="spi-list">
                  <li className="spi-list-item">
                    Select the correct property type (Land / Built Property) and enter
                    a realistic asking price.
                  </li>
                  <li className="spi-list-item">
                    Provide exact land or property details as per official documents
                    (Dag Number, Patta Number, Area, Bedrooms, etc.).
                  </li>
                  <li className="spi-list-item">
                    Enter complete and accurate location details including Village,
                    Mouza, PO, PS, District, State, and Pincode.
                  </li>
                  <li className="spi-list-item">
                    Upload clear ownership proof and required supporting documents.
                  </li>
                  <li className="spi-list-item">
                    Upload high-quality property images (minimum 4 recommended).
                  </li>
                  <li className="spi-list-item">
                    Ensure the property is legally owned by you or you are authorized
                    to sell it.
                  </li>
                </ul>

                <div className="spi-note">
                  By proceeding, you confirm that all information submitted is
                  genuine and legally valid.
                </div>

                <label className="spi-agree">
                  <input
                    type="checkbox"
                    className="spi-checkbox"
                    checked={agreed}
                    onChange={(event) => setAgreed(event.target.checked)}
                  />
                  <span className="spi-agree-text">
                    I confirm that the information I provide is accurate and I agree
                    to the platform’s terms and verification process.
                  </span>
                </label>

                <div className="spi-actions">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleContinue}
                  >
                    Continue to Fill the Form
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellPropertyInstructions;