
import React from "react";
import "../Styles/Step3LocationDetails.css";

const Step3LocationDetails = ({ location, setLocation }) => {

  const handleLocationChange = (field, value) => {
    setLocation((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <section className="sp3-section">
      <h3 className="sp3-title">Location Details</h3>
      <p className="sp3-subtitle">Enter complete location details so buyers can identify your property quickly.</p>

      <div className="sp3-grid">
        <div className="sp3-field">
          <label>State *</label>
          <input
            type="text"
            value={location.state}
            onChange={(event) => handleLocationChange("state", event.target.value)}
            placeholder="Enter state"
            required
          />
        </div>

        <div className="sp3-field">
          <label>District *</label>
          <input
            type="text"
            value={location.district}
            onChange={(event) => handleLocationChange("district", event.target.value)}
            placeholder="Enter district"
            required
          />
        </div>

        <div className="sp3-field">
          <label>City *</label>
          <input
            type="text"
            value={location.city}
            onChange={(event) => handleLocationChange("city", event.target.value)}
            placeholder="Enter city"
            required
          />
        </div>

        <div className="sp3-field">
          <label>Pincode *</label>
          <input
            type="text"
            value={location.pincode}
            onChange={(event) => handleLocationChange("pincode", event.target.value)}
            placeholder="Enter 6 digit pincode"
            maxLength={6}
            required
          />
        </div>

        <div className="sp3-field">
          <label>Village</label>
          <input
            type="text"
            value={location.village}
            onChange={(event) => handleLocationChange("village", event.target.value)}
            placeholder="Village name"
          />
        </div>

        <div className="sp3-field">
          <label>Block</label>
          <input
            type="text"
            value={location.block}
            onChange={(event) => handleLocationChange("block", event.target.value)}
            placeholder="Block name"
          />
        </div>

        <div className="sp3-field">
          <label>Post Office</label>
          <input
            type="text"
            value={location.po}
            onChange={(event) => handleLocationChange("po", event.target.value)}
            placeholder="Post office"
          />
        </div>

        <div className="sp3-field">
          <label>Police Station</label>
          <input
            type="text"
            value={location.ps}
            onChange={(event) => handleLocationChange("ps", event.target.value)}
            placeholder="Police station"
          />
        </div>
      </div>
    </section>
  );
};

export default Step3LocationDetails;
