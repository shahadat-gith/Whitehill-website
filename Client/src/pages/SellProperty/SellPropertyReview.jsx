import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../Configs/axios";
import StepProgress from "../../components/StepProgress/StepProgress";
import ErrorModal from "./Modals/ErrorModal";
import SubmitModal from "./Modals/SubmitModal";
import { initialData, stepTitles } from "./utils";
import "./Styles/SellPropertyReview.css";

const TOTAL_STEPS = 4;

const ReviewRow = ({ label, value }) => (
  <div className="spr-row">
    <span className="spr-row-label">{label}</span>
    <span className="spr-row-value">{value || "-"}</span>
  </div>
);

const ReviewGroup = ({ title, children }) => (
  <div className="spr-group">
    <h4 className="spr-group-title">{title}</h4>
    <div className="spr-group-body">{children}</div>
  </div>
);

const SellPropertyReview = () => {
  const navigate = useNavigate();
  const routeLocation = useLocation();
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorModalMessage, setErrorModalMessage] = useState("");

  const reviewData = useMemo(() => {
    const stateData = routeLocation.state;
    if (!stateData) return null;
    return {
      sellRequest: stateData.sellRequest || initialData.sellRequest,
      location: stateData.location || initialData.location,
      documents: stateData.documents || null,
      media: stateData.media || null,
    };
  }, [routeLocation.state]);

  if (!reviewData) {
    return (
      <div className="spr-page">
        <div className="spr-layout">
          <div className="spr-container spr-empty">
            <div className="spr-empty-icon">
              <i className="fas fa-folder-open"></i>
            </div>
            <h2 className="spr-empty-title">No Review Data Found</h2>
            <p className="spr-empty-text">
              Please complete the form and upload your documents first.
            </p>
            <button
              className="spr-btn spr-btn-primary"
              type="button"
              onClick={() => navigate("/sell-property/form")}
            >
              Go to Form
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { sellRequest, location, documents, media } = reviewData;
  const isLand = sellRequest.type === "land";

  const submitFinal = async () => {
    if (submitting) return;
    
    try {
      setSubmitting(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append("type", sellRequest.type);
      formData.append("priceAsked", String(Number(sellRequest.priceAsked)));
      formData.append("description", sellRequest.description || "");
      formData.append("location", JSON.stringify(location));

      if (isLand) {
        const landDetailsPayload = {
          ...sellRequest.landDetails,
          area: {
            bigha: Number(sellRequest.landDetails.area?.bigha),
            kattha: Number(sellRequest.landDetails.area?.kattha),
            lessa: Number(sellRequest.landDetails.area?.lessa),
          },
        };
        formData.append("landDetails", JSON.stringify(landDetailsPayload));
        formData.append("landOwnershipProof", documents.landOwnershipProof);
        formData.append("khajnaReceipt", documents.khajnaReceipt);
        (media.landImages || []).forEach((file) => formData.append("landImages", file));
      } else {
        const propertyDetailsPayload = {
          bedrooms: Number(sellRequest.propertyDetails.bedrooms),
          bathrooms: Number(sellRequest.propertyDetails.bathrooms),
          parkingSpaces: Number(sellRequest.propertyDetails.parkingSpaces),
        };
        formData.append("propertyDetails", JSON.stringify(propertyDetailsPayload));
        formData.append("ownershipProof", documents.ownershipProof);
        formData.append("buildingPlan", documents.buildingPlan);
        (media.propertyImages || []).forEach((file) => formData.append("propertyImages", file));
      }

      const submitResponse = await api.post("/api/property-selling/submit", formData, {
        onUploadProgress: (event) => {
          if (!event.total) return;
          const percent = Math.round((event.loaded * 100) / event.total);
          setUploadProgress(percent >= 100 ? 95 : percent);
        },
      });

      if (!submitResponse.data?.success || !submitResponse.data?.data?._id) {
        throw new Error(submitResponse.data?.message || "Failed to submit property request");
      }

      setUploadProgress(100);
      sessionStorage.removeItem("sellPropertyRequestDraft");
      navigate("/sell-property/congratulations");
    } catch (error) {
      setErrorModalMessage(
        error.response?.data?.message || error.message || "Submission failed"
      );
      setUploadProgress(0);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="spr-page">
      <div className="spr-layout">
         <StepProgress
            currentStep={TOTAL_STEPS + 1}
            totalSteps={TOTAL_STEPS}
            stepTitles={stepTitles}
          />

        <div className="spr-container">
         
          <div className="spr-body">
            <div className="spr-header">
              <div className="spr-header-icon">
                <i className="fas fa-clipboard-check"></i>
              </div>
              <div>
                <h2 className="spr-header-title">Review & Submit</h2>
                <p className="spr-header-sub">
                  Check your details below before final submission.
                </p>
              </div>
            </div>

            <div className="spr-notice">
              <i className="fas fa-info-circle"></i>
              Your files are already uploaded. Submitting will send your
              request for verification.
            </div>

            <div className="spr-groups">
              <ReviewGroup title="Basic Info">
                <ReviewRow label="Type" value={isLand ? "Land" : "Property"} />
                <ReviewRow
                  label="Asking Price"
                  value={`₹${Number(sellRequest.priceAsked || 0).toLocaleString("en-IN")}`}
                />
                <ReviewRow label="Description" value={sellRequest.description} />
              </ReviewGroup>

              <ReviewGroup title={isLand ? "Land Details" : "Property Details"}>
                {isLand ? (
                  <>
                    <ReviewRow
                      label="Area"
                      value={`${sellRequest.landDetails.area?.bigha || 0} Bigha, ${sellRequest.landDetails.area?.kattha || 0} Kattha, ${sellRequest.landDetails.area?.lessa || 0} Lessa`}
                    />
                    <ReviewRow label="DAG Number" value={sellRequest.landDetails.dagNumber} />
                    <ReviewRow label="Patta Number" value={sellRequest.landDetails.pattaNumber} />
                    <ReviewRow label="Land Type" value={sellRequest.landDetails.landType} />
                  </>
                ) : (
                  <>
                    <ReviewRow label="Bedrooms" value={sellRequest.propertyDetails.bedrooms} />
                    <ReviewRow label="Bathrooms" value={sellRequest.propertyDetails.bathrooms} />
                    <ReviewRow label="Parking Spaces" value={sellRequest.propertyDetails.parkingSpaces} />
                  </>
                )}
              </ReviewGroup>

              <ReviewGroup title="Location">
                {[
                  ["Village", location.village],
                  ["Mouza", location.mouza],
                  ["PO", location.po],
                  ["PS", location.ps],
                  ["City", location.city],
                  ["District", location.district],
                  ["State", location.state],
                  ["Pincode", location.pincode],
                ].map(([label, value]) => (
                  <ReviewRow key={label} label={label} value={value} />
                ))}
              </ReviewGroup>
            </div>

            <div className="spr-actions">
              <button
                className="spr-btn spr-btn-secondary"
                type="button"
                onClick={() => navigate("/sell-property/form")}
              >
                <i className="fas fa-arrow-left"></i> Back to Edit
              </button>
              <button
                className="spr-btn spr-btn-primary"
                type="button"
                onClick={submitFinal}
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Final Submit"}
                {!submitting && <i className="fas fa-paper-plane"></i>}
              </button>
            </div>
          </div>
        </div>
      </div>

      <SubmitModal isOpen={submitting} progress={uploadProgress} />
      <ErrorModal
        isOpen={Boolean(errorModalMessage)}
        message={errorModalMessage}
        onClose={() => setErrorModalMessage("")}
      />
    </div>
  );
};

export default SellPropertyReview;