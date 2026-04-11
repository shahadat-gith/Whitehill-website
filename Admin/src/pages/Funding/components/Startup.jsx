import React from "react";
import "./Startup.css";

const Startup = ({ funding }) => {
  if (!funding || funding.type !== "startup") return null;

  return (
    <div className="su-card">
      <div className="su-card-title">
        <i className="fa-solid fa-rocket"></i>
        <h3>Startup Information</h3>
      </div>

      <div className="su-info-item">
        <label>Startup Name</label>
        <p className="su-info-value">{funding.startup?.name || "N/A"}</p>
      </div>

      <div className="su-info-row">
        <div className="su-info-item">
          <label>Sector</label>
          <p className="su-info-value">{funding.startup?.sector || "N/A"}</p>
        </div>
        <div className="su-info-item">
          <label>Stage</label>
          <p className="su-info-value">
            {funding.startup?.stage ? funding.startup.stage.toUpperCase() : "N/A"}
          </p>
        </div>
      </div>

      <div className="su-info-item">
        <label>Description</label>
        <p className="su-info-value">{funding.startup?.description || "N/A"}</p>
      </div>

      <div className="su-info-row">
        <div className="su-info-item">
          <label>Foundation Year</label>
          <p className="su-info-value">{funding.startup?.foundationYear || "N/A"}</p>
        </div>
        <div className="su-info-item">
          <label>Team Size</label>
          <p className="su-info-value">{funding.startup?.teamSize || "N/A"}</p>
        </div>
      </div>

      {funding.startup?.founders && funding.startup.founders.length > 0 && (
        <div className="su-info-item">
          <label>Founders</label>
          <div className="su-founders-list">
            {funding.startup.founders.map((founder, idx) => (
              <div key={idx} className="su-founder-item">
                <strong>{founder.name || "N/A"}</strong> — {founder.role || "N/A"}
                {founder.experience && <p className="su-muted">{founder.experience}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="su-info-item">
        <label>Business Model</label>
        <p className="su-info-value">{funding.startup?.businessModel || "N/A"}</p>
      </div>

      <div className="su-info-item">
        <label>Website</label>
        <p className="su-info-value">
          {funding.startup?.website ? (
            <a href={funding.startup.website} target="_blank" rel="noopener noreferrer">
              {funding.startup.website} <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: '10px' }}></i>
            </a>
          ) : (
            "N/A"
          )}
        </p>
      </div>
    </div>
  );
};

export default Startup;