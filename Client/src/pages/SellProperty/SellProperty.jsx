import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import StepProgress from "../../components/StepProgress/StepProgress";
import Step1BasicInfo from "./Steps/Step1BasicInfo";
import Step2PropertyDetails from "./Steps/Step2PropertyDetails";
import Step3LocationDetails from "./Steps/Step3LocationDetails";
import "./Styles/Layout.css";
import "./Styles/SellProperty.css";
import {
  initialLocation,
  initialSellRequest,
  stepTitles,
} from "./utils";

const TOTAL_STEPS = 3;


const SellProperty = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [sellRequest, setSellRequest] = useState(initialSellRequest);
  const [location, setLocation] = useState(initialLocation);

  const storageKey = "sellPropertyRequestDraft";

  useEffect(() => {
    const saved = sessionStorage.getItem(storageKey);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      setSellRequest(parsed.sellRequest || parsed.listing || initialSellRequest);
      setLocation(parsed.location || initialLocation);
      setCurrentStep(parsed.currentStep || 1);
    } catch {
      sessionStorage.removeItem(storageKey);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem(
      storageKey,
      JSON.stringify({
        sellRequest,
        location,
        currentStep,
      })
    );
  }, [sellRequest, location, currentStep]);

  const isLand = sellRequest.type === "land";

  const handleTypeChange = (type) => {
    setSellRequest((prev) => ({
      ...prev,
      type,
      landDetails: initialSellRequest.landDetails,
      propertyDetails: initialSellRequest.propertyDetails,
    }));
  };

  const validateStep = () => {
    if (currentStep === 1) {
      if (!sellRequest.priceAsked || Number(sellRequest.priceAsked) <= 0) {
        toast.error("Enter a valid asking price.");
        return false;
      }
    }

    if (currentStep === 2 && isLand) {
      if (
        !sellRequest.landDetails.area ||
        !sellRequest.landDetails.dagNumber ||
        !sellRequest.landDetails.pattaNumber ||
        !sellRequest.landDetails.landType
      ) {
        toast.error("Fill all required land details.");
        return false;
      }
    }

    if (currentStep === 3) {
      if (!location.state || !location.district || !location.city || !location.pincode) {
        toast.error("State, district, city and pincode are required.");
        return false;
      }

      if (!/^\d{6}$/.test(location.pincode)) {
        toast.error("Pincode must be 6 digits.");
        return false;
      }
    }

    return true;
  };

  const goNext = () => {
    if (!validateStep()) return;
    setCurrentStep((prev) => Math.min(TOTAL_STEPS, prev + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToReview = () => {
    if (!validateStep()) return;
    navigate("/sell-property/review");
  };

  const renderStep = () => {
    if (currentStep === 1) {
      return <Step1BasicInfo sellRequest={sellRequest} setSellRequest={setSellRequest} />;
    }

    if (currentStep === 2) {
      return (
        <Step2PropertyDetails
          isLand={isLand}
          sellRequest={sellRequest}
          setSellRequest={setSellRequest}
        />
      );
    }

    if (currentStep === 3) {
      return <Step3LocationDetails location={location} setLocation={setLocation} />;
    }

    return null;
  };

  return (
    <div className="sell-property-page">
      <div className="sell-property-layout-full">
        <div className="sell-property-column">
          <div className="sell-property-card">
            <h2>Sell Property Request</h2>
            <div className="sell-property-tabs">
              <button
                type="button"
                className={`sell-property-tab ${isLand ? "active" : ""}`}
                onClick={() => handleTypeChange("land")}
              >
                Land
              </button>
              <button
                type="button"
                className={`sell-property-tab ${!isLand ? "active" : ""}`}
                onClick={() => handleTypeChange("property")}
              >
                Property
              </button>
            </div>
          </div>

          <div className="ifr-container sp-container">
            <StepProgress
              currentStep={currentStep}
              totalSteps={TOTAL_STEPS}
              stepTitles={stepTitles}
            />

            <form className="ifr-form sp-form" onSubmit={(event) => event.preventDefault()}>
              <div className="ifr-section">{renderStep()}</div>

              <div className="ifr-actions">
                {currentStep > 1 && (
                  <button type="button" className="btn btn-secondary" onClick={goBack}>
                    <i className="fas fa-arrow-left"></i> Previous
                  </button>
                )}

                {currentStep < TOTAL_STEPS ? (
                  <button type="button" className="btn btn-primary" onClick={goNext}>
                    Next <i className="fas fa-arrow-right"></i>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={goToReview}
                  >
                    Review & Submit
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellProperty;
