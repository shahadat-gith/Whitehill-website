import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Styles/Layout.css";
import "./Styles/SellProperty.css";
import "./Styles/SellPropertyCongratulationsPage.css";

const SellPropertyCongratulations = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const requestId = searchParams.get("id");
  const typeParam = searchParams.get("type");
  const page = searchParams.get("page");
  const type = typeParam === "property" ? "property" : "land";

  const handleContinue = () => {
    if (!requestId) return;

    if (page === "details") {
      navigate(`/sell-property/uploads/${requestId}?type=${type}`);
    } else if (page === "upload") {
      navigate("/", { replace: true });
    }
  };

  const isDetailsPage = page === "details";
  const isUploadPage = page === "upload";

  return (
    <div className="sell-property-page spc-page">
      <div className="sell-property-layout-full">
        <div className="sell-property-column">
          <div className="ifr-container sp-container">
            <div className="ifr-form sp-form">
              <div className="submit-review-section">
                <div className="submit-header">
                  <div className="submit-icon">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <h2>{isDetailsPage ? "" : "Congratulations"}</h2>
                  <p>
                    {isDetailsPage &&
                      "Your sell property request details have been submitted successfully."}
                    {isUploadPage &&
                      "Your documents and files have been uploaded successfully."}
                  </p>
                </div>

                {isDetailsPage && (
                  <div className="submit-notice">
                    <i className="fas fa-info-circle"></i>
                    <div>
                      <strong>Next Step:</strong> Upload your documents and images to complete your request.
                    </div>
                  </div>
                )}

                <div className="ifr-actions">
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={handleContinue}
                    disabled={!requestId}
                  >
                    {isDetailsPage && "Continue to Upload Files"}
                    {isUploadPage && "Okay"}
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