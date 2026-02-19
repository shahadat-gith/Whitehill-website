import React from "react";

const Step2PropertyDetails = ({ isLand, sellRequest, setSellRequest }) => {

  const updateLandDetails = (field, value) => {
    setSellRequest((prev) => ({
      ...prev,
      landDetails: { ...prev.landDetails, [field]: value },
    }));
  };

  const updatePropertyDetails = (field, value) => {
    setSellRequest((prev) => ({
      ...prev,
      propertyDetails: { ...prev.propertyDetails, [field]: value },
    }));
  };

  if (isLand) {
    return (
      <section className="sp-section">
        <h3>Land Details</h3>
        <p>Provide official identification details for your land.</p>
        <div className="sp-grid sp-grid-2">
          <div className="sp-field">
            <label>Area (in Bigha.) *</label>
            <input
              type="number"
              min="1"
              value={sellRequest.landDetails.area}
              onChange={(event) => updateLandDetails("area", event.target.value)}
              placeholder="Enter land area"
              required
            />
          </div>

          <div className="sp-field">
            <label>Land Type *</label>
            <select
              value={sellRequest.landDetails.landType}
              onChange={(event) => updateLandDetails("landType", event.target.value)}
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="agricultural">Agricultural</option>
            </select>
          </div>

          <div className="sp-field">
            <label>DAG Number *</label>
            <input
              type="text"
              value={sellRequest.landDetails.dagNumber}
              onChange={(event) => updateLandDetails("dagNumber", event.target.value)}
              placeholder="Enter DAG number"
              required
            />
          </div>

          <div className="sp-field">
            <label>Patta Number *</label>
            <input
              type="text"
              value={sellRequest.landDetails.pattaNumber}
              onChange={(event) => updateLandDetails("pattaNumber", event.target.value)}
              placeholder="Enter Patta number"
              required
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="sp-section">
      <h3>Property Details</h3>
      <p>Share building details to make your request complete and attractive.</p>
      <div className="sp-grid sp-grid-3">
        <div className="sp-field">
          <label>Bedrooms</label>
          <input
            type="number"
            min="0"
            value={sellRequest.propertyDetails.bedrooms}
            onChange={(event) => updatePropertyDetails("bedrooms", event.target.value)}
            placeholder="0"
          />
        </div>

        <div className="sp-field">
          <label>Bathrooms</label>
          <input
            type="number"
            min="0"
            value={sellRequest.propertyDetails.bathrooms}
            onChange={(event) => updatePropertyDetails("bathrooms", event.target.value)}
            placeholder="0"
          />
        </div>

        <div className="sp-field">
          <label>Parking Spaces</label>
          <input
            type="number"
            min="0"
            value={sellRequest.propertyDetails.parkingSpaces}
            onChange={(event) => updatePropertyDetails("parkingSpaces", event.target.value)}
            placeholder="0"
          />
        </div>
      </div>
    </section>
  );
};

export default Step2PropertyDetails;
