import React from "react";
import { initialData } from "../utils";
import "../Styles/Step1BasicInfo.css";

const Step1BasicInfo = ({ sellRequest, setSellRequest, onTypeChange }) => {

  const handlePriceChange = (value) => {
    setSellRequest((prev) => ({ ...prev, priceAsked: value }));
  };

  const handleTypeChange = (value) => {
    if (onTypeChange) {
      onTypeChange(value);
      return;
    }

    setSellRequest((prev) => ({
      ...prev,
      type: value,
      landDetails: initialData.sellRequest.landDetails,
      propertyDetails: initialData.sellRequest.propertyDetails,
    }));
  };

  const handleDescriptionChange = (value) => {
    setSellRequest((prev) => ({ ...prev, description: value }));
  };

  return (
    <section className="sp1-section">
      <div className="sp1-grid">
        <div className="sp1-field">
          <label>Property Type *</label>
          <select
            value={sellRequest.type}
            onChange={(event) => handleTypeChange(event.target.value)}
            required
          >
            <option value="land">Land</option>
            <option value="property">Property</option>
          </select>
        </div>

        <div className="sp1-field">
          <label>Asking Price (₹) *</label>
          <input
            type="number"
            min="1"
            value={sellRequest.priceAsked}
            onChange={(event) => handlePriceChange(event.target.value)}
            placeholder="Enter expected asking price"
            required
          />
        </div>

        <div className="sp1-field sp1-field-full">
          <label>Description</label>
          <textarea
            rows="4"
            value={sellRequest.description || ""}
            onChange={(event) => handleDescriptionChange(event.target.value)}
            placeholder="Add brief details about the property"
            maxLength={1000}
          />
        </div>
      </div>
    </section>
  );
};

export default Step1BasicInfo;
