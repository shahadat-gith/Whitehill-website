import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import "./Funding.css";

import Steps from "./components/Common/Steps";
import StepContent from "./StepContent";
import SubmitModal from "./components/Common/SubmitModal";

import { useFundingForm } from "./hooks/useFundingForm";
import { useFileUpload } from "./hooks/useFileUpload";
import { useAppContext } from "../../context/AppContext";

const Funding = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const { user } = useAppContext()

  const {
    formData,
    loading,
    updateFormData,
    addToArray,
    removeFromArray,
    submitForm,
    resetForm,
  } = useFundingForm();

  const {
    files,
    errors: fileErrors,
    handleFileChange,
    hasErrors,
  } = useFileUpload();

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('idle');
  const [submitError, setSubmitError] = useState('');

  const typeFromUrl = searchParams.get("type");

  /* =========================
     TYPE VALIDATION
  ========================= */
  useEffect(() => {
    if (!typeFromUrl) {
      navigate("/");
    }
  }, [typeFromUrl, navigate]);

  /* =========================
     SET TYPE
  ========================= */
  useEffect(() => {
    if (typeFromUrl) {
      const mappedType =
        typeFromUrl === "businessVenture" ? "business" : typeFromUrl;

      updateFormData("type", mappedType);
      setCurrentStep(1);
    }
  }, [typeFromUrl, updateFormData]);

  /* ========================= */
  const getTotalSteps = () => (formData.type ? 4 : 0);

  const handleNext = () => {
    if (currentStep < getTotalSteps()) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (hasErrors) {
      alert("Please fix file upload errors before submitting");
      return;
    }

    setShowSubmitModal(true);
    setSubmitStatus('processing');
    setSubmitError('');

    try {
      await submitForm(files);
      setSubmitStatus('success');
    } catch (err) {
      setSubmitStatus('failed');
      setSubmitError(err.response?.data?.message || err.message || 'Unable to submit at this time.');
    }
  };

  const handleSubmitModalClose = () => {
    if (submitStatus === 'success') {
      resetForm();
      navigate("/")
    }
    setShowSubmitModal(false);
    setSubmitStatus('idle');
    setSubmitError('');
  };

  const handleRedirectToFunding = () => {
    navigate(`/funding/user=${user?._id}`);
  };

  return (
    <div className="fun-container">

      {/* ================= HERO ================= */}
      <section className="fun-hero">
        <div className="fun-hero-bg">
          <div className="fun-shape fun-shape-1"></div>
          <div className="fun-shape fun-shape-2"></div>
        </div>

        <div className="fun-hero-content">
          <div className="fun-hero-badge">
            🚀 Fast & Secure Funding
          </div>

          <h1 className="fun-hero-title">
            Get the Capital You Need to
            <span> Grow Your Business</span>
          </h1>

          <p className="fun-hero-desc">
            We provide funding solutions for startups, business ventures, and individuals looking to invest in property or land — making access to capital simple and efficient.
          </p>

          <div className="fun-hero-stats">
            <div>
              <h3>$2.5M+</h3>
              <p>Funded</p>
            </div>
            <div>
              <h3>500+</h3>
              <p>Businesses</p>
            </div>
            <div>
              <h3>98%</h3>
              <p>Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= APPLICATION ================= */}
      <section className="fun-application">
        <Steps
          currentStep={currentStep}
          totalSteps={getTotalSteps()}
        />

        <div className="fun-form-container">
          <form onSubmit={handleSubmit} className="fun-form">

            <StepContent
              currentStep={currentStep}
              formData={formData}
              updateFormData={updateFormData}
              addToArray={addToArray}
              removeFromArray={removeFromArray}
              files={files}
              fileErrors={fileErrors}
              handleFileChange={handleFileChange}
            />
            <div className="fun-navigation">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="btn btn-secondary"
                >
                  Previous
                </button>
              )}

              {currentStep < getTotalSteps() && formData.type && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn btn-primary"
                >
                  Next
                </button>
              )}

              {currentStep === getTotalSteps() && (
                <button
                  type="submit"
                  disabled={loading || hasErrors}
                  className="btn btn-primary"
                >
                  {loading ? "Submitting..." : "Submit Application"}
                </button>
              )}
            </div>

          </form>
        </div>
      </section>

      <SubmitModal
        show={showSubmitModal}
        status={submitStatus}
        error={submitError}
        onClose={handleSubmitModalClose}
        onRedirect={handleRedirectToFunding}
      />
    </div>
  );
};

export default Funding;