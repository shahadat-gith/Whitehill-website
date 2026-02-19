import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Styles/Layout.css";
import "./Styles/SellProperty.css";

const SellPropertyCongratulations = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const requestId = searchParams.get("id") || "";
  const type = searchParams.get("type") === "property" ? "property" : "land";

  return (
    <div className="sell-property-page">
      <div className="sell-property-layout-full">
        <div className="sell-property-column">
          <div className="ifr-container sp-container">
            <div className="ifr-form sp-form">
              <div className="submit-review-section">
                <div className="submit-header">
                  <div className="submit-icon">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <h2>Congratulations!</h2>
                  <p>Your sell property request details have been submitted successfully.</p>
                </div>

                <div className="submit-notice">
                  <i className="fas fa-info-circle"></i>
                  <div>
                    <strong>Next Step:</strong> Upload your documents, images and videos to complete your request.
                  </div>
                </div>

                <div className="ifr-actions">
                  <button className="btn btn-secondary" type="button" onClick={() => navigate("/sell-property")}>
                    Create Another Request
                  </button>
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => navigate(`/sell-property/uploads/${requestId}?type=${type}`)}
                    disabled={!requestId}
                  >
                    Continue to Upload Files
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellPropertyCongratulations;
