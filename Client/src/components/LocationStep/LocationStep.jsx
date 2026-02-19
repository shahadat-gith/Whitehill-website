import React from "react";
import "./LocationStep.css";

const LocationStep = ({ location, handleLocationChange }) => {
  return (
    <section className="location-section">
      <div className="location-content">
        <div className="location-grid location-grid-3">
          <div className="location-field">
            <label>State *</label>
            <input
              type="text"
              value={location.state}
              onChange={(event) => handleLocationChange("state", event.target.value)}
              placeholder="e.g., Maharashtra"
              required
            />
          </div>
          <div className="location-field">
            <label>District *</label>
            <input
              type="text"
              value={location.district}
              onChange={(event) => handleLocationChange("district", event.target.value)}
              placeholder="e.g., Pune"
              required
            />
          </div>
          <div className="location-field">
            <label>City/Town *</label>
            <input
              type="text"
              value={location.city}
              onChange={(event) => handleLocationChange("city", event.target.value)}
              placeholder="e.g., Hinjewadi"
              required
            />
          </div>
        </div>

        <div className="location-grid location-grid-4">
          <div className="location-field">
            <label>Village</label>
            <input
              type="text"
              value={location.village}
              onChange={(event) => handleLocationChange("village", event.target.value)}
              placeholder="If applicable"
            />
          </div>
          <div className="location-field">
            <label>Block</label>
            <input
              type="text"
              value={location.block}
              onChange={(event) => handleLocationChange("block", event.target.value)}
              placeholder="Block name"
            />
          </div>
          <div className="location-field">
            <label>Town/Taluka</label>
            <input
              type="text"
              value={location.town}
              onChange={(event) => handleLocationChange("town", event.target.value)}
              placeholder="Taluka name"
            />
          </div>
          <div className="location-field">
            <label>PIN Code *</label>
            <input
              type="text"
              value={location.pincode}
              onChange={(event) => handleLocationChange("pincode", event.target.value)}
              placeholder="e.g., 411057"
              pattern="[0-9]{6}"
              maxLength="6"
              required
            />
          </div>
        </div>

        <div className="location-grid location-grid-3">
          <div className="location-field">
            <label>Post Office</label>
            <input
              type="text"
              value={location.po}
              onChange={(event) => handleLocationChange("po", event.target.value)}
              placeholder="Nearest post office"
            />
          </div>
          <div className="location-field">
            <label>Police Station</label>
            <input
              type="text"
              value={location.ps}
              onChange={(event) => handleLocationChange("ps", event.target.value)}
              placeholder="Nearest police station"
            />
          </div>
          <div className="location-field">
            <label>Google Maps Link</label>
            <input
              type="url"
              value={location.googleMapLocation}
              onChange={(event) => handleLocationChange("googleMapLocation", event.target.value)}
              placeholder="https://maps.app.goo.gl/..."
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationStep;
