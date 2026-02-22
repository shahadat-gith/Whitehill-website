import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StepProgress from "../../components/StepProgress/StepProgress";
import Step1BasicInfo from "./Steps/Step1BasicInfo";
import Step2PropertyDetails from "./Steps/Step2PropertyDetails";
import Step3LocationDetails from "./Steps/Step3LocationDetails";
import Step4Uploads from "./Steps/Step4Uploads";
import ErrorModal from "./Modals/ErrorModal";
import "./Styles/SellProperty.css";
import { getStepError, initialData, stepTitles } from "./utils";

const TOTAL_STEPS = 4;


const SellProperty = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [sellRequest, setSellRequest] = useState(initialData.sellRequest);
  const [location, setLocation] = useState(initialData.location);
  const [documents, setDocuments] = useState(initialData.documents);
  const [media, setMedia] = useState(initialData.media);
  const [errorModalMessage, setErrorModalMessage] = useState("");

  const storageKey = "sellPropertyRequestDraft";

  useEffect(() => {
    const hasAcceptedInstructions =
      sessionStorage.getItem("sellPropertyInstructionsAccepted") === "true";

    if (!hasAcceptedInstructions) {
      navigate("/sell-property", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const saved = sessionStorage.getItem(storageKey);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      setSellRequest(parsed.sellRequest || initialData.sellRequest);
      setLocation(parsed.location || initialData.location);
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
      landDetails: initialData.sellRequest.landDetails,
      propertyDetails: initialData.sellRequest.propertyDetails,
    }));
  };

  const validateStep = () => {
    const errorMessage = getStepError({
      currentStep,
      isLand,
      sellRequest,
      location,
      documents,
      media,
    });

    if (errorMessage) {
      setErrorModalMessage(errorMessage);
      return false;
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

  const goToSubmitReview = () => {
    if (!validateStep()) return;

    navigate("/sell-property/review", {
      state: {
        sellRequest,
        location,
        documents,
        media,
      },
    });
  };

  const renderStep = () => {
    if (currentStep === 1) {
      return (
        <Step1BasicInfo
          sellRequest={sellRequest}
          setSellRequest={setSellRequest}
          onTypeChange={handleTypeChange}
        />
      );
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

    if (currentStep === 4) {
      return (
        <Step4Uploads
          isLand={isLand}
          documents={documents}
          setDocuments={setDocuments}
          media={media}
          setMedia={setMedia}
        />
      );
    }

    return null;
  };

  return (
    <div className="sp-page">
      <div className="sp-layout">

        <StepProgress
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          stepTitles={stepTitles}
        />

        <div className="sp-column">
          <div className="sp-container">
            <form
              className="sp-form"
              onSubmit={(event) => event.preventDefault()}
            >
              <div className="sp-section">
                {renderStep()}
              </div>

              <div className="sp-actions">
                {currentStep > 1 && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={goBack}
                  >
                    Previous
                  </button>
                )}

                {currentStep < TOTAL_STEPS ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={goNext}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={goToSubmitReview}
                  >
                    Continue to Submit
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      <ErrorModal
        isOpen={Boolean(errorModalMessage)}
        message={errorModalMessage}
        onClose={() => setErrorModalMessage("")}
      />
    </div>
  );
};

export default SellProperty;
