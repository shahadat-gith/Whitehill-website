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
                            onChange={(e) => handleLocationChange("state", e.target.value)}
                            placeholder="e.g., Maharashtra"
                            required
                        />
                    </div>
                    <div className="location-field">
                        <label>District *</label>
                        <input
                            type="text"
                            value={location.district}
                            onChange={(e) => handleLocationChange("district", e.target.value)}
                            placeholder="e.g., Pune"
                            required
                        />
                    </div>
                    <div className="location-field">
                        <label>City/Town *</label>
                        <input
                            type="text"
                            value={location.city}
                            onChange={(e) => handleLocationChange("city", e.target.value)}
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
                            onChange={(e) => handleLocationChange("village", e.target.value)}
                            placeholder="If applicable"
                        />
                    </div>
                    <div className="location-field">
                        <label>Block</label>
                        <input
                            type="text"
                            value={location.block}
                            onChange={(e) => handleLocationChange("block", e.target.value)}
                            placeholder="Block name"
                        />
                    </div>
                    <div className="location-field">
                        <label>Town/Taluka</label>
                        <input
                            type="text"
                            value={location.town}
                            onChange={(e) => handleLocationChange("town", e.target.value)}
                            placeholder="Taluka name"
                        />
                    </div>
                    <div className="location-field">
                        <label>PIN Code *</label>
                        <input
                            type="text"
                            value={location.pincode}
                            onChange={(e) => handleLocationChange("pincode", e.target.value)}
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
                            onChange={(e) => handleLocationChange("po", e.target.value)}
                            placeholder="Nearest post office"
                        />
                    </div>
                    <div className="location-field">
                        <label>Police Station</label>
                        <input
                            type="text"
                            value={location.ps}
                            onChange={(e) => handleLocationChange("ps", e.target.value)}
                            placeholder="Nearest police station"
                        />
                    </div>
                    <div className="location-field">
                        <label>Google Maps Link</label>
                        <input
                            type="url"
                            value={location.googleMapLocation}
                            onChange={(e) => handleLocationChange("googleMapLocation", e.target.value)}
                            placeholder="https://maps.app.goo.gl/..."
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LocationStep;
