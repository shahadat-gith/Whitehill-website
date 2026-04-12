import React from "react";
import "./Property.css";
import { formatCurrency } from "../../../utils/utility";

const Property = ({ funding }) => {
  if (!funding || funding.type !== "property") return null;

  return (
    <div className="pt-card">
      <div className="pt-card-title">
        <i className="fa-solid fa-house-chimney"></i>
        <h3>Property Information</h3>
      </div>

      <div className="pt-info-row">
        <div className="pt-info-item">
          <label>Property Type</label>
          <p className="pt-info-value">
            {funding.property?.type ? funding.property.type.toUpperCase() : "N/A"}
          </p>
        </div>
        <div className="pt-info-item">
          <label>Sub Type</label>
          <p className="pt-info-value">
            {funding.property?.subType 
              ? funding.property.subType.replace(/_/g, " ").toUpperCase() 
              : "N/A"}
          </p>
        </div>
      </div>

      <div className="pt-info-item">
        <label>Location</label>
        <div className="pt-info-value">
          {funding.property?.location ? (
            <>
              {funding.property.location.address && <div>{funding.property.location.address}</div>}
              {funding.property.location.city && (
                <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                  {funding.property.location.city}, {funding.property.location.state} {funding.property.location.pincode}
                </div>
              )}
            </>
          ) : (
            "N/A"
          )}
        </div>
      </div>

      <div className="pt-info-row">
        <div className="pt-info-item">
          <label>Built Up Area</label>
          <p className="pt-info-value">{funding.property?.builtUpArea ? `${funding.property.builtUpArea} sq ft` : "N/A"}</p>
        </div>
        <div className="pt-info-item">
          <label>Carpet Area</label>
          <p className="pt-info-value">{funding.property?.carpetArea ? `${funding.property.carpetArea} sq ft` : "N/A"}</p>
        </div>
      </div>

      <div className="pt-info-row">
        <div className="pt-info-item">
          <label>Property Age</label>
          <p className="pt-info-value">{funding.property?.propertyAge ? `${funding.property.propertyAge} Years` : "N/A"}</p>
        </div>
        <div className="pt-info-item">
          <label>Builder</label>
          <p className="pt-info-value">{funding.property?.builder || "N/A"}</p>
        </div>
      </div>

      <div className="pt-info-row">
        <div className="pt-info-item">
          <label>Land Area</label>
          <p className="pt-info-value">{funding.property?.landArea ? `${funding.property.landArea} sq ft` : "N/A"}</p>
        </div>
        <div className="pt-info-item">
          <label>Ownership Type</label>
          <p className="pt-info-value">{funding.property?.ownershipType || "N/A"}</p>
        </div>
      </div>

      {funding.property?.legal && (
        <div className="pt-info-item">
          <label>Legal Status</label>
          <div className="pt-legal-info">
            <div className="pt-legal-item">
              <span>Title Clear</span>
              <span className={funding.property.legal.titleClear ? "yes" : "no"}>
                {funding.property.legal.titleClear ? "✓ Yes" : "✗ No"}
              </span>
            </div>
            <div className="pt-legal-item">
              <span>Disputed</span>
              <span className={!funding.property.legal.isDisputed ? "yes" : "no"}>
                {funding.property.legal.isDisputed ? "✗ Yes" : "✓ No"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Property;