import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../Configs/axios";
import { useAppContext } from "../../Context/AppContext";
import StepProgress from "../../components/StepProgress/StepProgress";
import { initialLocation, initialSellRequest, stepTitles } from "./utils";
import "./Styles/Layout.css";
import "./Styles/SellProperty.css";

const TOTAL_STEPS = 3;

const SellPropertyReview = () => {
  const navigate = useNavigate();
  const { user } = useAppContext();
  const [submitting, setSubmitting] = useState(false);

  const draft = useMemo(() => {
    const saved = sessionStorage.getItem("sellPropertyRequestDraft");
    if (!saved) return null;

    try {
      const parsed = JSON.parse(saved);
      return {
        sellRequest: parsed.sellRequest || parsed.listing || initialSellRequest,
        location: parsed.location || initialLocation,
      };
    } catch {
      return null;
    }
  }, []);

  if (!draft) {
    return (
      <div className="sell-property-page">
        <div className="sell-property-layout-full">
          <div className="sell-property-column">
            <div className="ifr-container sp-container">
              <div className="ifr-form sp-form">
                <div className="submit-review-section">
                  <div className="submit-header">
                    <h2>No details found</h2>
                    <p>Please fill the property details first.</p>
                  </div>
                  <div className="sp-reset-wrap">
                    <button className="btn btn-primary" type="button" onClick={() => navigate("/sell-property")}>Go to Sell Property</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { sellRequest, location } = draft;
  const isLand = sellRequest.type === "land";

  const submitDetails = async () => {
    if (!user?._id) {
      toast.error("Please login to continue.");
      return;
    }

    if (submitting) return;

    try {
      setSubmitting(true);

      const payload = {
        type: sellRequest.type,
        priceAsked: Number(sellRequest.priceAsked),
        location,
        landDetails: isLand
          ? {
              ...sellRequest.landDetails,
              area: Number(sellRequest.landDetails.area),
            }
          : undefined,
        propertyDetails: !isLand
          ? {
              bedrooms: sellRequest.propertyDetails.bedrooms
                ? Number(sellRequest.propertyDetails.bedrooms)
                : 0,
              bathrooms: sellRequest.propertyDetails.bathrooms
                ? Number(sellRequest.propertyDetails.bathrooms)
                : 0,
              parkingSpaces: sellRequest.propertyDetails.parkingSpaces
                ? Number(sellRequest.propertyDetails.parkingSpaces)
                : 0,
            }
          : undefined,
      };

      const { data } = await api.post("/api/property-selling/create-details", payload);

      if (!data.success) {
        throw new Error(data.message || "Failed to submit details");
      }

      sessionStorage.removeItem("sellPropertyRequestDraft");
      navigate(`/sell-property/congratulations?id=${data.data._id}&type=${data.data.type || sellRequest.type}`);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to submit details");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="sell-property-page">
      <div className="sell-property-layout-full">
        <div className="sell-property-column">
          <div className="ifr-container sp-container">
            <StepProgress currentStep={TOTAL_STEPS + 1} totalSteps={TOTAL_STEPS} stepTitles={stepTitles} />

            <div className="ifr-form sp-form">
              <div className="submit-review-section">
                <div className="submit-header">
                  <h2>Review & Submit</h2>
                  <p>Please review your details before final submission.</p>
                </div>

                <div className="submit-summary">
                  <div className="summary-item">
                    <span className="summary-label">Type</span>
                    <span className="summary-value">{isLand ? "Land" : "Property"}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Asking Price</span>
                    <span className="summary-value amount">₹{Number(sellRequest.priceAsked || 0).toLocaleString("en-IN")}</span>
                  </div>
                  {isLand ? (
                    <>
                      <div className="summary-item"><span className="summary-label">Area</span><span className="summary-value">{sellRequest.landDetails.area} Bigha</span></div>
                      <div className="summary-item"><span className="summary-label">DAG Number</span><span className="summary-value">{sellRequest.landDetails.dagNumber}</span></div>
                      <div className="summary-item"><span className="summary-label">Patta Number</span><span className="summary-value">{sellRequest.landDetails.pattaNumber}</span></div>
                    </>
                  ) : (
                    <>
                      <div className="summary-item"><span className="summary-label">Bedrooms</span><span className="summary-value">{sellRequest.propertyDetails.bedrooms || 0}</span></div>
                      <div className="summary-item"><span className="summary-label">Bathrooms</span><span className="summary-value">{sellRequest.propertyDetails.bathrooms || 0}</span></div>
                      <div className="summary-item"><span className="summary-label">Parking Spaces</span><span className="summary-value">{sellRequest.propertyDetails.parkingSpaces || 0}</span></div>
                    </>
                  )}
                  <div className="summary-item"><span className="summary-label">City</span><span className="summary-value">{location.city}</span></div>
                  <div className="summary-item"><span className="summary-label">District</span><span className="summary-value">{location.district}</span></div>
                  <div className="summary-item"><span className="summary-label">State</span><span className="summary-value">{location.state}</span></div>
                  <div className="summary-item"><span className="summary-label">Pincode</span><span className="summary-value">{location.pincode}</span></div>
                </div>

                <div className="ifr-actions">
                  <button className="btn btn-secondary" type="button" onClick={() => navigate("/sell-property")}>Back to Edit</button>
                  <button className="btn btn-primary" type="button" onClick={submitDetails} disabled={submitting}>
                    {submitting ? "Submitting..." : "Submit Details"}
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

export default SellPropertyReview;
